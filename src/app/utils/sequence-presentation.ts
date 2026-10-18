import { fretPositionsForMidi } from '../data/fretboard';
import { midiForFret } from '../data/music-theory';
import { FretPosition } from '../models/fret-position.model';
import { SequenceEntry } from '../models/sequence-entry.model';

export function fretPositionKey(position: FretPosition): string {
  return `${position.stringIndex}:${position.fret}`;
}

/**
 * Each sequence step keeps its play order. Colors follow pitch (MIDI note) so
 * the same note in different positions shares one hue.
 */
export function buildSequenceEntries(notes: FretPosition[]): SequenceEntry[] {
  const colorIndexByMidi = new Map<number, number>();
  let nextColorIndex = 0;

  return notes.map((position, orderIndex) => {
    const midi = midiForFret(position.stringIndex, position.fret);
    let colorIndex = colorIndexByMidi.get(midi);
    if (colorIndex === undefined) {
      colorIndex = nextColorIndex;
      nextColorIndex += 1;
      colorIndexByMidi.set(midi, colorIndex);
    }
    return { position, orderIndex, colorIndex };
  });
}

export interface NeckMarker {
  position: FretPosition;
  colorIndex: number;
  /** One-based play order labels (e.g. [1, 3] if that pitch repeated). */
  playOrders: number[];
  /** Fret that was actually played in the sequence (vs same-pitch alias). */
  isPlayed: boolean;
}

/** All neck locations for each sequence pitch, plus which fret was played. */
export function buildNeckMarkers(entries: SequenceEntry[]): NeckMarker[] {
  const byMidi = new Map<
    number,
    { colorIndex: number; playOrders: number[]; playedKeys: Set<string> }
  >();

  for (const entry of entries) {
    const midi = midiForFret(entry.position.stringIndex, entry.position.fret);
    let group = byMidi.get(midi);
    if (!group) {
      group = { colorIndex: entry.colorIndex, playOrders: [], playedKeys: new Set() };
      byMidi.set(midi, group);
    }
    group.playOrders.push(entry.orderIndex + 1);
    group.playedKeys.add(fretPositionKey(entry.position));
  }

  const markers: NeckMarker[] = [];
  for (const [midi, group] of byMidi) {
    const uniqueOrders = [...new Set(group.playOrders)].sort((a, b) => a - b);
    for (const position of fretPositionsForMidi(midi)) {
      markers.push({
        position,
        colorIndex: group.colorIndex,
        playOrders: uniqueOrders,
        isPlayed: group.playedKeys.has(fretPositionKey(position)),
      });
    }
  }

  return markers;
}
