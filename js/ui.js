// UI Components
// Renders parameter controls, mod matrix editor, value displays

import { PARAMS, MOD_SOURCES, MOD_DESTS, GROUP_ORDER, PARAM_MAP } from './params.js';
import { buildParamEdit, buildModMatrixEdit, buildBankSelect, buildPatchRequest, parsePatchDump, sysexToHex, buildUnlockBank, buildStoreEditBuffer } from './sysex.js';
import * as midi from './midi.js';

const NUM_MOD_PATHS = 10;
const LS_KEY_CHANNEL = 'matrix1000_channel';

let globalChannel = parseInt(localStorage.getItem(LS_KEY_CHANNEL) || '0');

export function getChannel() { return globalChannel; }

export function setChannel(ch) {
  globalChannel = ch;
  localStorage.setItem(LS_KEY_CHANNEL, String(ch));
}

/**
 * Render all parameter groups into the container.
 */
export function renderParams(container) {
  // Group params
  const groups = new Map();
  for (const p of PARAMS) {
    if (p.name.startsWith('Reserved')) continue;
    if (!groups.has(p.group)) groups.set(p.group, []);
    groups.get(p.group).push(p);
  }

  for (const groupName of GROUP_ORDER) {
    const params = groups.get(groupName);
    if (!params || params.length === 0) continue;

    const section = document.createElement('section');
    section.className = 'param-group';
    section.dataset.group = groupName;

    const header = document.createElement('h2');
    header.textContent = groupName;
    header.addEventListener('click', () => {
      section.classList.toggle('collapsed');
    });
    section.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'param-grid';

    for (const param of params) {
      grid.appendChild(createParamControl(param));
    }

    section.appendChild(grid);
    container.appendChild(section);
  }
}

/**
 * Create a single parameter control element.
 */
function createParamControl(param) {
  const wrapper = document.createElement('div');
  wrapper.className = `param-control param-type-${param.type}`;
  wrapper.dataset.param = param.number;

  const label = document.createElement('label');
  label.textContent = param.name;
  wrapper.appendChild(label);

  if (param.type === 'slider') {
    createSlider(param, wrapper);
  } else if (param.type === 'select') {
    createSelect(param, wrapper);
  } else if (param.type === 'toggle') {
    createToggle(param, wrapper);
  }

  return wrapper;
}

function createSlider(param, wrapper) {
  const row = document.createElement('div');
  row.className = 'slider-row';

  const input = document.createElement('input');
  input.type = 'range';
  input.min = param.min;
  input.max = param.max;
  input.value = param.signed ? 0 : param.min;
  input.step = 1;

  const valueDisplay = document.createElement('span');
  valueDisplay.className = 'value-display';
  valueDisplay.textContent = input.value;

  input.addEventListener('input', () => {
    const val = parseInt(input.value);
    valueDisplay.textContent = val;
    sendParamValue(param, val);
  });

  row.appendChild(input);
  row.appendChild(valueDisplay);
  wrapper.appendChild(row);
}

function createSelect(param, wrapper) {
  const select = document.createElement('select');

  let options = param.options;
  if (!options && param.name.includes('Source')) {
    options = {};
    for (const s of MOD_SOURCES) {
      if (s.value <= param.max) options[s.value] = s.name;
    }
  }

  if (options) {
    for (const [val, label] of Object.entries(options)) {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = label;
      select.appendChild(opt);
    }
  } else {
    for (let i = param.min; i <= param.max; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = i;
      select.appendChild(opt);
    }
  }

  select.addEventListener('change', () => {
    sendParamValue(param, parseInt(select.value));
  });

  wrapper.appendChild(select);
}

function createToggle(param, wrapper) {
  const btn = document.createElement('button');
  btn.className = 'toggle-btn';
  btn.dataset.value = '0';
  btn.textContent = param.options ? param.options[0] : 'Off';

  btn.addEventListener('click', () => {
    const current = parseInt(btn.dataset.value);
    const next = current === 0 ? 1 : 0;
    btn.dataset.value = String(next);
    btn.textContent = param.options ? param.options[next] : (next ? 'On' : 'Off');
    btn.classList.toggle('active', next === 1);
    sendParamValue(param, next);
  });

  wrapper.appendChild(btn);
}

