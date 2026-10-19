import { TestBed } from '@angular/core/testing';
import { BASS_OPEN_PITCH_CLASSES, scalePitchClasses } from '../data/music-theory';
import { NotePickerService } from './note-picker.service';

const cMajor = { id: 'C-major', root: 'C' as const, quality: 'major' as const, label: 'C Major' };

describe('NotePickerService', () => {
  let service: NotePickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotePickerService);
  });

  it('draws only scale pitch classes in strict in-key mode', () => {
    const allowed = scalePitchClasses(cMajor.root, cMajor.quality);
    for (let trial = 0; trial < 30; trial++) {
      const notes = service.pickNotes(8, 'key', cMajor);
      for (const note of notes) {
        const pc = (BASS_OPEN_PITCH_CLASSES[note.stringIndex] + note.fret) % 12;
        expect(allowed.has(pc)).withContext(`trial ${trial}`).toBeTrue();
      }
    }
  });

  it('mixes in chromatic pitch classes in key-chromatic mode', () => {
    const allowed = scalePitchClasses(cMajor.root, cMajor.quality);
    let chromaticCount = 0;
    let total = 0;

    for (let trial = 0; trial < 150; trial++) {
      for (const note of service.pickNotes(4, 'key-chromatic', cMajor)) {
        total += 1;
        const pc = (BASS_OPEN_PITCH_CLASSES[note.stringIndex] + note.fret) % 12;
        if (!allowed.has(pc)) {
          chromaticCount += 1;
        }
      }
    }

    expect(chromaticCount).toBeGreaterThan(0);
    expect(chromaticCount / total).toBeLessThan(0.45);
    expect(chromaticCount / total).toBeGreaterThan(0.08);
  });
});
