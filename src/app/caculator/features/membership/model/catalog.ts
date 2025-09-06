import { MembershipCatalog } from './types';

export const MEMBERSHIP_PARTNERS: MembershipCatalog = {
	SKT: {
		label: 'SKT',
		memberships: {
			sevenEarth: {
				label: '세븐일레븐 (우주패스)',
				message: '1,000원당 300원 할인',
				calc: (amount: number) => Math.floor(amount / 1000) * 300,
			},
			sevenT: {
				label: '세븐일레븐 (T할인)',
				message: '1,000원당 100원 할인',
				calc: (amount: number) => Math.floor(amount / 1000) * 100,
			},
			twosome: {
				label: '투썸플레이스 (우주패스)',
				message: '30% 할인, 최대 하루 9천원',
				calc: (amount: number) => amount * 0.3,
			},
		},
	},
};