function sendParamValue(param, value) {
  const msg = buildParamEdit(param, value);
  console.log(`[SysEx] Param ${param.number} (${param.name}) = ${value} → ${sysexToHex(msg)}`);
  midi.send(msg, `param-${param.number}`);
}

/**
 * Render the modulation matrix editor.
 */
export function renderModMatrix(container) {
  const section = document.createElement('section');
  section.className = 'param-group mod-matrix-section';

  const header = document.createElement('h2');
  header.textContent = 'Mod Matrix';
  header.addEventListener('click', () => {
    section.classList.toggle('collapsed');
  });
  section.appendChild(header);

  const table = document.createElement('table');
  table.className = 'mod-matrix';

  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  for (const h of ['Path', 'Source', 'Amount', 'Destination']) {
    const th = document.createElement('th');
    th.textContent = h;
    headRow.appendChild(th);
  }
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (let i = 0; i < NUM_MOD_PATHS; i++) {
    tbody.appendChild(createModRow(i));
  }
  table.appendChild(tbody);

  section.appendChild(table);
  container.appendChild(section);
}

function createModRow(pathIndex) {
  const tr = document.createElement('tr');
  tr.dataset.modPath = pathIndex;

  const tdPath = document.createElement('td');
  tdPath.textContent = pathIndex + 1;
  tdPath.className = 'mod-path-num';
  tr.appendChild(tdPath);

  const tdSource = document.createElement('td');
  const sourceSelect = document.createElement('select');
  sourceSelect.className = 'mod-source';
  for (const s of MOD_SOURCES) {
    const opt = document.createElement('option');
    opt.value = s.value;
    opt.textContent = s.name;
    sourceSelect.appendChild(opt);
  }
  tdSource.appendChild(sourceSelect);
  tr.appendChild(tdSource);

  const tdAmount = document.createElement('td');
  const amountRow = document.createElement('div');
  amountRow.className = 'slider-row';
  const amountSlider = document.createElement('input');
  amountSlider.type = 'range';
  amountSlider.min = -63;
  amountSlider.max = 63;
  amountSlider.value = 0;
  const amountValue = document.createElement('span');
  amountValue.className = 'value-display';
  amountValue.textContent = '0';
  amountSlider.addEventListener('input', () => {
    amountValue.textContent = amountSlider.value;
  });
  amountRow.appendChild(amountSlider);
  amountRow.appendChild(amountValue);
  tdAmount.appendChild(amountRow);
  tr.appendChild(tdAmount);

  const tdDest = document.createElement('td');
  const destSelect = document.createElement('select');
  destSelect.className = 'mod-dest';
  for (const d of MOD_DESTS) {
    const opt = document.createElement('option');
    opt.value = d.value;
    opt.textContent = d.name;
    destSelect.appendChild(opt);
  }
  tdDest.appendChild(destSelect);
  tr.appendChild(tdDest);

  const sendModPath = () => {
    const source = parseInt(sourceSelect.value);
    const amount = parseInt(amountSlider.value);
    const dest = parseInt(destSelect.value);
    const msg = buildModMatrixEdit(pathIndex, source, amount, dest);
    console.log(`[SysEx] Mod ${pathIndex + 1}: src=${source} amt=${amount} dst=${dest} → ${sysexToHex(msg)}`);
    midi.send(msg, `mod-${pathIndex}`);
  };

  sourceSelect.addEventListener('change', sendModPath);
  amountSlider.addEventListener('input', sendModPath);
  destSelect.addEventListener('change', sendModPath);

  return tr;
}

/**
 * Render MIDI output/input selectors and channel.
 */
