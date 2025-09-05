import {
	calculateCardDiscount,
	getCardDiscountInfo,
	getCardInfoMessages,
	type CardDiscountType,
} from '../features/card/lib/discountUtils';
import type { CardInfoMessage } from '../features/card/model/types';
import {
	calculateMembershipDiscount,
	getMembershipDiscountInfo,
	getMembershipInfoMessages,
	type MembershipDiscountType,
} from '../features/membership/lib/discountUtils';
import type { MembershipInfoMessage } from '../features/membership/model/types';

export interface AppliedDiscount {
	id: string;
	title: string;
	message: string;
	type: 'card' | 'membership';
	discountType: CardDiscountType | MembershipDiscountType;
}

/**
 * 적용된 모든 할인 정보를 반환
 */
export function getAllAppliedDiscounts(
	cardDiscount: CardDiscountType,
	membershipDiscount: MembershipDiscountType,
): AppliedDiscount[] {
	const discounts: AppliedDiscount[] = [];

	// 카드 할인 정보 추가
	const cardInfo = getCardDiscountInfo(cardDiscount);
	if (cardInfo) {
		discounts.push({
			id: `card-${cardInfo.type}`,
			title: cardInfo.title,
			message: cardInfo.message,
			type: 'card',
			discountType: cardInfo.type,
		});
	}

	// 멤버쉽 할인 정보 추가
	const membershipInfo = getMembershipDiscountInfo(membershipDiscount);
	if (membershipInfo) {
		discounts.push({
			id: `membership-${membershipInfo.type}`,
			title: membershipInfo.title,
			message: membershipInfo.message,
			type: 'membership',
			discountType: membershipInfo.type,
		});
	}

	return discounts;
}

/**
 * 할인 정보를 사용자 친화적인 메시지로 변환
 */
export function formatDiscountMessage(discount: AppliedDiscount): string {
	return `${discount.title} (${discount.message})`;
}

/**
 * 할인이 적용되었는지 확인
 */
export function hasAnyDiscount(
	cardDiscount: CardDiscountType,
	membershipDiscount: MembershipDiscountType,
): boolean {
	return cardDiscount !== 'none' || membershipDiscount !== 'none';
}

/**
 * 총 할인 금액을 계산 (카드 + 멤버쉽)
 */
export function calculateTotalDiscount(
	amount: number,
	cardDiscount: CardDiscountType,
	membershipDiscount: MembershipDiscountType,
): number {
	const cardDiscountAmount = calculateCardDiscount(amount, cardDiscount);
	const membershipDiscountAmount = calculateMembershipDiscount(
		amount,
		membershipDiscount,
	);

	return cardDiscountAmount + membershipDiscountAmount;
}

/**
 * 카드 할인 금액만 계산
 */
export function getCardDiscountAmount(
	amount: number,
	cardDiscount: CardDiscountType,
): number {
	return calculateCardDiscount(amount, cardDiscount);
}

/**
 * 멤버쉽 할인 금액만 계산
 */
export function getMembershipDiscountAmount(
	amount: number,
	membershipDiscount: MembershipDiscountType,
): number {
	return calculateMembershipDiscount(amount, membershipDiscount);
}

/**
 * 최종 결제 금액 계산 (원래 금액 - 총 할인)
 */
export function calculateFinalAmount(
	originalAmount: number,
	cardDiscount: CardDiscountType,
	membershipDiscount: MembershipDiscountType,
): number {
	const totalDiscount = calculateTotalDiscount(
		originalAmount,
		cardDiscount,
		membershipDiscount,
	);
	return Math.max(0, originalAmount - totalDiscount);
}

/**
 * 통합된 안내 메시지 타입
 */
export type InfoMessage = CardInfoMessage | MembershipInfoMessage;

/**
 * 모든 안내 메시지를 가져오기 (카드 + 멤버쉽)
 */
export function getAllInfoMessages(
	totalAmount: number,
	cardDiscount: CardDiscountType,
	membershipDiscount: MembershipDiscountType,
): InfoMessage[] {
	const messages: InfoMessage[] = [];

	// 카드 안내 메시지
	const cardDiscountAmount = getCardDiscountAmount(totalAmount, cardDiscount);
	const cardMessages = getCardInfoMessages(
		cardDiscount,
		totalAmount,
		cardDiscountAmount,
	);
	messages.push(...cardMessages);

	// 멤버쉽 안내 메시지
	const membershipDiscountAmount = getMembershipDiscountAmount(
		totalAmount,
		membershipDiscount,
	);
	const membershipMessages = getMembershipInfoMessages(
		membershipDiscount,
		totalAmount,
		membershipDiscountAmount,
	);
	messages.push(...membershipMessages);

	return messages;
}
