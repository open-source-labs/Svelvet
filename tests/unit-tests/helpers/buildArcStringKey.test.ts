import { describe, expect, it } from 'vitest';
import { buildArcStringKey } from '$lib/utils';

describe('Testing buildArcStringKey', () => {
	it('zero values in input coordinates should be represented as "0" in the output string', () => {
		expect(buildArcStringKey({ x: 0, y: 0 }, { x: 100, y: 100 })).toEqual('0011');
		expect(buildArcStringKey({ x: 10, y: 10 }, { x: 0, y: 0 })).toEqual('1100');
	});
	it('negative values in input coordinates should be represented as "-1" in the output string', () => {
		expect(buildArcStringKey({ x: 9, y: -10 }, { x: 10, y: -39 })).toEqual('1-11-1');
		expect(buildArcStringKey({ x: -10, y: -10 }, { x: -100, y: -100 })).toEqual('-1-1-1-1');
	});
});
