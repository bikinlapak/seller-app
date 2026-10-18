<script lang="ts">
	import type { SeriesPoint } from '#lib/types/api.js';

	/*
	 * Actual demand (solid) against the forecast (dashed) with its upper 80%
	 * bound as a band. Stockout and closed days are hollow: they are not real
	 * demand and the forecast ignores them. Plain SVG — one chart, no library.
	 */
	let { series, unit }: { series: SeriesPoint[]; unit: string } = $props();

	const W = 320;
	const H = 120;
	const PAD = { l: 26, r: 6, t: 8, b: 16 };

	const max = $derived(
		Math.max(1, ...series.map((p) => Math.max(p.actual ?? 0, p.upper ?? 0, p.forecast ?? 0)))
	);
	const x = (i: number) => PAD.l + (i / Math.max(1, series.length - 1)) * (W - PAD.l - PAD.r);
	const y = (v: number) => PAD.t + (1 - v / max) * (H - PAD.t - PAD.b);

	const path = (pick: (p: SeriesPoint) => number | undefined) =>
		series
			.map((p, i) => [i, pick(p)] as const)
			.filter(([, v]) => v !== undefined)
			.map(([i, v], k) => `${k === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v!).toFixed(1)}`)
			.join(' ');

	const band = $derived.by(() => {
		const pts = series
			.map((p, i) => [i, p.forecast, p.upper] as const)
			.filter(([, f, u]) => f !== undefined && u !== undefined);
		if (pts.length === 0) return '';
		const top = pts.map(([i, , u]) => `${x(i).toFixed(1)},${y(u!).toFixed(1)}`);
		const bottom = [...pts].reverse().map(([i, f]) => `${x(i).toFixed(1)},${y(f!).toFixed(1)}`);
		return `M${top.join(' L')} L${bottom.join(' L')} Z`;
	});

	const todayIndex = $derived(series.findIndex((p) => p.forecast !== undefined));
	const nextWeek = $derived(
		series
			.filter((p) => p.forecast !== undefined)
			.slice(0, 7)
			.reduce((a, p) => a + (p.forecast ?? 0), 0)
	);
	const lastWeek = $derived(
		series
			.filter((p) => p.actual !== undefined)
			.slice(-7)
			.reduce((a, p) => a + (p.actual ?? 0), 0)
	);
	const label = $derived(
		`Demand chart. Last 7 days sold ${lastWeek.toFixed(1)} ${unit}; next 7 days forecast ${nextWeek.toFixed(1)} ${unit}.`
	);
</script>

<figure class="m-0 flex flex-col gap-1">
	<svg viewBox="0 0 {W} {H}" role="img" aria-label={label} class="h-auto w-full">
		<line x1={PAD.l} x2={W - PAD.r} y1={y(0)} y2={y(0)} class="stroke-line" />
		<text x="2" y={y(max) + 4} class="fill-ink-muted text-[9px]"
			>{max.toFixed(max < 10 ? 1 : 0)}</text
		>
		<text x="2" y={y(0)} class="fill-ink-muted text-[9px]">0</text>
		{#if todayIndex > 0}
			<line
				x1={x(todayIndex)}
				x2={x(todayIndex)}
				y1={PAD.t}
				y2={y(0)}
				class="stroke-line-strong"
				stroke-dasharray="2 3"
			/>
			<text x={x(todayIndex) + 3} y={PAD.t + 6} class="fill-ink-muted text-[9px]">today</text>
		{/if}
		<path d={band} class="fill-kunyit-100" />
		<path d={path((p) => p.actual)} fill="none" class="stroke-pine-600" stroke-width="1.8" />
		<path
			d={path((p) => p.forecast)}
			fill="none"
			class="stroke-kunyit-700"
			stroke-width="1.8"
			stroke-dasharray="4 3"
		/>
		{#each series as p, i (p.date)}
			{#if p.censored && p.actual !== undefined}
				<circle
					cx={x(i)}
					cy={y(p.actual)}
					r="2.6"
					class="fill-surface stroke-danger"
					stroke-width="1.2"
				/>
			{/if}
		{/each}
	</svg>
	<figcaption class="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-ink-muted">
		<span><span class="text-pine-600">━</span> sold</span>
		<span><span class="text-kunyit-700">┅</span> forecast</span>
		<span><span class="text-kunyit-400">■</span> upper 80%</span>
		<span><span class="text-danger">○</span> stockout / closed</span>
	</figcaption>
</figure>
