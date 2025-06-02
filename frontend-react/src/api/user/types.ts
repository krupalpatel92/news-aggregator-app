export type userId = string | number;

export type SignUpPayload = {
	name: string;
	email: string;
	password: string;
};

export type SignInPayload = {
	email: string;
	password: string;
};

export type FeedPreferencesPayload = {
	categoryIds: number[];
	sourceIds: number[];
	authorIds: number[];
};
