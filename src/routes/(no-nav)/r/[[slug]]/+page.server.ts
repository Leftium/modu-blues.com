import { load as prettyFormLoad } from '../../pretty/form/+page.server';

export async function load({ url, fetch, parent }) {
	const { routeMap } = await parent();
	const pathname = url.pathname.replace(/\/r/, '') || '/';

	console.log({ pathname });

	url.searchParams.set('u', routeMap[pathname]?.formUrl);
	return prettyFormLoad({ url, fetch, parent });
}
