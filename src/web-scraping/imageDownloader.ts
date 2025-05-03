import axios from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Generates a filesystem-safe folder path for a given page URL.
 * Example: 'https://www.cookmedical.com/diversity-equity-inclusion/'
 *   => 'src/web-scraping/downloads/cookmedical.com-diversity-equity-inclusion'
 */
export function getFolderNameFromUrl(url: string): string {
  try {
    const { hostname, pathname } = new URL(url);
    // Remove leading/trailing slashes and replace '/' with '-'
    const safePath = pathname.replace(/(^\/|\/$)/g, '').replace(/\//g, '-');
    const folder = safePath
      ? `src/web-scraping/downloads/${hostname}-${safePath}`
      : `src/web-scraping/downloads/${hostname}`;
    return folder;
  } catch {
    // Fallback in case of invalid URL
    return 'src/web-scraping/downloads/unknown';
  }
}

/**
 * Downloads all images to a folder derived from the page URL.
 */
export async function downloadImages(imageUrls: string[], pageUrl: string): Promise<void> {
  const folder = getFolderNameFromUrl(pageUrl);
  await fs.mkdir(folder, { recursive: true });

  for (const imageUrl of imageUrls) {
    try {
      const urlObj = new URL(imageUrl);
      let filename = path.basename(urlObj.pathname);
      if (!filename || filename === '/') {
        filename = `image_${Date.now()}.jpg`;
      }
      const filePath = path.join(folder, filename);
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      await fs.writeFile(filePath, response.data);
      console.log(`Downloaded: ${imageUrl} -> ${filePath}`);
    } catch (err) {
      console.error(`Failed to download ${imageUrl}:`, err);
    }
  }
} 