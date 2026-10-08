<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { NAV_ITEMS, isActive } from '#lib/nav.js';

	let { children }: { children: Snippet } = $props();
</script>

<div class="flex min-h-dvh flex-col md:flex-row">
	<aside class="border-b border-line bg-cream-soft md:w-60 md:shrink-0 md:border-r md:border-b-0">
		<div class="px-5 py-4 font-display text-lg font-extrabold text-pine-600">bikinlapak</div>
		<nav aria-label="Menu utama" class="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col">
			{#each NAV_ITEMS as item (item.href)}
				{@const active = isActive(page.url.pathname, item.href)}
				<a
					href={item.href}
					aria-current={active ? 'page' : undefined}
					class={[
						'rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap',
						active ? 'bg-pine-100 text-pine-800' : 'text-ink-muted hover:bg-cream'
					]}
				>
					{item.label}
				</a>
			{/each}
		</nav>
	</aside>

	<main class="flex-1 px-4 py-6 md:px-8">
		{@render children()}
	</main>
</div>
