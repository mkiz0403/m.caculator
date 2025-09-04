export type PartnerKey = 'none' | 'SKT';
export type MembershipKey = 'none' | 'sevenEarth' | 'sevenT';

export type MembershipDefault = {
	label: string;
	message: string;
	calc: (amount: number) => number;
};

export type MembershipCatalog = Record<
	PartnerKey,
	{ label: string; memberships: Record<MembershipKey, MembershipDefault> }
>;
