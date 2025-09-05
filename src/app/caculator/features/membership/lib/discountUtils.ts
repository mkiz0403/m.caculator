import { MEMBERSHIP_PARTNERS } from '../model/catalog';
import type { MembershipInfoMessage } from '../model/types';

export type MembershipDiscountType = 'none' | 'sevenEarth' | 'sevenT';

export interface MembershipDiscountInfo {
	type: MembershipDiscountType;
	title: string;
	message: string;
	partner: string;
	membership: string;
}

/**
 * 멤버쉽 할인 타입에 따른 할인 정보를 반환
 */
export function getMembershipDiscountInfo(
	discountType: MembershipDiscountType,
): MembershipDiscountInfo | null {
	if (discountType === 'none') return null;

	// 모든 파트너와 멤버쉽을 순회하며 해당 할인 타입을 찾기
	for (const [partnerKey, partner] of Object.entries(MEMBERSHIP_PARTNERS)) {
		for (const [membershipKey, membership] of Object.entries(
			partner.memberships,
		)) {
			// 할인 타입 매핑
			const membershipDiscountType = getMembershipDiscountType(
				partner.label,
				membership.label,
			);

			if (membershipDiscountType === discountType) {
				return {
					type: discountType,
					title: `${membership.label}`,
					message: membership.message,
					partner: partner.label,
					membership: membership.label,
				};
			}
		}
	}

	return null;
}

/**
 * 파트너와 멤버쉽명으로 할인 타입을 결정
 */
export function getMembershipDiscountType(
	partner: string,
	membership: string,
): MembershipDiscountType {
	if (partner === 'SKT') {
		if (membership === '세븐일레븐 (우주패스)') return 'sevenEarth';
		if (membership === '세븐일레븐 (T할인)') return 'sevenT';
	}
	return 'none';
}

/**
 * 선택된 파트너와 멤버쉽으로부터 할인 정보를 생성
 */
export function createMembershipDiscountFromSelection(
	selectedPartner: string,
	selectedMembership: string,
): MembershipDiscountInfo | null {
	const discountType = getMembershipDiscountType(
		selectedPartner,
		selectedMembership,
	);
	return getMembershipDiscountInfo(discountType);
}

/**
 * 멤버쉽 할인 타입에 따른 할인 금액을 계산
 */
export function calculateMembershipDiscount(
	amount: number,
	discountType: MembershipDiscountType,
): number {
	if (discountType === 'none') return 0;

	const discountInfo = getMembershipDiscountInfo(discountType);
	if (!discountInfo) return 0;

	// 카탈로그에서 해당 멤버쉽의 calc 함수를 찾아서 실행
	for (const [partnerKey, partner] of Object.entries(MEMBERSHIP_PARTNERS)) {
		for (const [membershipKey, membership] of Object.entries(
			partner.memberships,
		)) {
			if (
				partner.label === discountInfo.partner &&
				membership.label === discountInfo.membership
			) {
				return membership.calc(amount);
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
 * 멤버쉽 할인 타입에 따른 안내 메시지 생성 (catalog 기반)
 */
export function getMembershipInfoMessages(
	discountType: MembershipDiscountType,
	totalAmount: number,
	discountAmount: number,
): MembershipInfoMessage[] {
	const messages: MembershipInfoMessage[] = [];

	if (discountType === 'none') return messages;

	// 카탈로그에서 해당 멤버쉽의 infoMessages 찾기
	for (const [partnerKey, partner] of Object.entries(MEMBERSHIP_PARTNERS)) {
		for (const [membershipKey, membership] of Object.entries(
			partner.memberships,
		)) {
			const membershipDiscountInfo = getMembershipDiscountInfo(discountType);
			if (
				membershipDiscountInfo &&
				partner.label === membershipDiscountInfo.partner &&
				membership.label === membershipDiscountInfo.membership &&
				membership.infoMessages
			) {
				// 각 메시지에 대해 조건 확인 및 변수 치환
				membership.infoMessages.forEach((msgTemplate) => {
					// 조건이 있으면 확인
					if (
						msgTemplate.condition &&
						!msgTemplate.condition(totalAmount, discountAmount)
					) {
						return;
					}

					// 변수 준비
					const variables: Record<string, string | number> = {
						discountAmount: discountAmount,
					};

					// 메시지 생성
					const processedMessage: MembershipInfoMessage = {
						type: msgTemplate.type,
						title: msgTemplate.title || undefined,
						message: replaceMessageVariables(msgTemplate.message, variables),
						secondMessage: msgTemplate.secondMessage
							? replaceMessageVariables(msgTemplate.secondMessage, variables)
							: undefined,
					};

					messages.push(processedMessage);
				});
			}
		}
	}

	return messages;
}
