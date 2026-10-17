import { AI_SETTINGS, PRODUCTS, STOCK } from '#lib/mock/fixtures.js';
import type { AiSettings, ProductList, StockList } from '#lib/types/api.js';
import { get } from './http.js';

export function products(fetch: typeof globalThis.fetch): Promise<ProductList | null> {
	return get<ProductList>(fetch, '/v1/products', () => PRODUCTS);
}

export function stock(fetch: typeof globalThis.fetch): Promise<StockList | null> {
	return get<StockList>(fetch, '/v1/stock', () => STOCK);
}

export function aiSettings(fetch: typeof globalThis.fetch): Promise<AiSettings | null> {
	return get<AiSettings>(fetch, '/v1/assistant/settings', () => AI_SETTINGS);
}
