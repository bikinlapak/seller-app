<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import type { ResultCard } from '#lib/types/api.js';

	/*
	 * The result card: shown once the executor has actually written to
	 * worksh.io. Its border is pine-300 and its header pine-100 so it reads
	 * clearly apart from a suggestion — one is a proposal, the other happened.
	 */
	let { card }: { card: ResultCard } = $props();
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
	<div class="flex gap-2 px-3.5 pt-2.5 pb-3">
		<a
			href={card.waUrl}
			rel="noreferrer"
			class="flex min-h-[42px] flex-1 items-center justify-center rounded-action bg-pine-600 text-sm font-bold text-white"
			>Send via WhatsApp</a
		>
		<a
			href={card.poHref}
			class="flex min-h-[42px] items-center rounded-action border border-line-strong px-3 text-sm font-semibold text-ink"
			>View PO</a
		>
	</div>
</article>
