/*
 * "4 loaves", "1 box", "12 kg". Mirrors `plural` in seller-svc/src/fmt.rs:
 * the backend formats everything it sends as text, but steppers count on
 * the client, so the same rule lives here for numbers the merchant changes.
 */
const INVARIANT = new Set(['kg', 'L', 'pcs', 'items']);
const IRREGULAR: Record<string, string> = { box: 'boxes', loaf: 'loaves' };

export function plural(unit: string, n: number): string {
	if (n === 1 || INVARIANT.has(unit) || unit.endsWith('s')) return unit;
	return IRREGULAR[unit] ?? `${unit}s`;
}

export function qty(n: number, unit: string): string {
	return `${n} ${plural(unit, n)}`;
}
