/*
 * The shape of seller-svc responses. Hand-written because seller-app and
 * seller-svc live in different repos and cannot share a schema at compile
 * time; this is the TypeScript half of seller-svc/src/contract.rs. The test
 * in src/lib/mock/fixtures.spec.ts keeps the fixtures honest against these
 * types, and seller-svc's tests/http.rs pins the JSON field names.
 */

/** Whole rupiah, no cents. Computed and formatted by the backend. */
export type Idr = number;

/**
 * How urgent something is. Covers both stock cover and expiry, so it is a
 * severity rather than a date state: `critical` means "act today", whether
 * that is four kilos left or milk past its date.
 */
export type Severity = 'ok' | 'warn' | 'critical';

/** Lifecycle of any card that carries an action token. */
export type CardState = 'open' | 'approved' | 'rejected' | 'replaced';

export type Shop = {
	name: string;
	owner: string;
	greeting: string; // "Morning, Rima." — the backend decides the time of day
};

/* ---------- Assistant ---------- */

export type Attention = {
	id: string;
	title: string;
	detail: string;
	icon: 'stock' | 'expiry' | 'donation' | 'special' | 'waste';
	href: string;
};

export type QuickCommand = { label: string; href: string };

export type AssistantHome = {
	shop: Shop;
	attention: Attention[];
	commands: QuickCommand[];
};

/** One line in a thread. `type` picks the component that renders it. */
export type Message =
	| { id: string; author: 'staff'; type: 'text'; time: string; text: string }
	| {
			id: string;
			author: 'staff';
			type: 'photo';
			time: string;
			photoLabel: string;
			photoUrl?: string;
			boxes: DetectionBox[];
	  }
	| {
			id: string;
			author: 'agent';
			type: 'text';
			time: string;
			text: string;
			actions?: InlineAction[];
	  }
	| { id: string; author: 'system'; type: 'note'; time: string; text: string }
	| { id: string; author: 'agent'; type: 'suggestion_card'; time: string; card: SuggestionCard }
	| { id: string; author: 'agent'; type: 'result_card'; time: string; card: ResultCard }
	| { id: string; author: 'agent'; type: 'waste_card'; time: string; card: WasteCard }
	| { id: string; author: 'agent'; type: 'donation_card'; time: string; card: DonationCard }
	| { id: string; author: 'agent'; type: 'count_card'; time: string; card: CountCard };

export type DetectionBox = {
	/* Percentages of the photo, so they survive any screen width. */
	x: number;
	y: number;
	w: number;
	h: number;
	confident: boolean;
};

export type InlineAction = {
	label: string;
	/* Single-use action token from the backend. null = a secondary button. */
	token: string | null;
	primary: boolean;
	/* What the button submits with its token. */
	quantity?: number;
	unit?: string;
};

/** One product on a multi-line card: a PO grouped by supplier. */
export type CardLine = {
	productId: string;
	name: string;
	quantity: number; // proposed, and the cap for this line
	unit: string;
	note: string;
};

/** Reorder, markdown or daily special: a proposal behind one token. */
export type SuggestionCard = {
	label: string; // "Reorder suggestion"
	confidence: string; // "High confidence"
	title: string; // "Bread Flour · order 175 kg"
	reason: string;
	/* The proposed quantity; the stepper must not exceed it. */
	quantity: number;
	unit: string;
	token: string;
	state: CardState;
	approveLabel: string; // "Approve", "Start 30% discount", "Make it today"
	editable: boolean;
	lines?: CardLine[];
};

export type Link = { label: string; href: string };

/** The card shown after the executor has written. */
export type ResultCard = {
	title: string; // "PO-0772 submitted"
	detail: string; // "125 kg Bread Flour · Tepung Jaya · arrives Tuesday"
	waUrl?: string;
	links?: Link[];
};

/** B5 · Waste photo → AI vision → destination. */
export type WasteCard = {
	label: string; // "Today's leftovers · 3 items"
	value: string; // "~Rp167k"
	items: WasteItem[];
	uncertain: UncertainItem | null;
	note: string;
	token: string;
	state: CardState;
};

export type WasteItem = {
	id: string;
	productId: string;
	name: string;
	quantity: number;
	maxQuantity: number;
	unit: string;
	severity: Severity;
	severityLabel: string; // "still good · 96%"
	destinations: Destination[];
	warning?: string;
};

/* Destination ids are the PRD's: donated, repurposed, staff_meal, bsf_or_compost, landfill… */
export type Destination = { id: string; label: string; selected: boolean };