export function renderMidiSelectors(container) {
  const div = document.createElement('div');
  div.className = 'midi-selectors';

  div.appendChild(createOutputSelector());
  div.appendChild(createInputSelector());
  div.appendChild(createChannelSelector());

  container.appendChild(div);
}

function createOutputSelector() {
  const wrapper = document.createElement('div');
  wrapper.className = 'midi-output-selector';

  const lbl = document.createElement('label');
  lbl.textContent = 'MIDI Out';
  wrapper.appendChild(lbl);

  const select = document.createElement('select');
  select.id = 'midi-output';

  const refreshOptions = () => {
    const currentId = midi.getOutput()?.id;
    select.innerHTML = '';
    const none = document.createElement('option');
    none.value = '';
    none.textContent = '— None —';
    select.appendChild(none);

    for (const output of midi.getOutputs()) {
      const opt = document.createElement('option');
      opt.value = output.id;
      opt.textContent = output.name;
      if (output.id === currentId) opt.selected = true;
      select.appendChild(opt);
    }
  };

  select.addEventListener('change', () => {
    midi.setOutput(select.value || null);
  });

  document.addEventListener('midi-devices-changed', refreshOptions);
  refreshOptions();

  wrapper.appendChild(select);
  return wrapper;
}

function createInputSelector() {
  const wrapper = document.createElement('div');
  wrapper.className = 'midi-input-selector';

  const lbl = document.createElement('label');
  lbl.textContent = 'MIDI In';
  wrapper.appendChild(lbl);

  const select = document.createElement('select');
  select.id = 'midi-input';

  const refreshOptions = () => {
    const currentId = midi.getInput()?.id;
    select.innerHTML = '';
    const none = document.createElement('option');
    none.value = '';
    none.textContent = '— None —';
    select.appendChild(none);

    for (const input of midi.getInputs()) {
      const opt = document.createElement('option');
      opt.value = input.id;
      opt.textContent = input.name;
      if (input.id === currentId) opt.selected = true;
      select.appendChild(opt);
    }
  };

  select.addEventListener('change', () => {
    midi.setInput(select.value || null);
  });

  document.addEventListener('midi-devices-changed', refreshOptions);
  refreshOptions();

  wrapper.appendChild(select);
  return wrapper;
}

function createChannelSelector() {
  const wrapper = document.createElement('div');
  wrapper.className = 'midi-output-selector';

  const lbl = document.createElement('label');
  lbl.textContent = 'MIDI Ch';
  wrapper.appendChild(lbl);

  const select = document.createElement('select');
  select.id = 'midi-channel';
  for (let i = 0; i < 16; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = i + 1;
    if (i === globalChannel) opt.selected = true;
    select.appendChild(opt);
  }

  select.addEventListener('change', () => {
    setChannel(parseInt(select.value));
  });

  wrapper.appendChild(select);
  return wrapper;
}

/**
 * Render bank/patch selector with program change and Get Patch.
 */
