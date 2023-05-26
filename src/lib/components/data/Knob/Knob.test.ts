import { describe, expect, test, assert, beforeAll } from 'vitest';
import { render } from '@testing-library/svelte';
import { Svelvet, Node, Knob } from '$lib';
// import Volume from '../../example-components/test-components/Volume.svelte';

test('should render', () => {
	// results is an object containing a series of methods that can be used to query the rendered component in a variety of ways: https://testing-library.com/docs/queries/about/#types-of-queries
	const { container } = render(Svelvet, { id: 1 });
	const svelvetElement = document.getElementById('1');
	// expect().toBe(1);
	expect(document.getElementById('1')).toBe(svelvetElement);
});

// test('should work as expected2', () => {
// 	expect(Math.sqrt(4)).toBe(1);
// 	// assert.equal(Math.sqrt(4), 1);
// });

// describe('testing initial values', () => {
// 	beforeAll(() => {

// 		const node = render(Node, {} )

// 	});
// });
