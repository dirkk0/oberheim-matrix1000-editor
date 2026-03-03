// Matrix 1000 Web Editor — Entry Point

import * as midi from './midi.js';
import { sysexToHex } from './sysex.js';
import { renderMidiSelectors, renderPatchSelector, renderParams, renderModMatrix, handlePatchReceive, renderMidiMonitor, logToMonitor, initDialogs } from './ui.js';

async function main() {
  const status = document.getElementById('status');
  const headerControls = document.getElementById('header-controls');
  const paramContainer = document.getElementById('params');

  try {
    await midi.init();
    status.textContent = 'MIDI connected';
    status.className = 'status ok';
  } catch (err) {
    status.textContent = `MIDI error: ${err.message}`;
    status.className = 'status error';
    console.error('WebMIDI init failed:', err);
    return;
  }

  // Wire MIDI receive handlers
  midi.onRawMidi((data) => {
    logToMonitor(data);
  });

  midi.onSysex((data) => {
    console.log(`[SysEx IN] ${sysexToHex(data).substring(0, 60)}...`);
    if (!handlePatchReceive(data)) {
      console.log('[SysEx IN] Unhandled message');
    }
  });

  renderMidiSelectors(headerControls);
  renderPatchSelector(headerControls);
  renderParams(paramContainer);
  renderModMatrix(paramContainer);
  renderMidiMonitor(paramContainer);
  initDialogs();
}

main();
