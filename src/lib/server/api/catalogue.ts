import { AI_SETTINGS, PRODUCTS, STOCK } from '#lib/mock/fixtures.js';
import type {
	AiSettings,
	Dashboard,
	ProductDetail,
	ProductList,
	StockList,
	WasteReport
} from '#lib/types/api.js';
import { get, send, type Result } from './http.js';

export function products(fetch: typeof globalThis.fetch): Promise<ProductList | null> {
	return get<ProductList>(fetch, '/v1/products', () => PRODUCTS);
}

export function product(fetch: typeof globalThis.fetch, id: string): Promise<ProductDetail | null> {
	return get<ProductDetail | null>(fetch, `/v1/products/${encodeURIComponent(id)}`, () => null);
}

export function stock(fetch: typeof globalThis.fetch): Promise<StockList | null> {
	return get<StockList>(fetch, '/v1/stock', () => STOCK);
}

export function aiSettings(fetch: typeof globalThis.fetch): Promise<AiSettings | null> {
	return get<AiSettings>(fetch, '/v1/assistant/settings', () => AI_SETTINGS);
}

export type SettingsUpdate = {
	selectedMode?: string;
	autonomy?: Record<string, boolean>;
	language?: string;
};

export function saveSettings(
	fetch: typeof globalThis.fetch,
	update: SettingsUpdate
): Promise<Result<AiSettings>> {
	return send<AiSettings>(fetch, 'PUT', '/v1/assistant/settings', update, {
		mock: () => AI_SETTINGS
	});
}

export function wasteReport(fetch: typeof globalThis.fetch): Promise<WasteReport | null> {
	return get<WasteReport | null>(fetch, '/v1/reports/waste', () => null);
}

export function dashboard(fetch: typeof globalThis.fetch): Promise<Dashboard | null> {
	return get<Dashboard | null>(fetch, '/v1/dashboard', () => null);
}
