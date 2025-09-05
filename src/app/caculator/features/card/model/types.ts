export type CardCompanyKey = '신한카드' | '현대카드';

export type CardInfoMessage = {
	type: 'info' | 'warning' | 'success';
	title?: string;
	message: string;
	secondMessage?: string;
	condition?: (amount: number, discountAmount: number) => boolean;
};

export type CardDiscountDefault = {
	label: string;
	message: string;
	secondMessage?: string;
	calc: (amount: number) => number;
	infoMessages?: CardInfoMessage[];
};

export type CardDiscountCatalog = Record<
	CardCompanyKey,
	{ label: string; cardDiscounts: Record<string, CardDiscountDefault> }
>;
