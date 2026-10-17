/*
 * Stand-in seller-svc data, mirroring src/seed.rs on the backend so the two
 * stay comparable. Content comes from the design canvas: Jasa Coffee Shop,
 * Arabica Beans, PO-0771, Sumber Kopi.
 *
 * Only used when SELLER_SVC_MOCK=true (see src/lib/server/api/http.ts). Every
 * number here pretends to have been computed by the backend: the frontend
 * formats no rupiah and counts no days, so swapping the source is one flag.
 */
import type {
	AiSettings,
	AssistantHome,
	ProductList,
	Shop,
	StockList,
	Thread
} from '#lib/types/api.js';

export const SHOP: Shop = {
	name: 'Jasa Coffee Shop',
	owner: 'Rima',
	greeting: 'Morning, Rima.'
};

export const HOME: AssistantHome = {
	shop: SHOP,
	attention: [
		{
			id: 'a1',
			title: 'Arabica beans run out Thursday',
			detail: 'Suggested: order 12 kg',
			icon: 'stock',
			href: '/assistant/reorder'
		},
		{
			id: 'a2',
			title: '14 croissants expire tomorrow',
			detail: '8 are unlikely to sell',
			icon: 'expiry',
			href: '/assistant/expiry'
		},
		{
			id: 'a3',
			title: 'Donation pickup 21.30',
			detail: '[PARTNER FOOD BANK]',
			icon: 'donation',
			href: '/assistant/donation'
		}
	],
	commands: [
		{ label: 'Add a product from a photo', href: '/assistant/product' },
		{ label: 'How much oat milk is left?', href: '/assistant/stock' },
		{ label: "Photograph today's leftovers", href: '/assistant/waste' },
		{ label: 'Menu ideas from stock', href: '/assistant/special' },
		{ label: "This week's report", href: '/assistant/report' },
		{ label: 'Change opening hours', href: '/assistant/shop' }
	]
};

/* B3 · Reorder suggestion → PO. The demo path: card → question → edit → approve. */
const REORDER_THREAD: Thread = {
	topic: 'Reorder suggestion',
	shop: SHOP,
	source: null,
	messages: [
		{
			id: 'm1',
			author: 'agent',
			type: 'suggestion_card',
			time: 'Monday 07.00',
			card: {
				label: 'Reorder suggestion',
				confidence: 'High confidence',
				title: 'Arabica Beans 1 kg · order 12 kg',
				reason:
					'4 kg on hand, selling 1.6 kg a day, out by Thursday. Sumber Kopi delivers in 2 days, arriving Wednesday.',
				quantity: 12,
				unit: 'kg',
				token: 'tok_suggestion_0771'
			}
		},
		{
			id: 'm2',
			author: 'staff',
			type: 'text',
			time: '07.03',
			text: "why 12? we're closed two days next week"
		},
		{
			id: 'm3',
			author: 'agent',
			type: 'text',
			time: '07.04',
			text: "12 kg covers 7 days plus a buffer. Closed two days, 9 kg is enough. I've noted the closure for next time.",
			actions: [
				{ label: 'Order 9 kg', token: 'tok_suggestion_0771_9', primary: true },
				{ label: 'Keep 12 kg', token: null, primary: false }
			]
		}
	]
};

/* B5 · Waste photo → AI vision → destination. */
const WASTE_THREAD: Thread = {
	topic: 'Waste photo',
	shop: SHOP,
	source: 'Gemini vision',
	messages: [
		{
			id: 'w1',
			author: 'staff',
			type: 'photo',
			time: '21.10',
			photoLabel: '[PHOTO OF LEFTOVER TRAY]',
			boxes: [
				{ x: 5, y: 15, w: 41, h: 47, confident: true },
				{ x: 53, y: 20, w: 39, h: 57, confident: true },
				{ x: 12, y: 67, w: 32, h: 23, confident: false }
			]
		},
		{
			id: 'w2',
			author: 'agent',
			type: 'waste_card',
			time: '21.11',
			card: {
				label: "Today's leftovers · 3 items",
				value: '~Rp167k',
				items: [
					{
						id: 'i1',
						name: 'Butter Croissant',
						quantity: 3,
						unit: 'pcs',
						severity: 'ok',
						severityLabel: 'still good · 96%',
						destinations: [
							{ id: 'donation', label: 'Donate', selected: true },
							{ id: 'special', label: "Today's special", selected: false },
							{ id: 'staff', label: 'Staff meal', selected: false }
						]
					},
					{
						id: 'i2',
						name: 'Oat Milk 1 L',
						quantity: 2,
						unit: 'L',
						severity: 'critical',
						severityLabel: 'past date · 92%',
						destinations: [
							{ id: 'compost', label: 'Compost / larvae', selected: true },
							{ id: 'discard', label: 'Discard', selected: false }
						],
						warning: 'Past its date: it cannot be sold or donated.'
					}
				],
				uncertain: {
					confidence: 58,
					candidates: [
						{ id: 'c1', name: 'Wholemeal Bread' },
						{ id: 'c2', name: 'Milk Bun' }
					]
				},
				note: 'Photo kept as evidence · location data removed'
			}
		}
	]
};

/* Threads not yet built out: the assistant opens, the composer is ready. */
function brief(topic: string, opening: string, source: string | null = null): Thread {
	return {
		topic,
		shop: SHOP,
		source,
		messages: [{ id: 'a1', author: 'agent', type: 'text', time: 'Just now', text: opening }]
	};
}

