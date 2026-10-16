<script lang="ts">
	import { enhance } from '$app/forms';
	import QtyStepper from '#lib/components/QtyStepper.svelte';
	import type { KartuSaran } from '#lib/types/api.js';

	let { kartu, selesai = false }: { kartu: KartuSaran; selesai?: boolean } = $props();

	/*
	 * "Ubah jumlah" membuka stepper; jumlah awal = yang diusulkan asisten.
	 * Thread me-render tiap kartu dengan key id pesan, jadi kartu baru = instansi
	 * baru: mengambil nilai awal dari prop memang yang diinginkan di sini.
	 */
	let ubahJumlah = $state(false);
	// svelte-ignore state_referenced_locally
	let jumlah = $state(kartu.jumlah);

	/*
	 * Satu kunci idempoten per instansi form: ketukan ganda atau percobaan ulang
	 * di koneksi buruk tidak boleh membuat dua PO.
	 */
	const idemKey = crypto.randomUUID();

	let mengirim = $state(false);
</script>

<article class="bubble-agent flex flex-col gap-2 border border-line bg-surface px-3.5 py-3">
	<div class="flex items-center justify-between">
		<span class="label-section text-pine-600">{kartu.label}</span>
		<span class="text-xs text-ink-muted">{kartu.keyakinan}</span>
	</div>

	<h2 class="m-0 text-base font-bold">{kartu.judul}</h2>
	<p class="m-0 text-[13px] leading-relaxed text-ink-label">{kartu.alasan}</p>

	<form
		method="POST"
		action="?/aksi"
		use:enhance={() => {
			mengirim = true;
			return async ({ update }) => {
				mengirim = false;
				// `reset: false`: tanpa ini SvelteKit mengosongkan form setelah
				// kirim, dan `bind:value` pada input number menulis balik nilai
				// kosong ke `jumlah` — stepper jadi hilang angkanya.
				await update({ reset: false });
			};
		}}
		class="flex flex-col gap-2"
	>
		<input type="hidden" name="token" value={kartu.token} />
		<input type="hidden" name="satuan" value={kartu.satuan} />
		<input type="hidden" name="idem" value={idemKey} />

		{#if selesai}
			<p class="m-0 text-[13px] text-ink-muted">Saran ini sudah diproses.</p>
		{:else if ubahJumlah}
			<QtyStepper bind:nilai={jumlah} max={kartu.jumlah} satuan={kartu.satuan} />
			<div class="flex gap-2">
				<button
					type="submit"
					disabled={mengirim}
					class="min-h-[42px] flex-1 rounded-action bg-pine-600 text-sm font-bold text-white disabled:opacity-60"
					>{mengirim ? 'Mengirim…' : `Pesan ${jumlah} ${kartu.satuan}`}</button
				>
				<button
					type="button"
					onclick={() => {
						ubahJumlah = false;
						jumlah = kartu.jumlah;
					}}
					class="min-h-[42px] rounded-action border border-line-strong bg-surface px-3 text-sm font-semibold text-ink"
					>Batal</button
				>
			</div>
		{:else}
			<input type="hidden" name="jumlah" value={kartu.jumlah} />
			<div class="flex gap-2">
				<button
					type="submit"
					disabled={mengirim}
					class="min-h-[42px] flex-1 rounded-action bg-pine-600 text-sm font-bold text-white disabled:opacity-60"
					>{mengirim ? 'Mengirim…' : 'Setujui'}</button
				>
				<button
					type="button"
					onclick={() => (ubahJumlah = true)}
					class="min-h-[42px] flex-1 rounded-action border border-pine-600 bg-surface text-sm font-bold text-pine-600"
					>Ubah jumlah</button
				>
				<button
					type="submit"
					formaction="?/tolak"
					class="min-h-[42px] rounded-action px-2.5 text-sm font-semibold text-ink-muted"
					>Tolak</button
				>
			</div>
		{/if}
	</form>
</article>
