import type { Handle } from '@sveltejs/kit';
export const handle: Handle = async ({ event, resolve }) => {
	console.log('-'.repeat(120));
	console.log(event.url.href);
	console.log(event);

	if (event.url.pathname === '/') {
		console.log(`${'!'.repeat(10)} Adjusting URL!`);
		event.url.pathname = '/pretty/form';
		event.url.search = '?u=https://forms.gle/ipLF7tw1q9QoWbRx6';
		event.route = { id: '/pretty/form' };
		console.log(event.url);
		console.log(event);
	}

	const response = await resolve(event);
	return response;
};
