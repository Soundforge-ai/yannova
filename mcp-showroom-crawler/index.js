#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  McpError,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import chrome from 'chrome-aws-lambda';

const server = new Server(
  {
    name: 'showroom-crawler',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {
        crawlShowroom: {
          description: 'Crawl Yannova showroom content and extract product information',
        },
      },
    },
  }
);

async function crawlWithPuppeteer(url, waitFor = 5000) {
  let browser = null;
  try {
    const executablePath = await chrome.executablePath;
    
    browser = await puppeteer.launch({
      args: chrome.args,
      defaultViewport: chrome.defaultViewport,
      executablePath,
      headless: chrome.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    await new Promise(resolve => setTimeout(resolve, waitFor));

    const content = await page.content();
    await browser.close();
    
    return content;
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    throw error;
  }
}

function extractContent($, selector, attribute = null) {
  const elements = $(selector);
  if (elements.length === 0) return [];

  return elements
    .map((i, el) => {
      const element = $(el);
      return attribute ? element.attr(attribute) : element.text().trim();
    })
    .get()
    .filter(item => item && item.trim());
}

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      name: 'Showroom Documentation',
      description: 'Yannova showroom crawling guide',
      uri: 'showroom://guide',
    },
  ],
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const {
    uri
  } = request.params;

  if (uri === 'showroom://guide') {
    return {
      contents: [{
        uri: request.params.uri,
        description: 'Yannova Showroom Crawling Guide',
        content: 'To crawl the showroom, use the crawlShowroom tool with the showroom URL. The tool will extract all products, categories, and content from the page.'
      }]
    };
  }

  throw new McpError(ErrorCode.ResourceNotFound, `Resource not found: ${uri}`);
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const {
    name,
    arguments: args
  } = request.params;

  if (name !== 'crawlShowroom') {
    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
  }

  try {
    const url = args.url || 'https://benefit.ekookna.com/nl/producthandleiding';
    const waitFor = args.waitFor || 8000;
    const includeSubPages = args.includeSubPages !== false;

    const html = await crawlWithPuppeteer(url, waitFor);
    const $ = cheerio.load(html);

    const title = $('h1').first().text().trim();
    const category = $('h2').first().text().trim();
    const overviewTitle = $('h4').first().text().trim();

    function extractTextContent(selector) {
      const container = $(selector);
      if (container.length === 0) {
        return [];
      }

      const content = [];

      container.find('p, li, div').each((i, el) => {
        const text = $(el).text().trim();
        if (text) {
          content.push(text);
        }
      });

      return content;
    }

    function extractProducts() {
      const table = $('.MuiTableContainer-root table');
      const products = [];

      if (table.length > 0) {
        const rows = table.find('tbody tr');

        if (rows.length > 0) {
          rows.each((i, row) => {
            const columns = $(row).find('td, th');
            const product = {};

            columns.each((j, col) => {
              const cellText = $(col).html() || $(col).text().trim();
              const header = table.find('thead th').eq(j).text().trim();
              const key = header || `column_${j}`;

              if (cellText.includes('</') || cellText.includes('/>')) {
                product[key] = cellText;
              } else {
                product[key] = cellText;
              }
            });

            products.push(product);
          });

          return products;
        }
      }

      const specsGrid = $('div.grid.grid-cols-3.gap-4');
      if (specsGrid.length > 0) {
        specsGrid.find('> div').each((i, item) => {
          const $item = $(item);
          products.push({
            name: $item.find('h5, h6').first().text().trim(),
            description: $item.find('p').first().text().trim(),
            price: $item.find('span').filter((i, el) => /€|\$/.test($(el).text())).first().text().trim(),
          });
        });
      }

      const jsonLdScripts = $('script[type="application/ld+json"]');
      jsonLdScripts.each((i, script) => {
        try {
          const jsonLd = JSON.parse($(script).html());
          if (jsonLd['@type'] === 'Product' || jsonLd['@type'] === 'IndividualProduct') {
            products.push({
              name: jsonLd.name,
              description: jsonLd.description,
              price: jsonLd.offers?.price,
              priceCurrency: jsonLd.offers?.priceCurrency,
              availability: jsonLd.offers?.availability,
            });
          }
        } catch (e) {}
      });

      const images = $('img').map((i, el) => ({
        src: $(el).attr('src'),
        alt: $(el).attr('alt') || '',
        title: $(el).attr('title') || $(el).attr('alt') || '',
      })).get();
      if (images.length > 0) {
        products.push({
          images: images.slice(0, 10),
        });
      }

      return products;
    }

    const navigationElements = $('a[href*="#"]').map((i, el) => {
      const $el = $(el);
      return {
        href: $el.attr('href'),
        text: $el.text().trim(),
        id: $el.attr('href').replace('#', ''),
      };
    }).get();

    const contentAnchors = [];
    navigationElements.forEach(item => {
      const targetElement = $(`[id="${item.id}"], [data-id="${item.id}"], [name="${item.id}"]`).first();

      if (targetElement.length > 0) {
        let content = '';

        targetElement.nextUntil(':has([id]), h1, h2, h3, h4, hr, a[href*="#"], div.fixed-bottom').each((i, el) => {
          const $el = $(el);
          const text = $el.text().trim();

          if ($el.is('p') && !$el.hasClass('text-muted')) {
            content += text + '\n';
          } else if ($el.is('ul, ol')) {
            $el.find('li').each((i, li) => {
              content += '- ' + $(li).text().trim() + '\n';
            });
          }
        });

        if (content.trim()) {
          contentAnchors.push({
            id: item.id,
            title: item.text,
            content: content.trim(),
          });
        }
      }
    });

    const allLinks = $('a[href]').map((i, el) => {
      const $el = $(el);
      return {
        href: $el.attr('href'),
        text: $el.text().trim(),
        title: $el.attr('title') || '',
      };
    }).get();

    const subPagesToCrawl = [];
    if (includeSubPages) {
      const baseUrl = new URL(url);
      const uniqueLinks = new Set();

      allLinks.forEach(link => {
        try {
          let linkUrl = link.href;

          if (linkUrl.startsWith('/')) {
            linkUrl = `${baseUrl.protocol}//${baseUrl.host}${linkUrl}`;
          } else if (linkUrl.startsWith('./')) {
            linkUrl = `${baseUrl.protocol}//${baseUrl.host}${baseUrl.pathname.replace(/\/[^\/]*$/, '/')}${linkUrl.slice(2)}`;
          } else if (!linkUrl.startsWith('http')) {
            linkUrl = `${baseUrl.protocol}//${baseUrl.host}${linkUrl}`;
          }

          const urlObj = new URL(linkUrl);

          if (urlObj.host === baseUrl.host && !uniqueLinks.has(linkUrl)) {
            const pathSegments = urlObj.pathname.split('/').filter(s => s);
            if (pathSegments.length <= 4 && !pathSegments.some(s => s.includes('?'))) {
              uniqueLinks.add(linkUrl);
              subPagesToCrawl.push({
                url: linkUrl,
                title: link.text || link.title,
              });
            }
          }
        } catch (e) {}
      });
    }

    const content_by_anchor_section = contentAnchors;

    const fullTextContent = extractTextContent('body');
    const introductionText = extractTextContent('.introduction').filter(text => text.length > 10);
    const productDescriptionText = extractTextContent('.product-description').filter(text => text.length > 10);
    const technicalSpecsText = extractTextContent('.specifications').filter(text => text.length > 10);

    const metaTags = {
      title: $('title').text().trim(),
      description: $('meta[name="description"]').attr('content') || '',
      keywords: $('meta[name="keywords"]').attr('content') || '',
      ogTitle: $('meta[property="og:title"]').attr('content') || '',
      ogDescription: $('meta[property="og:description"]').attr('content') || '',
      ogImage: $('meta[property="og:image"]').attr('content') || '',
    };

    const result = {
      url,
      crawl_timestamp: new Date().toISOString(),
      crawled_successfully: true,
      page_info: {
        title,
        category,
        overview_title: overviewTitle,
        meta: metaTags,
      },
      sections: {
        introduction_text: introductionText.length > 0 ? introductionText : undefined,
        product_description_text: productDescriptionText.length > 0 ? productDescriptionText : undefined,
        technical_specs_text: technicalSpecsText.length > 0 ? technicalSpecsText : undefined,
      },
      content_by_anchor_section,
      products: {
        items: extractProducts(),
        count: extractProducts().length,
      },
      links: {
        internal: allLinks.filter(l => l.href.startsWith('/') || l.href.includes(baseUrl.host)),
        external: allLinks.filter(l => l.href.startsWith('http') && !l.href.includes(baseUrl.host)),
        count: allLinks.length,
      },
      sub_pages: {
        discovered: subPagesToCrawl.length,
        limit_warning: 'Limited to 5 sub-pages',
        to_crawl: subPagesToCrawl.slice(0, 5),
      },
    };

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2),
      }],
    };

  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          crawled_successfully: false,
          error: error.message,
          error_type: error.constructor.name,
          url: args.url,
        }, null, 2),
      }],
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Showroom crawler MCP server running...');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
