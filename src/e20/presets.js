// E20L-F02 listPresets: the closed table of the five labelled preset values (ELM-IN-05,
// ELM-SU-03, ELM-IE-04). The digits are written exactly as the signed requirements write them.
import { parse, done } from '../core.js';
import { MODULE } from './shared.js';
import { numeric } from './numeric.js';

const num = (text, unit) => numeric(parse(text), unit);

export function listPresets() {
  const presets = [
    { presetId: 'preset-1', kind: 'k', value: num('5', 'EU/kg'), asWritten: '5' },
    { presetId: 'preset-2', kind: 'k', value: num('0.2', 'EU/kg'), asWritten: '0.2' },
    {
      presetId: 'preset-3',
      kind: 'limit',
      value: num('0.5', 'EU/mL'),
      denominator: { kind: 'mL', label: 'mL' },
      asWritten: '0.5',
    },
    {
      presetId: 'preset-4',
      kind: 'range',
      low: num('50', '%'),
      high: num('200', '%'),
      lowAsWritten: '50',
      highAsWritten: '200',
    },
    { presetId: 'preset-5', kind: 'r-criterion', value: num('0.980', null), asWritten: '0.980' },
  ];
  return done(MODULE, { presets });
}
