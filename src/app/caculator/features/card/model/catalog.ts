import { CardDiscountCatalog } from './types';

export const CARD_DISCOUNT_COMPANIES: CardDiscountCatalog = {
	신한카드: {
		label: '신한카드',
		cardDiscounts: {
			더모아: {
				label: '더모아',
				message: '5천원 이상 결제 시, 천원 미만 금액 포인트 적립',
				calc: (amount: number) => {
					if (amount < 5000) return 0;
					return Math.min(amount % 1000, 999);
				},
				infoMessages: [
					{
						type: 'info',
						title: '잠깐‼️',
						message:
							'뒷자리 {maxDiscount}원 한도내에서 추가 상품 구매를 하면 최대적립을 받을 수 있어요😀',
						condition: (amount, discountAmount) => {
							const maxDiscount = amount < 5000 ? 0 : 999 - (amount % 1000);
							return maxDiscount > 0;
						},
					},
					{
						type: 'info',
						title: '잠깐‼️',
						message:
							'{additionalAmount}원 추가 구매 시 5,000원의 행복을 누릴 수 있어요 🎉',
						condition: (amount, discountAmount) => {
							return amount >= 4000 && amount < 5000;
						},
					},
				],
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
				infoMessages: [
					{
						type: 'success',
						message:
							'현대 Zero 결제 시 {expectedDiscount}원을 청구할인 받을 수 있어요 🎉',
					},
				],
			},
		},
	},
};
