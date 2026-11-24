// E20L-F02 listPresets: the closed table of the five labelled preset values (ELM-IN-05,
// ELM-SU-03, ELM-IE-04). The digits are written exactly as the signed requirements write them.
import { parse, done } from '../core.js';
import { MODULE } from './shared.js';
import { numeric } from './numeric.js';

const num = (text, unit) => numeric(parse(text), unit);

// The digits of presets 1 to 3, written once. F01 reads them from here, never from a copy.
export const PRESET_DIGITS = Object.freeze({ 'preset-1': '5', 'preset-2': '0.2', 'preset-3': '0.5' });

// The range of preset-4, written once. F06 reads it from here as well.
export const PRESET_RANGE = Object.freeze({ low: '50', high: '200' });

export function listPresets() {
  const presets = [
    { presetId: 'preset-1', kind: 'k', value: num(PRESET_DIGITS['preset-1'], 'EU/kg'), asWritten: PRESET_DIGITS['preset-1'] },
    { presetId: 'preset-2', kind: 'k', value: num(PRESET_DIGITS['preset-2'], 'EU/kg'), asWritten: PRESET_DIGITS['preset-2'] },
    {
      presetId: 'preset-3',
      kind: 'limit',
      value: num(PRESET_DIGITS['preset-3'], 'EU/mL'),
      denominator: { kind: 'mL', label: 'mL' },
      asWritten: PRESET_DIGITS['preset-3'],
    },
    {
      presetId: 'preset-4',
      kind: 'range',
      low: num(PRESET_RANGE.low, '%'),
      high: num(PRESET_RANGE.high, '%'),
      lowAsWritten: PRESET_RANGE.low,
      highAsWritten: PRESET_RANGE.high,
    },
    { presetId: 'preset-5', kind: 'r-criterion', value: num('0.980', null), asWritten: '0.980' },
  ];
  return done(MODULE, { presets });
}
