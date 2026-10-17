<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import type { Shop } from '#lib/types/api.js';

	let {
		shop,
		back,
		title,
		settingsHref
	}: { shop?: Shop; back?: string; title?: string; settingsHref?: string } = $props();
</script>

<header class="flex items-center gap-2 border-b border-line bg-surface py-2.5 pr-3 pl-1">
	{#if back}
		<a
			href={back}
			aria-label="Back"
			class="flex size-11 flex-none items-center justify-center rounded-field text-ink"
		>
			<Icon name="left" />
		</a>
	{/if}

	{#if title}
		<span class="flex-1 text-[17px] font-bold">{title}</span>
	{:else if shop}
		<span
			class="flex size-9 flex-none items-center justify-center rounded-[11px] bg-pine-600 font-display text-sm text-kunyit-400"
			aria-hidden="true">bl</span
		>
		<span class="flex flex-1 flex-col gap-px">
			<span class="text-base font-bold">Shop Assistant</span>
			<span class="text-xs text-ink-muted">AI · {shop.name}</span>
		</span>
	{/if}

	{#if settingsHref}
		<a
			href={settingsHref}
			aria-label="AI settings"
			class="flex size-11 flex-none items-center justify-center rounded-field text-ink"
		>
			<Icon name="settings" />
		</a>
	{/if}
</header>
