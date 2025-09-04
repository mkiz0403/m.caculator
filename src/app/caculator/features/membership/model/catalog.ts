import { MembershipCatalog } from './types';

export const MEMBERSHIP_PARTNERS: MembershipCatalog = {
	none: {
		label: '없음',
		memberships: {
			none: {
				label: '없음',
				message: '없음',
				calc: (amount: number) => amount,
			},
		},
	},
};
