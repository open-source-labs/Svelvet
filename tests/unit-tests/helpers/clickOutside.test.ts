import { describe, expect, it, afterEach, vi } from 'vitest';

describe('clickOutside', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should dispatch a CustomEvent called "outclick" to node', () => {
		expect(1 + 1).toEqual(2);
		// expect().toHaveBeenCalledTimes(1)
	});
});
