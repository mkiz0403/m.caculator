export type CardCompanyKey = '신한카드' | '현대카드';

export type CardDiscountDefault = {
	label: string;
	message: string;
	calc: (amount: number) => number;
};

export type CardDiscountCatalog = Record<
	CardCompanyKey,
	{ label: string; cardDiscounts: Record<string, CardDiscountDefault> }
>;
