export const NOTE_NAMES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const;

export type NoteName = (typeof NOTE_NAMES)[number];

/** Open-string pitch classes: E, A, D, G (low to high string). */
export const BASS_OPEN_PITCH_CLASSES = [4, 9, 2, 7] as const;

export const BASS_STRING_LABELS = ['E', 'A', 'D', 'G'] as const;

/** Frets 0–20 inclusive (open string through 20th fret). */
export const FRET_COUNT = 21;

const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
const NATURAL_MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10];

export type KeyQuality = 'major' | 'minor';

export interface KeyOption {
  id: string;
  root: NoteName;
  quality: KeyQuality;
  label: string;
}

export function buildKeyOptions(): KeyOption[] {
  const options: KeyOption[] = [];
  for (const root of NOTE_NAMES) {
    options.push({
      id: `${root}-major`,
      root,
      quality: 'major',
      label: `${root} Major`,
    });
    options.push({
      id: `${root}-minor`,
      root,
      quality: 'minor',
      label: `${root} Minor`,
    });
  }
  return options;
}

export function pitchClassForNote(name: NoteName): number {
  return NOTE_NAMES.indexOf(name);
}

export function scalePitchClasses(root: NoteName, quality: KeyQuality): Set<number> {
  const rootPc = pitchClassForNote(root);
  const intervals = quality === 'major' ? MAJOR_INTERVALS : NATURAL_MINOR_INTERVALS;
  return new Set(intervals.map((i) => (rootPc + i) % 12));
}

/** A4 = 440 Hz; MIDI note number → frequency. */
export function frequencyFromMidi(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/** Standard bass tuning: E2, A2, D3, G3 open strings. */
export function midiForFret(stringIndex: number, fret: number): number {
  const openMidi = [28, 33, 38, 43][stringIndex];
  return openMidi + fret;
}

export function noteLabelForPitchClass(pc: number): string {
  return NOTE_NAMES[((pc % 12) + 12) % 12];
}
