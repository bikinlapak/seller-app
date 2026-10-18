<script lang="ts">
	import { enhance } from '$app/forms';
	import QtyStepper from '#lib/components/QtyStepper.svelte';
	import { qty } from '#lib/format.js';
	import type { SuggestionCard } from '#lib/types/api.js';

	/*
	 * A proposal behind one action token: a reorder (one product, or a PO
	 * grouped by supplier), a markdown on a lot about to expire, or today's
	 * special. The backend says which through the labels; this card only
	 * renders and submits.
	 *
	 * Thread keys each card by message id, so a new card is a new component
	 * instance: taking initial values from the prop is intended.
	 */
	let { card }: { card: SuggestionCard } = $props();

	let editing = $state(false);
	// svelte-ignore state_referenced_locally
	let quantity = $state(card.quantity);
	// svelte-ignore state_referenced_locally
	let lineQty = $state(
		Object.fromEntries((card.lines ?? []).map((l) => [l.productId, l.quantity]))
	);

	/*
	 * One idempotency key per form instance: a double tap, or a retry on a bad
	 * connection, must not create two purchase orders.
	 */
	const idempotencyKey = crypto.randomUUID();
	let sending = $state(false);

	const multi = $derived((card.lines ?? []).length > 0);
	const total = $derived(
		multi ? Object.values(lineQty).reduce((a, b) => a + (Number(b) || 0), 0) : quantity
	);
	const overCap = $derived(
		multi
			? (card.lines ?? []).some((l) => (lineQty[l.productId] ?? 0) > l.quantity)
			: quantity > card.quantity || quantity < 1
	);

	const submit = () => {
		sending = true;
		return async ({ update }: { update: (o?: { reset?: boolean }) => Promise<void> }) => {
			sending = false;
			// `reset: false`: SvelteKit would otherwise clear the form, and
			// `bind:value` on a number input writes the empty value back.
			await update({ reset: false });
		};
	};

	const stateNote = {
		open: '',
		approved: 'Approved.',
		rejected: 'Rejected. Nothing was changed.',
		replaced: 'Replaced by a newer suggestion below, after the stock count.'
	} as const;
</script>

<article class="bubble-agent flex flex-col gap-2 border border-line bg-surface px-3.5 py-3">
	<div class="flex items-center justify-between gap-2">
		<span class="label-section text-pine-600">{card.label}</span>
		<span class="text-right text-xs text-ink-muted">{card.confidence}</span>
	</div>

	<h2 class="m-0 text-base font-bold">{card.title}</h2>
	<p class="m-0 text-[13px] leading-relaxed text-ink-label">{card.reason}</p>

	{#if multi}
		<ul class="m-0 flex list-none flex-col gap-1.5 p-0">
			{#each card.lines ?? [] as line (line.productId)}
				<li class="flex flex-col gap-1 rounded-field bg-cream px-2.5 py-2">
					<span class="flex justify-between gap-2 text-sm font-semibold">
						{line.name}
						{#if !editing}<span class="flex-none">{qty(line.quantity, line.unit)}</span>{/if}
					</span>
					<span class="text-xs text-ink-muted">{line.note}</span>
				</li>
			{/each}
		</ul>
	{/if}

	{#if card.state !== 'open'}
		<p class="m-0 text-[13px] text-ink-muted">{stateNote[card.state]}</p>
	{:else}
		<form method="POST" action="?/act" use:enhance={submit} class="flex flex-col gap-2">
			<input type="hidden" name="token" value={card.token} />
			<input type="hidden" name="idempotencyKey" value={idempotencyKey} />

			{#if editing}
				{#if multi}
					{#each card.lines ?? [] as line (line.productId)}
						<input type="hidden" name="line" value={line.productId} />
						<div class="flex flex-col gap-1">
							<span class="text-xs font-semibold text-ink-label">{line.name}</span>
							<QtyStepper
								bind:value={lineQty[line.productId]}
								max={line.quantity}
								min={0}
								unit={line.unit}
								name="qty-{line.productId}"
							/>
						</div>
					{/each}
				{:else}
					<QtyStepper bind:value={quantity} max={card.quantity} unit={card.unit} />
				{/if}
				<div class="flex gap-2">
					<button
						type="submit"
						disabled={sending || overCap || total < 1}
						class="min-h-[42px] flex-1 rounded-action bg-pine-600 text-sm font-bold text-white disabled:opacity-50"
						>{sending
							? 'Sending…'
							: overCap
								? `At most ${qty(card.quantity, card.unit)}`
								: multi
									? `Order ${qty(total, card.unit)}`
									: `${card.approveLabel} · ${qty(quantity, card.unit)}`}</button
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
				{#if multi}
					{#each card.lines ?? [] as line (line.productId)}
						<input type="hidden" name="line" value={line.productId} />
						<input type="hidden" name="qty-{line.productId}" value={line.quantity} />
					{/each}
				{:else}
					<input type="hidden" name="quantity" value={card.quantity} />
				{/if}
				<div class="flex gap-2">
					<button
						type="submit"
						disabled={sending}
						class="min-h-[42px] flex-1 rounded-action bg-pine-600 px-2 text-sm font-bold text-white disabled:opacity-60"
						>{sending ? 'Sending…' : card.approveLabel}</button
					>
					{#if card.editable}
						<button
							type="button"
							onclick={() => (editing = true)}
							class="min-h-[42px] flex-1 rounded-action border border-pine-600 bg-surface px-2 text-sm font-bold text-pine-600"
							>Change {multi ? 'quantities' : 'quantity'}</button
						>
					{/if}
					<button
						type="submit"
						formaction="?/reject"
						disabled={sending}
						class="min-h-[42px] rounded-action px-2.5 text-sm font-semibold text-ink-muted"
						>Reject</button
					>
				</div>
			{/if}
		</form>
	{/if}
</article>
