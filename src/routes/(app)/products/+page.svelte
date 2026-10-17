<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import ProductRow from '#lib/components/ProductRow.svelte';

	let { data } = $props();

	let category = $state('All');
	let search = $state('');

	const visible = $derived(
		(data.list?.products ?? []).filter(
			(p) =>
				(category === 'All' || p.category === category) &&
				p.name.toLowerCase().includes(search.toLowerCase())
		)
	);
</script>

<svelte:head><title>Products · bikinlapak</title></svelte:head>

<header class="flex flex-col gap-2.5 px-4 pt-4 pb-2">
	<div class="flex items-baseline justify-between gap-2">
		<h1 class="m-0 font-display text-[26px] font-normal text-pine-600">Products</h1>
		<span class="flex-none text-[13px] text-ink-muted">{data.list?.total ?? 0} products</span>
	</div>

	<label
		class="flex min-h-[46px] items-center gap-2 rounded-field border border-line bg-surface px-3.5"
	>
		<span class="flex-none text-ink-muted"><Icon name="search" size={18} /></span>
		<span class="sr-only">Search products</span>
		<input
			type="search"
			bind:value={search}
			placeholder="Search products"
			class="min-w-0 flex-1 border-0 bg-transparent p-0 text-[15px] text-ink focus:ring-0"
		/>
	</label>

	<div role="tablist" aria-label="Category" class="flex gap-1.5 overflow-x-auto">
		{#each data.list?.categories ?? [] as c (c)}
			<button
				role="tab"
				aria-selected={category === c}
				onclick={() => (category = c)}
				class={[
					'min-h-9 flex-none rounded-full px-3 text-[13px]',
					category === c
						? 'bg-pine-600 font-bold text-white'
						: 'border border-line-strong bg-surface text-ink'
				]}>{c}</button
			>
		{/each}
	</div>
</header>

<main class="flex flex-1 flex-col gap-2 px-4 pt-1 pb-3">
	{#each visible as product (product.id)}
		<ProductRow {product} />
	{:else}
		<p class="py-8 text-center text-ink-faint">No products match.</p>
	{/each}
</main>

<!-- Floating actions: "from a photo" goes through chat, or a plain form. -->
<div class="sticky bottom-0 flex flex-col items-end gap-2 px-4 pb-2">
	<a
		href="/assistant/product"
		class="flex min-h-11 items-center gap-2 rounded-full border border-line-strong bg-surface px-3.5 text-sm font-semibold text-ink"
	>
		<Icon name="camera" size={18} />From a photo (AI)
	</a>
	<a
		href="/products/new"
		class="flex min-h-[52px] items-center gap-2 rounded-full bg-kunyit-400 px-4.5 text-[15px] font-bold text-kunyit-900"
	>
		<Icon name="plus" size={20} weight={2.5} />Add product
	</a>
</div>
