'use client';

import { useEffect, useState } from 'react';
import { PairDropdown } from '../../../../shared/CustomDropdown';
import {
	getMembershipDiscountType,
	type MembershipDiscountType,
} from '../lib/discountUtils';
import { MEMBERSHIP_PARTNERS } from '../model/catalog';

interface MembershipSelectProps {
	onMembershipDiscountChange: (discount: MembershipDiscountType) => void;
}

export default function MembershipSelect({
	onMembershipDiscountChange,
}: MembershipSelectProps) {
	const [selectedPartner, setSelectedPartner] = useState<string>('');
	const [selectedMembership, setSelectedMembership] = useState<string>('');

	// localStorage에서 상태 복원
	useEffect(() => {
		const savedPartner = localStorage.getItem('selectedMembershipPartner');
		const savedMembership = localStorage.getItem('selectedMembership');

		if (savedPartner) {
			setSelectedPartner(savedPartner);
		}
		if (savedMembership) {
			setSelectedMembership(savedMembership);
			// 복원된 멤버쉽에 따른 할인 타입 설정
			const discountType = getMembershipDiscountType(
				savedPartner || '',
				savedMembership,
			);
			onMembershipDiscountChange(discountType);
		}
	}, [onMembershipDiscountChange]);

	// 파트너 목록을 DropdownItem 형식으로 변환
	const partnerItems = Object.entries(MEMBERSHIP_PARTNERS).map(
		([key, partner]) => ({
			key,
			label: partner.label,
			onClick: () => setSelectedPartner(partner.label),
		}),
	);

	// 선택된 파트너의 멤버십 목록을 DropdownItem 형식으로 변환
	const membershipItems = selectedPartner
		? Object.entries(
				MEMBERSHIP_PARTNERS[selectedPartner as keyof typeof MEMBERSHIP_PARTNERS]
					?.memberships || {},
			).map(([key, membership]) => ({
				key,
				label: membership.label,
				onClick: () => setSelectedMembership(membership.label),
			}))
		: [];

	return (
		<PairDropdown
			firstLabel="멤버쉽"
			firstItems={partnerItems}
			secondItems={membershipItems}
			firstPlaceholder="제휴사"
			secondPlaceholder="멤버쉽"
			onFirstSelect={(key: string) => {
				setSelectedPartner(key);
				setSelectedMembership(''); // 파트너 변경 시 멤버십 초기화
				onMembershipDiscountChange('none'); // 파트너 변경 시 할인 초기화

				// localStorage에 저장
				localStorage.setItem('selectedMembershipPartner', key);
				localStorage.removeItem('selectedMembership');
			}}
			onSecondSelect={(key: string) => {
				setSelectedMembership(key);
				const discountType = getMembershipDiscountType(selectedPartner, key);
				onMembershipDiscountChange(discountType);

				// localStorage에 저장
				localStorage.setItem('selectedMembership', key);
			}}
			firstChildren={selectedPartner || '제휴사 '}
			secondChildren={selectedMembership || '멤버쉽'}
			onReset={() => {
				setSelectedPartner('');
				setSelectedMembership('');
				onMembershipDiscountChange('none');

				// localStorage에서 제거
				localStorage.removeItem('selectedMembershipPartner');
				localStorage.removeItem('selectedMembership');
			}}
		/>
	);
}
