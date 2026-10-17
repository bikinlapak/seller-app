<script lang="ts">
	import type { Severity, StockRow } from '#lib/types/api.js';

	/*
	 * A stock row with a cover bar. The bar's colour follows severity, but the
	 * figure and the day count are always shown — the bar alone is not the
	 * information.
	 */
	let { row }: { row: StockRow } = $props();

	const barColour: Record<Severity, string> = {
		ok: 'bg-pine-600',
		warn: 'bg-kunyit-400',
		critical: 'bg-danger'
	};

	const textColour: Record<Severity, string> = {
		ok: 'text-sukses',
		warn: 'text-kunyit-700',
		critical: 'text-danger'
	};
</script>

<a
	href="/stock/{row.id}"
	class="flex flex-col gap-1.5 rounded-row border border-line bg-surface p-3 text-ink"
>
	<span class="flex justify-between gap-2">
		<span class="text-[15px] font-semibold">{row.name}</span>
		<span class="flex-none text-[15px] font-bold">{row.quantityLabel}</span>
	</span>

	<span
		class="block h-1.5 overflow-hidden rounded-[3px] bg-line-soft"
		role="img"
		aria-label="Stock remaining {row.percent}%"
	>
		<span
			class={['block h-1.5 rounded-[3px]', barColour[row.severity]]}
			style="width: {row.percent}%"
		></span>
	</span>

	<span class="flex justify-between gap-2 text-xs">
		<span class={['font-semibold', textColour[row.severity]]}>{row.left}</span>
		<span
			class={['flex-none', row.rightImportant ? 'font-semibold text-pine-800' : 'text-ink-muted']}
			>{row.right}</span
		>
	</span>
</a>
