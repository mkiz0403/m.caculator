export type PartnerKey = 'SKT';

export type MembershipDefault = {
	label: string;
	message: string;
	calc: (amount: number) => number;
};

export type MembershipCatalog = Record<
	PartnerKey,
	{ label: string; memberships: Record<string, MembershipDefault> }
>;
