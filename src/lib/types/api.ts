/*
 * The shape of seller-svc responses. Hand-written because seller-app and
 * seller-svc live in different repos and cannot share a schema at compile
 * time. The test in src/lib/mock/fixtures.spec.ts keeps the fixtures honest
 * against these types — if the backend renames a field, that test fails first.
 */

/** Whole rupiah, no cents. Computed and formatted by the backend. */
export type Idr = number;

/**
 * How urgent something is. Covers both stock cover and expiry, so it is a
 * severity rather than a date state: `critical` means "act today", whether
 * that is four kilos left or milk past its date.
 */
export type Severity = 'ok' | 'warn' | 'critical';

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
	icon: 'stock' | 'expiry' | 'donation';
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
	| { id: string; author: 'agent'; type: 'waste_card'; time: string; card: WasteCard };

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
};

/** B3 · Reorder suggestion → PO. */
export type SuggestionCard = {
	label: string; // "Reorder suggestion"
	confidence: string; // "High confidence"
	title: string; // "Arabica Beans 1 kg · order 12 kg"
	reason: string;
	/* The proposed quantity; the stepper must not exceed it. */
	quantity: number;
	unit: string;
	token: string;
};

/** The card shown after the executor has written to worksh.io. */
export type ResultCard = {
	title: string; // "PO-0771 created"
	detail: string; // "9 kg · Sumber Kopi · arrives Wednesday"
	waUrl: string;
	poHref: string;
};

/** B5 · Waste photo → AI vision → destination. */
export type WasteCard = {
	label: string; // "Today's leftovers · 3 items"
	value: string; // "~Rp167k"
	items: WasteItem[];
	uncertain: UncertainItem | null;
	note: string;
};

export type WasteItem = {
	id: string;
	name: string;
	quantity: number;
	unit: string;
	severity: Severity;
	severityLabel: string; // "still good · 96%"
	destinations: Destination[];
	warning?: string;
};

export type Destination = { id: string; label: string; selected: boolean };

export type UncertainItem = {
	confidence: number;
	candidates: { id: string; name: string }[];
};

export type Thread = {
	topic: string;
	shop: Shop;
	source: string | null; // "Gemini vision", shown on the meta line
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
	stockLabel: string; // "20 in stock", "14 · exp. tomorrow"
	stockSeverity: Severity;
	status: string; // "New", "Discount 17.00", "PO sent"
	statusImportant: boolean;
	photoColour: string; // placeholder until real images exist
};

export type ProductList = {
	total: number;
	categories: string[];
	products: Product[];
};

/* ---------- Stock ---------- */

export type StockSummary = { value: string; lowCount: number; expiringCount: number };

export type StockRow = {
	id: string;
	name: string;
	quantityLabel: string; // "4 kg"
	/* Bar percentage; computed by the backend from on-hand vs reorder point. */
	percent: number;
	severity: Severity;
	left: string; // "Out Thursday · 2.5 days"
	right: string; // "PO-0771 arrives Wednesday"
	rightImportant: boolean;
};

export type StockList = {
	location: string;
	summary: StockSummary;
	rows: StockRow[];
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
