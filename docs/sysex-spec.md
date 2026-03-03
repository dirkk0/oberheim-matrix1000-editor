# Oberheim Matrix 1000 MIDI/SysEx Specification

Source: http://www.youngmonkey.ca/nose/audio_tech/synth/Oberheim-Matrix1000.html

## SysEx Header

All messages: `F0 10 06 [opcode] [data...] F7`
- Manufacturer: `10` (Oberheim)
- Device: `06` (Matrix-6/1000)

## Opcodes

| Opcode | Name | Format |
|--------|------|--------|
| 01H | Single Patch Data | `F0 10 06 01 [patch#] [268 nibbles] [checksum] F7` |
| 03H | Master Parameter Data | `F0 10 06 03 03 [344 nibbles] [checksum] F7` |
| 04H | Request Data | `F0 10 06 04 [type] [patch#] F7` |
| 06H | Remote Parameter Edit | `F0 10 06 06 [param#] [value] F7` |
| 07H | Set Group Mode | `F0 10 06 07 [count] [id] F7` |
| 0AH | Set Bank | `F0 10 06 0A [bank#] F7` |
| 0BH | Remote Mod Matrix Edit | `F0 10 06 0B [path] [source] [amount] [dest] F7` |
| 0CH | Unlock Bank | `F0 10 06 0C F7` |
| 0DH | Patch to Edit Buffer | `F0 10 06 0D [268 nibbles] [checksum] F7` |
| 0EH | Store Edit Buffer | `F0 10 06 0E [patch#] [bank#] [unit] F7` |

## Request Types (Opcode 04H)

