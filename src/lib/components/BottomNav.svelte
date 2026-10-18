<script lang="ts">
	import { page } from '$app/state';
	import Icon from '#lib/components/Icon.svelte';
	import { NAV_ITEMS, isActive } from '#lib/nav.js';
</script>

<!--
	The bottom bar: five destinations, a grid so widths stay even at 360px.
	Bottom padding clears the iOS home indicator via env(safe-area-inset-bottom).
-->
<nav
	aria-label="Main menu"
	class="sticky bottom-0 z-10 grid flex-none grid-cols-5 border-t border-line bg-surface px-1 pt-1.5"
	style="padding-bottom: calc(0.875rem + env(safe-area-inset-bottom, 0px))"
>
	{#each NAV_ITEMS as item (item.href)}
		{@const active = isActive(page.url.pathname, item.href)}
		<a
			href={item.href}
			aria-current={active ? 'page' : undefined}
			class={[
				'flex min-h-12 flex-col items-center justify-center gap-[3px] text-[11px]',
				active ? 'font-bold text-pine-600' : 'text-ink-muted'
			]}
		>
			<Icon name={item.icon} />
			{item.label}
		</a>
	{/each}
</nav>
