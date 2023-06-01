import { describe, expect, it } from 'vitest';
import { buildPath } from '$lib/utils';

describe('Testing buildPath', () => {
	it('expect the output string to be formated as expected', () => {
		expect(buildPath('str1', 0, 7, 'str2')).toEqual('str1 l 0 7 str2');
	});
});
