import {
  BASS_OPEN_PITCH_CLASSES,
  FRET_COUNT,
  frequencyFromMidi,
  midiForFret,
  noteLabelForPitchClass,
} from './music-theory';
import { FretPosition } from '../models/fret-position.model';

export function buildFretboard(): FretPosition[] {
  const positions: FretPosition[] = [];
  for (let stringIndex = 0; stringIndex < 4; stringIndex++) {
    for (let fret = 0; fret < FRET_COUNT; fret++) {
      const pc = (BASS_OPEN_PITCH_CLASSES[stringIndex] + fret) % 12;
      positions.push({
        stringIndex,
        fret,
        label: noteLabelForPitchClass(pc),
        frequency: frequencyFromMidi(midiForFret(stringIndex, fret)),
      });
    }
  }
  return positions;
}

export const ALL_FRET_POSITIONS = buildFretboard();

const FRETBOARD_BY_COORD = new Map<string, FretPosition>(
  ALL_FRET_POSITIONS.map((position) => [
    `${position.stringIndex}:${position.fret}`,
    position,
  ]),
);

export function fretPositionAt(stringIndex: number, fret: number): FretPosition {
  const position = FRETBOARD_BY_COORD.get(`${stringIndex}:${fret}`);
  if (!position) {
    throw new Error(`Invalid fret coordinate: string ${stringIndex}, fret ${fret}`);
  }
  return position;
}

const POSITIONS_BY_MIDI = new Map<number, FretPosition[]>();

for (const position of ALL_FRET_POSITIONS) {
  const midi = midiForFret(position.stringIndex, position.fret);
  const list = POSITIONS_BY_MIDI.get(midi) ?? [];
  list.push(position);
  POSITIONS_BY_MIDI.set(midi, list);
}

/** Every string/fret that produces this pitch (same octave / MIDI note). */
export function fretPositionsForMidi(midi: number): readonly FretPosition[] {
  return POSITIONS_BY_MIDI.get(midi) ?? [];
}
