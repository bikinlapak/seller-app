<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head><title>{page.status} · bikinlapak</title></svelte:head>

<main
	class="mx-auto flex min-h-dvh max-w-[430px] flex-col items-center justify-center gap-3 bg-cream px-6 text-center"
>
	<p class="m-0 font-display text-[44px] leading-none text-pine-600">{page.status}</p>
	<h1 class="m-0 text-lg font-bold">
		{page.status === 404 ? "This page doesn't exist" : 'Something went wrong'}
	</h1>
	<a
		href="/assistant"
		class="mt-2 flex min-h-11 items-center rounded-field bg-pine-600 px-4 text-sm font-bold text-white"
		>Back to the assistant</a
	>
</main>
