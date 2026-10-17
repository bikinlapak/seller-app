import type { IconName } from '#lib/components/Icon.svelte';

export type NavItem = { href: string; label: string; icon: IconName };

/*
 * The bottom bar from the design canvas: five destinations, Assistant first
 * because chat is the core of the app — there is no separate home screen.
 * "Me" opens AI settings.
 */
export const NAV_ITEMS: readonly NavItem[] = [
	{ href: '/assistant', label: 'Assistant', icon: 'assistant' },
	{ href: '/products', label: 'Products', icon: 'products' },
	{ href: '/stock', label: 'Stock', icon: 'stock' },
	{ href: '/shop', label: 'Shop', icon: 'shop' },
	{ href: '/me', label: 'Me', icon: 'me' }
];

/** A menu item stays active for its sub-pages: `/products/123` lights "Products". */
export function isActive(pathname: string, href: string): boolean {
	return pathname === href || pathname.startsWith(`${href}/`);
}
