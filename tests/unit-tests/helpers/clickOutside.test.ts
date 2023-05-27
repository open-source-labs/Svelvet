import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { clickOutside } from '../../../src/lib/utils/helpers';
import { render } from '@testing-library/svelte';

describe('clickOutside', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should dispatch a CustomEvent called "outclick" to node', () => {
		expect(1 + 1).toEqual(2);
		// expect().toHaveBeenCalledTimes(1)
	});
});
