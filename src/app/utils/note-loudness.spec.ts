import {
  NECK_MAX_HZ,
  NECK_MIN_HZ,
  peakGainForFrequency,
} from './note-loudness';

describe('peakGainForFrequency', () => {
  it('boosts the lowest neck note more than the highest', () => {
    const low = peakGainForFrequency(NECK_MIN_HZ);
    const high = peakGainForFrequency(NECK_MAX_HZ);
    expect(low).toBeGreaterThan(high);
    expect(low / high).toBeGreaterThan(4);
  });

  it('uses the same peak at the fretboard extremes', () => {
    expect(peakGainForFrequency(NECK_MIN_HZ)).toBeCloseTo(0.95, 2);
    expect(peakGainForFrequency(NECK_MAX_HZ)).toBeCloseTo(0.14, 2);
  });
});
