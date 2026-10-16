<script lang="ts">
	import { page } from '$app/state';
	import AppShell from '#lib/components/AppShell.svelte';

	let { children } = $props();

	/*
	 * Thread memakai komposer sebagai penutup halaman, jadi bar bawah
	 * disembunyikan di sana — sama seperti artboard B1–B9.
	 */
	const bar = $derived(!page.url.pathname.startsWith('/asisten/'));
</script>

<AppShell {bar}>
	{@render children()}
</AppShell>
