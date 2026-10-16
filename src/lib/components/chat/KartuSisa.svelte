<script lang="ts">
	import type { BarangSisa, KartuSisa, Kondisi } from '#lib/types/api.js';

	/*
	 * Kartu hasil AI vision: barang yang terdeteksi, pilihan tujuan per barang,
	 * lalu blok "belum yakin" untuk yang di bawah ambang keyakinan.
	 *
	 * Aturan dari rancangan: tujuan difilter kondisi barang. Yang lewat tanggal
	 * tidak boleh dijual atau didonasikan, dan "Buang" selalu pilihan eksplisit —
	 * tidak pernah terpilih otomatis.
	 */
	let { kartu }: { kartu: KartuSisa } = $props();

	/*
	 * Pilihan tujuan per barang; awalnya yang disarankan asisten, lalu milik
	 * penjual. Kartu di-key per id pesan, jadi nilai awal dari prop sudah benar.
	 */
	// svelte-ignore state_referenced_locally
	let pilihan = $state(
		Object.fromEntries(
			kartu.barang.map((b) => [b.id, b.tujuan.find((t) => t.dipilih)?.id ?? b.tujuan[0]?.id])
		)
	);

	const warnaKondisi: Record<Kondisi, string> = {
		aman: 'text-sukses',
		hampir: 'text-kunyit-700',
		lewat: 'text-bahaya'
	};

	function label(b: BarangSisa) {
		return `${b.nama} × ${b.jumlah}`;
	}
</script>

<article class="bubble-agent overflow-hidden border border-line bg-surface">
	<div class="flex items-center justify-between border-b border-line-soft px-3.5 py-2.5">
		<h2 class="label-section m-0 text-pine-600">{kartu.label}</h2>
		<span class="text-xs text-ink-muted">{kartu.nilai}</span>
	</div>

	{#each kartu.barang as b (b.id)}
		<div class="flex flex-col gap-1.5 border-b border-line-soft px-3.5 py-2.5">
			<div class="flex justify-between gap-2">
				<span class="text-sm font-semibold">{label(b)}</span>
				<span class={['flex-none text-xs font-semibold', warnaKondisi[b.kondisi]]}
					>{b.kondisiLabel}</span
				>
			</div>

			<fieldset class="m-0 flex flex-wrap gap-1.5 border-0 p-0">
				<legend class="sr-only">Tujuan untuk {label(b)}</legend>
				{#each b.tujuan as t (t.id)}
					{@const dipilih = pilihan[b.id] === t.id}
					<label
						class={[
							'flex min-h-[34px] cursor-pointer items-center rounded-full px-3 text-[13px]',
							dipilih
								? 'border-[1.5px] border-pine-600 bg-pine-100 font-bold text-pine-800'
								: 'border border-line-strong bg-surface text-ink'
						]}
					>
						<input
							type="radio"
							name="tujuan-{b.id}"
							value={t.id}
							checked={dipilih}
							onchange={() => (pilihan[b.id] = t.id)}
							class="sr-only"
						/>
						{t.label}
					</label>
				{/each}
			</fieldset>

			{#if b.peringatan}
				<p class="m-0 text-xs text-ink-muted">{b.peringatan}</p>
			{/if}
		</div>
	{/each}

	{#if kartu.ragu}
		<div class="flex flex-col gap-1.5 bg-surface-warn px-3.5 py-2.5">
			<p class="m-0 text-sm font-semibold text-kunyit-700">
				Belum yakin ({kartu.ragu.keyakinan}%): ini produk apa?
			</p>
			<div class="flex flex-wrap gap-1.5">
				{#each kartu.ragu.kandidat as k (k.id)}
					<button
						type="button"
						class="min-h-[34px] rounded-full border border-pine-600 bg-surface px-3 text-[13px] font-semibold text-pine-600"
						>{k.nama}</button
					>
				{/each}
				<button
					type="button"
					class="min-h-[34px] rounded-full border border-line-strong bg-surface px-3 text-[13px] font-semibold text-ink-muted"
					>Bukan produk toko</button
				>
			</div>
		</div>
	{/if}

	<div class="flex flex-col gap-1.5 px-3.5 pt-2.5 pb-3">
		<a
			href="/asisten/donasi"
			class="flex min-h-[46px] items-center justify-center rounded-field bg-pine-600 text-[15px] font-bold text-white"
			>Catat &amp; lanjut donasi</a
		>
		<p class="m-0 text-center text-xs text-ink-muted">{kartu.catatan}</p>
	</div>
</article>
