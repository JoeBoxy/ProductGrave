import { readdirSync, statSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');
const siteUrl = 'https://www.productgrave.net';

function getHtmlFiles(dir, base = '') {
  const files = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const relPath = base ? `${base}/${entry}` : entry;
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...getHtmlFiles(fullPath, relPath));
    } else if (entry.endsWith('.html') && entry !== '404.html') {
      files.push(relPath);
    }
  }
  return files;
}

const htmlFiles = getHtmlFiles(distDir);
const urls = htmlFiles.map((file) => {
  const path = file.replace(/index\.html$/, '').replace(/\.html$/, '');
  const url = `${siteUrl}/${path}`;
  const priority = path === '' ? '1.0' : path.startsWith('grave/') ? '0.8' : '0.6';
  return `  <url>\n    <loc>${url}</loc>\n    <priority>${priority}</priority>\n  </url>`;
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;

writeFileSync(join(distDir, 'sitemap-index.xml'), sitemap);
console.log(`Generated sitemap with ${urls.length} URLs`);
