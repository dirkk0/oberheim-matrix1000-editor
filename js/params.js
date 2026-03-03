// Matrix 1000 Parameter Definitions
// Based on Oberheim Matrix-6/1000 SysEx specification
// Parameter numbers 0-99, verified against BCR2000 template SysEx bytes

export const PARAMS = [
  // ── DCO 1 (0-9) ──────────────────────────────────────
  { number: 0,  name: 'DCO 1 Frequency',       group: 'DCO 1', type: 'slider', min: 0, max: 63, signed: false },
  { number: 1,  name: 'DCO 1 Freq by LFO 1',   group: 'DCO 1', type: 'slider', min: -63, max: 63, signed: true },
  { number: 2,  name: 'DCO Sync',               group: 'DCO 1', type: 'select', min: 0, max: 3, signed: false,
    options: { 0: 'Off', 1: 'Soft', 2: 'Medium', 3: 'Hard' } },
  { number: 3,  name: 'DCO 1 Pulse Width',      group: 'DCO 1', type: 'slider', min: 0, max: 63, signed: false },
  { number: 4,  name: 'DCO 1 PW by LFO 2',     group: 'DCO 1', type: 'slider', min: -63, max: 63, signed: true },
  { number: 5,  name: 'DCO 1 Wave Shape',       group: 'DCO 1', type: 'slider', min: 0, max: 63, signed: false },
  { number: 6,  name: 'DCO 1 Waveform',         group: 'DCO 1', type: 'select', min: 0, max: 3, signed: false,
    options: { 0: 'Off', 1: 'Pulse', 2: 'Wave', 3: 'Both' } },
  { number: 7,  name: 'DCO 1 Fixed Mods 1',     group: 'DCO 1', type: 'select', min: 0, max: 3, signed: false,
    options: { 0: 'Off', 1: 'Lever 1', 2: 'Vibrato', 3: 'Lever 1+Vib' } },
  { number: 8,  name: 'DCO 1 Fixed Mods 2',     group: 'DCO 1', type: 'select', min: 0, max: 1, signed: false,
    options: { 0: 'Off', 1: 'Portamento' } },
  { number: 9,  name: 'DCO 1 Click',            group: 'DCO 1', type: 'toggle', min: 0, max: 1, signed: false,
    options: { 0: 'Off', 1: 'On' } },

  // ── DCO 2 (10-19) ────────────────────────────────────
  { number: 10, name: 'DCO 2 Frequency',        group: 'DCO 2', type: 'slider', min: 0, max: 63, signed: false },
  { number: 11, name: 'DCO 2 Freq by LFO 1',   group: 'DCO 2', type: 'slider', min: -63, max: 63, signed: true },
  { number: 12, name: 'DCO 2 Detune',           group: 'DCO 2', type: 'slider', min: -63, max: 63, signed: true },
  { number: 13, name: 'DCO 2 Pulse Width',      group: 'DCO 2', type: 'slider', min: 0, max: 63, signed: false },
  { number: 14, name: 'DCO 2 PW by LFO 2',     group: 'DCO 2', type: 'slider', min: -63, max: 63, signed: true },
  { number: 15, name: 'DCO 2 Wave Shape',       group: 'DCO 2', type: 'slider', min: 0, max: 63, signed: false },
  { number: 16, name: 'DCO 2 Waveform',         group: 'DCO 2', type: 'select', min: 0, max: 7, signed: false,
    options: { 0: 'Off', 1: 'Pulse', 2: 'Wave', 3: 'Both', 4: 'Noise', 5: 'Noise+Pulse', 6: 'Noise+Wave', 7: 'All' } },
  { number: 17, name: 'DCO 2 Fixed Mods 1',     group: 'DCO 2', type: 'select', min: 0, max: 3, signed: false,
    options: { 0: 'Off', 1: 'Lever 1', 2: 'Vibrato', 3: 'Lever 1+Vib' } },
  { number: 18, name: 'DCO 2 Fixed Mods 2',     group: 'DCO 2', type: 'select', min: 0, max: 3, signed: false,
    options: { 0: 'Off', 1: 'Portamento', 2: 'Keyboard', 3: 'Port+Key' } },
  { number: 19, name: 'DCO 2 Click',            group: 'DCO 2', type: 'toggle', min: 0, max: 1, signed: false,
    options: { 0: 'Off', 1: 'On' } },

  // ── MIX (20) ──────────────────────────────────────────
  { number: 20, name: 'DCO Mix',                group: 'Mix', type: 'slider', min: 0, max: 63, signed: false },

  // ── VCF (21-26) ───────────────────────────────────────
  { number: 21, name: 'VCF Frequency',          group: 'VCF', type: 'slider', min: 0, max: 127, signed: false },
  { number: 22, name: 'VCF Freq by Env 1',      group: 'VCF', type: 'slider', min: -63, max: 63, signed: true },
  { number: 23, name: 'VCF Freq by Pressure',   group: 'VCF', type: 'slider', min: -63, max: 63, signed: true },
  { number: 24, name: 'VCF Resonance',          group: 'VCF', type: 'slider', min: 0, max: 63, signed: false },
  { number: 25, name: 'VCF Fixed Mods 1',       group: 'VCF', type: 'select', min: 0, max: 3, signed: false,
    options: { 0: 'Off', 1: 'Lever 1', 2: 'Vibrato', 3: 'Lever 1+Vib' } },
  { number: 26, name: 'VCF Fixed Mods 2',       group: 'VCF', type: 'select', min: 0, max: 3, signed: false,
    options: { 0: 'Off', 1: 'Portamento', 2: 'Keyboard', 3: 'Port+Key' } },

  // ── VCA (27-29) ───────────────────────────────────────
  { number: 27, name: 'VCA 1 Amount',           group: 'VCA', type: 'slider', min: 0, max: 63, signed: false },
  { number: 28, name: 'VCA 1 by Velocity',      group: 'VCA', type: 'slider', min: -63, max: 63, signed: true },
  { number: 29, name: 'VCA 2 by Env 2',         group: 'VCA', type: 'slider', min: -63, max: 63, signed: true },

  // ── VCF FM (30-32) ────────────────────────────────────
  { number: 30, name: 'VCF FM Amount',          group: 'VCF FM', type: 'slider', min: 0, max: 63, signed: false },
  { number: 31, name: 'VCF FM by Env 3',        group: 'VCF FM', type: 'slider', min: -63, max: 63, signed: true },
  { number: 32, name: 'VCF FM by Pressure',     group: 'VCF FM', type: 'slider', min: -63, max: 63, signed: true },

  // ── TRACKING GENERATOR (33-38) ────────────────────────
  { number: 33, name: 'Track Input Source',      group: 'Tracking', type: 'select', min: 0, max: 20, signed: false,
    options: null }, // Uses MOD_SOURCES table
  { number: 34, name: 'Track Point 1',           group: 'Tracking', type: 'slider', min: 0, max: 63, signed: false },
  { number: 35, name: 'Track Point 2',           group: 'Tracking', type: 'slider', min: 0, max: 63, signed: false },
  { number: 36, name: 'Track Point 3',           group: 'Tracking', type: 'slider', min: 0, max: 63, signed: false },
  { number: 37, name: 'Track Point 4',           group: 'Tracking', type: 'slider', min: 0, max: 63, signed: false },
  { number: 38, name: 'Track Point 5',           group: 'Tracking', type: 'slider', min: 0, max: 63, signed: false },

  // ── (39: reserved) ───────────────────────────────────
  { number: 39, name: 'Reserved (39)',           group: 'Misc', type: 'slider', min: 0, max: 63, signed: false },

  // ── RAMP GENERATORS (40-43) ───────────────────────────
  { number: 40, name: 'Ramp 1 Rate',            group: 'Ramp', type: 'slider', min: 0, max: 63, signed: false },
  { number: 41, name: 'Ramp 1 Mode',            group: 'Ramp', type: 'select', min: 0, max: 3, signed: false,
    options: { 0: 'Single', 1: 'Multi', 2: 'External', 3: 'Ext Gate' } },
  { number: 42, name: 'Ramp 2 Rate',            group: 'Ramp', type: 'slider', min: 0, max: 63, signed: false },
  { number: 43, name: 'Ramp 2 Mode',            group: 'Ramp', type: 'select', min: 0, max: 3, signed: false,
    options: { 0: 'Single', 1: 'Multi', 2: 'External', 3: 'Ext Gate' } },

  // ── PORTAMENTO (44-47) ────────────────────────────────
  { number: 44, name: 'Portamento Rate',         group: 'Portamento', type: 'slider', min: 0, max: 63, signed: false },
  { number: 45, name: 'Portamento by Velocity',  group: 'Portamento', type: 'slider', min: -63, max: 63, signed: true },
  { number: 46, name: 'Lag Mode',                group: 'Portamento', type: 'select', min: 0, max: 3, signed: false,
    options: { 0: 'Constant Speed', 1: 'Constant Time', 2: 'Exp Speed', 3: 'Exp Time' } },
  { number: 47, name: 'Legato Portamento',       group: 'Portamento', type: 'toggle', min: 0, max: 1, signed: false,
    options: { 0: 'Off', 1: 'On' } },

  // ── KEYBOARD (48-49) ─────────────────────────────────
  { number: 48, name: 'Keyboard Mode',           group: 'Keyboard', type: 'select', min: 0, max: 3, signed: false,
    options: { 0: 'Reassign', 1: 'Rotate', 2: 'Unison', 3: 'Reassign+Rob' } },
  { number: 49, name: 'Reserved (49)',           group: 'Misc', type: 'slider', min: 0, max: 63, signed: false },

  // ── ENV 1 (50-59) ────────────────────────────────────
  { number: 50, name: 'Env 1 Delay',            group: 'Env 1', type: 'slider', min: 0, max: 63, signed: false },
  { number: 51, name: 'Env 1 Attack',           group: 'Env 1', type: 'slider', min: 0, max: 63, signed: false },
  { number: 52, name: 'Env 1 Decay',            group: 'Env 1', type: 'slider', min: 0, max: 63, signed: false },
  { number: 53, name: 'Env 1 Sustain',          group: 'Env 1', type: 'slider', min: 0, max: 63, signed: false },
  { number: 54, name: 'Env 1 Release',          group: 'Env 1', type: 'slider', min: 0, max: 63, signed: false },
  { number: 55, name: 'Env 1 Amplitude',        group: 'Env 1', type: 'slider', min: 0, max: 63, signed: false },
  { number: 56, name: 'Env 1 Amp by Velocity',  group: 'Env 1', type: 'slider', min: -63, max: 63, signed: true },
  { number: 57, name: 'Env 1 Trigger Mode',     group: 'Env 1', type: 'select', min: 0, max: 7, signed: false,
    options: { 0: 'Single', 1: 'Single Reset', 2: 'Multi', 3: 'Multi Reset',
               4: 'Ext Single', 5: 'Ext Single Reset', 6: 'Ext Multi', 7: 'Ext Multi Reset' } },
  { number: 58, name: 'Env 1 Mode',             group: 'Env 1', type: 'select', min: 0, max: 3, signed: false,
    options: { 0: 'Normal', 1: 'DADR', 2: 'Free Run', 3: 'DADR+Free' } },
  { number: 59, name: 'Env 1 LFO Trigger',      group: 'Env 1', type: 'select', min: 0, max: 3, signed: false,
    options: { 0: 'Off', 1: 'LFO 1 Gated', 2: 'LFO 1', 3: 'LFO 1 Gated' } },

  // ── ENV 2 (60-69) ────────────────────────────────────
  { number: 60, name: 'Env 2 Delay',            group: 'Env 2', type: 'slider', min: 0, max: 63, signed: false },
  { number: 61, name: 'Env 2 Attack',           group: 'Env 2', type: 'slider', min: 0, max: 63, signed: false },
  { number: 62, name: 'Env 2 Decay',            group: 'Env 2', type: 'slider', min: 0, max: 63, signed: false },
  { number: 63, name: 'Env 2 Sustain',          group: 'Env 2', type: 'slider', min: 0, max: 63, signed: false },
  { number: 64, name: 'Env 2 Release',          group: 'Env 2', type: 'slider', min: 0, max: 63, signed: false },
  { number: 65, name: 'Env 2 Amplitude',        group: 'Env 2', type: 'slider', min: 0, max: 63, signed: false },
  { number: 66, name: 'Env 2 Amp by Velocity',  group: 'Env 2', type: 'slider', min: -63, max: 63, signed: true },
  { number: 67, name: 'Env 2 Trigger Mode',     group: 'Env 2', type: 'select', min: 0, max: 7, signed: false,
    options: { 0: 'Single', 1: 'Single Reset', 2: 'Multi', 3: 'Multi Reset',
               4: 'Ext Single', 5: 'Ext Single Reset', 6: 'Ext Multi', 7: 'Ext Multi Reset' } },
  { number: 68, name: 'Env 2 Mode',             group: 'Env 2', type: 'select', min: 0, max: 3, signed: false,
    options: { 0: 'Normal', 1: 'DADR', 2: 'Free Run', 3: 'DADR+Free' } },
  { number: 69, name: 'Env 2 LFO Trigger',      group: 'Env 2', type: 'select', min: 0, max: 3, signed: false,
    options: { 0: 'Off', 1: 'LFO 1 Gated', 2: 'LFO 1', 3: 'LFO 1 Gated' } },

  // ── ENV 3 (70-79) ────────────────────────────────────
  { number: 70, name: 'Env 3 Delay',            group: 'Env 3', type: 'slider', min: 0, max: 63, signed: false },
  { number: 71, name: 'Env 3 Attack',           group: 'Env 3', type: 'slider', min: 0, max: 63, signed: false },
  { number: 72, name: 'Env 3 Decay',            group: 'Env 3', type: 'slider', min: 0, max: 63, signed: false },
  { number: 73, name: 'Env 3 Sustain',          group: 'Env 3', type: 'slider', min: 0, max: 63, signed: false },
  { number: 74, name: 'Env 3 Release',          group: 'Env 3', type: 'slider', min: 0, max: 63, signed: false },
  { number: 75, name: 'Env 3 Amplitude',        group: 'Env 3', type: 'slider', min: 0, max: 63, signed: false },
  { number: 76, name: 'Env 3 Amp by Velocity',  group: 'Env 3', type: 'slider', min: -63, max: 63, signed: true },
  { number: 77, name: 'Env 3 Trigger Mode',     group: 'Env 3', type: 'select', min: 0, max: 7, signed: false,
    options: { 0: 'Single', 1: 'Single Reset', 2: 'Multi', 3: 'Multi Reset',
               4: 'Ext Single', 5: 'Ext Single Reset', 6: 'Ext Multi', 7: 'Ext Multi Reset' } },
  { number: 78, name: 'Env 3 Mode',             group: 'Env 3', type: 'select', min: 0, max: 3, signed: false,
    options: { 0: 'Normal', 1: 'DADR', 2: 'Free Run', 3: 'DADR+Free' } },
  { number: 79, name: 'Env 3 LFO Trigger',      group: 'Env 3', type: 'select', min: 0, max: 3, signed: false,
    options: { 0: 'Off', 1: 'LFO 1 Gated', 2: 'LFO 1', 3: 'LFO 1 Gated' } },

  // ── LFO 1 (80-89) ────────────────────────────────────
  { number: 80, name: 'LFO 1 Speed',            group: 'LFO 1', type: 'slider', min: 0, max: 63, signed: false },
  { number: 81, name: 'LFO 1 Speed by Pressure',group: 'LFO 1', type: 'slider', min: -63, max: 63, signed: true },
  { number: 82, name: 'LFO 1 Waveshape',        group: 'LFO 1', type: 'select', min: 0, max: 7, signed: false,
    options: { 0: 'Triangle', 1: 'Up Saw', 2: 'Down Saw', 3: 'Square', 4: 'Random', 5: 'Noise', 6: 'Sampled', 7: 'Sampled' } },
  { number: 83, name: 'LFO 1 Retrigger Point',  group: 'LFO 1', type: 'slider', min: 0, max: 63, signed: false },
  { number: 84, name: 'LFO 1 Amplitude',        group: 'LFO 1', type: 'slider', min: 0, max: 63, signed: false },
  { number: 85, name: 'LFO 1 Amp by Ramp 1',   group: 'LFO 1', type: 'slider', min: -63, max: 63, signed: true },
  { number: 86, name: 'LFO 1 Trigger',          group: 'LFO 1', type: 'select', min: 0, max: 3, signed: false,
    options: { 0: 'Off', 1: 'Single', 2: 'Multi', 3: 'External' } },
  { number: 87, name: 'LFO 1 Lag',              group: 'LFO 1', type: 'toggle', min: 0, max: 1, signed: false,
    options: { 0: 'Off', 1: 'On' } },
  { number: 88, name: 'LFO 1 Sample Source',    group: 'LFO 1', type: 'select', min: 0, max: 20, signed: false,
    options: null }, // Uses MOD_SOURCES table
  { number: 89, name: 'Reserved (89)',           group: 'Misc', type: 'slider', min: 0, max: 63, signed: false },

  // ── LFO 2 (90-99) ────────────────────────────────────
  { number: 90, name: 'LFO 2 Speed',            group: 'LFO 2', type: 'slider', min: 0, max: 63, signed: false },
  { number: 91, name: 'LFO 2 Speed by Keyboard',group: 'LFO 2', type: 'slider', min: -63, max: 63, signed: true },
  { number: 92, name: 'LFO 2 Waveshape',        group: 'LFO 2', type: 'select', min: 0, max: 7, signed: false,
    options: { 0: 'Triangle', 1: 'Up Saw', 2: 'Down Saw', 3: 'Square', 4: 'Random', 5: 'Noise', 6: 'Sampled', 7: 'Sampled' } },
  { number: 93, name: 'LFO 2 Retrigger Point',  group: 'LFO 2', type: 'slider', min: 0, max: 63, signed: false },
  { number: 94, name: 'LFO 2 Amplitude',        group: 'LFO 2', type: 'slider', min: 0, max: 63, signed: false },
  { number: 95, name: 'LFO 2 Amp by Ramp 2',   group: 'LFO 2', type: 'slider', min: -63, max: 63, signed: true },
  { number: 96, name: 'LFO 2 Trigger',          group: 'LFO 2', type: 'select', min: 0, max: 3, signed: false,
    options: { 0: 'Off', 1: 'Single', 2: 'Multi', 3: 'External' } },
  { number: 97, name: 'LFO 2 Lag',              group: 'LFO 2', type: 'toggle', min: 0, max: 1, signed: false,
    options: { 0: 'Off', 1: 'On' } },
  { number: 98, name: 'LFO 2 Sample Source',    group: 'LFO 2', type: 'select', min: 0, max: 20, signed: false,
    options: null }, // Uses MOD_SOURCES table
  { number: 99, name: 'Reserved (99)',           group: 'Misc', type: 'slider', min: 0, max: 63, signed: false },
];

