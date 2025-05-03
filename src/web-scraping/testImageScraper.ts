import { scrapeImages } from './imageScraper';

const testUrl = 'https://www.cookmedical.com/diversity-equity-inclusion/';

(async () => {
  const images = await scrapeImages(testUrl);
  console.log('Found images:', images);
})(); 