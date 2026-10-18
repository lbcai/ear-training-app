/** Distinct hues for sequence order (cycles after 10 notes). */
export const RAINBOW_SEQUENCE_COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#a855f7',
] as const;

export function sequenceColor(orderIndex: number): string {
  return RAINBOW_SEQUENCE_COLORS[orderIndex % RAINBOW_SEQUENCE_COLORS.length];
}
