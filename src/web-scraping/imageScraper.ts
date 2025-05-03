import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Scrapes all image URLs from the given web page URL.
 * @param url The URL of the web page to scrape.
 * @returns Promise<string[]> Array of absolute image URLs
 */
export async function scrapeImages(url: string): Promise<string[]> {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const imageUrls: string[] = [];
    $('img').each((_, element) => {
      const src = $(element).attr('src');
      if (src) {
        try {
          const absoluteUrl = new URL(src, url).href;
          imageUrls.push(absoluteUrl);
        } catch {
          // Ignore invalid URLs
        }
      }
    });
    return imageUrls;
  } catch (error) {
    console.error('Error scraping images:', error);
    return [];
  }
} 