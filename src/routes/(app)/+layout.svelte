<script lang="ts">
	import { page } from '$app/state';
	import AppShell from '#lib/components/AppShell.svelte';

	let { children } = $props();

	/*
	 * A thread uses the composer to close the page, so the bottom bar is
	 * hidden there — the same as artboards B1–B9.
	 */
	const bar = $derived(!page.url.pathname.startsWith('/assistant/'));
	// The assistant home and every thread end in the composer: keep it pinned.
	const chat = $derived(
		page.url.pathname === '/assistant' || page.url.pathname.startsWith('/assistant/')
	);
</script>

<AppShell {bar} {chat}>
	{@render children()}
</AppShell>
