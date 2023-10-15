import { load as rootLoad } from '../+page.server';

export async function load(requestEvent) {
	return rootLoad(requestEvent);
}
