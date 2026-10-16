<script lang="ts">
	/*
	 * C1 · Kelola toko. Belum didalami: rancangannya ada di artboard Toko,
	 * tapi jalur demo tidak melewatinya. Pintasan ke chat sudah jalan, karena di
	 * aplikasi ini mengubah toko memang dikerjakan lewat percakapan.
	 */
</script>

<svelte:head><title>Toko · bikinlapak</title></svelte:head>

<header class="px-4 pt-4 pb-2">
	<h1 class="m-0 font-display text-[26px] font-normal text-pine-600">Toko</h1>
</header>

<main class="flex flex-1 flex-col gap-3 px-4 pb-3">
	<section class="flex flex-col gap-2 rounded-row border border-line bg-surface p-3.5">
		<h2 class="label-section m-0 text-ink-muted">Jam buka</h2>
		<p class="m-0 text-sm">07.00 – 21.00, setiap hari</p>
		<a
			href="/asisten/toko"
			class="flex min-h-11 items-center justify-center rounded-action border border-pine-600 text-sm font-bold text-pine-600"
			>Ubah lewat chat</a
		>
	</section>

	<p class="m-0 text-sm text-ink-faint">
		Halaman toko online dan pengiriman menyusul — lihat docs/plan/05-phases.md.
	</p>
</main>
