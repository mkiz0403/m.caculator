import { CardDiscountCatalog } from './types';

export const CARD_DISCOUNT_COMPANIES: CardDiscountCatalog = {
	신한카드: {
		label: '신한카드',
		cardDiscounts: {
			더모아: {
				label: '더모아',
				message: '5,000원 이상 결제 시, 뒷자리 999원 이하 포인트 지급',
				calc: (amount: number) => {
					if (amount < 5000) return 0;
					return Math.min(amount % 1000, 999);
				},
			},
		},
	},
	현대카드: {
		label: '현대카드',
		cardDiscounts: {
			현대zero: {
				label: '현대 Zero',
				message: '결제금액 7% 청구할인',
				calc: (amount: number) => {
					return amount * 0.07;
				},
			},
		},
	},
};