export function renderPatchSelector(container) {
  const div = document.createElement('div');
  div.className = 'patch-selector';

  // Bank selector
  const bankLabel = document.createElement('label');
  bankLabel.textContent = 'Bank';
  div.appendChild(bankLabel);

  const bankSelect = document.createElement('select');
  bankSelect.id = 'bank-select';
  for (let i = 0; i < 10; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `Bank ${i}`;
    bankSelect.appendChild(opt);
  }
  div.appendChild(bankSelect);

  // Patch number
  const patchLabel = document.createElement('label');
  patchLabel.textContent = 'Patch';
  div.appendChild(patchLabel);

  const patchInput = document.createElement('input');
  patchInput.type = 'number';
  patchInput.id = 'patch-number';
  patchInput.min = 0;
  patchInput.max = 99;
  patchInput.value = 0;
  div.appendChild(patchInput);

  // Send bank select SysEx + program change
  const sendProgramChange = () => {
    const bank = parseInt(bankSelect.value);
    const patch = parseInt(patchInput.value);
    const bankMsg = buildBankSelect(bank);
    console.log(`[SysEx] Bank select: ${bank} → ${sysexToHex(bankMsg)}`);
    midi.sendImmediate(bankMsg);
    // Small delay between bank select and program change
    setTimeout(() => {
      midi.sendProgramChange(globalChannel, patch);
      console.log(`[MIDI] Program Change: bank ${bank}, patch ${patch}`);
      const nameEl = document.getElementById('patch-name');
      if (nameEl) nameEl.textContent = `${bank * 100 + patch}`;
    }, 15);
  };

  // Auto-send on bank or patch change
  bankSelect.addEventListener('change', sendProgramChange);
  patchInput.addEventListener('change', sendProgramChange);

  // Get Patch: request patch data back into editor (requires MIDI In)
  const getBtn = document.createElement('button');
  getBtn.textContent = 'Get Patch';
  getBtn.className = 'btn-primary';
  getBtn.addEventListener('click', () => {
    const bank = parseInt(bankSelect.value);
    const patch = parseInt(patchInput.value);
    const patchNum = bank * 100 + patch;
    const msg = buildPatchRequest(patchNum);
    console.log(`[SysEx] Request patch ${patchNum} → ${sysexToHex(msg)}`);
    midi.sendImmediate(msg);
    const nameEl = document.getElementById('patch-name');
    if (nameEl) nameEl.textContent = 'waiting...';
    clearTimeout(getBtn._timeout);
    getBtn._timeout = setTimeout(() => {
      if (nameEl && nameEl.textContent === 'waiting...') {
        nameEl.textContent = 'no response';
      }
    }, 5000);
  });
  div.appendChild(getBtn);

  // Store: save edit buffer to patch location on the Matrix
  const storeBtn = document.createElement('button');
  storeBtn.textContent = 'Store';
  storeBtn.className = 'btn-primary';
  storeBtn.addEventListener('click', () => {
    const bank = parseInt(bankSelect.value);
    const patch = parseInt(patchInput.value);
    if (bank > 1) {
      const dialog = document.getElementById('store-dialog');
      document.getElementById('store-dialog-msg').textContent =
        `Bank ${bank} is a factory bank. Only banks 0\u20131 (patches 0\u2013199) are user-writable.`;
      dialog.querySelector('.dialog-warning').style.display = 'none';
      document.getElementById('store-confirm').style.display = 'none';
      dialog.showModal();
      return;
    }
    showStoreDialog(bank, patch);
  });
  div.appendChild(storeBtn);

  // Play C note for 500ms
  const playBtn = document.createElement('button');
  playBtn.textContent = 'Play C';
  playBtn.className = 'btn-primary';
  playBtn.addEventListener('click', () => {
    const note = 60; // Middle C
    const velocity = 100;
    midi.sendNote(globalChannel, note, velocity, 500);
  });
  div.appendChild(playBtn);

  // Patch name display
  const nameDisplay = document.createElement('span');
  nameDisplay.id = 'patch-name';
  nameDisplay.className = 'patch-name';
  div.appendChild(nameDisplay);

  container.appendChild(div);
}

/**
 * Handle received SysEx: patch dumps and identity replies.
 */
export function handlePatchReceive(sysex) {
  // Identity Reply: F0 7E <id> 06 02 <manufacturer...> F7
  if (sysex[0] === 0xF0 && sysex[1] === 0x7E && sysex[3] === 0x06 && sysex[4] === 0x02) {
    parseIdentityReply(sysex);
    return true;
  }

  const patch = parsePatchDump(sysex);
  if (!patch) return false;

  console.log(`[Patch] Received patch ${patch.patchNumber}: "${patch.name}"`);

  const nameEl = document.getElementById('patch-name');
  if (nameEl) nameEl.textContent = patch.name;

  for (const [paramNum, value] of patch.params) {
    updateControlValue(paramNum, value);
  }

  for (let i = 0; i < patch.modMatrix.length; i++) {
    updateModRow(i, patch.modMatrix[i]);
  }

  return true;
}

