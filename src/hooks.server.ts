import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	console.log('-'.repeat(120), '\nHANDLE', event.url.href);
	const u = event.url.searchParams.get('u');

	if (event.url.href.includes('undefined')) {
		//console.log(event);
	}

	if (false && u && event.url.pathname === '/') {
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
