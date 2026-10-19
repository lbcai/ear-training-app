/** ASCII spellings (C#, Bb) → visible accidentals on small neck badges (C♯, B♭). */
export function displayNoteLabel(name: string): string {
  return name.replaceAll('#', '\u266F').replace(/(?<=[A-G])b/g, '\u266D');
}