function parseIdentityReply(data) {
  // Format: F0 7E <id> 06 02 <mfr> <family_lo> <family_hi> <member_lo> <member_hi> <ver1> <ver2> <ver3> <ver4> F7
  const mfr = data[5];
  const family = data[6] | (data[7] << 7);
  const member = data[8] | (data[9] << 7);
  const version = `${data[10]}.${data[11]}`;

  const MANUFACTURERS = { 0x10: 'Oberheim' };
  const mfrName = MANUFACTURERS[mfr] || `Unknown (${mfr.toString(16).toUpperCase()})`;

  const info = `${mfrName} — Family ${family}, Device ${member}, v${version}`;
  console.log(`[Identity] ${info}`);

  const status = document.getElementById('status');
  if (status) {
    status.textContent = info;
    status.className = 'status ok';
  }
}

/**
 * Update a single parameter control to show a value (no SysEx sent).
 */
function updateControlValue(paramNum, value) {
  const wrapper = document.querySelector(`.param-control[data-param="${paramNum}"]`);
  if (!wrapper) return;

  const param = PARAM_MAP.get(paramNum);
  if (!param) return;

  if (param.type === 'slider') {
    const input = wrapper.querySelector('input[type="range"]');
    const display = wrapper.querySelector('.value-display');
    if (input) {
      input.value = value;
      if (display) display.textContent = value;
    }
  } else if (param.type === 'select') {
    const select = wrapper.querySelector('select');
    if (select) select.value = value;
  } else if (param.type === 'toggle') {
    const btn = wrapper.querySelector('.toggle-btn');
    if (btn) {
      btn.dataset.value = String(value);
      btn.textContent = param.options ? param.options[value] : (value ? 'On' : 'Off');
      btn.classList.toggle('active', value === 1);
    }
  }
}

/**
 * Render a MIDI monitor panel that shows all incoming MIDI messages.
 */
export function renderMidiMonitor(container) {
  const details = document.createElement('details');
  details.className = 'param-group';

  const summary = document.createElement('summary');
  summary.className = 'monitor-summary';
  summary.textContent = 'MIDI Monitor';
  details.appendChild(summary);

  const monitorDiv = document.createElement('div');
  monitorDiv.style.padding = '8px 12px';

  const log = document.createElement('div');
  log.id = 'midi-monitor';
  log.style.cssText = 'font-family: monospace; font-size: 11px; background: var(--bg); border: 1px solid var(--border); border-radius: 3px; padding: 8px; max-height: 200px; overflow-y: auto; white-space: pre-wrap; color: var(--text-dim);';
  log.textContent = 'Waiting for MIDI input...\n';

  const clearBtn = document.createElement('button');
  clearBtn.textContent = 'Clear';
  clearBtn.className = 'btn-primary';
  clearBtn.style.marginTop = '6px';
  clearBtn.addEventListener('click', () => {
    log.textContent = '';
  });

  monitorDiv.appendChild(log);
  monitorDiv.appendChild(clearBtn);
  details.appendChild(monitorDiv);
  container.appendChild(details);
}

/**
 * Append a message to the MIDI monitor log.
 */
