import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { calculate, formatGrade } from '../calculator.mjs';

const sourcePath = process.argv[2];
if (!sourcePath) throw new Error('Informe o caminho para calculadora.vue original.');
const source = await readFile(sourcePath, 'utf8');
const script = source.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script, 'Componente original precisa conter <script>.');
// Executa somente a referência pública explicitamente fornecida, em contexto isolado.
const original = vm.runInNewContext(script.replace('export default', 'globalThis.component ='), {}, { timeout: 1000 });
let cases = 0;
const grades = Array.from({ length: 101 }, (_, index) => index / 10);
grades.push(0.0949, 0.095, 2.995, 4.95, 4.955, 4.959, 4.96, 4.965, 4.995, 6.995, 8.995);
for (const p1 of grades) for (const p2 of grades) {
  const context = { p1, p2, media_ap: 4.96 };
  const expected = {};
  for (const name of ['media', 'calcP2', 'calcP3', 'subs']) expected[name] = original.computed[name].call(context);
  context.media = expected.media;
  expected.approved = original.computed.approved.call(context);
  expected.mencao = original.filters.mencao(original.filters.round(expected.media));
  assert.deepEqual(calculate(p1, p2), expected, `P1=${p1}, P2=${p2}`);
  assert.equal(formatGrade(expected.media), original.filters.round(expected.media).replace('.', ','));
  cases++;
}
console.log(`Paridade confirmada: ${cases} pares de notas comparados com o componente original.`);
