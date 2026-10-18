<script lang="ts">
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/state';
	import ChatHeader from '#lib/components/ChatHeader.svelte';
	import Composer from '#lib/components/Composer.svelte';
	import Thread from '#lib/components/chat/Thread.svelte';

	let { data, form } = $props();

	/*
	 * Live updates (FR-25): seller-svc announces "this thread changed" over
	 * SSE and the page re-runs its load. Every message comes from the stored
	 * thread — nothing is appended client-side — so what the merchant sees is
	 * exactly what was recorded, on any device.
	 */
	onMount(() => {
		if (typeof EventSource === 'undefined') return;
		const es = new EventSource(`${page.url.pathname}/stream`);
		const refresh = () => invalidate('app:thread');
		es.addEventListener('change', refresh);
		es.addEventListener('resync', refresh);
		return () => es.close();
	});

	const isWaste = $derived(page.params.topic === 'waste');
</script>

<svelte:head><title>{data.thread.topic} · Shop Assistant</title></svelte:head>

<ChatHeader shop={data.thread.shop} back="/assistant" />

<Thread
	messages={data.thread.messages}
	source={data.thread.source}
	reported={form && 'reported' in form ? form.reported : null}
/>

{#if form?.message}
	<p role="alert" class="mx-4 mb-2 rounded-field bg-danger-bg px-3 py-2 text-sm text-danger">
		{form.message}
	</p>
{/if}

<Composer upload={isWaste} cameraHref={isWaste ? undefined : '/assistant/waste'} />
