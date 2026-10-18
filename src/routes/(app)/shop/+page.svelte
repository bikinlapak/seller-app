<script lang="ts">
	/*
	 * C1 · Shop settings. Not built out: the design exists in the Shop
	 * artboard, but the demo path does not go through it. The shortcut into
	 * chat works, because in this app changing the shop is a conversation.
	 */
</script>

<svelte:head><title>Shop · bikinlapak</title></svelte:head>

<header class="px-4 pt-4 pb-2">
	<h1 class="m-0 font-display text-[26px] font-normal text-pine-600">Shop</h1>
</header>

<main class="flex flex-1 flex-col gap-3 px-4 pb-3">
	<section class="flex flex-col gap-2 rounded-row border border-line bg-surface p-3.5">
		<h2 class="label-section m-0 text-ink-muted">Opening hours</h2>
		<p class="m-0 text-sm">07.00 – 21.00, every day</p>
		<a
			href="/assistant/shop"
			class="flex min-h-11 items-center justify-center rounded-action border border-pine-600 text-sm font-bold text-pine-600"
			>Change via chat</a
		>
	</section>

	<a
		href="/reports"
		class="flex min-h-11 items-center justify-between rounded-row border border-line bg-surface px-3.5 text-sm font-semibold text-ink"
		>Impact and waste report <span aria-hidden="true" class="text-ink-muted">›</span></a
	>
</main>
