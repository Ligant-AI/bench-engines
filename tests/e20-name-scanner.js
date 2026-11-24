// The E20 name scanner (spec section 8). It lives here, outside src/e20, with its term list
// and its controls. Case-insensitive substring match; no word allow-list.

export const TERMS = [
  'dose', 'dosing', 'dosage', 'patient', 'infus', 'bagvolume', 'coa', 'clinic', 'bedside',
  'physician', 'pharmacist', 'nurse', 'apheresis', 'collectiontarget', 'mobilisation',
  'mobilization', 'transplant', 'cds', 'ivd', 'gmpready', 'cellskg', 'cellsperkg', 'cd34',
  'medicaldevice', 'fdaexempt', 'regulatedbyfda', 'valid', 'complian', 'complies', 'pass',
  'fail', 'release', 'conform', 'meetsspecification', 'eligible', 'safe', 'qualified',
  'certif', 'usp', 'aami',
];

// Multi-word terms of form B, with their words.
const MULTI = {
  bagvolume: ['bag', 'volume'],
  collectiontarget: ['collection', 'target'],
  gmpready: ['gmp', 'ready'],
  cellskg: ['cells', 'kg'],
  cellsperkg: ['cells', 'per', 'kg'],
  medicaldevice: ['medical', 'device'],
  fdaexempt: ['fda', 'exempt'],
  regulatedbyfda: ['regulated', 'by', 'fda'],
  meetsspecification: ['meets', 'specification'],
};

const GAP = '[\\s*/\\-_.]*';

// Form A: a name or token, tested alone as written and with separators removed.
export function scanName(name) {
  const lower = String(name).toLowerCase();
  const joined = lower.replace(/[-_./ ]/g, '');
  return TERMS.filter((t) => lower.includes(t) || joined.includes(t));
}

// Form B: source text and comments, separators kept, multi-word terms with gaps allowed.
export function scanText(text) {
  const lower = String(text).toLowerCase();
  return TERMS.filter((t) => {
    if (MULTI[t]) return new RegExp(MULTI[t].join(GAP)).test(lower);
    return lower.includes(t);
  });
}

export const POSITIVE_NAMES = [
  'dose_per_kg', 'dosageUnit', 'Release', 'bypass', 'isPass', 'isValid', 'clinicianName',
  'meetsSpecification', 'meets-specification',
];
export const POSITIVE_COMMENT = '// the reading meets\n// specification here';
export const NEGATIVE_NAMES = ['resultQualifier', 'rejected', 'incomplete'];
export const NEGATIVE_COMMENT = '// map as string';

// Every positive reported, no negative reported. Returns a list of problems (empty when sound).
export function runControls() {
  const problems = [];
  for (const n of POSITIVE_NAMES) if (!scanName(n).length) problems.push(`positive missed: ${n}`);
  if (!scanText(POSITIVE_COMMENT).length) problems.push('positive missed: split comment');
  for (const n of NEGATIVE_NAMES) if (scanName(n).length) problems.push(`negative reported: ${n}`);
  if (scanText(NEGATIVE_COMMENT).length) problems.push('negative reported: comment');
  return problems;
}

// Splits a source file into code (comments and string literals removed) and its string literals.
export function splitSource(text) {
  const noComments = text.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '');
  const strings = [];
  const code = noComments.replace(/'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|`(?:\\.|[^`\\])*`/g, (m) => {
    strings.push(m.slice(1, -1));
    return '""';
  });
  return { code, strings };
}

export const identifiersOf = (code) => code.match(/[A-Za-z_$][\w$]*/g) || [];

// Words of a camel-case, snake-case or kebab-case name, lower-cased.
export const wordsOf = (name) =>
  name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').split(/[\s_-]+/).filter(Boolean).map((w) => w.toLowerCase());

// Keys and string values of a returned object, recursively.
export function collect(value, keys = new Set(), strings = new Set()) {
  if (typeof value === 'string') strings.add(value);
  else if (Array.isArray(value)) for (const v of value) collect(v, keys, strings);
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) { keys.add(k); collect(v, keys, strings); }
  }
  return { keys, strings };
}

// True when a JS number sits anywhere in the value.
export function holdsNumber(value) {
  if (typeof value === 'number') return true;
  if (Array.isArray(value)) return value.some(holdsNumber);
  if (value && typeof value === 'object') return Object.values(value).some(holdsNumber);
  return false;
}