export const THREADS: Record<string, Thread> = {
	reorder: REORDER_THREAD,
	waste: WASTE_THREAD,
	product: brief(
		'Add a product from a photo',
		"Send me a photo and I'll draft the name, category and description. Nothing is saved until you approve it."
	),
	stock: brief(
		'Check and adjust stock',
		'Oat Milk 1 L is down to 5 L in the main store, across 2 lots. Want me to record an adjustment?'
	),
	expiry: brief(
		'Expiring soon',
		'14 croissants expire tomorrow and 8 are unlikely to sell. Shall I set a stepped discount from 17.00?'
	),
	donation: brief(
		'Donation',
		"[PARTNER FOOD BANK] can collect at 21.30. Before we go on, there's a food-safety checklist for you to tick."
	),
	special: brief(
		"Today's special from stock",
		"From what's on hand: croissants and oat milk make 6 portions of pudding. Price Rp18,000, recovering Rp108,000."
	),
	report: brief(
		'Reports and impact',
		'This week: Rp12.4M revenue, Rp3.1M profit. Across 9 waste photos, 78% was diverted — up from 61% last week.'
	),
	shop: brief('Shop settings', "You're open 07.00–21.00. Which day would you like to change?")
};

export const PRODUCTS: ProductList = {
	total: 24,
	categories: ['All', 'Drinks', 'Bakery', 'Ingredients', 'Drafts'],
	products: [
		{
			id: 'p1',
			name: 'Palm Sugar Latte 250 ml',
			price: 35000,
			priceLabel: 'Rp35,000',
			subtitle: null,
			category: 'Drinks',
			stockLabel: '20 in stock',
			stockSeverity: 'ok',
			status: 'New',
			statusImportant: false,
			photoColour: '#EAD9C2'
		},
		{
			id: 'p2',
			name: 'Butter Croissant (box of 4)',
			price: 60000,
			priceLabel: 'Rp60,000',
			subtitle: null,
			category: 'Bakery',
			stockLabel: '14 · exp. tomorrow',
			stockSeverity: 'warn',
			status: 'Discount 17.00',
			statusImportant: true,
			photoColour: '#E8DCC8'
		},
		{
			id: 'p3',
			name: 'Arabica Beans 1 kg',
			price: 210000,
			priceLabel: 'Rp210,000',
			subtitle: null,
			category: 'Ingredients',
			stockLabel: '4 kg',
			stockSeverity: 'critical',
			status: 'PO sent',
			statusImportant: false,
			photoColour: '#DCCFBD'
		},
		{
			id: 'p4',
			name: 'Oat Milk 1 L',
			price: null,
			priceLabel: null,
			subtitle: 'Ingredient · not for sale',
			category: 'Ingredients',
			stockLabel: '5 L',
			stockSeverity: 'warn',
			status: '2 lots',
			statusImportant: false,
			photoColour: '#E6E2D6'
		},
		{
			id: 'p5',
			name: 'Palm Sugar Doughnut',
			price: 15000,
			priceLabel: 'Rp15,000',
			subtitle: null,
			category: 'Bakery',
			stockLabel: '12 in stock',
			stockSeverity: 'ok',
			status: 'Active',
			statusImportant: false,
			photoColour: '#EFE0CB'
		}
	]
};

export const STOCK: StockList = {
	location: 'Main store',
	summary: { value: 'Rp6.8M', lowCount: 3, expiringCount: 2 },
	rows: [
		{
			id: 's1',
			name: 'Arabica Beans 1 kg',
			quantityLabel: '4 kg',
			percent: 18,
			severity: 'critical',
			left: 'Out Thursday · 2.5 days',
			right: 'PO-0771 arrives Wednesday',
			rightImportant: true
		},
		{
			id: 's2',
			name: 'Oat Milk 1 L',
			quantityLabel: '5 L',
			percent: 30,
			severity: 'warn',
			left: '3 L expire Thursday',
			right: '2 lots',
			rightImportant: false
		},
		{
			id: 's3',
			name: 'Butter Croissant',
			quantityLabel: '14 boxes',
			percent: 70,
			severity: 'warn',
			left: 'Expires tomorrow · discount 17.00',
			right: 'lot L-889',
			rightImportant: false
		},
		{
			id: 's4',
			name: 'Palm Sugar 1 kg',
			quantityLabel: '9 kg',
			percent: 62,
			severity: 'ok',
			left: 'Fine · 11 days',
			right: 'auto-approved',
			rightImportant: false
		}
	]
};

export const AI_SETTINGS: AiSettings = {
	modes: [
		{ id: 'frugal', label: 'Frugal', note: 'short answers, small model' },
		{ id: 'balanced', label: 'Balanced', note: 'default' },
		{ id: 'thorough', label: 'Thorough', note: 'longer reasoning' }
	],
	selectedMode: 'balanced',
	models: [
		{ task: 'Chat and explanations', name: 'Gemini Flash', system: false },
		{ task: 'Reading product and waste photos', name: 'Gemini Pro', system: false },
		{ task: 'Menu ideas and listings', name: 'Gemini Flash', system: false },
		{
			task: 'Stock forecasting',
			note: 'computed by the system, not by chat',
			name: 'TimesFM',
			system: true
		}
	],
	autonomy: [
		{
			id: 'small-po',
			label: 'Auto-approve small orders',
			note: '≤Rp500k, after 3 approvals with no edits',
			enabled: true
		},
		{ id: 'markdown', label: 'Auto-discount near expiry', enabled: false }
	],
	language: {
		options: ['English', 'Indonesia · santai', 'Indonesia · formal'],
		selected: 'English'
	},
	budget: {
		capLabel: 'Rp150k/mo',
		usedPercent: 25,
		note: '25% used this month. If it runs out, the assistant drops to Frugal.'
	},
	privacy:
		"Your shop's data is not used to train models. Waste photos are kept for 90 days as evidence."
};
