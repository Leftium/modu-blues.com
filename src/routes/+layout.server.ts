import routes from './routes.json';

const routeMap: Record<string, unknown> = {};

for (const { path, title, formUrl } of routes) {
	routeMap[path] = { title, formUrl };
}

export const load = async () => {
	console.log('+layout.server load');

	return { routes, routeMap };
};
