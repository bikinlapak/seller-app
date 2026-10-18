<script lang="ts">
	import { page } from '$app/state';

	/*
	 * Errors inside the app keep the shell and the bottom bar, so the way
	 * back is one tap. Wording by status: a missing page is not an outage.
	 */
	const notFound = $derived(page.status === 404);
</script>

<svelte:head
	><title>{notFound ? 'Not found' : 'Something went wrong'} · bikinlapak</title></svelte:head
>

<main class="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
	<p class="m-0 font-display text-[44px] leading-none text-pine-600">{page.status}</p>
	<h1 class="m-0 text-lg font-bold">
		{notFound ? "This page doesn't exist" : 'Something went wrong'}
	</h1>
	<p class="m-0 max-w-[280px] text-sm text-ink-muted">
		{notFound
			? 'The link may be old, or the item was removed.'
			: (page.error?.message ?? 'Try again in a moment.')}
	</p>
	<div class="flex gap-2 pt-2">
		<a
			href="/assistant"
			class="flex min-h-11 items-center rounded-field bg-pine-600 px-4 text-sm font-bold text-white"
			>Back to the assistant</a
		>
		{#if !notFound}
			<a
				href={page.url.pathname}
				data-sveltekit-reload
				class="flex min-h-11 items-center rounded-field border border-line-strong px-4 text-sm font-semibold text-ink"
				>Try again</a
			>
		{/if}
	</div>
</main>
