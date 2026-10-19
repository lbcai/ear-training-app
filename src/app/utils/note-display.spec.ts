import { displayNoteLabel } from './note-display';

describe('displayNoteLabel', () => {
  it('shows sharp and flat symbols', () => {
    expect(displayNoteLabel('C#')).toBe('C\u266F');
    expect(displayNoteLabel('Bb')).toBe('B\u266D');
    expect(displayNoteLabel('F#')).toBe('F\u266F');
  });

  it('leaves natural notes unchanged', () => {
    expect(displayNoteLabel('E')).toBe('E');
    expect(displayNoteLabel('B')).toBe('B');
  });
});
