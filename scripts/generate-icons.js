import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const sizes = [
  { size: 180, name: 'apple-touch-icon-180.png' },
  { size: 167, name: 'apple-touch-icon-167.png' },
  { size: 152, name: 'apple-touch-icon-152.png' }
];

async function generateIcons() {
  const inputSvg = await fs.readFile('public/icon.svg');
  
  await Promise.all(sizes.map(async ({ size, name }) => {
    await sharp(inputSvg)
      .resize(size, size)
      .png()
      .toFile(`public/${name}`);
    console.log(`Generated ${name}`);
  }));
}

generateIcons().catch(console.error);