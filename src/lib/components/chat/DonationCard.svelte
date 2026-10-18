<script lang="ts">
	import { enhance } from '$app/forms';
	import { qty } from '#lib/format.js';
	import type { DonationCard } from '#lib/types/api.js';

	/*
	 * Donation (FR-48): what goes, to whom, when, and the food-safety
	 * checklist. The checklist is a hard gate — the button stays disabled
	 * until every box is ticked, and seller-svc refuses the request anyway if
	 * one is missing. Nothing past its date ever reaches this card.
	 */
	let { card }: { card: DonationCard } = $props();

	let checked = $state<Record<string, boolean>>({});
	// svelte-ignore state_referenced_locally
	let recipient = $state(card.recipients[0]?.id ?? '');
	// svelte-ignore state_referenced_locally
	let pickup = $state(card.pickupWindows[0] ?? '');
	let sending = $state(false);
	const idempotencyKey = crypto.randomUUID();

	const ready = $derived(card.checklist.every((c) => checked[c.id]) && !!recipient && !!pickup);
	const remaining = $derived(card.checklist.filter((c) => !checked[c.id]).length);
</script>

<article class="bubble-agent overflow-hidden border border-line bg-surface">
	<div class="flex items-center justify-between border-b border-line-soft px-3.5 py-2.5">
		<h2 class="label-section m-0 text-pine-600">{card.title}</h2>
		<span class="text-xs text-ink-muted">{qty(card.lines.length, 'item')}</span>
	</div>

	<ul class="m-0 flex list-none flex-col gap-1 border-b border-line-soft px-3.5 py-2.5">
		{#each card.lines as line (line.name)}
			<li class="flex justify-between gap-2 text-sm">
				<span><b>{qty(line.quantity, line.unit)}</b> {line.name}</span>
				<span class="flex-none text-xs text-ink-muted">{line.expiry}</span>
			</li>
		{/each}
	</ul>

	{#if card.state === 'approved'}
		<div class="flex flex-col gap-2 px-3.5 py-3">
			<p class="m-0 text-[13px] text-ink-muted">Checklist passed. Pickup confirmed.</p>
			{#if card.receiptHref}
				<a
					href={card.receiptHref}
					target="_blank"
					class="flex min-h-[42px] items-center justify-center rounded-action border border-pine-600 text-sm font-bold text-pine-600"
					>Donation receipt (PDF)</a
				>
			{/if}
		</div>
	{:else}
		<form
			method="POST"
			action="?/donate"
			use:enhance={() => {
				sending = true;
				return async ({ update }) => {
					sending = false;
					await update({ reset: false });
				};
			}}
			class="flex flex-col gap-3 px-3.5 py-3"
		>
			<input type="hidden" name="token" value={card.token} />
			<input type="hidden" name="idempotencyKey" value={idempotencyKey} />

			<fieldset class="m-0 flex flex-col gap-1.5 border-0 p-0">
				<legend class="mb-1 text-[13px] font-bold text-ink-label">Recipient</legend>
				{#each card.recipients as r (r.id)}
					<label
						class="flex min-h-11 items-center gap-2.5 rounded-field border border-line px-3 text-sm"
					>
						<input
							type="radio"
							name="recipientId"
							value={r.id}
							bind:group={recipient}
							class="text-pine-600 focus:ring-pine-600"
						/>
						<span class="flex flex-col">
							{r.name}
							<span class="text-[11px] text-ink-muted">{r.kind}</span>
						</span>
					</label>
				{/each}
			</fieldset>

			<label class="flex flex-col gap-1 text-[13px] font-bold text-ink-label">
				Pickup
				<select
					name="pickupWindow"
					bind:value={pickup}
					class="min-h-11 rounded-field border border-line-strong bg-cream text-sm font-semibold text-ink"
				>
					{#each card.pickupWindows as w (w)}
						<option value={w}>{w}</option>
					{/each}
				</select>
			</label>

			<fieldset class="m-0 flex flex-col gap-1 border-0 p-0">
				<legend class="mb-1 text-[13px] font-bold text-ink-label">Food-safety checklist</legend>
				{#each card.checklist as c (c.id)}
					<label class="flex min-h-11 items-center gap-2.5 text-sm">
						<input
							type="checkbox"
							name="check"
							value={c.id}
							bind:checked={checked[c.id]}
							class="size-[22px] flex-none rounded text-pine-600 focus:ring-pine-600"
						/>
						{c.label}
					</label>
				{/each}
			</fieldset>

			<button
				type="submit"
				disabled={!ready || sending}
				class="min-h-[46px] rounded-field bg-pine-600 text-[15px] font-bold text-white disabled:opacity-50"
				>{sending
					? 'Confirming…'
					: ready
						? 'Confirm donation'
						: `Tick ${remaining} more ${remaining === 1 ? 'check' : 'checks'}`}</button
			>
		</form>
	{/if}
</article>
