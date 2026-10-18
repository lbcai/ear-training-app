import { Injectable } from '@angular/core';
import { FretPosition } from '../models/fret-position.model';
import { peakGainForFrequency } from '../utils/note-loudness';

/** Below this, blend in a quiet 2nd harmonic so laptop speakers reproduce the pitch. */
const SUB_BASS_HARMONIC_CUTOFF_HZ = 140;
const SUB_BASS_HARMONIC_MIX = 0.35;

@Injectable({ providedIn: 'root' })
export class AudioService {
  private context: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.context) {
      this.context = new AudioContext();
    }
    return this.context;
  }

  async playSequence(notes: FretPosition[], noteDurationMs = 550, gapMs = 120): Promise<void> {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    let startAt = ctx.currentTime + 0.05;
    for (const note of notes) {
      this.scheduleTone(ctx, note.frequency, startAt, noteDurationMs / 1000);
      startAt += (noteDurationMs + gapMs) / 1000;
    }

    const totalMs = notes.length * (noteDurationMs + gapMs);
    await new Promise((resolve) => setTimeout(resolve, totalMs));
  }

  async playNote(frequency: number, durationMs = 450): Promise<void> {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    const startTime = ctx.currentTime + 0.01;
    this.scheduleTone(ctx, frequency, startTime, durationMs / 1000);
    await new Promise((resolve) => setTimeout(resolve, durationMs));
  }

  private scheduleTone(
    ctx: AudioContext,
    frequency: number,
    startTime: number,
    durationSec: number,
  ): void {
    const peak = peakGainForFrequency(frequency);
    const attack = 0.02;
    const release = 0.08;

    this.scheduleOscillatorTone(ctx, frequency, peak, startTime, durationSec, attack, release);

    if (frequency < SUB_BASS_HARMONIC_CUTOFF_HZ) {
      this.scheduleOscillatorTone(
        ctx,
        frequency * 2,
        peak * SUB_BASS_HARMONIC_MIX,
        startTime,
        durationSec,
        attack,
        release,
      );
    }
  }

  private scheduleOscillatorTone(
    ctx: AudioContext,
    frequency: number,
    peak: number,
    startTime: number,
    durationSec: number,
    attack: number,
    release: number,
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(peak, startTime + attack);
    gain.gain.setValueAtTime(peak, startTime + durationSec - release);
    gain.gain.linearRampToValueAtTime(0, startTime + durationSec);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + durationSec + 0.05);
  }
}
