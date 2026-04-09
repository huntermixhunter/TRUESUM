import puppeteer from 'puppeteer';
import { mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = join(__dirname, 'temporary screenshots');
mkdirSync(dir, { recursive: true });

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

const existing = readdirSync(dir).filter(f => f.startsWith('screenshot-')).length;
const n = existing + 1;
const filename = label ? `screenshot-${n}-${label}.png` : `screenshot-${n}.png`;

const browser = await puppeteer.launch({
  headless: true,
  executablePath: 'C:/Users/mixma/.cache/puppeteer/chrome/win64-146.0.7680.153/chrome-win64/chrome.exe',
  args: ['--no-sandbox']
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

// Scroll to capture full page
const height = await page.evaluate(() => document.body.scrollHeight);
await page.setViewport({ width: 1440, height });
await page.screenshot({ path: join(dir, filename), fullPage: true });

console.log(`Saved: temporary screenshots/${filename}`);
await browser.close();
