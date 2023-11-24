import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const u = event.url.searchParams.get('u');

	if (u && event.url.pathname === '/') {
		const uType = /^https:\/\/(forms.gle\/)|(docs.google.com\/forms\/d\/e)/.test(u)
			? 'form'
			: 'sheet';

		const newUrl = new URL(`${event.url.origin}/pretty/${uType}`);
		newUrl.searchParams.set('u', u);
		throw redirect(302, newUrl);
	}

	const response = await resolve(event);
	return response;
};
