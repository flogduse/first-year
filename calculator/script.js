const exprDisplay = document.getElementById('exprDisplay');
const resultDisplay = document.getElementById('resultDisplay');
const histList = document.getElementById('histList');
const histBadge = document.getElementById('histBadge');
const histToggle = document.getElementById('histToggle');
const degBtn = document.getElementById('degBtn');
const btn2nd = document.getElementById('btn2nd');
const progBtn = document.getElementById('progBtn');
const progPanel = document.getElementById('progPanel');
const progResult = document.getElementById('progResult');
const ind2nd = document.getElementById('ind2nd');
const indRad = document.getElementById('indRad');
const indMem = document.getElementById('indMem');

const state = {
  expr: '',
  display: '0',
  memory: 0,
  hasMemory: false,
  ans: null,
  history: [],
  is2nd: false,
  isDeg: true,
  isProg: false,
  progBase: 'DEC',
  justEvaled: false,
};

const ALT_MAP = {
  sin: { alt: 'sin\u207B\u00B9', action: 'asin' },
  cos: { alt: 'cos\u207B\u00B9', action: 'acos' },
  tan: { alt: 'tan\u207B\u00B9', action: 'atan' },
  log: { alt: '10\u02E3', action: 'pow10' },
  ln: { alt: 'e\u02E3', action: 'exp' },
};

function fact(n) {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  if (!Number.isInteger(n)) return gamma(n + 1);
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function gamma(n) {
  if (n < 0.5) return Math.PI / (Math.sin(Math.PI * n) * gamma(1 - n));
  n -= 1;
  const g = 7;
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  let x = c[0];
  for (let i = 1; i < g + 2; i++) x += c[i] / (n + i);
  const t = n + g + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, n + 0.5) * Math.exp(-t) * x;
}

function updateResult(text) {
  state.display = text;
  resultDisplay.textContent = text;
  clampFontSize();
}

function updateExpr(text) {
  state.expr = text;
  exprDisplay.textContent = text || '\u00A0';
}

function clampFontSize() {
  const len = state.display.length;
  if (len > 14) resultDisplay.style.fontSize = '1.3rem';
  else if (len > 10) resultDisplay.style.fontSize = '1.8rem';
  else resultDisplay.style.fontSize = '2.4rem';
}

function update2ndLabels() {
  document.querySelectorAll('.g4[data-action]').forEach((btn) => {
    const a = btn.dataset.action;
    if (ALT_MAP[a]) {
      btn.textContent = state.is2nd ? ALT_MAP[a].alt : btn.dataset.label || a;
      btn.classList.toggle('alt', state.is2nd);
    }
  });
  ind2nd.classList.toggle('active', state.is2nd);
}

function updateDegBtn() {
  degBtn.textContent = state.isDeg ? 'DEG' : 'RAD';
  degBtn.classList.toggle('active', !state.isDeg);
  indRad.classList.toggle('active', !state.isDeg);
}

function updateMemInd() {
  indMem.classList.toggle('active', state.hasMemory);
}

function getLastNumIndex(str) {
  let i = str.length - 1;
  while (i >= 0 && /[\d.]/.test(str[i])) i--;
  return i + 1;
}

function isOp(ch) {
  return '+\u00F7\u00D7-*/'.includes(ch);
}

