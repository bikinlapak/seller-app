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
	 *
	 * `chat` screens are exactly one viewport tall: the header and the
	 * composer stay put and only the message list scrolls. Without a fixed
	 * height the frame grows with a long thread and the composer scrolls away
	 * below the last message. Other screens scroll as a normal page.
	 */
	let {
		children,
		bar = true,
		chat = false
	}: { children: Snippet; bar?: boolean; chat?: boolean } = $props();
</script>

<div
	class={[
		'mx-auto flex w-full max-w-[430px] flex-col bg-cream',
		chat ? 'h-dvh overflow-hidden' : 'min-h-dvh'
	]}
>
	{@render children()}
	{#if bar}
		<BottomNav />
	{/if}
</div>
