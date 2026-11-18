// Color propio de cada escuela y el color de texto que se lee bien encima.
const FALLBACK = '#FFC531';

function isDark(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16);
  if (Number.isNaN(n)) return false;
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b < 150;
}

export function brandOf(config: { accent?: string }) {
  const bg = /^#[0-9a-f]{6}$/i.test(config.accent ?? '') ? config.accent! : FALLBACK;
  return { bg, fg: isDark(bg) ? '#ffffff' : '#031e41' };
}

// Variables CSS para usar el color en clases: bg-[var(--accent)] text-[var(--accent-ink)].
export const brandVars = (config: { accent?: string }) => {
  const { bg, fg } = brandOf(config);
  return { ['--accent' as string]: bg, ['--accent-ink' as string]: fg } as React.CSSProperties;
};