function evaluate(exprStr) {
  if (!exprStr || exprStr.trim() === '') return null;
  let s = exprStr;
  s = s.replace(/\u00D7/g, '*');
  s = s.replace(/\u00F7/g, '/');
  s = s.replace(/\u03C0/g, 'PI');
  s = s.replace(/(\d+)!/g, 'fact($1)');
  let i = s.indexOf('!');
  while (i >= 0) {
    const start = getLastNumIndex(s.substring(0, i));
    if (start < i) {
      const num = s.substring(start, i);
      if (/^[\d.]+$/.test(num)) {
        s = s.substring(0, start) + 'fact(' + num + ')' + s.substring(i + 1);
        i = s.indexOf('!', start + 6);
        continue;
      }
    }
    i = s.indexOf('!', i + 1);
  }
  s = s.replace(/%/g, '/100');
  s = s.replace(/ANS/g, '(' + (state.ans ?? 0) + ')');
  if (s.includes('\u00B2')) s = s.replace(/\u00B2/g, '**2');
  if (s.includes('\u00B3')) s = s.replace(/\u00B3/g, '**3');

  try {
    const trig = {
      sin: (x) => Math.sin(state.isDeg ? x * Math.PI / 180 : x),
      cos: (x) => Math.cos(state.isDeg ? x * Math.PI / 180 : x),
      tan: (x) => Math.tan(state.isDeg ? x * Math.PI / 180 : x),
      asin: (x) => state.isDeg ? Math.asin(x) * 180 / Math.PI : Math.asin(x),
      acos: (x) => state.isDeg ? Math.acos(x) * 180 / Math.PI : Math.acos(x),
      atan: (x) => state.isDeg ? Math.atan(x) * 180 / Math.PI : Math.atan(x),
    };
    const fn = new Function(
      'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
      'PI', 'E', 'sqrt', 'cbrt', 'log', 'ln', 'exp',
      'pow10', 'fact', 'nthroot', 'recip',
      'return ' + s
    );
    const result = fn(
      trig.sin, trig.cos, trig.tan, trig.asin, trig.acos, trig.atan,
      Math.PI, Math.E,
      Math.sqrt, Math.cbrt, Math.log10, Math.log, Math.exp,
      (x) => Math.pow(10, x),
      fact,
      (x, n) => Math.pow(x, 1 / n),
      (x) => 1 / x
    );
    if (typeof result !== 'number' || !isFinite(result)) return null;
    return parseFloat(result.toFixed(12));
  } catch { return null; }
}

function addHistory(expr, result) {
  state.history.unshift({ expr, result: String(result) });
  if (state.history.length > 50) state.history.pop();
  renderHistory();
}

function renderHistory() {
  histList.innerHTML = '';
  histBadge.textContent = state.history.length;
  state.history.forEach((h) => {
    const div = document.createElement('div');
    div.className = 'hist-item';
    div.innerHTML = '<span class="hist-expr">' + h.expr + '</span><span class="hist-result">= ' + h.result + '</span>';
    div.onclick = () => {
      state.expr = h.expr;
      updateExpr(state.expr);
      updateResult(h.result);
      state.justEvaled = true;
    };
    histList.appendChild(div);
  });
}

function toggleHist() {
  histList.classList.toggle('open');
  histToggle.textContent = histList.classList.contains('open') ? '\u25B2' : '\u25BC';
}

