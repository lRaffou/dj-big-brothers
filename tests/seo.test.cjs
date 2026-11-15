const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, 'dist', name), 'utf8');

test('sitemap lists canonical indexable pages, excluding legal and error documents', () => {
  const locations = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  assert.deepEqual(locations, ['https://djbigbrothers.fr/']);
  assert.ok(read('robots.txt').includes('Sitemap: https://djbigbrothers.fr/sitemap.xml'));
  for (const file of fs.readdirSync(path.join(root, 'dist')).filter(f => f.endsWith('.html'))) {
    const html = read(file);
    if (/name="robots" content="noindex/.test(html)) continue;
    const canonical = html.match(/rel="canonical" href="([^"]+)"/)[1];
    assert.ok(locations.includes(canonical), file);
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
  }
});

test('structured identity matches visible contacts and has no self-serving review markup', () => {
  const html = read('index.html');
  const data = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(data['@context'], 'https://schema.org');
  const graph = data['@graph'];
  const org = graph.find(node => node['@type'] === 'Organization');
  assert.ok(html.includes('tel:' + org.telephone));
  assert.ok(html.includes('mailto:' + org.email));
  for (const url of org.sameAs) assert.ok(html.includes(url));
  const ids = new Set(graph.map(node => node['@id']));
  for (const node of graph) for (const prop of ['provider', 'publisher']) {
    if (node[prop]) assert.ok(ids.has(node[prop]['@id']));
  }
  assert.ok(!JSON.stringify(data).includes('aggregateRating'));
  assert.ok(!JSON.stringify(data).includes('openingHours'));
});

test('share metadata uses the canonical domain and a real 1200 by 630 image', () => {
  const html = read('index.html');
  assert.ok(html.includes('property="og:url" content="https://djbigbrothers.fr/"'));
  assert.ok(html.includes('name="twitter:card" content="summary_large_image"'));
  const imageUrl = new URL(html.match(/property="og:image" content="([^"]+)"/)[1]);
  assert.equal(imageUrl.origin, 'https://djbigbrothers.fr');
  const png = fs.readFileSync(path.join(root, 'dist', imageUrl.pathname));
  assert.equal(png.toString('ascii', 1, 4), 'PNG');
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
});

test('legacy Pages redirects retain page, query and section without duplicating site content', () => {
  const { build } = require('../scripts/prepare-pages-redirects.cjs');
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'big-brothers-redirects-'));
  try {
    build(output);
    for (const file of ['index.html', 'mentions-legales.html']) {
      const html = fs.readFileSync(path.join(output, file), 'utf8');
      const target = 'https://djbigbrothers.fr/' + (file === 'index.html' ? '' : file);
      assert.ok(html.includes(`content="0;url=${target}"`));
      let result;
      vm.runInNewContext(html.match(/<script>(.*?)<\/script>/)[1], { location: { search: '?utm_source=legacy', hash: '#avis', replace: url => { result = url; } } });
      assert.equal(result, target + '?utm_source=legacy#avis');
      assert.ok(!html.includes('id="enquiry"'));
    }
    assert.ok(!fs.existsSync(path.join(output, 'assets')));
    assert.ok(!fs.readFileSync(path.join(output, '404.html'), 'utf8').includes('http-equiv="refresh"'));
  } finally {
    fs.rmSync(output, { recursive: true, force: true });
  }
});
