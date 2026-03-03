// Matrix 1000 SysEx Message Builders
// Oberheim manufacturer ID: 0x10
// Device ID: 0x06 (Matrix 1000)

const SYSEX_START = 0xF0;
const SYSEX_END   = 0xF7;
const OBERHEIM_ID = 0x10;
const DEVICE_ID   = 0x06;

// Opcodes
const OP_SINGLE_PATCH   = 0x01; // Single patch data (response)
const OP_REQUEST_DATA   = 0x04; // Request data
const OP_PARAM_EDIT     = 0x06; // Single parameter edit
const OP_BANK_SELECT    = 0x0A; // Select bank
const OP_MOD_MATRIX_EDIT = 0x0B; // Modulation matrix path edit

export { OBERHEIM_ID, DEVICE_ID, OP_SINGLE_PATCH };

/**
 * Encode a signed value (-63..+63) to Matrix 1000 byte format.
 * Bit 6 = sign (0=positive, 1=negative), bits 0-5 = magnitude.
 */
export function encodeSignedValue(value) {
  if (value >= 0) return value & 0x3F;
  return ((-value) & 0x3F) | 0x40;
}

/**
 * Encode a parameter value for SysEx transmission.
 * Handles both signed and unsigned params.
 */
export function encodeParamValue(param, value) {
  if (param.signed) {
    return encodeSignedValue(value);
  }
  return value & 0x7F;
}

/**
 * Build a single parameter edit message (Opcode 06H).
 * Format: F0 10 06 06 <param> <value> F7
 */
export function buildParamEdit(param, value) {
  const encodedValue = encodeParamValue(param, value);
  return new Uint8Array([
    SYSEX_START,
    OBERHEIM_ID,
    DEVICE_ID,
    OP_PARAM_EDIT,
    param.number & 0x7F,
    encodedValue,
    SYSEX_END,
  ]);
}

/**
 * Build a modulation matrix path edit message (Opcode 0BH).
 * Format: F0 10 06 0B <path> <source> <amount> <dest> F7
 * All three fields (source, amount, dest) are required per message.
 */
export function buildModMatrixEdit(path, source, amount, dest) {
  return new Uint8Array([
    SYSEX_START,
    OBERHEIM_ID,
    DEVICE_ID,
    OP_MOD_MATRIX_EDIT,
    path & 0x7F,
    source & 0x7F,
    encodeSignedValue(amount),
    dest & 0x7F,
    SYSEX_END,
  ]);
}

/**
 * Build a bank select message (Opcode 0AH).
 * Format: F0 10 06 0A <bank> F7
 * Bank 0-9 selects banks 0-9 (100 patches each).
 */
export function buildBankSelect(bank) {
  return new Uint8Array([
    SYSEX_START,
    OBERHEIM_ID,
    DEVICE_ID,
    OP_BANK_SELECT,
    bank & 0x7F,
    SYSEX_END,
  ]);
}

/**
 * Build a patch request message (Opcode 04H, type 1 = single patch).
 * Format: F0 10 06 04 01 <patch#> F7
 */
export function buildPatchRequest(patchNumber) {
  return new Uint8Array([
    SYSEX_START,
    OBERHEIM_ID,
    DEVICE_ID,
    OP_REQUEST_DATA,
    0x01, // type 1 = single patch
    patchNumber & 0x7F,
    SYSEX_END,
  ]);
}

/**
 * Build an Unlock Bank message (Opcode 0CH).
 * Must be sent before storing to a bank.
 * Format: F0 10 06 0C F7
 */
export function buildUnlockBank() {
  return new Uint8Array([
    SYSEX_START,
    OBERHEIM_ID,
    DEVICE_ID,
    0x0C,
    SYSEX_END,
  ]);
}

/**
 * Build a Store Edit Buffer message (Opcode 0EH).
 * Stores the current edit buffer to a patch location.
 * Format: F0 10 06 0E <patch#> <bank#> <unit> F7
 * unit: 0 = single unit
 */
export function buildStoreEditBuffer(patchNumber, bank) {
  return new Uint8Array([
    SYSEX_START,
    OBERHEIM_ID,
    DEVICE_ID,
    0x0E,
    patchNumber & 0x7F,
    bank & 0x7F,
    0x00, // unit
    SYSEX_END,
  ]);
}

/**
 * Build a Universal MIDI Identity Request message.
 * Format: F0 7E 7F 06 01 F7
 * Most MIDI devices respond with their manufacturer/device info.
 */
export function buildIdentityRequest() {
  return new Uint8Array([0xF0, 0x7E, 0x7F, 0x06, 0x01, 0xF7]);
}

/**
 * Format a SysEx message as a hex string for console logging.
 */
