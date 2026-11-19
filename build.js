const fs = require('fs');
const path = require('path');

console.log('🌸 Building Ruang Berdamai for Vercel...');

const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  fs.rmSync(publicDir, { recursive: true, force: true });
}
fs.mkdirSync(publicDir, { recursive: true });

const filesToCopy = [
  'index.html',
  'buat.html',
  'love.html',
  'studio.js',
  'love.js',
  'bubu.js',
  'style.css'
];

filesToCopy.forEach(file => {
  const src = path.join(__dirname, file);
  const dest = path.join(publicDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied ${file}`);
  }
});

const assetsSrc = path.join(__dirname, 'assets');
const assetsDest = path.join(publicDir, 'assets');
if (fs.existsSync(assetsSrc)) {
  fs.cpSync(assetsSrc, assetsDest, { recursive: true });
  console.log(`✓ Copied assets directory`);
}

console.log('✅ Static build complete! Output folder: public/');
