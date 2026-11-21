import { calculate, parseGrade, formatGrade, isGradeInput } from './calculator.mjs?v=2';

const get = id => document.getElementById(id);
const inputs = [get('p1'), get('p2')];
const previousValues = new WeakMap(inputs.map(input => [input, '']));
const result = document.querySelector('.result');
let announceTimer;

function render() {
  const grades = inputs.map(input => {
    if (isGradeInput(input.value)) previousValues.set(input, input.value);
    const parsed = parseGrade(input.value);
    input.setAttribute('aria-invalid', String(Boolean(parsed.error)));
    get(`${input.id}-error`).textContent = parsed.error;
    return parsed;
  });
  get('clear').disabled = inputs.every(input => input.value === '');
  const [p1, p2] = grades.map(grade => grade.value);
  let state = 'empty', status = 'Aguardando notas', average = '—', mention = '—';
  let label = 'COMO USAR', value = 'Informe suas notas';
  let description = 'Preencha a P1 para descobrir quanto precisa na P2.';
  let progress = 0;

  if (grades.some(grade => grade.error)) {
    state = 'invalid'; status = 'Confira as notas'; label = 'NOTA INVÁLIDA';
    value = 'Confira o campo marcado'; description = 'Use notas de 0 a 10. Você pode digitar com vírgula ou ponto.';
  } else if (p1 !== null && p2 !== null) {
    const calculation = calculate(p1, p2);
    average = formatGrade(calculation.media); mention = calculation.mencao;
    progress = calculation.media / 10;
    if (calculation.approved) {
      state = 'approved'; status = 'Aprovado'; label = 'RESULTADO';
      value = 'Média de aprovação atingida'; description = 'Você atingiu a média de aprovação desta calculadora.';
    } else {
      state = 'recovery'; status = 'Abaixo da média'; label = 'NOTA NECESSÁRIA NA P3';
      value = `${formatGrade(calculation.calcP3)} na P3`;
      description = `Substituindo a ${calculation.subs}, que tem peso ${calculation.subs === 'P1' ? '40%' : '60%'}. A projeção busca média 5,00.`;
      if (calculation.calcP3 > 10) description += ' A nota projetada ultrapassa o máximo de 10.';
    }
  } else if (p1 !== null) {
    const needed = calculate(p1, 0).calcP2;
    state = 'partial'; status = 'Falta a P2'; label = 'PARA CHEGAR À MÉDIA 5,00';
    value = `${formatGrade(needed)} na P2`;
    description = 'Já fez a segunda prova? Preencha a P2 para ver sua média.';
    if (needed > 10) description = 'A nota projetada ultrapassa o máximo de 10. Preencha a P2 para conferir sua média e a projeção de P3.';
  } else if (p2 !== null) {
    state = 'partial'; status = 'Falta a P1'; label = 'NOTA PENDENTE';
    value = 'Qual foi sua P1?'; description = 'Preencha a primeira prova para calcular sua média do semestre.';
  }

  result.dataset.state = state;
  result.dataset.mention = mention;
  get('status').textContent = status;
  get('average').textContent = average;
  get('mention').textContent = mention;
  document.querySelectorAll('.mentions [data-mention]').forEach(item => {
    if (item.dataset.mention === mention) item.setAttribute('aria-current', 'true');
    else item.removeAttribute('aria-current');
  });
  get('scale-fill').style.transform = `scaleX(${progress})`;
  get('next-label').textContent = label;
  get('next-value').textContent = value;
  get('next-description').textContent = description;
  clearTimeout(announceTimer);
  announceTimer = setTimeout(() => {
    get('announcement').textContent = `${status}. ${average === '—' ? '' : `Média ${average}. Menção ${mention}. `}${value}. ${description}`;
  }, 450);
}

const editedValue = (input, text) => input.value.slice(0, input.selectionStart) + text + input.value.slice(input.selectionEnd);
inputs.forEach(input => {
  input.addEventListener('beforeinput', event => {
    if (!event.isComposing && event.inputType.startsWith('insert') && event.data !== null
        && !isGradeInput(editedValue(input, event.data))) event.preventDefault();
  });
  input.addEventListener('paste', event => {
    const text = event.clipboardData?.getData('text');
    if (text !== undefined && !isGradeInput(editedValue(input, text))) event.preventDefault();
  });
  input.addEventListener('input', () => {
    if (!isGradeInput(input.value)) {
      const position = input.selectionStart;
      input.value = previousValues.get(input) ?? '';
      const cursor = Math.min(position, input.value.length);
      input.setSelectionRange(cursor, cursor);
    }
    render();
  });
});
get('grades').addEventListener('submit', event => event.preventDefault());
inputs[0].addEventListener('keydown', event => {
  if (event.key === 'Enter') { event.preventDefault(); inputs[1].focus(); }
});
get('clear').addEventListener('click', () => {
  inputs.forEach(input => { input.value = ''; });
  render(); inputs[0].focus();
});
render();
