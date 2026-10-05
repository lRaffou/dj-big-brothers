const { test } = require('node:test');
const assert = require('node:assert/strict');
const { prepare, localDate } = require('../dist/contact-validation.js');
const today = new Date(2026, 9, 6, 23, 30);
const valid = { prenom: 'Camille', date: '2028-02-29', lieu: 'Domaine d’Aubrac, 82000 Montauban', message: '' };
const check = changes => prepare({ ...valid, ...changes }, today);

test('accepts international names, accents, apostrophes and hyphens', () => {
  for (const prenom of ['Éloïse', 'Jean-Pierre', 'D’Arcy', "O'Neil", '李', 'محمد', 'Mae\u0308lle', 'A']) {
    assert.deepEqual(check({ prenom }).errors, {}, prenom);
  }
  assert.equal(check({ prenom: '  Mae\u0308lle  ' }).values.prenom, 'Maëlle');
});

test('rejects blank fields, malformed names and control characters', () => {
  for (const prenom of ['', '   ', '123', '<script>', 'A\u0000B', 'A\ud800']) assert.ok(check({ prenom }).errors.prenom);
  for (const lieu of ['', '  ', 'Domaine\u0000test', 'Domaine\ud800', 'Domaine\nToulouse']) assert.ok(check({ lieu }).errors.lieu);
  for (const message of ['a\u0000b', 'a\u001bb', 'a\ud800']) assert.ok(check({ message }).errors.message);
  assert.deepEqual(check({ message: 'Jazz & soul 🎵\nDeuxième ligne\tMerci !' }).errors, {});
});

test('enforces length limits even for programmatically assigned values', () => {
  for (const [field, limit] of Object.entries({ prenom: 80, lieu: 160, message: 1000 })) {
    assert.deepEqual(check({ [field]: 'A'.repeat(limit) }).errors, {});
    const result = check({ [field]: 'A'.repeat(limit + 1) });
    assert.ok(result.errors[field]);
    assert.equal(result.href, '');
  }
});

test('checks real calendar dates and today using the local day', () => {
  assert.equal(localDate(today), '2026-10-06');
  for (const date of ['', '2026-10-05', '2027-02-29', '2028-02-30', '2028-13-01', '2028-2-29', '2028-02-29\n']) {
    assert.ok(check({ date }).errors.date, date);
  }
  assert.deepEqual(check({ date: '2026-10-06' }).errors, {});
  assert.deepEqual(check({ date: '2028-02-29' }).errors, {});
});

test('keeps untrusted content literal and prevents extra mailto parameters', () => {
  const payload = '<script>alert(1)</script> &bcc=other@example.test#fragment %0D%0ABcc: other@example.test\nMerci 🎵';
  const result = check({ lieu: 'Salle A & B #2 ?subject=autre', message: payload });
  assert.deepEqual(result.errors, {});
  const url = new URL(result.href);
  assert.equal(url.protocol, 'mailto:');
  assert.equal(url.pathname, 'djbigbrothers.music@gmail.com');
  assert.deepEqual([...url.searchParams.keys()], ['subject', 'body']);
  assert.equal(url.hash, '');
  assert.ok(url.searchParams.get('body').includes(payload));
  assert.ok(url.searchParams.get('body').includes('Salle A & B #2 ?subject=autre'));
  assert.ok(!url.searchParams.get('subject').includes('Bcc'));
});
