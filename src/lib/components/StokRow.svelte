<script lang="ts">
	import type { BarisStok, Kondisi } from '#lib/types/api.js';

	/*
	 * Baris stok dengan bar sisa. Warna bar mengikuti kondisi, tapi angka dan
	 * teks hari selalu ikut — bar sendiri bukan informasi.
	 */
	let { baris }: { baris: BarisStok } = $props();

	const warnaBar: Record<Kondisi, string> = {
		aman: 'bg-pine-600',
		hampir: 'bg-kunyit-400',
		lewat: 'bg-bahaya'
	};

	const warnaTeks: Record<Kondisi, string> = {
		aman: 'text-sukses',
		hampir: 'text-kunyit-700',
		lewat: 'text-bahaya'
	};
</script>

<a
	href="/stok/{baris.id}"
	class="flex flex-col gap-1.5 rounded-row border border-line bg-surface p-3 text-ink"
>
	<span class="flex justify-between gap-2">
		<span class="text-[15px] font-semibold">{baris.nama}</span>
		<span class="flex-none text-[15px] font-bold">{baris.jumlahLabel}</span>
	</span>

	<span
		class="block h-1.5 overflow-hidden rounded-[3px] bg-line-soft"
		role="img"
		aria-label="Sisa stok {baris.persen}%"
	>
		<span
			class={['block h-1.5 rounded-[3px]', warnaBar[baris.kondisi]]}
			style="width: {baris.persen}%"
		></span>
	</span>

	<span class="flex justify-between gap-2 text-xs">
		<span class={['font-semibold', warnaTeks[baris.kondisi]]}>{baris.kiri}</span>
		<span
			class={['flex-none', baris.kananPenting ? 'font-semibold text-pine-800' : 'text-ink-muted']}
			>{baris.kanan}</span
		>
	</span>
</a>
