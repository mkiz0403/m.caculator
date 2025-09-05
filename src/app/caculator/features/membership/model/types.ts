export type PartnerKey = 'SKT';

export type MembershipInfoMessage = {
	type: 'info' | 'warning' | 'success';
	title?: string;
	message: string;
	condition?: (amount: number, discountAmount: number) => boolean;
};

export type MembershipDefault = {
	label: string;
	message: string;
	calc: (amount: number) => number;
	infoMessages?: MembershipInfoMessage[];
};

export type MembershipCatalog = Record<
	PartnerKey,
	{ label: string; memberships: Record<string, MembershipDefault> }
>;
