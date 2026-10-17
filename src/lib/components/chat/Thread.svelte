<script lang="ts">
	import AgentMeta from '#lib/components/chat/AgentMeta.svelte';
	import Bubble from '#lib/components/chat/Bubble.svelte';
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
	 * aria-live polite: an arriving card is announced once, not re-read.
	 */
	let {
		messages,
		source,
		done = false
	}: { messages: Message[]; source?: string | null; done?: boolean } = $props();
</script>

<div
	aria-live="polite"
	aria-label="Conversation with the Shop Assistant"
	class="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-3"
>
	{#each messages as message (message.id)}
		{#if message.author === 'agent'}
			<AgentMeta time={message.time} source={message.type === 'waste_card' ? source : null} />
		{/if}

		{#if message.type === 'note'}
			<SystemNote text={message.text} />
		{:else if message.type === 'photo'}
			<PhotoMessage label={message.photoLabel} boxes={message.boxes} />
		{:else if message.type === 'suggestion_card'}
			<SuggestionCard card={message.card} {done} />
		{:else if message.type === 'result_card'}
			<ResultCard card={message.card} />
		{:else if message.type === 'waste_card'}
			<WasteCard card={message.card} />
		{:else if message.type === 'text'}
			<Bubble author={message.author}>
				{message.text}
				{#if message.author === 'agent' && message.actions}
					<div class="mt-2 flex gap-2">
						{#each message.actions as action (action.label)}
							{#if action.primary && action.token}
								<form method="POST" action="?/act" class="flex-1">
									<input type="hidden" name="token" value={action.token} />
									<input type="hidden" name="quantity" value="9" />
									<input type="hidden" name="unit" value="kg" />
									<input type="hidden" name="idempotencyKey" value={action.token} />
									<button
										type="submit"
										class="min-h-10 w-full rounded-action bg-pine-600 text-sm font-bold text-white"
										>{action.label}</button
									>
								</form>
							{:else}
								<button
									type="button"
									class="min-h-10 flex-1 rounded-action border border-line-strong bg-surface text-sm font-semibold text-ink"
									>{action.label}</button
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
