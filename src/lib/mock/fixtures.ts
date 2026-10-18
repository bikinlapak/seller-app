/*
 * Stand-in seller-svc data for SELLER_SVC_MOCK=true, in the shapes of
 * seller-svc/src/contract.rs. The real backend now computes all of this from
 * its demo tenant (seller-svc/src/shop/demo.rs) and runs with no cloud
 * dependency, so prefer it; these fixtures keep the UI buildable offline. Content mirrors
 * the demo tenant, Hangat Bakery.
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
	name: 'Hangat Bakery (mock)',
	owner: 'Rima',
	greeting: 'Morning, Rima.'
};

export const HOME: AssistantHome = {
	shop: SHOP,
	attention: [
		{
			id: 'a1',
			title: 'Bread Flour runs out Tuesday',
			detail: 'Suggested: order 175 kg',
			icon: 'stock',
			href: '/assistant/reorder'
		},
		{
			id: 'a2',
			title: '50 pcs of Butter Croissant expire tomorrow',
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
		{ label: 'How much butter is left?', href: '/assistant/stock' },
		{ label: "Photograph today's leftovers", href: '/assistant/waste' },
		{ label: 'Ideas for day-old bakes', href: '/assistant/special' },
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
				title: 'Bread Flour · order 175 kg',
				reason:
					'40 kg on hand, using 22 kg a day, out by Tuesday. Tepung Jaya delivers in 2 days, arriving Tuesday.',
				quantity: 175,
				unit: 'kg',
				token: 'tok_suggestion_0771',
				state: 'open',
				approveLabel: 'Approve',
				editable: true
			}
		},
		{
			id: 'm2',
			author: 'staff',
			type: 'text',
			time: '07.03',
			text: "why 175? we're closed two days next week"
		},
		{
			id: 'm3',
			author: 'agent',
			type: 'text',
			time: '07.04',
			text: "175 kg covered a normal week plus a buffer. Closed two days, 125 kg is enough. I've saved the closure for future forecasts.",
			actions: [
				{
					label: 'Order 125 kg',
					token: 'tok_suggestion_0771_9',
					primary: true,
					quantity: 125,
					unit: 'kg'
				},
				{
					label: 'Keep 175 kg',
					token: 'tok_suggestion_0771',
					primary: false,
					quantity: 175,
					unit: 'kg'
				}
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
						productId: 'p1',
						name: 'Butter Croissant',
						quantity: 3,
						maxQuantity: 50,
						unit: 'pcs',
						severity: 'ok',
						severityLabel: 'still good · 96%',
						destinations: [
							{ id: 'repurposed', label: "Today's special", selected: true },
							{ id: 'donated', label: 'Donate', selected: false },
							{ id: 'staff_meal', label: 'Staff meal', selected: false },
							{ id: 'bsf_or_compost', label: 'Compost / larvae', selected: false },
							{ id: 'landfill', label: 'Discard', selected: false }
						]
					},
					{
						id: 'i2',
						productId: 'p9',
						name: 'Fresh Milk 1 L',
						quantity: 2,
						maxQuantity: 7,
						unit: 'L',
						severity: 'critical',
						severityLabel: 'past date · 92%',
						destinations: [
							{ id: 'bsf_or_compost', label: 'Compost / larvae', selected: true },
							{ id: 'landfill', label: 'Discard', selected: false }
						],
						warning: 'Past its date: it cannot be sold or donated.'
					}
				],
				uncertain: {
					itemId: 'i3',
					label: 'bread',
					quantity: 1,
					unit: 'pcs',
					confidence: 58,
					candidates: [
						{ id: 'p4', name: 'Sourdough Loaf' },
						{ id: 'p5', name: 'Milk Bread' }
					],
					destinations: [
						{ id: 'repurposed', label: "Today's special", selected: true },
						{ id: 'donated', label: 'Donate', selected: false },
						{ id: 'landfill', label: 'Discard', selected: false }
					]
				},
				note: 'Photo kept as evidence · location data removed',
				token: 'tok_waste_session',
				state: 'open'
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
		"Fresh Milk 1 L: 5 L usable across 1 lot (2 L past its date). Photograph a shelf or the fridge and I'll count it."
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
		"From what's on hand: day-old croissants, milk and eggs make 8 portions of bread pudding. Price Rp25,000, recovering Rp200,000."
	),
	report: brief(
		'Reports and impact',
		'This week: Rp12.4M revenue, Rp3.1M profit. Across 9 waste photos, 78% was diverted — up from 61% last week.'
	),
	shop: brief('Shop settings', "You're open 06.00–20.00. Which day would you like to change?")
};

export const PRODUCTS: ProductList = {
	total: 5,
	categories: ['All', 'Bread', 'Pastries', 'Ingredients'],
	products: [
		{
			id: 'p1',
			name: 'Butter Croissant',
			price: 18000,
			priceLabel: 'Rp18,000',
			subtitle: null,
			category: 'Pastries',
			stockLabel: '50 pcs · exp. tomorrow',
			stockSeverity: 'warn',
			status: '30% off 17.00',
			statusImportant: true,
			photoColour: '#E8D3AE'
		},
		{
			id: 'p4',
			name: 'Sourdough Loaf',
			price: 45000,
			priceLabel: 'Rp45,000',
			subtitle: null,
			category: 'Bread',
			stockLabel: '8 loaves',
			stockSeverity: 'ok',
			status: 'Active',
			statusImportant: false,
			photoColour: '#D6BC94'
		},
		{
			id: 'p6',
			name: 'Baguette',
			price: 25000,
			priceLabel: 'Rp25,000',
			subtitle: null,
			category: 'Bread',
			stockLabel: '14 pcs · exp. today',
			stockSeverity: 'warn',
			status: 'Active',
			statusImportant: false,
			photoColour: '#DDBF8E'
		},
		{
			id: 'p7',
			name: 'Bread Flour',
			price: null,
			priceLabel: null,
			subtitle: 'Ingredient · not for sale',
			category: 'Ingredients',
			stockLabel: '40 kg',
			stockSeverity: 'critical',
			status: 'Reorder suggested',
			statusImportant: true,
			photoColour: '#EFE9DD'
		},
		{
			id: 'p9',
			name: 'Fresh Milk 1 L',
			price: null,
			priceLabel: null,
			subtitle: 'Ingredient · not for sale',
			category: 'Ingredients',
			stockLabel: '7 L · past date',
			stockSeverity: 'critical',
			status: 'Reorder suggested',
			statusImportant: true,
			photoColour: '#F1ECE2'
		}
	]
};

export const STOCK: StockList = {
	location: 'Main store',
	summary: { value: 'Rp4.1M', lowCount: 2, expiringCount: 2 },
	rows: [
		{
			id: 'p7',
			name: 'Bread Flour',
			quantityLabel: '40 kg',
			percent: 13,
			severity: 'critical',
			left: 'Out by Tuesday · 1.8 days',
			right: 'lot L-101',
			rightImportant: false,
			tags: ['low']
		},
		{
			id: 'p9',
			name: 'Fresh Milk 1 L',
			quantityLabel: '7 L',
			percent: 6,
			severity: 'critical',
			left: '2 L past date',
			right: '2 lots',
			rightImportant: false,
			tags: ['low', 'expiring']
		},
		{
			id: 'p1',
			name: 'Butter Croissant',
			quantityLabel: '50 pcs',
			percent: 14,
			severity: 'warn',
			left: '8 pcs expire tomorrow unsold',
			right: 'lot B-201',
			rightImportant: false,
			tags: ['expiring']
		},
		{
			id: 'p11',
			name: 'Sugar',
			quantityLabel: '30 kg',
			percent: 71,
			severity: 'ok',
			left: 'Fine · 10 days',
			right: 'lot L-106',
			rightImportant: false,
			tags: []
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
