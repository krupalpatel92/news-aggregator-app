export interface UserProfile {
	id: number;
	name: string;
}

export interface LoginAction {
	accessToken: string;
	expireAt: string;
	user: UserProfile;
}

export interface AuthContextType {
	token: string | undefined;
	isLoggedIn: boolean;
	userProfile: UserProfile | null;
	setLogin: (param: LoginAction) => void;
	setLogout: () => void;
}
