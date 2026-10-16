<script lang="ts">
	import StokRow from '#lib/components/StokRow.svelte';

	let { data } = $props();

	const FILTER = ['Semua', 'Menipis', 'Kedaluwarsa', 'Pesanan PO'] as const;
	let filter = $state<(typeof FILTER)[number]>('Semua');

	const terlihat = $derived(
		(data.daftar?.baris ?? []).filter((b) => {
			if (filter === 'Menipis') return b.kondisi === 'lewat';
			if (filter === 'Kedaluwarsa') return b.kiri.toLowerCase().includes('kedaluwarsa');
			if (filter === 'Pesanan PO') return b.kanan.startsWith('PO-');
			return true;
		})
	);
</script>

<svelte:head><title>Stok · bikinlapak</title></svelte:head>

<header class="flex flex-col gap-3 px-4 pt-4 pb-2">
	<div class="flex items-center justify-between gap-2">
		<h1 class="m-0 font-display text-[26px] font-normal text-pine-600">Stok</h1>
		<button
			class="min-h-10 flex-none rounded-action border border-line-strong bg-surface px-3 text-[13px] font-semibold text-ink"
			>{data.daftar?.lokasi ?? 'Semua lokasi'}</button
		>
	</div>

	{#if data.daftar}
		<div class="grid grid-cols-3 gap-2">
			<div class="flex flex-col gap-0.5 rounded-field border border-line bg-surface p-2.5">
				<span class="text-lg font-bold">{data.daftar.ringkasan.nilai}</span>
				<span class="text-xs text-ink-muted">nilai stok</span>
			</div>
			<div class="flex flex-col gap-0.5 rounded-field bg-bahaya-bg p-2.5">
				<span class="text-lg font-bold text-bahaya-kuat">{data.daftar.ringkasan.hampirHabis}</span>
				<span class="text-xs text-bahaya-kuat">hampir habis</span>
			</div>
			<div class="flex flex-col gap-0.5 rounded-field bg-kunyit-100 p-2.5">
				<span class="text-lg font-bold text-kunyit-800"
					>{data.daftar.ringkasan.hampirKedaluwarsa}</span
				>
				<span class="text-xs text-kunyit-800">hampir kedaluwarsa</span>
			</div>
		</div>
	{/if}

	<div role="tablist" aria-label="Filter stok" class="flex gap-1.5 overflow-x-auto">
		{#each FILTER as f (f)}
			<button
				role="tab"
				aria-selected={filter === f}
				onclick={() => (filter = f)}
				class={[
					'min-h-9 flex-none rounded-full px-3 text-[13px]',
					filter === f
						? 'bg-pine-600 font-bold text-white'
						: 'border border-line-strong bg-surface text-ink'
				]}>{f}</button
			>
		{/each}
	</div>
</header>

<main class="flex flex-1 flex-col gap-2 px-4 pt-1 pb-3">
	{#each terlihat as b (b.id)}
		<StokRow baris={b} />
	{:else}
		<p class="py-8 text-center text-ink-faint">Tidak ada stok di filter ini.</p>
	{/each}
</main>

<div class="grid grid-cols-3 gap-2 px-4 pb-2">
	<button
		class="min-h-11 rounded-field border border-line-strong bg-surface text-[13px] font-semibold text-ink"
		>Terima barang</button
	>
	<button
		class="min-h-11 rounded-field border border-line-strong bg-surface text-[13px] font-semibold text-ink"
		>Stock opname</button
	>
	<a
		href="/asisten/pesan"
		class="flex min-h-11 items-center justify-center rounded-field bg-pine-600 text-[13px] font-bold text-white"
		>Buat PO</a
	>
</div>
