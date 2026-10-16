<script lang="ts">
	/*
	 * Ikon garis dari kanvas desain: kotak 24, stroke 2, ujung bulat.
	 * Jangan pakai emoji sebagai ikon — semua artboard memakai SVG inline.
	 */
	export type NamaIkon =
		| 'asisten'
		| 'produk'
		| 'stok'
		| 'toko'
		| 'saya'
		| 'pengaturan'
		| 'kedaluwarsa'
		| 'donasi'
		| 'kanan'
		| 'kiri'
		| 'tambah'
		| 'kamera'
		| 'kirim'
		| 'centang'
		| 'cari';

	let {
		nama,
		ukuran = 22,
		tebal = 2,
		label
	}: { nama: NamaIkon; ukuran?: number; tebal?: number; label?: string } = $props();
</script>

<svg
	width={ukuran}
	height={ukuran}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width={tebal}
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden={label ? undefined : 'true'}
	role={label ? 'img' : undefined}
	aria-label={label}
>
	{#if nama === 'asisten'}
		<path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z" />
	{:else if nama === 'produk'}
		<path d="M20 12l-8 8-9-9V3h8z" />
		<circle cx="7.5" cy="7.5" r="1.5" />
	{:else if nama === 'stok'}
		<path d="M21 8l-9-5-9 5 9 5 9-5z" />
		<path d="M3 8v8l9 5 9-5V8" />
		<path d="M12 13v8" />
	{:else if nama === 'toko'}
		<path d="M3 9l1.5-5h15L21 9" />
		<path d="M4 9v11h16V9" />
		<path d="M9 20v-6h6v6" />
	{:else if nama === 'saya'}
		<circle cx="12" cy="8" r="4" />
		<path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
	{:else if nama === 'pengaturan'}
		<path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
		<circle cx="16" cy="7" r="2" />
		<circle cx="10" cy="17" r="2" />
	{:else if nama === 'kedaluwarsa'}
		<circle cx="12" cy="12" r="9" />
		<path d="M12 7v5l3 2" />
	{:else if nama === 'donasi'}
		<path d="M12 21s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.5-7 10-7 10z" />
	{:else if nama === 'kanan'}
		<path d="M9 6l6 6-6 6" />
	{:else if nama === 'kiri'}
		<path d="M15 18l-6-6 6-6" />
	{:else if nama === 'tambah'}
		<path d="M12 5v14M5 12h14" />
	{:else if nama === 'kamera'}
		<path d="M4 8h3l2-3h6l2 3h3v11H4z" />
		<circle cx="12" cy="13" r="3.5" />
	{:else if nama === 'kirim'}
		<path d="M22 2L11 13" />
		<path d="M22 2l-7 20-4-9-9-4 20-7z" />
	{:else if nama === 'centang'}
		<path d="M20 6L9 17l-5-5" />
	{:else if nama === 'cari'}
		<circle cx="11" cy="11" r="7" />
		<path d="M20 20l-3.5-3.5" />
	{/if}
</svg>
