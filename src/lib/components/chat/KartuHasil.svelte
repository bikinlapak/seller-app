<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import type { KartuHasil } from '#lib/types/api.js';

	/*
	 * Kartu hasil: muncul setelah executor benar-benar menulis ke worksh.io.
	 * Garisnya pine-300 dan kepalanya pine-100 supaya jelas berbeda dari saran —
	 * yang satu usulan, yang satu sudah terjadi.
	 */
	let { kartu }: { kartu: KartuHasil } = $props();
</script>

<article class="bubble-agent overflow-hidden border border-pine-300 bg-surface">
	<div class="flex items-center gap-2.5 bg-pine-100 px-3.5 py-2.5">
		<span
			class="flex size-8 flex-none items-center justify-center rounded-full bg-pine-600 text-white"
		>
			<Icon nama="centang" ukuran={18} tebal={2.5} />
		</span>
		<span class="flex flex-col gap-px">
			<span class="text-[15px] font-bold text-pine-800">{kartu.judul}</span>
			<span class="text-xs text-pine-800">{kartu.detail}</span>
		</span>
	</div>
	<div class="flex gap-2 px-3.5 pt-2.5 pb-3">
		<a
			href={kartu.waUrl}
			rel="noreferrer"
			class="flex min-h-[42px] flex-1 items-center justify-center rounded-action bg-pine-600 text-sm font-bold text-white"
			>Kirim via WhatsApp</a
		>
		<a
			href={kartu.poHref}
			class="flex min-h-[42px] items-center rounded-action border border-line-strong px-3 text-sm font-semibold text-ink"
			>Lihat PO</a
		>
	</div>
</article>
