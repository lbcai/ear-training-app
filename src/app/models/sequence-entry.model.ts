import { FretPosition } from './fret-position.model';

export interface SequenceEntry {
  position: FretPosition;
  /** Zero-based index in the played sequence. */
  orderIndex: number;
  /** Stable color slot for this string/fret (shared when the position repeats). */
  colorIndex: number;
}
