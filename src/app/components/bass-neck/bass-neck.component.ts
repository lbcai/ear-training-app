import { Component, Input } from '@angular/core';
import { fretPositionAt } from '../../data/fretboard';
import { sequenceColor } from '../../data/rainbow-colors';
import { BASS_STRING_LABELS, FRET_COUNT } from '../../data/music-theory';
import { SequenceEntry } from '../../models/sequence-entry.model';
import { AudioService } from '../../services/audio.service';
import { buildNeckMarkers, NeckMarker } from '../../utils/sequence-presentation';

/** Display order: G (high) → E (low), matching standard neck diagrams. */
const STRING_ROWS = [
  { index: 3, label: 'G' },
  { index: 2, label: 'D' },
  { index: 1, label: 'A' },
  { index: 0, label: 'E' },
] as const;

const FRET_MARKERS = new Set([3, 5, 7, 9, 12, 15, 17, 19]);

@Component({
  selector: 'app-bass-neck',
  imports: [],
  templateUrl: './bass-neck.component.html',
  styleUrl: './bass-neck.component.scss',
})
export class BassNeckComponent {
  readonly stringRows = STRING_ROWS;
  readonly frets = Array.from({ length: FRET_COUNT }, (_, i) => i);
  readonly sequenceColor = sequenceColor;

  @Input() sequenceEntries: SequenceEntry[] = [];
  @Input() reveal = false;

  constructor(private readonly audio: AudioService) {}

  isFretMarker(fret: number): boolean {
    return FRET_MARKERS.has(fret);
  }

  markersAt(stringIndex: number, fret: number): NeckMarker[] {
    if (!this.reveal) {
      return [];
    }
    return this.neckMarkers.filter(
      (marker) =>
        marker.position.stringIndex === stringIndex && marker.position.fret === fret,
    );
  }

  private get neckMarkers(): NeckMarker[] {
    return buildNeckMarkers(this.sequenceEntries);
  }

  cellAriaLabel(stringIndex: number, fret: number): string {
    const { label } = fretPositionAt(stringIndex, fret);
    const stringName = BASS_STRING_LABELS[stringIndex];
    return `Play ${label} on ${stringName} string, fret ${fret}`;
  }

  playCell(stringIndex: number, fret: number): void {
    const { frequency } = fretPositionAt(stringIndex, fret);
    void this.audio.playNote(frequency);
  }
}
