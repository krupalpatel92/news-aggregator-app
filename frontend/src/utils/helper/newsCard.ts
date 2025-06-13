import moment from 'moment';

export const getImageUrl = (image?: string | null): string => {
	//TODO: a quick fix for the image url could be handle in backend.
	const r = image ? image.replace('https://https://', 'https://') : `/placeholder.png`;

	return r;
};

export const getHumanReadableDate = (date: string): string => {
	const dateObject = new Date(date);
	return dateObject.toLocaleDateString('en-US');
};

export const formatTimeAgo = dateString => {
	const date = moment(dateString);
	const now = moment();
	const diffInDays = now.diff(date, 'days');

	if (diffInDays < 2) {
		return date.fromNow();
	} else {
		return date.format('YYYY/MM/DD');
	}
};
