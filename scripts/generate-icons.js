/**
 * @file generate-icons.js
 * @description Generate PNG icons from SVG for PWA and social sharing
 * @author Cleanlystudio
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

async function generateIcons() {
  console.log('Generating icons...');

  // Generate favicon PNG (32x32)
  await sharp(path.join(publicDir, 'favicon.svg'))
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('✓ favicon.png (32x32)');

  // Generate PWA icons
  await sharp(path.join(publicDir, 'icon.svg'))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));
  console.log('✓ icon-192.png');

  await sharp(path.join(publicDir, 'icon.svg'))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));
  console.log('✓ icon-512.png');

  // Generate Apple Touch Icon
  await sharp(path.join(publicDir, 'icon.svg'))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✓ apple-touch-icon.png (180x180)');

  // Generate OG Image (1200x630)
  await sharp(path.join(publicDir, 'og-image.svg'))
    .resize(1200, 630)
    .png()
    .toFile(path.join(publicDir, 'og-image.png'));
  console.log('✓ og-image.png (1200x630)');

  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
