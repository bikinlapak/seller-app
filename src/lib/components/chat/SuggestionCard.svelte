<script lang="ts">
	import { enhance } from '$app/forms';
	import QtyStepper from '#lib/components/QtyStepper.svelte';
	import type { SuggestionCard } from '#lib/types/api.js';

	let { card, done = false }: { card: SuggestionCard; done?: boolean } = $props();

	/*
	 * "Change quantity" opens the stepper, starting at what the assistant
	 * proposed. Thread keys each card by message id, so a new card is a new
	 * component instance: taking the initial value from the prop is intended.
	 */
	let editing = $state(false);
	// svelte-ignore state_referenced_locally
	let quantity = $state(card.quantity);

	/*
	 * One idempotency key per form instance: a double tap, or a retry on a bad
	 * connection, must not create two purchase orders.
	 */
	const idempotencyKey = crypto.randomUUID();

	let sending = $state(false);
</script>

<article class="bubble-agent flex flex-col gap-2 border border-line bg-surface px-3.5 py-3">
	<div class="flex items-center justify-between">
		<span class="label-section text-pine-600">{card.label}</span>
		<span class="text-xs text-ink-muted">{card.confidence}</span>
	</div>

	<h2 class="m-0 text-base font-bold">{card.title}</h2>
	<p class="m-0 text-[13px] leading-relaxed text-ink-label">{card.reason}</p>

	<form
		method="POST"
		action="?/act"
		use:enhance={() => {
			sending = true;
			return async ({ update }) => {
				sending = false;
				// `reset: false`: without it SvelteKit clears the form after
				// submit, and `bind:value` on a number input writes the empty
				// value back into `quantity` — the stepper loses its number.
				await update({ reset: false });
			};
		}}
		class="flex flex-col gap-2"
	>
		<input type="hidden" name="token" value={card.token} />
		<input type="hidden" name="unit" value={card.unit} />
		<input type="hidden" name="idempotencyKey" value={idempotencyKey} />

		{#if done}
			<p class="m-0 text-[13px] text-ink-muted">This suggestion has been handled.</p>
		{:else if editing}
			<QtyStepper bind:value={quantity} max={card.quantity} unit={card.unit} />
			<div class="flex gap-2">
				<button
					type="submit"
					disabled={sending}
					class="min-h-[42px] flex-1 rounded-action bg-pine-600 text-sm font-bold text-white disabled:opacity-60"
					>{sending ? 'Sending…' : `Order ${quantity} ${card.unit}`}</button
				>
				<button
					type="button"
					onclick={() => {
						editing = false;
						quantity = card.quantity;
					}}
					class="min-h-[42px] rounded-action border border-line-strong bg-surface px-3 text-sm font-semibold text-ink"
					>Cancel</button
				>
			</div>
		{:else}
			<input type="hidden" name="quantity" value={card.quantity} />
			<div class="flex gap-2">
				<button
					type="submit"
					disabled={sending}
					class="min-h-[42px] flex-1 rounded-action bg-pine-600 text-sm font-bold text-white disabled:opacity-60"
					>{sending ? 'Sending…' : 'Approve'}</button
				>
				<button
					type="button"
					onclick={() => (editing = true)}
					class="min-h-[42px] flex-1 rounded-action border border-pine-600 bg-surface text-sm font-bold text-pine-600"
					>Change quantity</button
				>
				<button
					type="submit"
					formaction="?/reject"
					class="min-h-[42px] rounded-action px-2.5 text-sm font-semibold text-ink-muted"
					>Reject</button
				>
			</div>
		{/if}
	</form>
</article>
