const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];

  // 1. Direct file check
  let targetPath = path.join(__dirname, reqUrl);

  // 2. Relative resolution fallback (e.g. /love/style.css -> /style.css, /love/assets/... -> /assets/...)
  const isDirectFile = fs.existsSync(targetPath) && fs.statSync(targetPath).isFile();
  if (!isDirectFile && reqUrl.startsWith('/love/')) {
    const strippedPath = reqUrl.replace(/^\/love\//, '/');
    const fallbackPath = path.join(__dirname, strippedPath);
    if (fs.existsSync(fallbackPath) && fs.statSync(fallbackPath).isFile()) {
      targetPath = fallbackPath;
    }
  }

  // 3. Clean URL Routing for pages
  const isFileNow = fs.existsSync(targetPath) && fs.statSync(targetPath).isFile();
  if (!isFileNow) {
    if (reqUrl === '/' || reqUrl === '/index.html') {
      targetPath = path.join(__dirname, 'index.html');
    } else if (reqUrl === '/buat' || reqUrl === '/create' || reqUrl === '/buat.html') {
      targetPath = path.join(__dirname, 'buat.html');
    } else if (reqUrl === '/love' || reqUrl.startsWith('/love/')) {
      targetPath = path.join(__dirname, 'love.html');
    }
  }

  const ext = path.extname(targetPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(targetPath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found: ' + reqUrl);
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server Error: ' + err.code);
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
