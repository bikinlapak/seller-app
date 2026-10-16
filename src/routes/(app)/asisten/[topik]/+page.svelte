<script lang="ts">
	import ChatHeader from '#lib/components/ChatHeader.svelte';
	import Composer from '#lib/components/Composer.svelte';
	import Thread from '#lib/components/chat/Thread.svelte';
	import type { Pesan } from '#lib/types/api.js';

	let { data, form } = $props();

	/*
	 * Pesan dari form action ditempel di belakang riwayat. Nantinya SSE yang
	 * mengisi ini; sampai kanal itu ada, hasil action sudah cukup untuk membuat
	 * jalur setujui → kartu hasil berjalan utuh.
	 */
	const pesan = $derived<Pesan[]>([...data.thread.pesan, ...(form?.tambahan ?? [])]);

	/*
	 * Token aksi sekali pakai: begitu saran diproses, tombolnya tidak boleh
	 * ditawarkan lagi — ketukan kedua pasti ditolak backend (409 token_used).
	 *
	 * Satu thread hari ini hanya punya satu saran, jadi penanda setingkat
	 * halaman sudah tepat. Kalau nanti satu thread bisa memuat beberapa saran,
	 * ini harus per-saran (lewat id saran di kartu hasil).
	 */
	const selesai = $derived((form?.tambahan ?? []).some((p) => p.tipe === 'kartu_hasil'));
</script>

<svelte:head><title>{data.thread.topik} · Asisten Lapak</title></svelte:head>

<ChatHeader toko={data.thread.toko} kembali="/asisten" />

<Thread {pesan} sumber={data.thread.sumber} {selesai} />

{#if form?.pesan}
	<p role="alert" class="mx-4 mb-2 rounded-field bg-bahaya-bg px-3 py-2 text-sm text-bahaya">
		{form.pesan}
	</p>
{/if}

<Composer kameraAktif={data.thread.sumber === 'Gemini vision'} />
