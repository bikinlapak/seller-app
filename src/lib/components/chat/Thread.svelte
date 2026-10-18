<script lang="ts">
	import { enhance } from '$app/forms';
	import AgentMeta from '#lib/components/chat/AgentMeta.svelte';
	import Bubble from '#lib/components/chat/Bubble.svelte';
	import DonationCard from '#lib/components/chat/DonationCard.svelte';
	import PhotoMessage from '#lib/components/chat/PhotoMessage.svelte';
	import ResultCard from '#lib/components/chat/ResultCard.svelte';
	import SuggestionCard from '#lib/components/chat/SuggestionCard.svelte';
	import SystemNote from '#lib/components/chat/SystemNote.svelte';
	import WasteCard from '#lib/components/chat/WasteCard.svelte';
	import type { Message } from '#lib/types/api.js';

	/*
	 * The message list. One switch covers every card type, so the backend can
	 * add a new one without a routing change here — an unknown type falls back
	 * to plain text rather than throwing and killing the thread.
	 *
	 * Card state (open / approved / rejected) comes from the backend with each
	 * message, so a handled card stays handled after a reload or on another
	 * device.
	 *
	 * aria-live polite: an arriving card is announced once, not re-read.
	 */
	let {
		messages,
		source,
		reported = null
	}: { messages: Message[]; source?: string | null; reported?: string | null } = $props();

	let list: HTMLDivElement | undefined = $state();

	// Keep the newest message in view as the thread grows.
	$effect(() => {
		if (messages.length && list) {
			list.lastElementChild?.scrollIntoView({ block: 'end' });
		}
	});
</script>

<div
	bind:this={list}
	aria-live="polite"
	aria-label="Conversation with the Shop Assistant"
	class="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-3"
>
	{#each messages as message (message.id)}
		{#if message.author === 'agent'}
			<AgentMeta
				time={message.time}
				source={message.type === 'waste_card' ? source : null}
				messageId={message.id}
				reported={reported === message.id}
			/>
		{/if}

		{#if message.type === 'note'}
			<SystemNote text={message.text} />
		{:else if message.type === 'photo'}
			<PhotoMessage label={message.photoLabel} url={message.photoUrl} boxes={message.boxes} />
		{:else if message.type === 'suggestion_card'}
			<SuggestionCard card={message.card} />
		{:else if message.type === 'result_card'}
			<ResultCard card={message.card} />
		{:else if message.type === 'waste_card'}
			<WasteCard card={message.card} />
		{:else if message.type === 'donation_card'}
			<DonationCard card={message.card} />
		{:else if message.type === 'text'}
			<Bubble author={message.author}>
				{message.text}
				{#if message.author === 'agent' && message.actions}
					<div class="mt-2 flex gap-2">
						{#each message.actions as action (action.label)}
							{#if action.token}
								<form method="POST" action="?/act" use:enhance class="flex-1">
									<input type="hidden" name="token" value={action.token} />
									<input type="hidden" name="quantity" value={action.quantity ?? 1} />
									<input type="hidden" name="idempotencyKey" value={action.token.slice(-24)} />
									<button
										type="submit"
										class={[
											'min-h-10 w-full rounded-action px-2 text-sm',
											action.primary
												? 'bg-pine-600 font-bold text-white'
												: 'border border-line-strong bg-surface font-semibold text-ink'
										]}>{action.label}</button
									>
								</form>
							{:else}
								<span
									class="flex min-h-10 flex-1 items-center justify-center rounded-action border border-line-strong bg-surface text-sm font-semibold text-ink"
									>{action.label}</span
								>
							{/if}
						{/each}
					</div>
				{/if}
			</Bubble>
		{:else}
			<!-- A card type we do not know yet: do not kill the thread over it. -->
			<Bubble author="agent">This message cannot be shown in this version of the app.</Bubble>
		{/if}
	{/each}
</div>
