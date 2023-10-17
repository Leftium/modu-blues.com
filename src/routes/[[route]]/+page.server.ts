import { load as prettyFormLoad } from '../(no-nav)/pretty/form/+page.server';

export async function load({ url, fetch, parent }) {
	const { routeMap } = await parent();
	const pathname = url.pathname;

	url.searchParams.set('u', routeMap[pathname]?.formUrl);
	return prettyFormLoad({ url, fetch, parent });
}
