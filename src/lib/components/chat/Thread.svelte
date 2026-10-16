<script lang="ts">
	import FotoPesan from '#lib/components/chat/FotoPesan.svelte';
	import Gelembung from '#lib/components/chat/Gelembung.svelte';
	import KartuHasil from '#lib/components/chat/KartuHasil.svelte';
	import KartuSaran from '#lib/components/chat/KartuSaran.svelte';
	import KartuSisa from '#lib/components/chat/KartuSisa.svelte';
	import MetaAgen from '#lib/components/chat/MetaAgen.svelte';
	import TandaSistem from '#lib/components/chat/TandaSistem.svelte';
	import type { Pesan } from '#lib/types/api.js';

	/*
	 * Daftar pesan. Satu switch untuk semua tipe kartu, jadi backend bisa
	 * menambah tipe baru tanpa mengubah routing di sini — tipe yang belum
	 * dikenal jatuh ke teks biasa, bukan melempar dan mematikan thread.
	 *
	 * aria-live polite: kartu yang masuk diumumkan sekali, tidak dibaca ulang.
	 */
	let {
		pesan,
		sumber,
		selesai = false
	}: { pesan: Pesan[]; sumber?: string | null; selesai?: boolean } = $props();
</script>

<div
	aria-live="polite"
	aria-label="Percakapan dengan Asisten Lapak"
	class="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-3"
>
	{#each pesan as p (p.id)}
		{#if p.penulis === 'agent'}
			<MetaAgen waktu={p.waktu} sumber={p.tipe === 'kartu_sisa' ? sumber : null} />
		{/if}

		{#if p.penulis === 'sistem'}
			<TandaSistem teks={p.teks} />
		{:else if p.tipe === 'foto'}
			<FotoPesan label={p.fotoLabel} kotak={p.kotak} />
		{:else if p.tipe === 'kartu_saran'}
			<KartuSaran kartu={p.kartu} {selesai} />
		{:else if p.tipe === 'kartu_hasil'}
			<KartuHasil kartu={p.kartu} />
		{:else if p.tipe === 'kartu_sisa'}
			<KartuSisa kartu={p.kartu} />
		{:else if p.tipe === 'teks'}
			<Gelembung penulis={p.penulis}>
				{p.teks}
				{#if p.penulis === 'agent' && p.aksi}
					<div class="mt-2 flex gap-2">
						{#each p.aksi as a (a.label)}
							{#if a.utama && a.token}
								<form method="POST" action="?/aksi" class="flex-1">
									<input type="hidden" name="token" value={a.token} />
									<input type="hidden" name="jumlah" value="9" />
									<input type="hidden" name="satuan" value="kg" />
									<input type="hidden" name="idem" value={a.token} />
									<button
										type="submit"
										class="min-h-10 w-full rounded-action bg-pine-600 text-sm font-bold text-white"
										>{a.label}</button
									>
								</form>
							{:else}
								<button
									type="button"
									class="min-h-10 flex-1 rounded-action border border-line-strong bg-surface text-sm font-semibold text-ink"
									>{a.label}</button
								>
							{/if}
						{/each}
					</div>
				{/if}
			</Gelembung>
		{:else}
			<!-- Tipe kartu yang belum dikenal: jangan sampai thread mati. -->
			<Gelembung penulis="agent">Pesan ini belum bisa ditampilkan di versi aplikasi ini.</Gelembung>
		{/if}
	{/each}
</div>
