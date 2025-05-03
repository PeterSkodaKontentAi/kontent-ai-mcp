import { scrapeImages } from './imageScraper';
import { downloadImages } from './imageDownloader';

const testUrl = 'https://www.cookmedical.com/diversity-equity-inclusion/';

(async () => {
  const images = await scrapeImages(testUrl);
  console.log('Found images:', images);
  await downloadImages(images, testUrl);
})(); 