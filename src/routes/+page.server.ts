import { load as prettyFormLoad } from './pretty/form/+page.server';

export function load({ url, fetch }) {
	url.searchParams.set('u', 'https://forms.gle/ipLF7tw1q9QoWbRx6');
	return prettyFormLoad({ url, fetch });
}
