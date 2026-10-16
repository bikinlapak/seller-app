<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import ProdukRow from '#lib/components/ProdukRow.svelte';

	let { data } = $props();

	let kategori = $state('Semua');
	let cari = $state('');

	const terlihat = $derived(
		(data.daftar?.produk ?? []).filter(
			(p) =>
				(kategori === 'Semua' || p.kategori === kategori) &&
				p.nama.toLowerCase().includes(cari.toLowerCase())
		)
	);
</script>

<svelte:head><title>Produk · bikinlapak</title></svelte:head>

<header class="flex flex-col gap-2.5 px-4 pt-4 pb-2">
	<div class="flex items-baseline justify-between gap-2">
		<h1 class="m-0 font-display text-[26px] font-normal text-pine-600">Produk</h1>
		<span class="flex-none text-[13px] text-ink-muted">{data.daftar?.total ?? 0} produk</span>
	</div>

	<label
		class="flex min-h-[46px] items-center gap-2 rounded-field border border-line bg-surface px-3.5"
	>
		<span class="flex-none text-ink-muted"><Icon nama="cari" ukuran={18} /></span>
		<span class="sr-only">Cari produk</span>
		<input
			type="search"
			bind:value={cari}
			placeholder="Cari produk"
			class="min-w-0 flex-1 border-0 bg-transparent p-0 text-[15px] text-ink focus:ring-0"
		/>
	</label>

	<div role="tablist" aria-label="Kategori" class="flex gap-1.5 overflow-x-auto">
		{#each data.daftar?.kategori ?? [] as k (k)}
			<button
				role="tab"
				aria-selected={kategori === k}
				onclick={() => (kategori = k)}
				class={[
					'min-h-9 flex-none rounded-full px-3 text-[13px]',
					kategori === k
						? 'bg-pine-600 font-bold text-white'
						: 'border border-line-strong bg-surface text-ink'
				]}>{k}</button
			>
		{/each}
	</div>
</header>

<main class="flex flex-1 flex-col gap-2 px-4 pt-1 pb-3">
	{#each terlihat as p (p.id)}
		<ProdukRow produk={p} />
	{:else}
		<p class="py-8 text-center text-ink-faint">Tidak ada produk yang cocok.</p>
	{/each}
</main>

<!-- Aksi mengapung: "dari foto" lewat chat, atau form biasa. -->
<div class="sticky bottom-0 flex flex-col items-end gap-2 px-4 pb-2">
	<a
		href="/asisten/produk"
		class="flex min-h-11 items-center gap-2 rounded-full border border-line-strong bg-surface px-3.5 text-sm font-semibold text-ink"
	>
		<Icon nama="kamera" ukuran={18} />Dari foto (AI)
	</a>
	<a
		href="/produk/baru"
		class="flex min-h-[52px] items-center gap-2 rounded-full bg-kunyit-400 px-4.5 text-[15px] font-bold text-kunyit-900"
	>
		<Icon nama="tambah" ukuran={20} tebal={2.5} />Tambah produk
	</a>
</div>
