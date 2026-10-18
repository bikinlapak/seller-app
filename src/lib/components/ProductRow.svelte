<script lang="ts">
	import Chip from '#lib/components/Chip.svelte';
	import type { Product } from '#lib/types/api.js';

	let { product }: { product: Product } = $props();
</script>

<a
	href="/products/{product.id}"
	class="flex items-center gap-3 rounded-row border border-line bg-surface p-2.5 text-ink"
>
	<!-- The colour shows while the photo loads, and stands in when there is none. -->
	{#if product.photoUrl}
		<img
			src={product.photoUrl}
			alt=""
			loading="lazy"
			width="56"
			height="56"
			class="size-14 flex-none rounded-tile object-cover"
			style="background: {product.photoColour}"
		/>
	{:else}
		<span
			class="flex size-14 flex-none items-center justify-center rounded-tile text-[10px] text-[#6B5A3E]"
			style="background: {product.photoColour}"
			aria-hidden="true">[PHOTO]</span
		>
	{/if}
	<span class="flex min-w-0 flex-1 flex-col gap-[3px]">
		<span class="truncate text-[15px] font-semibold">{product.name}</span>
		{#if product.priceLabel}
			<span class="text-sm font-bold">{product.priceLabel}</span>
		{:else if product.subtitle}
			<span class="text-[13px] text-ink-muted">{product.subtitle}</span>
		{/if}
	</span>
	<span class="flex flex-none flex-col items-end gap-1">
		<Chip severity={product.stockSeverity}>{product.stockLabel}</Chip>
		<span
			class={[
				'text-[11px]',
				product.statusImportant ? 'font-semibold text-kunyit-700' : 'text-ink-muted'
			]}>{product.status}</span
		>
	</span>
</a>
