const globalLimits = globalThis as unknown as { nexusLimits?: Map<string, { count: number; until: number }> };
const limits = globalLimits.nexusLimits ??= new Map();

export function allowRequest(key: string, maximum: number, windowMs: number, now = Date.now()) {
  if (limits.size > 2000) for (const [k, v] of limits) if (v.until <= now) limits.delete(k);
  const existing = limits.get(key);
  if (!existing || existing.until <= now) { limits.set(key, { count: 1, until: now + windowMs }); return true; }
  if (existing.count >= maximum) return false;
  existing.count++;
  return true;
}
