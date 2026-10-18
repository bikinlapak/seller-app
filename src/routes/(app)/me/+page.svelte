<script lang="ts">
	import { enhance } from '$app/forms';
	import ChatHeader from '#lib/components/ChatHeader.svelte';

	/*
	 * AI settings (artboard C6). This is the screen that makes the assistant
	 * feel owned rather than imposed: mode, model per task, how autonomous it
	 * may be, and what it is allowed to cost.
	 *
	 * "Stock forecasting" is deliberately marked as a system number — it comes
	 * from TimesFM via BigQuery, not from chat, and the screen says so.
	 */
	let { data, form } = $props();

	// Initial value from the server; after that the merchant's choice wins.
	// svelte-ignore state_referenced_locally
	let mode = $state(data.settings?.selectedMode ?? '');

	/*
	 * Every control saves on change: no "Save" button to forget. The form
	 * also works without JavaScript through the submit button in <noscript>.
	 */
	let formEl: HTMLFormElement | undefined = $state();
	let saving = $state(false);
	const save = () => formEl?.requestSubmit();
</script>

<svelte:head><title>AI settings · bikinlapak</title></svelte:head>

<ChatHeader back="/assistant" title="AI settings" />

{#if data.settings}
	{@const s = data.settings}
	<form
		bind:this={formEl}
		method="POST"
		action="?/save"
		use:enhance={() => {
			saving = true;
			return async ({ update }) => {
				saving = false;
				await update({ reset: false });
			};
		}}
		class="flex flex-1 flex-col gap-3 px-4 py-3"
	>
		<input type="hidden" name="mode" value={mode} />
		<p class="m-0 h-4 text-right text-xs text-ink-muted" aria-live="polite">
			{saving ? 'Saving…' : form?.saved ? 'Saved' : (form?.message ?? '')}
		</p>
		<section class="flex flex-col gap-2">
			<h2 class="label-section m-0 text-ink-muted">Assistant mode</h2>
			<div role="radiogroup" aria-label="Assistant mode" class="grid grid-cols-3 gap-2">
				{#each s.modes as m (m.id)}
					<button
						type="button"
						role="radio"
						aria-checked={mode === m.id}
						onclick={() => {
							mode = m.id;
							queueMicrotask(save);
						}}
						class={[
							'flex min-h-16 flex-col items-start justify-center gap-0.5 rounded-field px-2.5 py-2 text-left',
							mode === m.id
								? 'border-[1.5px] border-pine-600 bg-pine-100'
								: 'border border-line bg-surface'
						]}
					>
						<span class="text-sm font-bold">{m.label}</span>
						<span class="text-[11px] leading-tight text-ink-muted">{m.note}</span>
					</button>
				{/each}
			</div>
		</section>

		<section class="rounded-row border border-line bg-surface px-3.5 py-1">
			<h2 class="label-section m-0 pt-2.5 pb-0.5 text-ink-muted">Model per task</h2>
			{#each s.models as m (m.task)}
				<div class="flex min-h-[46px] items-center justify-between gap-2 border-t border-line-soft">
					<span class="flex flex-col gap-px text-sm">
						{m.task}
						{#if m.note}<span class="text-[11px] text-ink-muted">{m.note}</span>{/if}
					</span>
					<span
						class={[
							'flex-none rounded-full px-2.5 py-[3px] text-xs font-bold',
							m.system ? 'bg-chip text-ink-label' : 'bg-pine-100 text-pine-800'
						]}>{m.name}</span
					>
				</div>
			{/each}
		</section>

		<section class="rounded-row border border-line bg-surface px-3.5 py-1">
			<h2 class="label-section m-0 pt-2.5 pb-0.5 text-ink-muted">How autonomous</h2>
			{#each s.autonomy as a (a.id)}
				<label
					class="flex min-h-[52px] items-center justify-between gap-2.5 border-t border-line-soft text-sm"
				>
					<span class="flex flex-col gap-px">
						{a.label}
						{#if a.note}<span class="text-[11px] text-ink-muted">{a.note}</span>{/if}
					</span>
					<input type="hidden" name="autonomyId" value={a.id} />
					<input
						type="checkbox"
						name="autonomy"
						value={a.id}
						checked={a.enabled}
						onchange={save}
						class="size-[22px] flex-none rounded text-pine-600 focus:ring-pine-600"
					/>
				</label>
			{/each}
			<div class="flex min-h-[46px] items-center justify-between gap-2 border-t border-line-soft">
				<label for="language" class="text-sm">Language &amp; tone</label>
				<select
					id="language"
					name="language"
					onchange={save}
					class="min-h-9 rounded-lg border border-line-strong bg-cream py-0 pr-7 pl-2 text-[13px] font-semibold text-ink"
				>
					{#each s.language.options as option (option)}
						<option selected={option === s.language.selected}>{option}</option>
					{/each}
				</select>
			</div>
		</section>

		<section class="flex flex-col gap-1.5 rounded-row border border-line bg-surface px-3.5 py-3">
			<div class="flex justify-between gap-2 text-sm">
				<span class="font-semibold">AI spend cap</span>
				<span class="flex-none font-bold">{s.budget.capLabel}</span>
			</div>
			<div
				class="h-1.5 overflow-hidden rounded-[3px] bg-line-soft"
				role="img"
				aria-label="{s.budget.usedPercent}% used"
			>
				<div class="h-1.5 rounded-[3px] bg-kunyit-400" style="width: {s.budget.usedPercent}%"></div>
			</div>
			<p class="m-0 text-xs text-ink-muted">{s.budget.note}</p>
		</section>

		<section class="flex flex-col gap-1 text-xs leading-relaxed text-ink-label">
			<p class="m-0">{s.privacy}</p>
		</section>
		<noscript>
			<button
				type="submit"
				class="min-h-11 w-full rounded-field bg-pine-600 text-sm font-bold text-white">Save</button
			>
		</noscript>
	</form>
{:else}
	<main class="flex flex-1 items-center justify-center px-6">
		<p class="text-ink-muted">Settings could not be loaded.</p>
	</main>
{/if}