export function sysexToHex(msg) {
  return Array.from(msg).map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ');
}

// ── Patch Data Parser ───────────────────────────────────
// Unpacks a 134-byte patch dump into parameter values + mod matrix.
// The transmitted format is nibble-pairs (low first, high second) = 268 nibbles.

/**
 * Reassemble nibble-pair data back into bytes.
 * Input: array of nibbles (each 0x00-0x0F), length 268
 * Output: Uint8Array of 134 bytes
 */
function reassembleNibbles(nibbles) {
  const bytes = new Uint8Array(nibbles.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = (nibbles[i * 2] & 0x0F) | ((nibbles[i * 2 + 1] & 0x0F) << 4);
  }
  return bytes;
}

/**
 * Decode a signed 7-bit value from patch data.
 * Bit 6 = sign, bits 0-5 = magnitude.
 */
function decodeSignedValue(byte) {
  const magnitude = byte & 0x3F;
  return (byte & 0x40) ? -magnitude : magnitude;
}

// Patch byte → parameter mapping table.
// Each entry: [byteIndex, paramNumber, bitCount, isSigned]
// See docs/sysex-spec.md for the full table.
const PATCH_MAP_UNSIGNED = [
  // byte, param, bits
  [8,  48, 2],  // Keyboard Mode
  [9,   0, 6],  // DCO 1 Frequency
  [10,  5, 6],  // DCO 1 Wave Shape
  [11,  3, 6],  // DCO 1 Pulse Width
  [12,  7, 2],  // DCO 1 Fixed Mods 1
  [13,  6, 2],  // DCO 1 Waveform Enable
  [14, 10, 6],  // DCO 2 Frequency
  [15, 15, 6],  // DCO 2 Wave Shape
  [16, 13, 6],  // DCO 2 Pulse Width
  [17, 17, 2],  // DCO 2 Fixed Mods 1
  [18, 16, 3],  // DCO 2 Waveform Enable
  [19, 12, 6],  // DCO 2 Detune (stored unsigned in patch, decoded as signed)
  [20, 20, 6],  // Mix
  [21,  8, 2],  // DCO 1 Fixed Mods 2
  [22,  9, 1],  // DCO 1 Click
  [23, 18, 2],  // DCO 2 Fixed Mods 2
  [24, 19, 1],  // DCO 2 Click
  [25,  2, 2],  // DCO Sync Mode
  [26, 21, 7],  // VCF Frequency
  [27, 24, 6],  // VCF Resonance
  [28, 25, 2],  // VCF Fixed Mods 1
  [29, 26, 2],  // VCF Fixed Mods 2
  [30, 30, 6],  // VCF FM Amount
  [31, 27, 6],  // VCA 1 Amount
  [32, 44, 6],  // Portamento Rate
  [33, 46, 2],  // Lag Mode
  [34, 47, 1],  // Legato Portamento
  [35, 80, 6],  // LFO 1 Speed
  [36, 86, 2],  // LFO 1 Trigger
  [37, 87, 1],  // LFO 1 Lag
  [38, 82, 3],  // LFO 1 Waveshape
  [39, 83, 5],  // LFO 1 Retrigger Point
  [40, 88, 5],  // LFO 1 Sample Source
  [41, 84, 6],  // LFO 1 Amplitude
  [42, 90, 6],  // LFO 2 Speed
  [43, 96, 2],  // LFO 2 Trigger
  [44, 97, 1],  // LFO 2 Lag
  [45, 92, 3],  // LFO 2 Waveshape
  [46, 93, 5],  // LFO 2 Retrigger Point
  [47, 98, 5],  // LFO 2 Sample Source
  [48, 94, 6],  // LFO 2 Amplitude
  [49, 57, 3],  // Env 1 Trigger Mode
  [50, 50, 6],  // Env 1 Delay
  [51, 51, 6],  // Env 1 Attack
  [52, 52, 6],  // Env 1 Decay
  [53, 53, 6],  // Env 1 Sustain
  [54, 54, 6],  // Env 1 Release
  [55, 55, 6],  // Env 1 Amplitude
  [56, 59, 2],  // Env 1 LFO Trigger
  [57, 58, 2],  // Env 1 Mode
  [58, 67, 3],  // Env 2 Trigger Mode
  [59, 60, 6],  // Env 2 Delay
  [60, 61, 6],  // Env 2 Attack
  [61, 62, 6],  // Env 2 Decay
  [62, 63, 6],  // Env 2 Sustain
  [63, 64, 6],  // Env 2 Release
  [64, 65, 6],  // Env 2 Amplitude
  [65, 69, 2],  // Env 2 LFO Trigger
  [66, 68, 2],  // Env 2 Mode
  [67, 77, 3],  // Env 3 Trigger Mode
  [68, 70, 6],  // Env 3 Delay
  [69, 71, 6],  // Env 3 Attack
  [70, 72, 6],  // Env 3 Decay
  [71, 73, 6],  // Env 3 Sustain
  [72, 74, 6],  // Env 3 Release
  [73, 75, 6],  // Env 3 Amplitude
  [74, 79, 2],  // Env 3 LFO Trigger
  [75, 78, 2],  // Env 3 Mode
  [76, 33, 5],  // Tracking Input Source
  [77, 34, 6],  // Tracking Point 1
  [78, 35, 6],  // Tracking Point 2
  [79, 36, 6],  // Tracking Point 3
  [80, 37, 6],  // Tracking Point 4
  [81, 38, 6],  // Tracking Point 5
  [82, 40, 6],  // Ramp 1 Rate
  [83, 41, 2],  // Ramp 1 Mode
  [84, 42, 6],  // Ramp 2 Rate
  [85, 43, 2],  // Ramp 2 Mode
];

