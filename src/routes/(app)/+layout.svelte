<script lang="ts">
	import { page } from '$app/state';
	import AppShell from '#lib/components/AppShell.svelte';

	let { children } = $props();

	/*
	 * A thread uses the composer to close the page, so the bottom bar is
	 * hidden there — the same as artboards B1–B9.
	 */
	const bar = $derived(!page.url.pathname.startsWith('/assistant/'));
</script>

<AppShell {bar}>
	{@render children()}
</AppShell>