function handleAction(action) {
  if (state.isProg) { handleProgAction(action); return; }

  const numRe = /^[\d.]$/;

  if (numRe.test(action)) {
    if (state.justEvaled) {
      state.expr = '';
      updateExpr('');
      state.justEvaled = false;
    }
    if (action === '.' && /\.\d*$/.test(state.expr)) return;
    if (action === '.' && (state.expr === '' || isOp(state.expr.slice(-1)) || state.expr.endsWith('('))) {
      state.expr += '0';
    }
    state.expr += action;
    updateExpr(state.expr);
    updateResult(state.expr);
    return;
  }

  if (action === 'clear') {
    state.expr = '';
    updateExpr('');
    updateResult('0');
    state.justEvaled = false;
    return;
  }

  if (action === 'del') {
    if (state.justEvaled) {
      state.expr = '';
      updateExpr('');
      updateResult('0');
      state.justEvaled = false;
      return;
    }
    const funcs = ['asin', 'acos', 'atan', 'pow10', 'nthroot', 'sqrt', 'cbrt', 'fact', 'exp', 'log', 'ln', 'sin', 'cos', 'tan'];
    let removed = false;
    for (const fn of funcs) {
      if (state.expr.endsWith(fn + '(')) {
        state.expr = state.expr.slice(0, -(fn.length + 1));
        removed = true;
        break;
      }
    }
    if (!removed) {
      if (state.expr.endsWith('**2')) { state.expr = state.expr.slice(0, -3); removed = true; }
      else if (state.expr.endsWith('**3')) { state.expr = state.expr.slice(0, -3); removed = true; }
      else if (state.expr.endsWith('**')) { state.expr = state.expr.slice(0, -2); removed = true; }
    }
    if (!removed) {
      state.expr = state.expr.slice(0, -1);
    }
    if (state.expr === '') {
      updateExpr('');
      updateResult('0');
    } else {
      updateExpr(state.expr);
      const evaled = evaluate(state.expr);
      if (evaled !== null) updateResult(String(evaled));
      else updateResult(state.expr);
    }
    return;
  }

  if (action === '=') {
    if (!state.expr) return;
    const result = evaluate(state.expr);
    if (result === null) { updateResult('Error'); return; }
    const resultStr = String(result);
    const displayExpr = state.expr;
    addHistory(displayExpr, resultStr);
    state.expr = resultStr;
    updateExpr(displayExpr);
    updateResult(resultStr);
    state.ans = result;
    state.justEvaled = true;
    return;
  }

  if (action === '\u00B1') { // ±
    if (state.justEvaled && state.expr) {
      state.expr = String(parseFloat(state.expr) * -1);
      updateExpr(state.expr);
      updateResult(state.expr);
      state.justEvaled = false;
      return;
    }
    const lastNum = state.expr.match(/([\d.]+)$/);
    if (lastNum) {
      const idx = state.expr.lastIndexOf(lastNum[1]);
      const neg = parseFloat(lastNum[1]) * -1;
      state.expr = state.expr.slice(0, idx) + String(neg);
      updateExpr(state.expr);
      const evaled = evaluate(state.expr);
      if (evaled !== null) updateResult(String(evaled));
      else updateResult(state.expr);
    }
    return;
  }

  const ops = { '+': '+', '-': '-', '\u00D7': '\u00D7', '\u00F7': '\u00F7' };
  if (ops[action]) {
    if (state.justEvaled) { state.justEvaled = false; }
    state.expr += action;
    updateExpr(state.expr);
    return;
  }

  if (action === '(' || action === ')') {
    if (state.justEvaled) {
      if (action === '(') {
        state.expr = '';
        updateExpr('');
        state.justEvaled = false;
      } else { return; }
    }
    state.expr += action;
    updateExpr(state.expr);
    return;
  }

  if (action === 'pi') {
    if (state.justEvaled) { state.expr = ''; updateExpr(''); state.justEvaled = false; }
    state.expr += '\u03C0';
    updateExpr(state.expr);
    return;
  }

  if (action === 'e') {
    if (state.justEvaled) { state.expr = ''; updateExpr(''); state.justEvaled = false; }
    state.expr += 'E';
    updateExpr(state.expr);
    return;
  }

  if (action === 'exp') {
    if (state.justEvaled) { state.expr = ''; updateExpr(''); state.justEvaled = false; }
    const last = state.expr.slice(-1);
    if (/[\d.]/.test(last)) {
      state.expr += 'e';
    } else {
      state.expr += '10**';
    }
    updateExpr(state.expr);
    return;
  }

  if (action === 'ans') {
    if (state.ans === null) return;
    if (state.justEvaled) { state.expr = ''; updateExpr(''); state.justEvaled = false; }
    state.expr += String(state.ans);
    updateExpr(state.expr);
    return;
  }

  if (action === '2nd') {
    state.is2nd = !state.is2nd;
    btn2nd.classList.toggle('active', state.is2nd);
    update2ndLabels();
    return;
  }

  if (action === 'deg') {
    state.isDeg = !state.isDeg;
    updateDegBtn();
    return;
  }

  if (action === 'prog') {
    state.isProg = !state.isProg;
    progBtn.classList.toggle('active', state.isProg);
    progPanel.classList.toggle('open', state.isProg);
    if (!state.isProg) progResult.classList.remove('show');
    return;
  }

  if (action === 'mc') { state.memory = 0; state.hasMemory = false; updateMemInd(); return; }
  if (action === 'mr') {
    if (!state.hasMemory) return;
    if (state.justEvaled) { state.expr = ''; updateExpr(''); state.justEvaled = false; }
    state.expr += String(state.memory);
    updateExpr(state.expr);
    return;
  }
  if (action === 'mplus') {
    const val = parseFloat(state.display);
    if (!isNaN(val)) { state.memory += val; state.hasMemory = true; updateMemInd(); }
    return;
  }
  if (action === 'mminus') {
    const val = parseFloat(state.display);
    if (!isNaN(val)) { state.memory -= val; state.hasMemory = true; updateMemInd(); }
    return;
  }

  if (action === 'sq') {
    if (state.justEvaled) { state.justEvaled = false; }
    if (state.is2nd) {
      const lastNum = state.expr.match(/([\d.]+)$/);
      if (lastNum) {
        const idx = state.expr.lastIndexOf(lastNum[1]);
        const recip = 1 / parseFloat(lastNum[1]);
        state.expr = state.expr.slice(0, idx) + String(recip);
        updateExpr(state.expr);
        updateResult(String(recip));
      }
      return;
    }
    if (/[\d.)]$/.test(state.expr)) {
      state.expr += '\u00B2';
      updateExpr(state.expr);
    }
    return;
  }

  if (action === 'cube') {
    if (state.justEvaled) { state.justEvaled = false; }
    if (state.is2nd) {
      if (/[\d.)]$/.test(state.expr)) {
        state.expr += '**(1/3)';
        updateExpr(state.expr);
      }
      return;
    }
    if (/[\d.)]$/.test(state.expr)) {
      state.expr += '\u00B3';
      updateExpr(state.expr);
    }
    return;
  }

  if (action === 'pow') {
    if (state.justEvaled) { state.justEvaled = false; }
    if (state.is2nd) {
      if (/[\d.)]$/.test(state.expr)) {
        state.expr += '**(1/';
        updateExpr(state.expr);
      }
      return;
    }
    state.expr += '**';
    updateExpr(state.expr);
    return;
  }

  const sciActions = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', 'sqrt', 'cbrt', 'exp', 'pow10', 'fact', 'nthroot', 'recip'];
  if (sciActions.includes(action)) {
    if (state.justEvaled) { state.expr = ''; updateExpr(''); state.justEvaled = false; }
    state.expr += action + '(';
    updateExpr(state.expr);
    return;
  }
}

