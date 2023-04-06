// Function to check if a value is a Svelte store
function isStore(value) {
	return value && typeof value.subscribe === 'function';
}

// Function to traverse a nested object and extract the data
function traverse(obj) {
	const output = {};

	for (const key in obj) {
		const value = obj[key];
		if (key === 'dimensions') continue;
		if (isStore(value)) {
			let storeValue;
			value.subscribe(($value) => {
				storeValue = $value;
			})();
			output[key] =
				typeof storeValue === 'object' && storeValue !== null ? traverse(storeValue) : storeValue;
		} else if (typeof value === 'object' && value !== null) {
			output[key] = traverse(value);
		} else {
			output[key] = value;
		}
	}

	return output;
}

// Custom replacer function for JSON.stringify()
function domRectReplacer(key, value) {
	if (value instanceof DOMRectReadOnly) {
		return {
			x: value.x,
			y: value.y,
			width: value.width,
			height: value.height
		};
	}
	return value;
}

// Function to get JSON stringified data from nested Svelte store
export function getJSONState(store) {
	const data = traverse(store);
	return JSON.stringify(data, domRectReplacer, 2);
}