| Type | Description |
|------|-------------|
| 0 | All patches + master parameters |
| 1 | Single patch (specify patch# in next byte) |
| 3 | All patches only |

## Data Transmission Algorithm

Each data byte is split into two nibbles for transmission:
1. Transmit `(byte & 0x0F)` — low nibble first
2. Transmit `((byte >> 4) & 0x0F)` — high nibble second

To reassemble: `byte = nibble[2*N] | (nibble[2*N+1] << 4)`

Checksum: Sum all original data bytes, then `checksum = sum & 0x7F`

134 data bytes → 268 nibbles transmitted, plus checksum byte.

## Single Patch Data Format (134 bytes)

### Bytes 0-7: Patch Name
8 characters, 6 bits each (lower 6 bits of ASCII).

### Bytes 8-85: Unsigned Parameters

| Byte | Param# | Bits | Name |
|------|--------|------|------|
| 8 | 48 | 2 | Keyboard Mode |
| 9 | 0 | 6 | DCO 1 Frequency |
| 10 | 5 | 6 | DCO 1 Wave Shape |
| 11 | 3 | 6 | DCO 1 Pulse Width |
| 12 | 7 | 2 | DCO 1 Fixed Mods 1 (Lever1, Vibrato) |
| 13 | 6 | 2 | DCO 1 Waveform Enable |
| 14 | 10 | 6 | DCO 2 Frequency |
| 15 | 15 | 6 | DCO 2 Wave Shape |
| 16 | 13 | 6 | DCO 2 Pulse Width |
| 17 | 17 | 2 | DCO 2 Fixed Mods 1 (Lever1, Vibrato) |
| 18 | 16 | 3 | DCO 2 Waveform Enable |
| 19 | 12 | 6 | DCO 2 Detune (signed in patch, 6-bit) |
| 20 | 20 | 6 | Mix |
| 21 | 8 | 2 | DCO 1 Fixed Mods 2 (Portamento) |
| 22 | 9 | 1 | DCO 1 Click |
| 23 | 18 | 2 | DCO 2 Fixed Mods 2 (Portamento, Keyboard) |
| 24 | 19 | 1 | DCO 2 Click |
| 25 | 2 | 2 | DCO Sync Mode |
| 26 | 21 | 7 | VCF Frequency |
| 27 | 24 | 6 | VCF Resonance |
| 28 | 25 | 2 | VCF Fixed Mods 1 (Lever1, Vibrato) |
| 29 | 26 | 2 | VCF Fixed Mods 2 (Portamento, Keyboard) |
| 30 | 30 | 6 | VCF FM Amount |
| 31 | 27 | 6 | VCA 1 Amount |
| 32 | 44 | 6 | Portamento Rate |
| 33 | 46 | 2 | Lag Mode |
| 34 | 47 | 1 | Legato Portamento Enable |
| 35 | 80 | 6 | LFO 1 Speed |
| 36 | 86 | 2 | LFO 1 Trigger |
| 37 | 87 | 1 | LFO 1 Lag |
| 38 | 82 | 3 | LFO 1 Waveshape |
| 39 | 83 | 5 | LFO 1 Retrigger Point |
| 40 | 88 | 5 | LFO 1 Sample Source |
| 41 | 84 | 6 | LFO 1 Amplitude |
| 42 | 90 | 6 | LFO 2 Speed |
| 43 | 96 | 2 | LFO 2 Trigger |
| 44 | 97 | 1 | LFO 2 Lag |
| 45 | 92 | 3 | LFO 2 Waveshape |
| 46 | 93 | 5 | LFO 2 Retrigger Point |
| 47 | 98 | 5 | LFO 2 Sample Source |
| 48 | 94 | 6 | LFO 2 Amplitude |
| 49 | 57 | 3 | Env 1 Trigger Mode |
| 50 | 50 | 6 | Env 1 Delay |
| 51 | 51 | 6 | Env 1 Attack |
| 52 | 52 | 6 | Env 1 Decay |
| 53 | 53 | 6 | Env 1 Sustain |
| 54 | 54 | 6 | Env 1 Release |
| 55 | 55 | 6 | Env 1 Amplitude |
| 56 | 59 | 2 | Env 1 LFO Trigger |
| 57 | 58 | 2 | Env 1 Mode |
| 58 | 67 | 3 | Env 2 Trigger Mode |
| 59 | 60 | 6 | Env 2 Delay |
| 60 | 61 | 6 | Env 2 Attack |
| 61 | 62 | 6 | Env 2 Decay |
| 62 | 63 | 6 | Env 2 Sustain |
| 63 | 64 | 6 | Env 2 Release |
| 64 | 65 | 6 | Env 2 Amplitude |
| 65 | 69 | 2 | Env 2 LFO Trigger |
| 66 | 68 | 2 | Env 2 Mode |
| 67 | 77 | 3 | Env 3 Trigger Mode |
| 68 | 70 | 6 | Env 3 Delay |
| 69 | 71 | 6 | Env 3 Attack |
| 70 | 72 | 6 | Env 3 Decay |
| 71 | 73 | 6 | Env 3 Sustain |
| 72 | 74 | 6 | Env 3 Release |
| 73 | 75 | 6 | Env 3 Amplitude |
| 74 | 79 | 2 | Env 3 LFO Trigger |
| 75 | 78 | 2 | Env 3 Mode |
| 76 | 33 | 5 | Tracking Input Source |
| 77 | 34 | 6 | Tracking Point 1 |
| 78 | 35 | 6 | Tracking Point 2 |
| 79 | 36 | 6 | Tracking Point 3 |
| 80 | 37 | 6 | Tracking Point 4 |
| 81 | 38 | 6 | Tracking Point 5 |
| 82 | 40 | 6 | Ramp 1 Rate |
| 83 | 41 | 2 | Ramp 1 Mode |
| 84 | 42 | 6 | Ramp 2 Rate |
| 85 | 43 | 2 | Ramp 2 Mode |

### Bytes 86-103: Signed Parameters (7-bit, bit 6 = sign)

| Byte | Param# | Name |
|------|--------|------|
| 86 | 1 | DCO 1 Freq by LFO 1 |
| 87 | 4 | DCO 1 PW by LFO 2 |
| 88 | 11 | DCO 2 Freq by LFO 1 |
| 89 | 14 | DCO 2 PW by LFO 2 |
| 90 | 22 | VCF Freq by Env 1 |
| 91 | 23 | VCF Freq by Pressure |
| 92 | 28 | VCA 1 by Velocity |
| 93 | 29 | VCA 2 by Env 2 |
| 94 | 56 | Env 1 Amp by Velocity |
| 95 | 66 | Env 2 Amp by Velocity |
| 96 | 76 | Env 3 Amp by Velocity |
| 97 | 85 | LFO 1 Amp by Ramp 1 |
| 98 | 95 | LFO 2 Amp by Ramp 2 |
| 99 | 45 | Portamento by Velocity |
| 100 | 31 | VCF FM by Env 3 |
| 101 | 32 | VCF FM by Pressure |
| 102 | 81 | LFO 1 Speed by Pressure |
| 103 | 91 | LFO 2 Speed by Keyboard |

### Bytes 104-133: Modulation Matrix (10 paths x 3 bytes)

Each path (3 bytes):
- Byte +0: Source (5 bits, Table 2)
- Byte +1: Amount (7 bits, signed)
- Byte +2: Destination (5 bits, Table 3)

## Parameters NOT in Patch Data

Params 39, 49, 89, 99 are not stored in patches — they are reserved/unused gaps in the parameter numbering.

## Signed Value Encoding

For SysEx parameter edit (06H):
- Bit 6 = sign (0=positive, 1=negative)
- Bits 0-5 = magnitude
- Example: -5 → `0x45` (bit6=1, magnitude=5)

In patch data, signed bytes use same encoding (7-bit: bit 6 = sign).

## Modulation Sources (Table 2)

| Code | Source |
|------|--------|
| 0 | Unused |
| 1 | Env 1 |
| 2 | Env 2 |
| 3 | Env 3 |
| 4 | LFO 1 |
| 5 | LFO 2 |
| 6 | Vibrato |
| 7 | Ramp 1 |
| 8 | Ramp 2 |
| 9 | Keyboard |
| 10 | Portamento |
| 11 | Tracking Generator |
| 12 | Keyboard Gate |
| 13 | Velocity |
| 14 | Release Velocity |
| 15 | Pressure |
| 16 | Pedal 1 |
| 17 | Pedal 2 |
| 18 | Lever 1 |
| 19 | Lever 2 |
| 20 | Lever 3 |

## Modulation Destinations (Table 3)

| Code | Destination |
|------|-------------|
| 0 | Unused |
| 1 | DCO 1 Frequency |
| 2 | DCO 1 Pulse Width |
| 3 | DCO 1 Waveform |
| 4 | DCO 2 Frequency |
| 5 | DCO 2 Pulse Width |
| 6 | DCO 2 Waveform |
| 7 | Mix Level |
| 8 | VCF FM Amount |
| 9 | VCF Frequency |
| 10 | VCF Resonance |
| 11 | VCA 1 Level |
| 12 | VCA 2 Level |
| 13-17 | Env 1 (Delay, Attack, Decay, Release, Amplitude) |
| 18-22 | Env 2 (Delay, Attack, Decay, Release, Amplitude) |
| 23-27 | Env 3 (Delay, Attack, Decay, Release, Amplitude) |
| 28-29 | LFO 1 (Speed, Amplitude) |
| 30-31 | LFO 2 (Speed, Amplitude) |
| 32 | Portamento Time |

## Timing

- 10ms minimum between SysEx messages
- 10ms wait after loading patch to edit buffer
- 10ms between patches when sending multiple
