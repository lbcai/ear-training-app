import {
  noteNameForPitchClassInKey,
  scaleNoteNames,
} from './music-theory';

describe('music theory spellings', () => {
  it('spells A major with sharps', () => {
    expect(scaleNoteNames('A', 'major')).toEqual(['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']);
  });

  it('spells F major with flats', () => {
    expect(scaleNoteNames('F', 'major')).toEqual(['F', 'G', 'A', 'Bb', 'C', 'D', 'E']);
  });

  it('labels scale tones in key when picking', () => {
    expect(noteNameForPitchClassInKey(6, 'A', 'major')).toBe('F#');
    expect(noteNameForPitchClassInKey(10, 'F', 'major')).toBe('Bb');
  });
});
