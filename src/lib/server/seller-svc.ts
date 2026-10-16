/*
 * Berkas ini dulu menampung seluruh klien seller-svc. Sekarang isinya pindah ke
 * ./api/ (satu modul per kelompok endpoint); ini tinggal re-export supaya impor
 * lama tidak putus.
 */
export { fetchHealth, pakaiTiruan, sellerSvcUrl, type Health } from './api/http.js';
