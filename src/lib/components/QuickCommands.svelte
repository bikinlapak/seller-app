<script lang="ts">
	import type { QuickCommand } from '#lib/types/api.js';

	/*
	 * "Try asking": example commands that teach the merchant this app is driven
	 * in plain language. Two columns, 56px tall, big enough for a thumb.
	 */
	let { commands }: { commands: QuickCommand[] } = $props();
</script>

<h2 class="m-0 text-[13px] font-bold text-ink-label">Try asking</h2>
<nav aria-label="Quick commands" class="grid grid-cols-2 gap-2">
	{#each commands as c (c.href)}
		<a
			href={c.href}
			class="flex min-h-14 items-center rounded-row border border-line bg-surface px-3 py-2.5 text-sm font-semibold text-ink"
			>{c.label}</a
		>
	{/each}
</nav>
