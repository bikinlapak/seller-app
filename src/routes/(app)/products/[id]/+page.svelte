<script lang="ts">
	import ChatHeader from '#lib/components/ChatHeader.svelte';
	import ForecastChart from '#lib/components/ForecastChart.svelte';
	import { qty } from '#lib/format.js';
	import type { Severity } from '#lib/types/api.js';

	/*
	 * C3/C5 · Product and its stock: facts, lots in FEFO order with what is
	 * at risk, and demand against the forecast. Read-only in this build —
	 * catalog edits belong to worksh.io.
	 */
	let { data } = $props();
	const d = $derived(data.detail);

	const sev: Record<Severity, string> = {
		ok: 'bg-sukses-bg text-sukses',
		warn: 'bg-kunyit-100 text-kunyit-800',
		critical: 'bg-danger-bg text-danger-strong'
	};
</script>

<svelte:head><title>{d.product.name} · bikinlapak</title></svelte:head>

<ChatHeader back="/products" title={d.product.name} />

<main class="flex flex-1 flex-col gap-3 px-4 py-3">
	<section class="flex items-center gap-3">
		<span
			class="flex size-16 flex-none items-center justify-center rounded-field text-[10px] text-ink-muted"
			style="background: {d.product.photoColour}">[PHOTO]</span
		>
		<div class="flex min-w-0 flex-col gap-0.5">
			<span class="text-[15px] font-bold">{d.product.name}</span>
			<span class="text-sm text-ink-label">{d.product.priceLabel ?? d.product.subtitle}</span>
			<span class="flex flex-wrap gap-1.5 pt-0.5">
				<span class={['rounded-full px-2 py-0.5 text-xs font-bold', sev[d.product.stockSeverity]]}
					>{d.product.stockLabel}</span
				>
				<span
					class={[
						'rounded-full px-2 py-0.5 text-xs',
						d.product.statusImportant
							? 'bg-kunyit-100 font-bold text-kunyit-800'
							: 'bg-chip text-ink-label'
					]}>{d.product.status}</span
				>
			</span>
		</div>
	</section>

	{#if d.description}
		<p class="m-0 text-sm leading-relaxed text-ink-label">{d.description}</p>
	{/if}

	{#if d.series.length > 0}
		<section class="flex flex-col gap-2 rounded-row border border-line bg-surface px-3.5 py-3">
			<h2 class="label-section m-0 text-ink-muted">Demand and forecast</h2>
			<ForecastChart series={d.series} unit={d.unit} />
			<p class="m-0 text-xs leading-relaxed text-ink-muted">{d.forecastNote}</p>
		</section>
	{/if}

	<section class="rounded-row border border-line bg-surface px-3.5 py-1">
		<h2 class="label-section m-0 pt-2.5 pb-0.5 text-ink-muted">Details</h2>
		<dl class="m-0">
			{#each d.facts as f (f.label)}
				<div
					class="flex min-h-[42px] items-center justify-between gap-3 border-t border-line-soft text-sm"
				>
					<dt class="text-ink-label">{f.label}</dt>
					<dd class="m-0 text-right font-semibold">{f.value}</dd>
				</div>
			{/each}
		</dl>
	</section>

	{#if d.lots.length > 0}
		<section class="rounded-row border border-line bg-surface px-3.5 py-1">
			<h2 class="label-section m-0 pt-2.5 pb-0.5 text-ink-muted">Lots · first to expire first</h2>
			{#each d.lots as lot (lot.id)}
				<div
					class="flex min-h-[46px] items-center justify-between gap-2 border-t border-line-soft text-sm"
				>
					<span class="flex flex-col">
						<span class="font-semibold">{qty(lot.quantity, lot.unit)}</span>
						<span class="text-xs text-ink-muted">lot {lot.id}</span>
					</span>
					<span class="flex flex-col items-end gap-0.5">
						<span class={['rounded-full px-2 py-0.5 text-xs font-bold', sev[lot.severity]]}
							>{lot.expiryLabel}</span
						>
						{#if lot.atRisk > 0}
							<span class="text-xs text-danger">{lot.atRisk} unlikely to sell</span>
						{/if}
					</span>
				</div>
			{/each}
		</section>
	{/if}
</main>
