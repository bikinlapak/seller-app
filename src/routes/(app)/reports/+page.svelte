<script lang="ts">
	import ChatHeader from '#lib/components/ChatHeader.svelte';
	import ForecastChart from '#lib/components/ForecastChart.svelte';

	/*
	 * Laporan sisa + impact (FR-23, FR-24, FR-54): how much did not sell at
	 * full price, where it went, what share stayed out of landfill, and what
	 * the forecast is doing. Every figure is computed by seller-svc from the
	 * ledger; the method line says how.
	 */
	let { data } = $props();
	const w = $derived(data.waste);
	const d = $derived(data.dash);

	const delta = $derived(
		w?.diversionPercent != null && w.previousPercent != null
			? w.diversionPercent - w.previousPercent
			: null
	);
</script>

<svelte:head><title>Reports · bikinlapak</title></svelte:head>

<ChatHeader back="/assistant" title="Impact and waste" />

<main class="flex flex-1 flex-col gap-3 px-4 py-3">
	{#if w}
		<section class="flex flex-col gap-3 rounded-row border border-line bg-surface p-3.5">
			<div class="flex items-end justify-between gap-3">
				<div class="flex flex-col">
					<span class="label-section text-ink-muted">Kept out of landfill · {w.period}</span>
					<span class="font-display text-[40px] leading-none text-pine-600"
						>{w.diversionPercent ?? '–'}%</span
					>
				</div>
				{#if delta !== null}
					<span
						class={[
							'rounded-full px-2.5 py-1 text-xs font-bold',
							delta >= 0 ? 'bg-sukses-bg text-sukses' : 'bg-danger-bg text-danger-strong'
						]}>{delta >= 0 ? '+' : ''}{delta} pts vs last week</span
					>
				{/if}
			</div>
			<p class="m-0 text-sm text-ink-label">
				{w.totalValue} ({w.totalWeight}) did not sell at full price, logged from {w.photos}
				{w.photos === 1 ? 'photo' : 'photos'}.
			</p>

			<ul class="m-0 flex list-none flex-col gap-2 p-0" aria-label="By destination">
				{#each w.byDestination as dest (dest.id)}
					<li class="flex flex-col gap-1">
						<span class="flex justify-between gap-2 text-[13px]">
							<span class={dest.landfill ? 'font-semibold text-danger' : 'font-semibold'}
								>{dest.label}</span
							>
							<span class="text-ink-muted">{dest.value} · {dest.weight}</span>
						</span>
						<span class="h-2 overflow-hidden rounded bg-line-soft" aria-hidden="true">
							<span
								class={['block h-2 rounded', dest.landfill ? 'bg-danger' : 'bg-pine-600']}
								style="width: {Math.max(2, dest.percent)}%"
							></span>
						</span>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#if d}
		<section aria-label="Impact" class="grid grid-cols-2 gap-2">
			{#each d.impact as stat (stat.label)}
				<div class="flex flex-col gap-0.5 rounded-field border border-line bg-surface p-3">
					<span class="text-xl font-bold">{stat.value}</span>
					<span class="text-xs font-semibold text-ink-label">{stat.label}</span>
					{#if stat.note}<span class="text-[11px] text-ink-muted">{stat.note}</span>{/if}
				</div>
			{/each}
		</section>

		{#if d.atRisk.length > 0}
			<section class="rounded-row border border-line bg-surface px-3.5 py-1">
				<h2 class="label-section m-0 pt-2.5 pb-0.5 text-ink-muted">
					At risk now · {d.openSuggestions} open suggestions
				</h2>
				{#each d.atRisk as r (r.lotId)}
					<a
						href="/products/{r.productId}"
						class="flex min-h-[46px] items-center justify-between gap-2 border-t border-line-soft text-sm text-ink"
					>
						<span class="flex flex-col">
							<span class="font-semibold">{r.name}</span>
							<span class="text-xs text-ink-muted">{r.atRisk} · {r.expiryLabel}</span>
						</span>
						<span class="flex-none text-xs font-semibold text-danger">{r.value}</span>
					</a>
				{/each}
			</section>
		{/if}

		{#each d.series as s (s.productId)}
			<section class="flex flex-col gap-2 rounded-row border border-line bg-surface px-3.5 py-3">
				<a href="/products/{s.productId}" class="text-sm font-bold text-ink">{s.name}</a>
				<ForecastChart series={s.series} unit={s.unit} />
				<p class="m-0 text-xs text-ink-muted">{s.accuracy}</p>
			</section>
		{/each}

		<p class="m-0 text-xs leading-relaxed text-ink-muted">{d.methodNote}</p>
	{/if}

	{#if w}
		<section class="rounded-row border border-line bg-surface px-3.5 py-1">
			<h2 class="label-section m-0 pt-2.5 pb-0.5 text-ink-muted">Latest entries</h2>
			{#each w.recent as r, i (i)}
				<div
					class="flex min-h-[42px] items-center justify-between gap-2 border-t border-line-soft text-[13px]"
				>
					<span>{r.label}</span>
					<span class="flex-none text-right text-ink-muted">{r.value}</span>
				</div>
			{/each}
		</section>
		<p class="m-0 text-xs leading-relaxed text-ink-muted">{w.method}</p>
	{/if}

	{#if !w && !d}
		<p class="py-8 text-center text-ink-muted">Reports could not be loaded.</p>
	{/if}
</main>
