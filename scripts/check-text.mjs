import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const files = execSync('git ls-files', { encoding: 'utf8' })
  .split('\n')
  .filter(f => /\.(html|tsx?|jsx?|json|css|md)$/.test(f) && f !== 'package-lock.json' && !f.startsWith('supabase/'));

const checks = [
  ['U+FFFD replacement character (broken text)', /�/g],
  ['Chinese/Japanese ideograph in a Khmer/English project', /[一-鿿]/g],
  ['Khmer vowel/sign at the start of a word (lost base letter)', /(^|[\s.,;:!?()\-])[ា-៓]/gmu],
];

let bad = 0;
for (const f of files) {
  try {
    const s = readFileSync(f, 'utf8');
    for (const [name, re] of checks) {
      const m = s.match(re);
      if (m) { bad++; console.error(`${f}: ${m.length} x ${name}`); }
    }
  } catch (e) {}
}
if (bad) process.exit(1);
console.log('text check passed (' + files.length + ' files)');