export type UncertainItem = {
	itemId: string;
	label: string; // what the model saw: "bread"
	quantity: number;
	unit: string;
	confidence: number;
	candidates: { id: string; name: string }[];
	destinations: Destination[];
};

/** Donation with the food-safety checklist as a hard gate. */
export type DonationCard = {
	donationId: string;
	title: string;
	lines: { name: string; quantity: number; unit: string; expiry: string; value: string }[];
	recipients: { id: string; name: string; kind: string }[];
	checklist: { id: string; label: string }[];
	pickupWindows: string[];
	token: string;
	state: CardState;
	receiptHref?: string;
};

/** Stock count from a photo: counted vs system, and what it means for ordering. */
export type CountCard = {
	label: string;
	lines: {
		productId: string;
		name: string;
		unit: string;
		counted: number; // from the photo; editable
		system: number; // what the ledger says
		differenceLabel: string;
		coverLabel: string;
		needLabel: string; // "Order 12 kg · runs out Tuesday"
		severity: Severity;
	}[];
	unsure: {
		itemId: string;
		label: string;
		quantity: number;
		candidates: { id: string; name: string }[];
	}[];
	unmatched: string[]; // seen, but not in the catalog
	note: string;
	token: string;
	state: CardState;
};

export type Thread = {
	topic: string;
	shop: Shop;
	source: string | null; // vision source, shown on the meta line
	messages: Message[];
};

/* ---------- Products ---------- */

export type Product = {
	id: string;
	name: string;
	price: Idr | null;
	priceLabel: string | null;
	subtitle: string | null; // "Ingredient · not for sale"
	category: string;
	stockLabel: string; // "20 in stock", "14 boxes · exp. tomorrow"
	stockSeverity: Severity;
	status: string; // "Active", "30% off 17.00", "PO-0772 sent"
	statusImportant: boolean;
	photoColour: string; // placeholder until real images exist
};

export type ProductList = {
	total: number;
	categories: string[];
	products: Product[];
};

export type Fact = { label: string; value: string };

export type SeriesPoint = {
	date: string; // YYYY-MM-DD
	actual?: number;
	forecast?: number;
	upper?: number;
	censored: boolean; // stockout or closed: not real demand
};

export type ProductDetail = {
	product: Product;
	description: string;
	unit: string;
	facts: Fact[];
	lots: {
		id: string;
		quantity: number;
		unit: string;
		expiryLabel: string;
		severity: Severity;
		atRisk: number;
	}[];
	series: SeriesPoint[];
	forecastNote: string;
};

/* ---------- Stock ---------- */

export type StockSummary = { value: string; lowCount: number; expiringCount: number };

export type StockTag = 'low' | 'expiring' | 'on_order';

export type StockRow = {
	id: string;
	name: string;
	quantityLabel: string; // "4 kg"
	/* Bar percentage: days of cover against two weeks. */
	percent: number;
	severity: Severity;
	left: string;
	right: string;
	rightImportant: boolean;
	/* What the filters and the summary tiles count, so they never disagree. */
	tags: StockTag[];
};

export type StockList = {
	location: string;
	summary: StockSummary;
	rows: StockRow[];
};

/* ---------- Reports ---------- */

export type WasteReport = {
	period: string;
	diversionPercent: number | null;
	previousPercent: number | null;
	totalValue: string;
	totalWeight: string;
	photos: number;
	byDestination: {
		id: string;
		label: string;
		value: string;
		weight: string;
		percent: number;
		landfill: boolean;
	}[];
	recent: Fact[];
	method: string;
};

export type Dashboard = {
	impact: { label: string; value: string; note: string }[];
	openSuggestions: number;
	atRisk: {
		productId: string;
		name: string;
		lotId: string;
		atRisk: string;
		expiryLabel: string;
		value: string;
	}[];
	series: {
		productId: string;
		name: string;
		unit: string;
		accuracy: string;
		series: SeriesPoint[];
	}[];
	methodNote: string;
};

/* ---------- AI settings ---------- */

export type AssistantMode = { id: string; label: string; note: string };

export type AiSettings = {
	modes: AssistantMode[];
	selectedMode: string;
	models: { task: string; note?: string; name: string; system: boolean }[];
	autonomy: { id: string; label: string; note?: string; enabled: boolean }[];
	language: { options: string[]; selected: string };
	budget: { capLabel: string; usedPercent: number; note: string };
	privacy: string;
};

/** The error body seller-svc returns: `{ error: { code, message } }`. */
export type ApiError = { code: string; message: string };
