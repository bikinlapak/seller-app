<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import type { ResultCard } from '#lib/types/api.js';

	/*
	 * The result card: shown once the executor has actually written. Its
	 * border is pine-300 and its header pine-100 so it reads clearly apart
	 * from a suggestion — one is a proposal, the other happened.
	 */
	let { card }: { card: ResultCard } = $props();
	const links = $derived(card.links ?? []);
</script>

<article class="bubble-agent overflow-hidden border border-pine-300 bg-surface">
	<div class="flex items-center gap-2.5 bg-pine-100 px-3.5 py-2.5">
		<span
			class="flex size-8 flex-none items-center justify-center rounded-full bg-pine-600 text-white"
		>
			<Icon name="check" size={18} weight={2.5} />
		</span>
		<span class="flex flex-col gap-px">
			<span class="text-[15px] font-bold text-pine-800">{card.title}</span>
			<span class="text-xs text-pine-800">{card.detail}</span>
		</span>
	</div>
	{#if card.waUrl || links.length > 0}
		<div class="flex flex-wrap gap-2 px-3.5 pt-2.5 pb-3">
			{#if card.waUrl}
				<a
					href={card.waUrl}
					target="_blank"
					rel="noreferrer"
					class="flex min-h-[42px] flex-1 items-center justify-center rounded-action bg-pine-600 px-3 text-sm font-bold text-white"
					>Send via WhatsApp</a
				>
			{/if}
			{#each links as link (link.href)}
				<a
					href={link.href}
					class={[
						'flex min-h-[42px] items-center justify-center rounded-action px-3 text-sm font-semibold',
						card.waUrl
							? 'border border-line-strong text-ink'
							: 'flex-1 border border-pine-600 text-pine-600'
					]}>{link.label}</a
				>
			{/each}
		</div>
	{/if}
</article>
