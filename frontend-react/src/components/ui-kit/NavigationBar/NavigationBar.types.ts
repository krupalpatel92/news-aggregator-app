export type NavigationBarItem = {
	name: string;
	url: string;
};

export default interface INavigationBar {
	items: NavigationBarItem[];
}
