import { redirect } from '@sveltejs/kit';

// Belum ada halaman depan; penjual langsung masuk ke beranda dasbor.
export const load = () => {
	redirect(307, '/beranda');
};
