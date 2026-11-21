// Fórmulas e ordem das operações preservadas da calculadora de Gabriel Sancho.
// https://github.com/Sancho41/calculadora_iesb/blob/master/calculadora.vue
export function calculate(p1, p2) {
  const media_ap = 4.96;
  const media = p1 * 0.4 + p2 * 0.6;
  const nota1 = (p1 * 0.4 * -1 + 5) / 0.6;
  const nota2 = (p2 * 0.6 * -1 + 5) / 0.4;
  let nota = nota1 > nota2 ? nota1 : nota2;
  if (nota1 > 5 || nota2 > 5) nota = nota1 < nota2 ? nota1 : nota2;
  const sub1 = (5 - p1 * 0.4) / 0.6;
  const sub2 = (5 - p2 * 0.6) / 0.4;
  const subs = sub1 > media_ap || sub2 > media_ap
    ? (sub1 < sub2 ? 'P2' : 'P1')
    : (sub1 > sub2 ? 'P2' : 'P1');
  const rounded = Number(media.toFixed(2));
  const mencao = rounded >= 9 ? 'SS' : rounded >= 7 ? 'MS' : rounded >= 5 ? 'MM'
    : rounded >= 3 ? 'MI' : rounded >= 0.1 ? 'II' : 'SR';
  return { media, approved: media >= media_ap, calcP2: nota1 >= 0 ? nota1 : 0,
    calcP3: nota >= 0 ? nota : 0, subs, mencao };
}

export function parseGrade(raw) {
  const text = raw.trim();
  if (text === '') return { value: null, error: '' };
  if (!/^(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(text)) {
    return { value: null, error: 'Digite uma nota de 0 a 10.' };
  }
  const value = Number(text.replace(',', '.'));
  if (!Number.isFinite(value) || value < 0 || value > 10) {
    return { value: null, error: 'A nota precisa estar entre 0 e 10.' };
  }
  return { value, error: '' };
}

export const formatGrade = value => value.toFixed(2).replace('.', ',');

// Permite estados intermediários de digitação, inclusive campo vazio ou separador.
export const isGradeInput = raw => /^\d*(?:[.,]\d*)?$/.test(raw);
