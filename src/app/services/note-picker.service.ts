import { Injectable } from '@angular/core';
import { ALL_FRET_POSITIONS } from '../data/fretboard';
import {
  BASS_OPEN_PITCH_CLASSES,
  KeyOption,
  formatPitchClass,
  noteNameForPitchClassInKey,
  pitchClassAt,
  scalePitchClasses,
} from '../data/music-theory';
import { FretPosition } from '../models/fret-position.model';
import { randomInt, randomUnitInterval } from '../utils/random';

export type PickMode = 'key' | 'key-chromatic' | 'random';

/** Chance each note is drawn from outside the selected scale (in key-chromatic mode). */
export const CHROMATIC_NOTE_CHANCE = 0.25;

@Injectable({ providedIn: 'root' })
export class NotePickerService {
  pickNotes(count: number, mode: PickMode, key: KeyOption): FretPosition[] {
    const notes: FretPosition[] = [];
    for (let i = 0; i < count; i++) {
      const pool = this.poolForNextNote(mode, key);
      const index = randomInt(pool.length);
      notes.push(this.withLabel(pool[index], mode, key));
    }
    return notes;
  }

  usesKey(mode: PickMode): boolean {
    return mode === 'key' || mode === 'key-chromatic';
  }

  private poolForNextNote(mode: PickMode, key: KeyOption): FretPosition[] {
    if (mode === 'random') {
      return ALL_FRET_POSITIONS;
    }

    const diatonic = this.diatonicPool(key);
    if (mode === 'key') {
      return diatonic;
    }

    const chromatic = this.chromaticPool(key);
    const useChromatic = randomUnitInterval() < CHROMATIC_NOTE_CHANCE && chromatic.length > 0;
    return useChromatic ? chromatic : diatonic;
  }

  private withLabel(position: FretPosition, mode: PickMode, key: KeyOption): FretPosition {
    const pc = pitchClassAt(position.stringIndex, position.fret);
    const label = this.usesKey(mode)
      ? noteNameForPitchClassInKey(pc, key.root, key.quality)
      : formatPitchClass(pc, false);
    return { ...position, label };
  }

  private diatonicPool(key: KeyOption): FretPosition[] {
    const allowed = scalePitchClasses(key.root, key.quality);
    return ALL_FRET_POSITIONS.filter((pos) => {
      const pc = (BASS_OPEN_PITCH_CLASSES[pos.stringIndex] + pos.fret) % 12;
      return allowed.has(pc);
    });
  }

  private chromaticPool(key: KeyOption): FretPosition[] {
    const allowed = scalePitchClasses(key.root, key.quality);
    return ALL_FRET_POSITIONS.filter((pos) => {
      const pc = (BASS_OPEN_PITCH_CLASSES[pos.stringIndex] + pos.fret) % 12;
      return !allowed.has(pc);
    });
  }
}
