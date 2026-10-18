<script lang="ts">
	import AttentionList from '#lib/components/AttentionList.svelte';
	import ChatHeader from '#lib/components/ChatHeader.svelte';
	import Composer from '#lib/components/Composer.svelte';
	import QuickCommands from '#lib/components/QuickCommands.svelte';

	let { data, form } = $props();
</script>

<svelte:head><title>Shop Assistant · bikinlapak</title></svelte:head>

{#if data.home}
	<ChatHeader shop={data.home.shop} settingsHref="/me" />

	<main class="flex flex-1 flex-col gap-3 px-4 py-3.5">
		<h1 class="m-0 font-display text-2xl font-normal text-pine-600">{data.home.shop.greeting}</h1>
		<AttentionList attention={data.home.attention} />
		<QuickCommands commands={data.home.commands} />
		<a
			href="/reports"
			class="flex min-h-11 items-center justify-between rounded-row border border-line bg-surface px-3.5 text-sm font-semibold text-ink"
			>Impact and waste report <span aria-hidden="true" class="text-ink-muted">›</span></a
		>
	</main>

	{#if form?.message}
		<p role="alert" class="mx-4 mb-2 rounded-field bg-danger-bg px-3 py-2 text-sm text-danger">
			{form.message}
		</p>
	{/if}

	<Composer cameraHref="/assistant/waste" />
{:else}
	<main class="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
		<p class="m-0 text-ink-muted">The assistant cannot be reached.</p>
		<a
			href="/assistant"
			class="flex min-h-11 items-center rounded-field bg-pine-600 px-4 font-semibold text-white"
			>Try again</a
		>
	</main>
{/if}