export function logToMonitor(data) {
  const log = document.getElementById('midi-monitor');
  if (!log) return;

  const hex = Array.from(data).map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ');
  const timestamp = new Date().toLocaleTimeString('en', { hour12: false, fractionalSecondDigits: 1 });

  // Annotate common message types
  let annotation = '';
  if (data[0] === 0xF0) {
    if (data[1] === 0x7E && data[3] === 0x06 && data[4] === 0x02) {
      annotation = ' ← Identity Reply';
    } else if (data[1] === 0x10 && data[2] === 0x06) {
      const opcodes = { 0x01: 'Patch Data', 0x03: 'Master Data', 0x06: 'Param Edit', 0x0B: 'Mod Edit' };
      annotation = ` ← ${opcodes[data[3]] || `Opcode ${data[3].toString(16).toUpperCase()}`}`;
    }
    annotation += ` (${data.length} bytes)`;
  } else if ((data[0] & 0xF0) === 0xC0) {
    annotation = ` ← Program Change ch${(data[0] & 0x0F) + 1} prog=${data[1]}`;
  } else if ((data[0] & 0xF0) === 0x90) {
    annotation = ` ← Note On ch${(data[0] & 0x0F) + 1}`;
  } else if ((data[0] & 0xF0) === 0xB0) {
    annotation = ` ← CC ch${(data[0] & 0x0F) + 1} cc${data[1]}=${data[2]}`;
  } else if (data[0] === 0xFE) {
    return; // Skip Active Sensing (too noisy)
  }

  const displayHex = hex.length > 120 ? hex.substring(0, 120) + '...' : hex;
  log.textContent += `[${timestamp}] ${displayHex}${annotation}\n`;
  log.scrollTop = log.scrollHeight;
}

/**
 * Update a mod matrix row to show values (no SysEx sent).
 */
function updateModRow(pathIndex, { source, amount, dest }) {
  const row = document.querySelector(`tr[data-mod-path="${pathIndex}"]`);
  if (!row) return;

  const sourceSelect = row.querySelector('.mod-source');
  const amountSlider = row.querySelector('input[type="range"]');
  const amountDisplay = row.querySelector('.value-display');
  const destSelect = row.querySelector('.mod-dest');

  if (sourceSelect) sourceSelect.value = source;
  if (amountSlider) amountSlider.value = amount;
  if (amountDisplay) amountDisplay.textContent = amount;
  if (destSelect) destSelect.value = dest;
}

// ── Dialogs ─────────────────────────────────────────────

function showStoreDialog(bank, patch) {
  const dialog = document.getElementById('store-dialog');
  const msg = document.getElementById('store-dialog-msg');
  const warning = dialog.querySelector('.dialog-warning');
  const confirmBtn = document.getElementById('store-confirm');

  msg.textContent = `Store current edit buffer to Bank ${bank}, Patch ${patch} (location ${bank * 100 + patch})?`;
  warning.style.display = '';
  confirmBtn.style.display = '';

  // Clean up old listeners
  const newConfirm = confirmBtn.cloneNode(true);
  confirmBtn.replaceWith(newConfirm);

  newConfirm.addEventListener('click', () => {
    const unlockMsg = buildUnlockBank();
    console.log(`[SysEx] Unlock bank → ${sysexToHex(unlockMsg)}`);
    midi.sendImmediate(unlockMsg);
    setTimeout(() => {
      const storeMsg = buildStoreEditBuffer(patch, bank);
      console.log(`[SysEx] Store edit buffer → bank ${bank}, patch ${patch} → ${sysexToHex(storeMsg)}`);
      midi.sendImmediate(storeMsg);
      const nameEl = document.getElementById('patch-name');
      if (nameEl) nameEl.textContent = `stored → ${bank * 100 + patch}`;
    }, 15);
    dialog.close();
  });

  dialog.showModal();
}

export function initDialogs() {
  // Store dialog cancel
  document.getElementById('store-cancel').addEventListener('click', () => {
    document.getElementById('store-dialog').close();
  });

  // About button + dialog
  document.getElementById('about-btn').addEventListener('click', () => {
    document.getElementById('about-dialog').showModal();
  });
  document.getElementById('about-close').addEventListener('click', () => {
    document.getElementById('about-dialog').close();
  });

  // Contact link: assembled via JS so bots can't scrape it
  document.getElementById('contact-link').addEventListener('click', (e) => {
    e.preventDefault();
    const link = e.target;
    if (link.dataset.revealed) return;
    const user = 'dirkk0+m-editor';
    const domain = 'googlemail.com';
    link.href = `mailto:${user}@${domain}`;
    link.textContent = `${user}@${domain}`;
    link.dataset.revealed = '1';
  });

  // Close dialogs on backdrop click
  for (const dialog of document.querySelectorAll('dialog')) {
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });
  }
}
