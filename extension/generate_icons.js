const fs = require('fs');
const path = require('path');

// Simple minimal valid 16x16, 48x48, 128x128 PNG base64 strings
const base64Png = 'iVBORw0KGgoAAAANSU5ACC010AAAAABJRU5ErkJggg==';

const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 1x1 green pixel PNG valid binary fallback
const greenPngBase64 = 'iVBORw0KGgoAAAANSU5EUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const buffer = Buffer.from(greenPngBase64, 'base64');

fs.writeFileSync(path.join(iconsDir, 'icon16.png'), buffer);
fs.writeFileSync(path.join(iconsDir, 'icon48.png'), buffer);
fs.writeFileSync(path.join(iconsDir, 'icon128.png'), buffer);

console.log('Icons generated successfully.');