function handleProgAction(action) {
  const bases = { HEX: 16, DEC: 10, OCT: 8, BIN: 2 };
  const base = bases[state.progBase] || 10;

  if (action === 'clear') {
    state.expr = '';
    updateExpr('');
    updateResult('0');
    progResult.classList.remove('show');
    return;
  }

  if (action === 'del') {
    state.expr = state.expr.slice(0, -1);
    updateExpr(state.expr);
    if (state.expr) evalProgExpr();
    else { updateResult('0'); progResult.classList.remove('show'); }
    return;
  }

  if (action === '=') {
    if (!state.expr) return;
    evalProgExpr(true);
    return;
  }

  if (['DEC', 'HEX', 'OCT', 'BIN'].includes(action)) {
    state.progBase = action;
    document.querySelectorAll('.prog-base-btn').forEach((b) => b.classList.toggle('active', b.dataset.base === action));
    if (state.expr) evalProgExpr();
    return;
  }

  if (['A', 'B', 'C', 'D', 'E', 'F'].includes(action)) {
    if (state.progBase !== 'HEX') return;
    state.expr += action;
    updateExpr(state.expr);
    evalProgExpr();
    return;
  }

  const bitwiseMap = { '<<': ' << ', '>>': ' >> ', and: ' & ', or: ' | ', xor: ' ^ ', not: '~' };
  if (bitwiseMap[action]) {
    state.expr += bitwiseMap[action];
    updateExpr(state.expr);
    return;
  }

  const progNumRe = /^[\d.]$/;
  if (progNumRe.test(action)) {
    const digit = parseInt(action, 10);
    if (digit >= base) return;
    state.expr += action;
    updateExpr(state.expr);
    evalProgExpr();
    return;
  }

  const opsMap = { '+': ' + ', '-': ' - ', '\u00D7': ' * ', '\u00F7': ' / ' };
  if (opsMap[action]) {
    state.expr += opsMap[action];
    updateExpr(state.expr);
    return;
  }

  if (action === '(' || action === ')') {
    state.expr += action;
    updateExpr(state.expr);
    return;
  }
}

