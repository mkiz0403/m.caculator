'use client';

import { message } from 'antd';
import { useEffect, useState } from 'react';
import { PairDropdown } from '../../../../shared/CustomDropdown';
import {
	getCardDiscountType,
	type CardDiscountType,
} from '../lib/discountUtils';
import { CARD_DISCOUNT_COMPANIES } from '../model/catalog';

interface CardSelectProps {
	onCardDiscountChange: (discount: CardDiscountType) => void;
}

export default function CardSelect({ onCardDiscountChange }: CardSelectProps) {
	const [selectedCompany, setSelectedCompany] = useState<string>('');
	const [selectedCard, setSelectedCard] = useState<string>('');

	// localStorage에서 상태 복원
	useEffect(() => {
		const savedCompany = localStorage.getItem('selectedCardCompany');
		const savedCard = localStorage.getItem('selectedCard');

		if (savedCompany) {
			setSelectedCompany(savedCompany);
		}
		if (savedCard) {
			setSelectedCard(savedCard);
			// 복원된 카드에 따른 할인 타입 설정
			const discountType = getCardDiscountType(savedCompany || '', savedCard);
			onCardDiscountChange(discountType);
		}
	}, [onCardDiscountChange]);

	// 카드사 목록을 DropdownItem 형식으로 변환
	const companyItems = Object.entries(CARD_DISCOUNT_COMPANIES).map(
		([key, company]) => ({
			key,
			label: company.label,
			onClick: () => setSelectedCompany(company.label),
		}),
	);

	// 선택된 카드사의 카드 목록을 DropdownItem 형식으로 변환
	const cardItems = selectedCompany
		? Object.entries(
				CARD_DISCOUNT_COMPANIES[
					selectedCompany as keyof typeof CARD_DISCOUNT_COMPANIES
				]?.cardDiscounts || {},
			).map(([key, card]) => ({
				key,
				label: card.label,
				onClick: () => setSelectedCard(card.label),
			}))
		: [];

	return (
		<PairDropdown
			firstLabel="할인카드"
			firstItems={companyItems}
			secondItems={cardItems}
			firstPlaceholder="카드사"
			secondPlaceholder="카드 선택"
			onFirstSelect={(key: string) => {
				setSelectedCompany(key);
				setSelectedCard(''); // 카드사 변경 시 카드 초기화
				onCardDiscountChange('none'); // 카드사 변경 시 할인 초기화

				// localStorage에 저장
				localStorage.setItem('selectedCardCompany', key);
				localStorage.removeItem('selectedCard');
			}}
			onSecondSelect={(key: string) => {
				setSelectedCard(key);
				const discountType = getCardDiscountType(selectedCompany, key);
				onCardDiscountChange(discountType);

				// localStorage에 저장
				localStorage.setItem('selectedCard', key);
			}}
			firstChildren={selectedCompany || '카드사'}
			secondChildren={selectedCard || '카드 선택'}
			onReset={() => {
				setSelectedCompany('');
				setSelectedCard('');
				onCardDiscountChange('none');
				message.success('카드 선택이 초기화되었습니다.');

				// localStorage에서 제거
				localStorage.removeItem('selectedCardCompany');
				localStorage.removeItem('selectedCard');
			}}
		/>
	);
}
