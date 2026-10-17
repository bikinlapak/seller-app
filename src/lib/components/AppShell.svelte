<script lang="ts">
	import type { Snippet } from 'svelte';
	import BottomNav from '#lib/components/BottomNav.svelte';

	/*
	 * The app frame. The design is a 390x844 phone, so the width is capped and
	 * centred on a large screen — desktop gets the same app, not a different
	 * layout.
	 *
	 * `bar` can be turned off on thread screens, which use the composer to
	 * close the page, exactly as the canvas does.
	 */
	let { children, bar = true }: { children: Snippet; bar?: boolean } = $props();
</script>

<div class="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-cream">
	{@render children()}
	{#if bar}
		<BottomNav />
	{/if}
</div>
