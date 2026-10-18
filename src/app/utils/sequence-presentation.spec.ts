import { fretPositionAt } from '../data/fretboard';
import { buildNeckMarkers, buildSequenceEntries } from './sequence-presentation';
import { FretPosition } from '../models/fret-position.model';

const pos = (stringIndex: number, fret: number, label: string): FretPosition => ({
  stringIndex,
  fret,
  label,
  frequency: 110,
});

describe('sequence presentation', () => {
  it('reuses color for the same pitch on the same string/fret', () => {
    const a = pos(1, 5, 'D');
    const entries = buildSequenceEntries([a, pos(0, 3, 'G'), a]);

    expect(entries[0].colorIndex).toBe(0);
    expect(entries[1].colorIndex).toBe(1);
    expect(entries[2].colorIndex).toBe(0);
  });

  it('reuses color for the same pitch in different positions', () => {
    const dOnA = fretPositionAt(1, 5);
    const dOnE = fretPositionAt(0, 10);
    const entries = buildSequenceEntries([dOnA, fretPositionAt(3, 0)]);

    expect(entries[0].colorIndex).toBe(entries.find((e) => e.orderIndex === 0)!.colorIndex);
    const dOnly = buildSequenceEntries([dOnA, dOnE]);
    expect(dOnly[0].colorIndex).toBe(dOnly[1].colorIndex);
  });

  it('shows all same-octave locations on reveal', () => {
    const dOnA = fretPositionAt(1, 5);
    const entries = buildSequenceEntries([dOnA]);
    const markers = buildNeckMarkers(entries);

    const onA5 = markers.find((m) => m.position.stringIndex === 1 && m.position.fret === 5)!;
    const onE10 = markers.find((m) => m.position.stringIndex === 0 && m.position.fret === 10)!;

    expect(onA5).toBeTruthy();
    expect(onE10).toBeTruthy();
    expect(onA5.isPlayed).toBe(true);
    expect(onE10.isPlayed).toBe(false);
    expect(onE10.colorIndex).toBe(onA5.colorIndex);
  });

  it('merges repeated played positions into one neck marker', () => {
    const a = pos(1, 5, 'D');
    const entries = buildSequenceEntries([a, pos(0, 3, 'G'), a]);
    const markers = buildNeckMarkers(entries);

    const dMarkers = markers.filter((m) => m.colorIndex === 0);
    const playedD = dMarkers.filter((m) => m.isPlayed);
    expect(playedD.length).toBe(1);
    expect(playedD[0].playOrders).toEqual([1, 3]);
  });
});
