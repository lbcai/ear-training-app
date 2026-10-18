import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BassNeckComponent } from './components/bass-neck/bass-neck.component';
import { buildKeyOptions, KeyOption } from './data/music-theory';
import { sequenceColor } from './data/rainbow-colors';
import { FretPosition } from './models/fret-position.model';
import { buildSequenceEntries } from './utils/sequence-presentation';
import { AudioService } from './services/audio.service';
import { NotePickerService, PickMode } from './services/note-picker.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule, BassNeckComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly noteCountOptions = Array.from({ length: 10 }, (_, i) => i + 1);
  readonly keyOptions = buildKeyOptions();
  readonly sequenceColor = sequenceColor;

  noteCount = 4;
  mode: PickMode = 'key';
  selectedKeyId = 'A-major';

  currentNotes: FretPosition[] = [];
  revealed = false;
  isPlaying = false;

  constructor(
    private readonly audio: AudioService,
    private readonly notePicker: NotePickerService,
  ) {}

  get hasRound(): boolean {
    return this.currentNotes.length > 0;
  }

  get sequenceEntries() {
    return buildSequenceEntries(this.currentNotes);
  }

  private selectedKey(): KeyOption {
    return this.keyOptions.find((k) => k.id === this.selectedKeyId) ?? this.keyOptions[0];
  }

  async play(): Promise<void> {
    this.revealed = false;
    this.currentNotes = this.notePicker.pickNotes(
      this.noteCount,
      this.mode,
      this.selectedKey(),
    );
    await this.playCurrentSequence();
  }

  async replay(): Promise<void> {
    if (!this.hasRound) {
      return;
    }
    await this.playCurrentSequence();
  }

  private async playCurrentSequence(): Promise<void> {
    this.isPlaying = true;
    try {
      await this.audio.playSequence(this.currentNotes);
    } finally {
      this.isPlaying = false;
    }
  }

  reveal(): void {
    if (this.hasRound) {
      this.revealed = true;
    }
  }
}
