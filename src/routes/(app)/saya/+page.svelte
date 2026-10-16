<script lang="ts">
	import ChatHeader from '#lib/components/ChatHeader.svelte';

	/*
	 * Pengaturan AI (artboard C6). Layar ini yang membuat asistennya terasa
	 * milik penjual: mode, model per tugas, seberapa mandiri, dan batas biaya.
	 *
	 * "Prediksi stok" sengaja ditandai sistem — angkanya dari TimesFM lewat
	 * BigQuery, bukan dari chat, dan itu dikatakan apa adanya di layar.
	 */
	let { data } = $props();

	// Nilai awal dari server; sesudah itu pilihan penjual yang menang.
	// svelte-ignore state_referenced_locally
	let mode = $state(data.pengaturan?.modeDipilih ?? '');
</script>

<svelte:head><title>Pengaturan AI · bikinlapak</title></svelte:head>

<ChatHeader kembali="/asisten" judul="Pengaturan AI" />

{#if data.pengaturan}
	{@const p = data.pengaturan}
	<main class="flex flex-1 flex-col gap-3 px-4 py-3">
		<section class="flex flex-col gap-2">
			<h2 class="label-section m-0 text-ink-muted">Mode asisten</h2>
			<div role="radiogroup" aria-label="Mode asisten" class="grid grid-cols-3 gap-2">
				{#each p.mode as m (m.id)}
					<button
						role="radio"
						aria-checked={mode === m.id}
						onclick={() => (mode = m.id)}
						class={[
							'flex min-h-16 flex-col items-start justify-center gap-0.5 rounded-field px-2.5 py-2 text-left',
							mode === m.id
								? 'border-[1.5px] border-pine-600 bg-pine-100'
								: 'border border-line bg-surface'
						]}
					>
						<span class="text-sm font-bold">{m.label}</span>
						<span class="text-[11px] leading-tight text-ink-muted">{m.catatan}</span>
					</button>
				{/each}
			</div>
		</section>

		<section class="rounded-row border border-line bg-surface px-3.5 py-1">
			<h2 class="label-section m-0 pt-2.5 pb-0.5 text-ink-muted">Model per tugas</h2>
			{#each p.model as m (m.tugas)}
				<div class="flex min-h-[46px] items-center justify-between gap-2 border-t border-line-soft">
					<span class="flex flex-col gap-px text-sm">
						{m.tugas}
						{#if m.catatan}<span class="text-[11px] text-ink-muted">{m.catatan}</span>{/if}
					</span>
					<span
						class={[
							'flex-none rounded-full px-2.5 py-[3px] text-xs font-bold',
							m.sistem ? 'bg-chip text-ink-label' : 'bg-pine-100 text-pine-800'
						]}>{m.nama}</span
					>
				</div>
			{/each}
		</section>

		<section class="rounded-row border border-line bg-surface px-3.5 py-1">
			<h2 class="label-section m-0 pt-2.5 pb-0.5 text-ink-muted">Seberapa mandiri</h2>
			{#each p.otonomi as o (o.id)}
				<label
					class="flex min-h-[52px] items-center justify-between gap-2.5 border-t border-line-soft text-sm"
				>
					<span class="flex flex-col gap-px">
						{o.label}
						{#if o.catatan}<span class="text-[11px] text-ink-muted">{o.catatan}</span>{/if}
					</span>
					<input
						type="checkbox"
						checked={o.aktif}
						class="size-[22px] flex-none rounded text-pine-600 focus:ring-pine-600"
					/>
				</label>
			{/each}
			<div class="flex min-h-[46px] items-center justify-between gap-2 border-t border-line-soft">
				<label for="bahasa" class="text-sm">Bahasa &amp; gaya</label>
				<select
					id="bahasa"
					class="min-h-9 rounded-lg border border-line-strong bg-cream py-0 pr-7 pl-2 text-[13px] font-semibold text-ink"
				>
					{#each p.bahasa.pilihan as b (b)}
						<option selected={b === p.bahasa.dipilih}>{b}</option>
					{/each}
				</select>
			</div>
		</section>

		<section class="flex flex-col gap-1.5 rounded-row border border-line bg-surface px-3.5 py-3">
			<div class="flex justify-between gap-2 text-sm">
				<span class="font-semibold">Batas biaya AI</span>
				<span class="flex-none font-bold">{p.biaya.batasLabel}</span>
			</div>
			<div
				class="h-1.5 overflow-hidden rounded-[3px] bg-line-soft"
				role="img"
				aria-label="Terpakai {p.biaya.terpakaiPersen}%"
			>
				<div
					class="h-1.5 rounded-[3px] bg-kunyit-400"
					style="width: {p.biaya.terpakaiPersen}%"
				></div>
			</div>
			<p class="m-0 text-xs text-ink-muted">{p.biaya.catatan}</p>
		</section>

		<section class="flex flex-col gap-1 text-xs leading-relaxed text-ink-label">
			<p class="m-0">{p.privasi}</p>
			<span class="flex gap-4">
				<a href="/saya/riwayat" class="font-bold">Hapus riwayat chat</a>
				<a href="/saya/unduh" class="font-bold">Unduh data saya</a>
			</span>
		</section>
	</main>
{:else}
	<main class="flex flex-1 items-center justify-center px-6">
		<p class="text-ink-muted">Pengaturan belum bisa dimuat.</p>
	</main>
{/if}
