const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');

function redirectPage(target) {
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DJ Big Brothers — nouvelle adresse</title>
<link rel="canonical" href="${target}">
<meta http-equiv="refresh" content="0;url=${target}">
<script>location.replace(${JSON.stringify(target)} + location.search + location.hash);</script>
</head><body><p>Le site DJ Big Brothers a déménagé : <a href="${target}">rejoindre le site officiel</a>.</p></body></html>
`;
}

function build(output = path.join(root, '.pages-redirects')) {
  fs.mkdirSync(output, { recursive: true });
  const pages = fs.readdirSync(path.join(root, 'dist')).filter(file => file.endsWith('.html'));
  for (const file of pages) {
    // The GitHub fallback preserves missing URL semantics instead of sending every typo home.
    if (file === '404.html') {
      fs.writeFileSync(path.join(output, file), '<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="robots" content="noindex,follow"><title>Page introuvable</title><h1>Page introuvable</h1><p>Consultez <a href="https://djbigbrothers.fr/">le site officiel DJ Big Brothers</a>.</p></html>');
      continue;
    }
    const target = 'https://djbigbrothers.fr/' + (file === 'index.html' ? '' : file);
    fs.writeFileSync(path.join(output, file), redirectPage(target));
  }
  fs.writeFileSync(path.join(output, '.nojekyll'), '');
}
if (require.main === module) build();
module.exports = { build, redirectPage };
