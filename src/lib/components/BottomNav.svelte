<script lang="ts">
	import { page } from '$app/state';
	import Icon from '#lib/components/Icon.svelte';
	import { NAV_ITEMS, isActive } from '#lib/nav.js';
</script>

<!--
	Bar bawah: lima tujuan, grid supaya lebarnya rata di 360px.
	pb aman untuk home indicator iOS lewat env(safe-area-inset-bottom).
-->
<nav
	aria-label="Menu utama"
	class="grid grid-cols-5 border-t border-line bg-surface px-1 pt-1.5"
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
			<Icon nama={item.ikon} />
			{item.label}
		</a>
	{/each}
</nav>
