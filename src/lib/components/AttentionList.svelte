<script lang="ts">
	import AiLabel from '#lib/components/AiLabel.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import type { Attention } from '#lib/types/api.js';

	/*
	 * "Needs attention today": the most urgent thing, written as a consequence
	 * ("Bread flour runs out Tuesday") rather than a metric. Each row goes
	 * straight into the thread that handles it.
	 *
	 * When nothing is urgent the section is absent — better empty than filled
	 * with reassurance nobody can act on.
	 */
	let { attention }: { attention: Attention[] } = $props();

	const tiles = {
		stock: 'bg-pine-100 text-pine-600',
		expiry: 'bg-kunyit-100 text-kunyit-700',
		donation: 'bg-sukses-bg text-sukses',
		special: 'bg-kunyit-100 text-kunyit-700',
		waste: 'bg-pine-100 text-pine-600'
	} as const;

	const icons = {
		stock: 'stock',
		expiry: 'expiry',
		donation: 'donation',
		special: 'products',
		waste: 'camera'
	} as const;
</script>

{#if attention.length > 0}
	<section
		aria-label="Needs attention today"
		class="overflow-hidden rounded-card border border-line bg-surface"
	>
		<div class="flex items-center justify-between px-3.5 pt-3 pb-1.5">
			<h2 class="m-0 text-[13px] font-bold text-ink-label">Needs attention today</h2>
			<AiLabel />
		</div>

		{#each attention as item (item.id)}
			<a
				href={item.href}
				class="flex items-center gap-3 border-t border-line-soft px-3.5 py-2.5 text-ink"
			>
				<span
					class={[
						'flex size-9 flex-none items-center justify-center rounded-tile',
						tiles[item.icon]
					]}
				>
					<Icon name={icons[item.icon]} size={18} />
				</span>
				<span class="flex flex-1 flex-col gap-0.5">
					<span class="text-sm font-semibold">{item.title}</span>
					<span class="text-xs text-ink-muted">{item.detail}</span>
				</span>
				<span class="flex-none text-ink-faint"><Icon name="right" size={18} /></span>
			</a>
		{/each}
	</section>
{/if}
