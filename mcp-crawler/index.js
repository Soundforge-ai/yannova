import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import * as cheerio from "cheerio";
import { URL } from "url";
import sanitize from "sanitize-filename";

const server = new Server(
  {
    name: "showroom-crawler",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

function cleanUrl(relativeUrl, baseUrl) {
  try {
    const absoluteUrl = new URL(relativeUrl, baseUrl);
    if (absoluteUrl.hash) {
      absoluteUrl.hash = '';
    }
    if (absoluteUrl.search) {
      absoluteUrl.search = '';
    }
    return absoluteUrl.toString();
  } catch (error) {
    return null;
  }
}

function extractLinks($, baseUrl) {
  const links = [];
  
  // Extract specific product links with /product/ pattern
  $('a[href*="/product/"]').each((_, element) => {
    const href = $(element).attr('href');
    if (href) {
      let cleaned = cleanUrl(href, baseUrl);
      if (cleaned) {
        // Only add URLs ending with /product/<id>
        if (cleaned.includes('/product/')) {
          // Take the part before the next slash after the product id
          const parts = cleaned.split('/');
          const productIndex = parts.findIndex(p => p === 'product');
          if (productIndex !== -1 && parts.length > productIndex + 2) {
            // This means we need to split to get slug/product/id
            const baseUrlObj = new URL(baseUrl);
            const protocol = baseUrlObj.protocol;
            const host = baseUrlObj.host;
            const basePath = parts[0];
            const productId = parts[parts.length - 1];
            cleaned = `${protocol}//${host}/${parts[0]}/${parts[1]}/${parts[2]}/`;
            if (!cleaned.endsWith('/')) cleaned += '/';
          }
          links.push(cleaned);
        }
      }
    }
  });

  // Extract general site navigation links
  $('a[href]').each((_, element) => {
    const href = $(element).attr('href');
    if (href) {
      const cleaned = cleanUrl(href, baseUrl);
      if (cleaned && cleaned.startsWith(baseUrl)) {
        if (!links.includes(cleaned)) {
          links.push(cleaned);
        }
      }
    }
  });

  return links;
}

function splitTextIntoChunks(text, chunkSize = 4000) {
  const chunks = [];
  const paragraphs = text.split('\n\n');
  let currentChunk = '';

  paragraphs.forEach(paragraph => {
    if (currentChunk.length + paragraph.length > chunkSize) {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = paragraph;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    }
  });

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

function extractMainContent($) {
  // Remove script and style elements
  $('script').remove();
  $('style').remove();
  $('noscript').remove();
  $('iframe').remove();

  // Try to find main content areas
  let content = '';
  
  const mainSelectors = ['main article', 'article', '.content', '#content', '.page-content', '#page-content'];
  
  for (const selector of mainSelectors) {
    const element = $(selector);
    if (element.length) {
      content += ' ' + element.text().trim();
      break;
    }
  }

  if (!content) {
    $('main').each((_, el) => {
      content += ' ' + $(el).text().trim();
    });
  }

  if (!content) {
    const bodyText = $('body').text().trim();
    const lines = bodyText.split('\n').filter(line => line.trim().length > 0);
    const contentLines = lines.slice(0, Math.min(lines.length, 50));
    content = contentLines.join('\n\n');
  }

  return content.replace(/\s+/g, ' ').trim();
}

async function crawlPage(baseUrl, url, depth = 0, maxDepth = 3, limit = 50, visited = {}, delayMs = 1000) {
  if (depth > maxDepth || Object.keys(visited).length >= limit || visited[url]) {
    return [];
  }

  visited[url] = true;
  const pages = [];

  try {
    console.error(`Crawling: ${url}`);
    
    await new Promise(resolve => setTimeout(resolve, delayMs));
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ShowroomCrawler/1.0)'
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);
    const title = $('title').text().trim() || $('h1').text().trim() || new URL(url).pathname;
    const content = extractMainContent($);
    const links = extractLinks($, url);

    const chunks = splitTextIntoChunks(content);
    const slug = new URL(url).pathname.slice(1);
    
    pages.push({
      url,
      title: sanitize(title),
      slug: sanitize(`${slug}-${new Date().toISOString().split('T')[0]}`),
      depth,
      content: content.substring(0, 15000),
      content_chunks: chunks,
      main_content: content,
      links_found: links.slice(0, 50)
    });

    console.error(`Extracted ${chunks.length} chunks from ${url}`);

    for (const link of links.slice(0, 5)) {
      if (!visited[link] && link.startsWith(baseUrl)) {
        const subPages = await crawlPage(baseUrl, link, depth + 1, maxDepth, limit, visited, delayMs);
        pages.push(...subPages);
        
        if (Object.keys(visited).length >= limit) {
          break;
        }
      }
    }

  } catch (error) {
    console.error(`Failed to crawl ${url}:`, error.message);
    return [];
  }

  return pages;
}

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "crawl_showroom",
      description: "Crawls the benefit.ekookna.com showroom website and extracts product information. Returns all crawled pages with content chunks. CSV output will be written to standard output immediately after crawling completes (one row per page). The --nl option can be used in subsequent commands to generate clean output.",
      inputSchema: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "The website URL to crawl (e.g., https://benefit.ekookna.com/nl/producthandleiding)",
            default: "https://benefit.ekookna.com/nl/producthandleiding"
          },
          depth: {
            type: "number",
            description: "Maximum depth to crawl from the starting URL",
            default: 3
          },
          limit: {
            type: "number",
            description: "Maximum number of pages to crawl",
            default: 50
          },
          delay: {
            type: "number",
            description: "Delay between requests in milliseconds to be respectful to the server",
            default: 1000
          }
        },
        required: ["url"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  console.error('Received request to crawl:', request);

  const { name, arguments: args } = request.params;

  if (name === "crawl_showroom") {
    const {
      url = "https://benefit.ekookna.com/nl/producthandleiding",
      depth = 3,
      limit = 50,
      delay = 1000
    } = args || {};

    if (!url) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        "URL parameter is required"
      );
    }

    try {
      const baseUrl = new URL(url).origin + '/';
      let allPages = [];
      
      console.error(`Starting crawl of ${url} (depth: ${depth}, limit: ${limit}, delay: ${delay}ms)`);
      
      try {
        allPages = await crawlPage(baseUrl, url, 0, depth, limit, {}, delay);
      } catch (error) {
        console.error('Crawling error:', error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                message: error.message,
                url,
                crawled_pages: 0
              }, null, 2)
            }
          ]
        };
      }
      
      console.error(`\n********** END OF JSON OUTPUT **********`);
      console.log('url,title,slug,depth,word_count\n');
      
      for (const page of allPages) {
        const wordCount = page.content.trim().split(/\s+/).length;
        console.log(`${page.url},${page.title},${page.slug},${page.depth},${wordCount}`);
      }
      
      console.error(`CSV DATA READY (${allPages.length} pages)`);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              url,
              crawled_pages: allPages.length,
              depth_limit: depth,
              page_limit: limit,
              pages: allPages
            }, null, 2)
          }
        ],
      };
    } catch (error) {
      console.error('Error in crawl_showroom:', error);
      throw new McpError(
        ErrorCode.InternalError,
        error.message || "Failed to crawl showroom"
      );
    }
  }

  throw new McpError(
    ErrorCode.MethodNotFound,
    `Unknown tool: ${name}`
  );
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Showroom crawler MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main:", error);
  process.exit(1);
});