// ── Modulation Sources (Table 2) ────────────────────────
export const MOD_SOURCES = [
  { value: 0,  name: 'Unused' },
  { value: 1,  name: 'Env 1' },
  { value: 2,  name: 'Env 2' },
  { value: 3,  name: 'Env 3' },
  { value: 4,  name: 'LFO 1' },
  { value: 5,  name: 'LFO 2' },
  { value: 6,  name: 'Vibrato' },
  { value: 7,  name: 'Ramp 1' },
  { value: 8,  name: 'Ramp 2' },
  { value: 9,  name: 'Keyboard' },
  { value: 10, name: 'Portamento' },
  { value: 11, name: 'Tracking Gen' },
  { value: 12, name: 'Keyboard Gate' },
  { value: 13, name: 'Velocity' },
  { value: 14, name: 'Release Vel' },
  { value: 15, name: 'Pressure' },
  { value: 16, name: 'Pedal 1' },
  { value: 17, name: 'Pedal 2' },
  { value: 18, name: 'Lever 1' },
  { value: 19, name: 'Lever 2' },
  { value: 20, name: 'Lever 3' },
];

// ── Modulation Destinations (Table 3) ───────────────────
export const MOD_DESTS = [
  { value: 0,  name: 'Unused' },
  { value: 1,  name: 'DCO 1 Freq' },
  { value: 2,  name: 'DCO 1 PW' },
  { value: 3,  name: 'DCO 1 Wave Shape' },
  { value: 4,  name: 'DCO 2 Freq' },
  { value: 5,  name: 'DCO 2 PW' },
  { value: 6,  name: 'DCO 2 Wave Shape' },
  { value: 7,  name: 'Mix Level' },
  { value: 8,  name: 'VCF FM Amount' },
  { value: 9,  name: 'VCF Frequency' },
  { value: 10, name: 'VCF Resonance' },
  { value: 11, name: 'VCA 1 Level' },
  { value: 12, name: 'VCA 2 Level' },
  { value: 13, name: 'Env 1 Delay' },
  { value: 14, name: 'Env 1 Attack' },
  { value: 15, name: 'Env 1 Decay' },
  { value: 16, name: 'Env 1 Release' },
  { value: 17, name: 'Env 1 Amplitude' },
  { value: 18, name: 'Env 2 Delay' },
  { value: 19, name: 'Env 2 Attack' },
  { value: 20, name: 'Env 2 Decay' },
  { value: 21, name: 'Env 2 Release' },
  { value: 22, name: 'Env 2 Amplitude' },
  { value: 23, name: 'Env 3 Delay' },
  { value: 24, name: 'Env 3 Attack' },
  { value: 25, name: 'Env 3 Decay' },
  { value: 26, name: 'Env 3 Release' },
  { value: 27, name: 'Env 3 Amplitude' },
  { value: 28, name: 'LFO 1 Speed' },
  { value: 29, name: 'LFO 1 Amplitude' },
  { value: 30, name: 'LFO 2 Speed' },
  { value: 31, name: 'LFO 2 Amplitude' },
  { value: 32, name: 'Portamento Time' },
];

// Group display order (mirrors signal flow)
export const GROUP_ORDER = [
  'DCO 1', 'DCO 2', 'Mix', 'VCF', 'VCF FM', 'VCA',
  'Env 1', 'Env 2', 'Env 3',
  'LFO 1', 'LFO 2', 'Ramp',
  'Tracking', 'Portamento', 'Keyboard',
];

// Build lookup map: param number -> param definition
export const PARAM_MAP = new Map(PARAMS.map(p => [p.number, p]));
