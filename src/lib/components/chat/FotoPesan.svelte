<script lang="ts">
	import type { KotakDeteksi } from '#lib/types/api.js';

	/*
	 * Foto yang dikirim penjual, dengan kotak hasil deteksi di atasnya.
	 * Kotak solid hijau = model yakin; putus-putus kunyit = belum yakin, dan
	 * barangnya muncul di blok "Belum yakin" pada kartu sisa.
	 *
	 * Posisi kotak dalam persen, jadi tidak tergantung lebar layar.
	 */
	let { label, kotak }: { label: string; kotak: KotakDeteksi[] } = $props();
</script>

<figure
	class="bubble-staff relative m-0 h-[150px] w-[220px] self-end overflow-hidden bg-foto-dasar"
>
	{#each kotak as k, i (i)}
		<span
			class={[
				'absolute rounded-md',
				k.yakin ? 'border-2 border-kotak-yakin' : 'border-2 border-dashed border-kunyit-400'
			]}
			style="left: {k.x}%; top: {k.y}%; width: {k.w}%; height: {k.h}%"
		></span>
	{/each}
	<figcaption class="absolute inset-x-0 bottom-2 text-center text-[11px] text-[#D9CDBB]">
		{label}
	</figcaption>
</figure>
