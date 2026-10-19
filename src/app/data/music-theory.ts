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

export const FLAT_NOTE_NAMES = [
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
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

/** Major keys that are usually written with flats (and their relative minors). */
const FLAT_MAJOR_ROOTS = new Set<NoteName>(['F', 'A#', 'D#', 'G#', 'C#', 'F#']);

export type KeyQuality = 'major' | 'minor';

export interface KeyOption {
  id: string;
  root: NoteName;
  quality: KeyQuality;
  label: string;
}

export function buildKeyOptions(): KeyOption[] {
  return NOTE_NAMES.flatMap((root) => [
    {
      id: `${root}-major`,
      root,
      quality: 'major' as const,
      label: `${root} Major`,
    },
    {
      id: `${root}-minor`,
      root,
      quality: 'minor' as const,
      label: `${root} Minor`,
    },
  ]);
}

export function pitchClassForNote(name: NoteName): number {
  return NOTE_NAMES.indexOf(name);
}

export function pitchClassAt(stringIndex: number, fret: number): number {
  return (BASS_OPEN_PITCH_CLASSES[stringIndex] + fret) % 12;
}

export function scalePitchClasses(root: NoteName, quality: KeyQuality): Set<number> {
  const rootPc = pitchClassForNote(root);
  const intervals = quality === 'major' ? MAJOR_INTERVALS : NATURAL_MINOR_INTERVALS;
  return new Set(intervals.map((i) => (rootPc + i) % 12));
}

export function keyPreferFlats(root: NoteName, quality: KeyQuality): boolean {
  if (quality === 'major') {
    return FLAT_MAJOR_ROOTS.has(root);
  }
  const relativeMajorPc = (pitchClassForNote(root) + 3) % 12;
  const relativeMajorRoot = NOTE_NAMES[relativeMajorPc];
  return FLAT_MAJOR_ROOTS.has(relativeMajorRoot);
}

export function formatPitchClass(pc: number, preferFlats: boolean): string {
  const normalized = ((pc % 12) + 12) % 12;
  return preferFlats ? FLAT_NOTE_NAMES[normalized] : NOTE_NAMES[normalized];
}

/** Scale tones in order, spelled with sharps or flats for the key. */
export function scaleNoteNames(root: NoteName, quality: KeyQuality): string[] {
  const intervals = quality === 'major' ? MAJOR_INTERVALS : NATURAL_MINOR_INTERVALS;
  const rootPc = pitchClassForNote(root);
  const preferFlats = keyPreferFlats(root, quality);
  return intervals.map((i) => formatPitchClass(rootPc + i, preferFlats));
}

export function fretNoteLabel(
  stringIndex: number,
  fret: number,
  key: KeyOption | null,
  mode: 'key' | 'key-chromatic' | 'random',
): string {
  const pc = pitchClassAt(stringIndex, fret);
  if (mode !== 'random' && key) {
    return noteNameForPitchClassInKey(pc, key.root, key.quality);
  }
  return formatPitchClass(pc, false);
}

export function noteNameForPitchClassInKey(
  pc: number,
  root: NoteName,
  quality: KeyQuality,
): string {
  const normalized = ((pc % 12) + 12) % 12;
  const scale = scaleNoteNames(root, quality);
  const intervals = quality === 'major' ? MAJOR_INTERVALS : NATURAL_MINOR_INTERVALS;
  const rootPc = pitchClassForNote(root);
  for (let i = 0; i < intervals.length; i++) {
    if ((rootPc + intervals[i]) % 12 === normalized) {
      return scale[i];
    }
  }
  return formatPitchClass(normalized, keyPreferFlats(root, quality));
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

/** @deprecated Prefer noteNameForPitchClassInKey when a key is active. */
export function noteLabelForPitchClass(pc: number): string {
  return formatPitchClass(pc, false);
}
