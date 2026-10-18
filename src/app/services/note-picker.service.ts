import { Injectable } from '@angular/core';
import { ALL_FRET_POSITIONS } from '../data/fretboard';
import {
  BASS_OPEN_PITCH_CLASSES,
  KeyOption,
  scalePitchClasses,
} from '../data/music-theory';
import { FretPosition } from '../models/fret-position.model';

export type PickMode = 'key' | 'random';

@Injectable({ providedIn: 'root' })
export class NotePickerService {
  pickNotes(count: number, mode: PickMode, key: KeyOption): FretPosition[] {
    const pool = this.buildPool(mode, key);
    const notes: FretPosition[] = [];
    for (let i = 0; i < count; i++) {
      const index = Math.floor(Math.random() * pool.length);
      notes.push(pool[index]);
    }
    return notes;
  }

  private buildPool(mode: PickMode, key: KeyOption): FretPosition[] {
    if (mode === 'random') {
      return ALL_FRET_POSITIONS;
    }
    const allowed = scalePitchClasses(key.root, key.quality);
    return ALL_FRET_POSITIONS.filter((pos) => {
      const pc = (BASS_OPEN_PITCH_CLASSES[pos.stringIndex] + pos.fret) % 12;
      return allowed.has(pc);
    });
  }
}
