export type NavItem = { href: string; label: string };

// Menu utama dasbor. Urutannya mengikuti urutan di sidebar.
export const NAV_ITEMS: readonly NavItem[] = [
	{ href: '/beranda', label: 'Beranda' },
	{ href: '/produk', label: 'Produk' },
	{ href: '/toko', label: 'Toko Online' },
	{ href: '/pengaturan', label: 'Pengaturan' }
];

/** Menu aktif juga untuk sub-halamannya, mis. `/produk/123` menyalakan "Produk". */
export function isActive(pathname: string, href: string): boolean {
	return pathname === href || pathname.startsWith(`${href}/`);
}
