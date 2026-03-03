// WebMIDI Management
// Handles MIDI output/input selection, SysEx sending with throttling

const THROTTLE_MS = 10; // Minimum gap between SysEx messages (V1.11 CPU limit)
const LS_KEY_OUTPUT = 'matrix1000_output';
const LS_KEY_INPUT  = 'matrix1000_input';

let midiAccess = null;
let output = null;
let input = null;
let sysexCallback = null; // called with (data: Uint8Array)
let rawCallback = null;   // called with (data: Uint8Array) for ALL messages

// Throttled send queue: drops intermediate values for same param
const queue = new Map();
let sending = false;
let lastSendTime = 0;

/**
 * Initialize WebMIDI with SysEx permission.
 */
export async function init() {
  if (!navigator.requestMIDIAccess) {
    throw new Error('WebMIDI not supported. Use Chrome.');
  }
  midiAccess = await navigator.requestMIDIAccess({ sysex: true });
  midiAccess.onstatechange = () => {
    document.dispatchEvent(new CustomEvent('midi-devices-changed'));
  };

  restoreSavedOutput();
  restoreSavedInput();
  return midiAccess;
}

/**
 * Get all available MIDI outputs.
 */
export function getOutputs() {
  if (!midiAccess) return [];
  return Array.from(midiAccess.outputs.values());
}

/**
 * Get all available MIDI inputs.
 */
export function getInputs() {
  if (!midiAccess) return [];
  return Array.from(midiAccess.inputs.values());
}

/**
 * Set the MIDI output device.
 */
export function setOutput(outputId) {
  output = outputId ? midiAccess.outputs.get(outputId) : null;
  if (outputId) localStorage.setItem(LS_KEY_OUTPUT, outputId);
  else localStorage.removeItem(LS_KEY_OUTPUT);
}

export function getOutput() {
  return output;
}

/**
 * Set the MIDI input device.
 */
export function setInput(inputId) {
  if (input) {
    input.onmidimessage = null;
  }
  input = inputId ? midiAccess.inputs.get(inputId) : null;
  if (inputId) localStorage.setItem(LS_KEY_INPUT, inputId);
  else localStorage.removeItem(LS_KEY_INPUT);
  if (input) {
    input.onmidimessage = handleMidiMessage;
  }
}

export function getInput() {
  return input;
}

/**
 * Send a SysEx message (throttled).
 * paramKey: unique key for deduplication (e.g. param number or 'mod-3')
 */
export function send(message, paramKey) {
  queue.set(paramKey, message);
  processQueue();
}

/**
 * Send a raw SysEx message immediately (bypasses throttle).
 * For bank select, patch request, identity request.
 */
export function sendImmediate(message) {
  if (output) output.send(Array.from(message));
}

/**
 * Send a MIDI Program Change message.
 */
export function sendProgramChange(channel, program) {
  const msg = [0xC0 | (channel & 0x0F), program & 0x7F];
  if (output) output.send(msg);
}

/**
 * Send a Note On, then Note Off after durationMs.
 */
export function sendNote(channel, note, velocity, durationMs) {
  if (!output) return;
  output.send([0x90 | (channel & 0x0F), note & 0x7F, velocity & 0x7F]);
  setTimeout(() => {
    output.send([0x80 | (channel & 0x0F), note & 0x7F, 0]);
  }, durationMs);
}

/**
 * Register a callback for received SysEx messages.
 * Callback signature: (data: Uint8Array) => void
 */
export function onSysex(callback) {
  sysexCallback = callback;
}

/**
 * Register a callback for ALL received MIDI messages (for monitoring).
 * Callback signature: (data: Uint8Array) => void
 */
export function onRawMidi(callback) {
  rawCallback = callback;
}

// ── Internal throttled queue ────────────────────────────

function processQueue() {
  if (sending) return;
  if (queue.size === 0) return;
  if (!output) {
    queue.clear();
    return;
  }

  const now = performance.now();
  const elapsed = now - lastSendTime;
  const delay = elapsed >= THROTTLE_MS ? 0 : THROTTLE_MS - elapsed;

  sending = true;
  setTimeout(() => {
    const [key, msg] = queue.entries().next().value;
    queue.delete(key);

    output.send(Array.from(msg));
    lastSendTime = performance.now();
    sending = false;

    if (queue.size > 0) {
      processQueue();
    }
  }, delay);
}

function handleMidiMessage(event) {
  const data = event.data;
  if (rawCallback) {
    rawCallback(new Uint8Array(data));
  }
  if (data[0] === 0xF0 && sysexCallback) {
    sysexCallback(new Uint8Array(data));
  }
}

function restoreSavedOutput() {
  const id = localStorage.getItem(LS_KEY_OUTPUT);
  if (id && midiAccess.outputs.has(id)) {
    output = midiAccess.outputs.get(id);
  }
}

function restoreSavedInput() {
  const id = localStorage.getItem(LS_KEY_INPUT);
  if (id && midiAccess.inputs.has(id)) {
    input = midiAccess.inputs.get(id);
    input.onmidimessage = handleMidiMessage;
  }
}
