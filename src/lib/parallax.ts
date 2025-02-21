export const parallax = (node: Element, params: { hero: boolean }) => {
	let instance: { destroy: () => void };

	if (params.hero) {
		import('simple-parallax-js/vanilla').then(({ default: SimpleParallax }) => {
			instance = new SimpleParallax(node, {
				delay: 1,
				scale: 1.6,
				transition: 'cubic-bezier(0,0,0,1)'
			});
		});
	}

	return {
		destroy: () => {
			if (instance) {
				instance.destroy();
			}
		}
	};
};