// Bytes 86-103: signed 7-bit parameters
const PATCH_MAP_SIGNED = [
  // byte, param
  [86,  1],  // DCO 1 Freq by LFO 1
  [87,  4],  // DCO 1 PW by LFO 2
  [88, 11],  // DCO 2 Freq by LFO 1
  [89, 14],  // DCO 2 PW by LFO 2
  [90, 22],  // VCF Freq by Env 1
  [91, 23],  // VCF Freq by Pressure
  [92, 28],  // VCA 1 by Velocity
  [93, 29],  // VCA 2 by Env 2
  [94, 56],  // Env 1 Amp by Velocity
  [95, 66],  // Env 2 Amp by Velocity
  [96, 76],  // Env 3 Amp by Velocity
  [97, 85],  // LFO 1 Amp by Ramp 1
  [98, 95],  // LFO 2 Amp by Ramp 2
  [99, 45],  // Portamento by Velocity
  [100, 31], // VCF FM by Env 3
  [101, 32], // VCF FM by Pressure
  [102, 81], // LFO 1 Speed by Pressure
  [103, 91], // LFO 2 Speed by Keyboard
];

/**
 * Parse a received single patch SysEx message.
 * Input: full SysEx Uint8Array (F0 ... F7)
 * Returns: { name, params: Map<paramNumber, value>, modMatrix: [{source, amount, dest}] }
 * or null if the message is not a valid patch dump.
 */
export function parsePatchDump(sysex) {
  // Validate header: F0 10 06 01
  if (sysex[0] !== 0xF0 || sysex[1] !== OBERHEIM_ID || sysex[2] !== DEVICE_ID) {
    return null;
  }
  if (sysex[3] !== OP_SINGLE_PATCH) {
    return null;
  }

  // Byte 4 is patch number
  const patchNumber = sysex[4];

  // Bytes 5 through (5 + 268 - 1) are the nibble data
  const nibbleStart = 5;
  const nibbleCount = 268;
  if (sysex.length < nibbleStart + nibbleCount + 2) { // +checksum +F7
    console.warn('[SysEx] Patch dump too short:', sysex.length);
    return null;
  }

  const nibbles = sysex.slice(nibbleStart, nibbleStart + nibbleCount);
  const data = reassembleNibbles(nibbles);

  // Extract patch name (bytes 0-7, 6 bits each)
  let name = '';
  for (let i = 0; i < 8; i++) {
    name += String.fromCharCode((data[i] & 0x3F) + 32); // 6-bit ASCII offset
  }
  name = name.trimEnd();

  // Extract unsigned parameters
  const params = new Map();
  for (const [byteIdx, paramNum, bits] of PATCH_MAP_UNSIGNED) {
    const mask = (1 << bits) - 1;
    let value = data[byteIdx] & mask;
    // Special case: DCO 2 Detune (param 12) is stored as 6-bit signed in patch
    if (paramNum === 12) {
      value = (data[byteIdx] & 0x40) ? -(data[byteIdx] & 0x3F) : (data[byteIdx] & 0x3F);
    }
    params.set(paramNum, value);
  }

  // Extract signed parameters (bytes 86-103)
  for (const [byteIdx, paramNum] of PATCH_MAP_SIGNED) {
    params.set(paramNum, decodeSignedValue(data[byteIdx]));
  }

  // Extract modulation matrix (bytes 104-133, 10 paths x 3 bytes)
  const modMatrix = [];
  for (let i = 0; i < 10; i++) {
    const base = 104 + i * 3;
    modMatrix.push({
      source: data[base] & 0x1F,
      amount: decodeSignedValue(data[base + 1]),
      dest: data[base + 2] & 0x1F,
    });
  }

  return { patchNumber, name, params, modMatrix };
}
