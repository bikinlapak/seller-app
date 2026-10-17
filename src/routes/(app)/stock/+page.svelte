<script lang="ts">
	import StockRow from '#lib/components/StockRow.svelte';

	let { data } = $props();

	const FILTERS = ['All', 'Running low', 'Expiring', 'On order'] as const;
	let filter = $state<(typeof FILTERS)[number]>('All');

	const visible = $derived(
		(data.list?.rows ?? []).filter((row) => {
			if (filter === 'Running low') return row.severity === 'critical';
			if (filter === 'Expiring') return row.left.toLowerCase().includes('expire');
			if (filter === 'On order') return row.right.startsWith('PO-');
			return true;
		})
	);
</script>

<svelte:head><title>Stock · bikinlapak</title></svelte:head>

<header class="flex flex-col gap-3 px-4 pt-4 pb-2">
	<div class="flex items-center justify-between gap-2">
		<h1 class="m-0 font-display text-[26px] font-normal text-pine-600">Stock</h1>
		<button
			class="min-h-10 flex-none rounded-action border border-line-strong bg-surface px-3 text-[13px] font-semibold text-ink"
			>{data.list?.location ?? 'All locations'}</button
		>
	</div>

	{#if data.list}
		<div class="grid grid-cols-3 gap-2">
			<div class="flex flex-col gap-0.5 rounded-field border border-line bg-surface p-2.5">
				<span class="text-lg font-bold">{data.list.summary.value}</span>
				<span class="text-xs text-ink-muted">stock value</span>
			</div>
			<div class="flex flex-col gap-0.5 rounded-field bg-danger-bg p-2.5">
				<span class="text-lg font-bold text-danger-strong">{data.list.summary.lowCount}</span>
				<span class="text-xs text-danger-strong">running low</span>
			</div>
			<div class="flex flex-col gap-0.5 rounded-field bg-kunyit-100 p-2.5">
				<span class="text-lg font-bold text-kunyit-800">{data.list.summary.expiringCount}</span>
				<span class="text-xs text-kunyit-800">expiring soon</span>
			</div>
		</div>
	{/if}

	<div role="tablist" aria-label="Stock filter" class="flex gap-1.5 overflow-x-auto">
		{#each FILTERS as f (f)}
			<button
				role="tab"
				aria-selected={filter === f}
				onclick={() => (filter = f)}
				class={[
					'min-h-9 flex-none rounded-full px-3 text-[13px]',
					filter === f
						? 'bg-pine-600 font-bold text-white'
						: 'border border-line-strong bg-surface text-ink'
				]}>{f}</button
			>
		{/each}
	</div>
</header>

<main class="flex flex-1 flex-col gap-2 px-4 pt-1 pb-3">
	{#each visible as row (row.id)}
		<StockRow {row} />
	{:else}
		<p class="py-8 text-center text-ink-faint">Nothing in this filter.</p>
	{/each}
</main>

<div class="grid grid-cols-3 gap-2 px-4 pb-2">
	<button
		class="min-h-11 rounded-field border border-line-strong bg-surface text-[13px] font-semibold text-ink"
		>Receive goods</button
	>
	<button
		class="min-h-11 rounded-field border border-line-strong bg-surface text-[13px] font-semibold text-ink"
		>Stocktake</button
	>
	<a
		href="/assistant/reorder"
		class="flex min-h-11 items-center justify-center rounded-field bg-pine-600 text-[13px] font-bold text-white"
		>Create PO</a
	>
</div>