function evalProgExpr(addHistoryFlag) {
  if (!state.expr) return;
  let s = state.expr;
  s = s.replace(/\u00D7/g, '*');
  s = s.replace(/\u00F7/g, '/');
  s = s.replace(/and/g, '&');
  s = s.replace(/or/g, '|');
  s = s.replace(/xor/g, '^');
  s = s.replace(/not/g, '~');

  const bases = { HEX: 16, DEC: 10, OCT: 8, BIN: 2 };
  const base = bases[state.progBase] || 10;
  let modified = s;
  modified = modified.replace(/\b0x([\da-fA-F]+)\b/g, (m, d) => String(parseInt(d, 16)));
  modified = modified.replace(/\b0b([01]+)\b/g, (m, d) => String(parseInt(d, 2)));
  modified = modified.replace(/\b0o([0-7]+)\b/g, (m, d) => String(parseInt(d, 8)));
  modified = modified.replace(/\b([\da-fA-F]+)\b/g, (m) => {
    if (/^[01]+$/.test(m) && base === 2) return String(parseInt(m, 2));
    if (/^[0-7]+$/.test(m) && base === 8) return String(parseInt(m, 8));
    if (/^[\da-fA-F]+$/.test(m) && base === 16) return String(parseInt(m, 16));
    return m;
  });

  let result;
  try { result = new Function('return ' + modified)(); }
  catch { return; }
  if (typeof result !== 'number' || !isFinite(result)) return;

  const intResult = Math.floor(result);
  const displayResult = String(intResult);
  updateResult(displayResult);
  if (addHistoryFlag) addHistory(state.expr, displayResult);

  const dec = intResult;
  const hex = (dec >>> 0).toString(16).toUpperCase();
  const oct = (dec >>> 0).toString(8);
  const bin = (dec >>> 0).toString(2);
  progResult.innerHTML =
    '<div>DEC: ' + dec + '</div>' +
    '<div>HEX: ' + hex + '</div>' +
    '<div>OCT: ' + oct + '</div>' +
    '<div>BIN: ' + bin + '</div>';
  progResult.classList.add('show');
}

document.querySelector('.btns').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;
  const action = btn.dataset.action;
  if (!action) return;
  handleAction(action);
});

document.querySelector('.prog-panel').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn, .prog-base-btn');
  if (!btn) return;
  const action = btn.dataset.action;
  const baseVal = btn.dataset.base;
  if (action) { handleProgAction(action); }
  else if (baseVal) { handleProgAction(baseVal); }
});

document.addEventListener('keydown', (e) => {
  const key = e.key;
  if (key === 'Shift') return;

  const numMap = {
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
    '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
    '.': '.',
  };

  const opMap = { '+': '+', '-': '-', '*': '\u00D7', '/': '\u00F7' };
  const ctrlMap = { Enter: '=', '=': '=', Escape: 'clear', Delete: 'clear', Backspace: 'del', '(': '(', ')': ')' };

  if (state.isProg) {
    const progKeys = {
      a: 'A', A: 'A', b: 'B', B: 'B', c: 'C', C: 'C',
      d: 'D', D: 'D', f: 'F', F: 'F',
      '&': 'and', '|': 'or', '^': 'xor', '~': 'not',
      '<': '<<', '>': '>>',
    };
    if (progKeys[key]) { e.preventDefault(); handleProgAction(progKeys[key]); return; }
  }

  if (!state.isProg) {
    const sciKeys = {
      s: 'sin', c: 'cos', t: 'tan', l: 'log', n: 'ln',
      q: 'sqrt', w: 'pow', '!': 'fact', r: 'deg',
      p: 'pi', P: 'pi', x: 'exp', X: 'exp',
    };
    if (sciKeys[key]) {
      e.preventDefault();
      if (key === 'r') { handleAction('deg'); return; }
      if (key === 'p' || key === 'P') { handleAction('pi'); return; }
      if (key === 'x' || key === 'X') { handleAction('exp'); return; }
      if (key === 'e') { handleAction('e'); return; }
      const a = sciKeys[key];
      const mapped = state.is2nd && ALT_MAP[a] ? ALT_MAP[a].action : a;
      handleAction(mapped);
      return;
    }
  }

  if (numMap[key]) { e.preventDefault(); handleAction(numMap[key]); return; }
  if (opMap[key]) { e.preventDefault(); handleAction(opMap[key]); return; }
  if (ctrlMap[key]) { e.preventDefault(); handleAction(ctrlMap[key]); return; }
  if (key === '%') { e.preventDefault(); handleAction('%'); return; }
});

document.querySelectorAll('.g4[data-action]').forEach((btn) => {
  if (!btn.dataset.label) btn.dataset.label = btn.textContent;
});
updateDegBtn();
