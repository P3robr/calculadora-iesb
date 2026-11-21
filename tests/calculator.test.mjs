import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calculate, parseGrade, formatGrade, isGradeInput } from '../calculator.mjs';

test('exemplo de recuperação: a P2 é substituída mesmo sendo a maior nota', () => {
  const result = calculate(4, 4.5);
  assert.equal(formatGrade(result.media), '4,30');
  assert.equal(formatGrade(result.calcP3), '5,67');
  assert.equal(result.subs, 'P2');
  assert.equal(result.approved, false);
  assert.equal(result.mencao, 'MI');
});

test('aprovação usa a média sem arredondar; menção usa duas casas', () => {
  assert.equal(calculate(4.96, 4.96).approved, true);
  assert.equal(calculate(4.96, 4.96).mencao, 'MI');
  assert.equal(calculate(4.955, 4.955).approved, false);
  assert.equal(calculate(4.999, 4.999).mencao, 'MM');
  for (const [grade, mention] of [[0, 'SR'], [0.1, 'II'], [3, 'MI'], [5, 'MM'], [7, 'MS'], [9, 'SS'], [10, 'SS']]) {
    assert.equal(calculate(grade, grade).mencao, mention);
  }
});

test('notas zero, projeções e campos vazios são distintos', () => {
  assert.deepEqual(parseGrade(''), { value: null, error: '' });
  assert.deepEqual(parseGrade('0'), { value: 0, error: '' });
  assert.equal(calculate(0, 0).media, 0);
  assert.equal(calculate(0, 0).subs, 'P2');
  assert.equal(formatGrade(calculate(0, 0).calcP3), '8,33');
  assert.equal(formatGrade(calculate(0, 0).calcP2), '8,33');
  assert.equal(calculate(0, 10).calcP3, 0);
});

test('entrada aceita vírgula e ponto e rejeita notas inválidas', () => {
  for (const raw of ['4,5', '4.5', ' 4,5 ']) assert.deepEqual(parseGrade(raw), { value: 4.5, error: '' });
  assert.equal(parseGrade('10').value, 10);
  assert.equal(parseGrade('.5').value, 0.5);
  for (const raw of ['-1', '11', 'NaN', 'Infinity', '4,5.2', '1e1', '<script>', '9 9']) assert.ok(parseGrade(raw).error);
});

test('digitação aceita apenas dígitos e um separador, sem bloquear edição parcial', () => {
  for (const raw of ['', '0', '10', '4,', '4.', ',5', '.5', '4,75', '4.75']) assert.equal(isGradeInput(raw), true, raw);
  for (const raw of ['a', '4a', '1e1', '-1', '+1', '4,5.2', '4,,5', '4..5', '4 5', '7\n', '<script>']) {
    assert.equal(isGradeInput(raw), false, raw);
  }
});
