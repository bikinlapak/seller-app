<script lang="ts">
	import type { Snippet } from 'svelte';

	/*
	 * A chat bubble. The 4px corner faces the sender (see .bubble-* in
	 * layout.css). Agent: a white bordered card, left-aligned. Merchant: pine,
	 * white text, right-aligned.
	 */
	let { author, children }: { author: 'agent' | 'staff'; children: Snippet } = $props();
</script>

{#if author === 'agent'}
	<div
		class="bubble-agent max-w-[320px] self-start border border-line bg-surface px-3.5 py-2.5 text-sm leading-relaxed"
	>
		{@render children()}
	</div>
{:else}
	<div class="bubble-staff self-end bg-pine-600 px-3.5 py-2.5 text-[15px] text-white">
		{@render children()}
	</div>
{/if}
