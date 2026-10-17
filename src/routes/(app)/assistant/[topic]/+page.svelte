<script lang="ts">
	import ChatHeader from '#lib/components/ChatHeader.svelte';
	import Composer from '#lib/components/Composer.svelte';
	import Thread from '#lib/components/chat/Thread.svelte';
	import type { Message } from '#lib/types/api.js';

	let { data, form } = $props();

	/*
	 * Messages from the form action are appended to the stored history. SSE
	 * will fill this in later; until that channel exists, the action result is
	 * enough to make approve → result card work end to end.
	 */
	const messages = $derived<Message[]>([...data.thread.messages, ...(form?.added ?? [])]);

	/*
	 * Action tokens are single use: once a suggestion has been handled its
	 * buttons must not be offered again — a second tap is certain to be
	 * refused by the backend (409 token_used).
	 *
	 * A thread holds one suggestion today, so a page-level flag is accurate.
	 * If a thread can ever carry several, this has to become per-suggestion
	 * (keyed by the suggestion id on the result card).
	 */
	const done = $derived((form?.added ?? []).some((m) => m.type === 'result_card'));
</script>

<svelte:head><title>{data.thread.topic} · Shop Assistant</title></svelte:head>

<ChatHeader shop={data.thread.shop} back="/assistant" />

<Thread {messages} source={data.thread.source} {done} />

{#if form?.message}
	<p role="alert" class="mx-4 mb-2 rounded-field bg-danger-bg px-3 py-2 text-sm text-danger">
		{form.message}
	</p>
{/if}

<Composer cameraActive={data.thread.source === 'Gemini vision'} />
