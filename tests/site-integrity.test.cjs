const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL, fileURLToPath } = require('node:url');
const root = path.resolve(__dirname, '..');
const files = ['dist', 'drafts/legal'].flatMap(dir => fs.readdirSync(path.join(root, dir))
  .filter(file => /\.(html|css)$/.test(file)).map(file => path.join(root, dir, file)));
const htmlFiles = files.filter(file => file.endsWith('.html'));

test('local HTML/CSS links, assets and anchors resolve', () => {
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    const references = file.endsWith('.html')
      ? [...source.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(match => match[1])
      : [...source.matchAll(/url\(\s*['"]?([^\s'"\)]+)['"]?\s*\)/g)].map(match => match[1]);
    for (const reference of references) {
      assert.ok(!/^javascript:/i.test(reference), `Executable URL in ${file}`);
      if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference)) continue;
      const url = new URL(reference, pathToFileURL(file));
      const target = fileURLToPath(url);
      assert.ok(fs.existsSync(target), `${file}: missing ${reference}`);
      if (url.hash && target.endsWith('.html')) {
        const ids = [...fs.readFileSync(target, 'utf8').matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
        assert.ok(ids.includes(decodeURIComponent(url.hash.slice(1))), `${file}: missing anchor ${reference}`);
      }
    }
  }
});

test('each HTML page has unique IDs and local executable scripts', () => {
  for (const file of htmlFiles) {
    const source = fs.readFileSync(file, 'utf8');
    const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(ids.length, new Set(ids).size, `Duplicate ID in ${file}`);
    for (const [, script] of source.matchAll(/<script[^>]+src="([^"]+)"/g)) {
      assert.ok(!/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(script), `External script in ${file}`);
    }
  }
});

test('navigation follows the page order and the contact recipient stays consistent', () => {
  const { recipient } = require('../dist/contact-validation.js');
  for (const relative of ['dist/index.html', 'drafts/legal/preview.html']) {
    const html = fs.readFileSync(path.join(root, relative), 'utf8');
    const nav = html.match(/<nav id="main-navigation"[^>]*>(.*?)<\/nav>/s)[1];
    const positions = [...nav.matchAll(/href="#([^"]+)"/g)].map(([, id]) => html.indexOf(`<section id="${id}"`));
    assert.ok(positions.every((position, index) => position >= 0 && (!index || position > positions[index - 1])), relative);
    assert.ok(html.includes(`href="mailto:${recipient}"`), relative);
  }
});
