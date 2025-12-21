import { promises as fs } from 'fs';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

async function crawlShowroom(url) {
  console.log(`📄 Crawling: ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'nl-NL,nl;q=0.9,en-NL;q=0.8,en;q=0.7',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Connection': 'keep-alive'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer-when-downgrade',
      // 5 seconden timeout om redirect loops te voorkomen
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      throw new Error('Could not parse content with Readability');
    }

    return {
      url,
      title: article.title,
      excerpt: article.excerpt,
      content: article.textContent,
      length: article.length
    };
  } catch (error) {
    console.error(`❌ Error crawling ${url}:`, error.message);
    throw error;
  }
}

async function main() {
  const showroomUrl = 'https://benefit.ekookna.com/nl/producthandleiding';
  
  try {
    console.log('🚀 Starting showroom crawl...\n');
    
    const result = await crawlShowroom(showroomUrl);
    
    const output = {
      crawledAt: new Date().toISOString(),
      sourceUrl: showroomUrl,
      data: result
    };

    await fs.writeFile('showroom-content.json', JSON.stringify(output, null, 2), 'utf8');
    
    console.log('\n✅ Content saved to showroom-content.json\n');
    console.log(`Title: ${result.title}`);
    console.log(`Content length: ${result.length} characters`);
    
  } catch (error) {
    console.error('\n❌ Crawl failed:', error.message);
    process.exit(1);
  }
}

main();
