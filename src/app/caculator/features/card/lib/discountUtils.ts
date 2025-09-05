import { CARD_DISCOUNT_COMPANIES } from '../model/catalog';
import type { CardInfoMessage } from '../model/types';

export type CardDiscountType = 'none' | 'theMoa' | 'HDzero';

export interface DiscountInfo {
	type: CardDiscountType;
	title: string;
	message: string;
	company: string;
	card: string;
}

/**
 * 카드 할인 타입에 따른 할인 정보를 반환
 */
export function getCardDiscountInfo(
	discountType: CardDiscountType,
): DiscountInfo | null {
	if (discountType === 'none') return null;

	// 모든 카드사와 카드를 순회하며 해당 할인 타입을 찾기
	for (const [companyKey, company] of Object.entries(CARD_DISCOUNT_COMPANIES)) {
		for (const [cardKey, card] of Object.entries(company.cardDiscounts)) {
			// 할인 타입 매핑
			const cardDiscountType = getCardDiscountType(company.label, card.label);

			if (cardDiscountType === discountType) {
				return {
					type: discountType,
					title: `${card.label}`,
					message: card.message,
					company: company.label,
					card: card.label,
				};
			}
		}
	}

	return null;
}

/**
 * 카드사와 카드명으로 할인 타입을 결정
 */
export function getCardDiscountType(
	company: string,
	card: string,
): CardDiscountType {
	if (company === '신한카드' && card === '더모아') return 'theMoa';
	if (company === '현대카드' && card === '현대 Zero') return 'HDzero';
	return 'none';
}

/**
 * 선택된 카드사와 카드로부터 할인 정보를 생성
 */
export function createCardDiscountFromSelection(
	selectedCompany: string,
	selectedCard: string,
): DiscountInfo | null {
	const discountType = getCardDiscountType(selectedCompany, selectedCard);
	return getCardDiscountInfo(discountType);
}

/**
 * 카드 할인 타입에 따른 할인 금액을 계산
 */
export function calculateCardDiscount(
	amount: number,
	discountType: CardDiscountType,
): number {
	if (discountType === 'none') return 0;

	const discountInfo = getCardDiscountInfo(discountType);
	if (!discountInfo) return 0;

	// 카탈로그에서 해당 카드의 calc 함수를 찾아서 실행
	for (const [companyKey, company] of Object.entries(CARD_DISCOUNT_COMPANIES)) {
		for (const [cardKey, card] of Object.entries(company.cardDiscounts)) {
			if (
				company.label === discountInfo.company &&
				card.label === discountInfo.card
			) {
				return card.calc(amount);
			}
		}
	}

	return 0;
}

/**
 * 메시지 템플릿에서 변수 치환
 */
function replaceMessageVariables(
	message: string,
	variables: Record<string, string | number>,
): string {
	let result = message;
	Object.entries(variables).forEach(([key, value]) => {
		const placeholder = `{${key}}`;
		result = result.replace(new RegExp(placeholder, 'g'), value.toString());
	});
	return result;
}

/**
 * 카드 할인 타입에 따른 안내 메시지 생성 (catalog 기반)
 */
export function getCardInfoMessages(
	discountType: CardDiscountType,
	totalAmount: number,
	discountAmount: number,
): CardInfoMessage[] {
	const messages: CardInfoMessage[] = [];

	if (discountType === 'none') return messages;

	// 카탈로그에서 해당 카드의 infoMessages 찾기
	for (const [companyKey, company] of Object.entries(CARD_DISCOUNT_COMPANIES)) {
		for (const [cardKey, card] of Object.entries(company.cardDiscounts)) {
			const cardDiscountInfo = getCardDiscountInfo(discountType);
			if (
				cardDiscountInfo &&
				company.label === cardDiscountInfo.company &&
				card.label === cardDiscountInfo.card &&
				card.infoMessages
			) {
				// 각 메시지에 대해 조건 확인 및 변수 치환
				card.infoMessages.forEach((msgTemplate) => {
					// 조건이 있으면 확인
					if (
						msgTemplate.condition &&
						!msgTemplate.condition(totalAmount, discountAmount)
					) {
						return;
					}

					// 변수 준비
					const variables: Record<string, string | number> = {
						maxDiscount: totalAmount < 5000 ? 0 : 999 - (totalAmount % 1000),
						additionalAmount: 5000 - totalAmount,
						expectedDiscount: Math.floor(totalAmount * 0.07),
						discountAmount: discountAmount,
					};

					// 메시지 생성
					const processedMessage: CardInfoMessage = {
						type: msgTemplate.type,
						title: msgTemplate.title,
						message: replaceMessageVariables(msgTemplate.message, variables),
					};

					messages.push(processedMessage);
				});
			}
		}
	}

	return messages;
}
