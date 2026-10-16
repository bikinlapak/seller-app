<script lang="ts">
	import Chip from '#lib/components/Chip.svelte';
	import type { Produk } from '#lib/types/api.js';

	let { produk }: { produk: Produk } = $props();
</script>

<a
	href="/produk/{produk.id}"
	class="flex items-center gap-3 rounded-row border border-line bg-surface p-2.5 text-ink"
>
	<!-- Placeholder foto: warna per produk sampai gambar asli dari worksh.io ada. -->
	<span
		class="flex size-14 flex-none items-center justify-center rounded-tile text-[10px] text-[#6B5A3E]"
		style="background: {produk.fotoWarna}"
		aria-hidden="true">[FOTO]</span
	>
	<span class="flex min-w-0 flex-1 flex-col gap-[3px]">
		<span class="truncate text-[15px] font-semibold">{produk.nama}</span>
		{#if produk.hargaLabel}
			<span class="text-sm font-bold">{produk.hargaLabel}</span>
		{:else if produk.subjudul}
			<span class="text-[13px] text-ink-muted">{produk.subjudul}</span>
		{/if}
	</span>
	<span class="flex flex-none flex-col items-end gap-1">
		<Chip kondisi={produk.stokKondisi}>{produk.stokLabel}</Chip>
		<span
			class={[
				'text-[11px]',
				produk.statusPenting ? 'font-semibold text-kunyit-700' : 'text-ink-muted'
			]}>{produk.status}</span
		>
	</span>
</a>
