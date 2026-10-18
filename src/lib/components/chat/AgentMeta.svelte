<script lang="ts">
	import { enhance } from '$app/forms';
	import AiLabel from '#lib/components/AiLabel.svelte';

	/*
	 * The line above an agent turn: who, the AI label, the source, the time,
	 * and "Report" — every AI turn can be sent to the moderation queue
	 * (FR-30, Permendag 19/2026 Art. 47).
	 */
	let {
		time,
		source,
		messageId,
		reported = false
	}: { time: string; source?: string | null; messageId?: string; reported?: boolean } = $props();
</script>

<div class="flex items-center gap-1.5 text-xs text-ink-muted">
	Shop Assistant <AiLabel small />
	{#if source}· {source}{/if}
	{#if time}· {time}{/if}
	{#if messageId}
		{#if reported}
			<span class="ml-auto text-[11px]">Reported, thank you</span>
		{:else}
			<form method="POST" action="?/report" use:enhance class="ml-auto">
				<input type="hidden" name="messageId" value={messageId} />
				<button
					type="submit"
					class="min-h-6 px-1 text-[11px] text-ink-faint underline-offset-2 hover:underline"
					aria-label="Report this answer">Report</button
				>
			</form>
		{/if}
	{/if}
</div>
