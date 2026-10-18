import { frequencyFromMidi, midiForFret } from '../data/music-theory';

/** Lowest and highest pitches reachable on this app's 4×21 fretboard. */
export const NECK_MIN_HZ = frequencyFromMidi(midiForFret(0, 0));
export const NECK_MAX_HZ = frequencyFromMidi(midiForFret(3, 20));

const PEAK_AT_MIN_HZ = 0.95;
const PEAK_AT_MAX_HZ = 0.14;

/**
 * Maps the neck's log-frequency span to peak gain so open E and high G frets
 * sit at similar perceived levels for sine tones.
 */
export function peakGainForFrequency(frequency: number): number {
  const hz = Math.min(NECK_MAX_HZ, Math.max(NECK_MIN_HZ, frequency));
  const logMin = Math.log(NECK_MIN_HZ);
  const logMax = Math.log(NECK_MAX_HZ);
  const t = (Math.log(hz) - logMin) / (logMax - logMin);
  return PEAK_AT_MIN_HZ + t * (PEAK_AT_MAX_HZ - PEAK_AT_MIN_HZ);
}
