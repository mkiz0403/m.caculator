export type CardCompanyKey = 'none' | '신한카드' | '현대카드';
export type CardDiscountKey = 'none' | '더 모아' | '현대 zero';

export type CardDiscountDefault = {
	label: string;
	message: string;
	calc: (amount: number) => number;
};

export type CardDiscountCatalog = Record<
	CardCompanyKey,
	{ label: string; cardDiscounts: Record<CardDiscountKey, CardDiscountDefault> }
>;
