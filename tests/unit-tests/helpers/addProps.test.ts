import { describe, expect, it, beforeEach } from 'vitest';
import { addProps } from '$lib/utils';

describe('Testing addProps', () => {
	const propObjectTest: Record<string, any> = {};

	it('props width and height should match the input values respectively', () => {
		addProps(['width', 'height'], [100, 80], propObjectTest);
		expect(propObjectTest.width).toEqual(100);
		expect(propObjectTest.height).toEqual(80);
	});

	it('should work for when zero is present in the propValues array', () => {
		addProps(['width', 'height'], [0, 80], propObjectTest);
		expect(propObjectTest.width).toEqual(0);
		expect(propObjectTest.height).toEqual(80);
	});

	it('should work for mixed types of values in the input propValues array', () => {
		addProps(['invisible', 'anchorEdgeLabel', 'height'], [true, 'connection', 80], propObjectTest);
		expect(propObjectTest.invisible).toEqual(true);
		expect(propObjectTest.anchorEdgeLabel).toEqual('connection');
		expect(propObjectTest.height).toEqual(80);
	});

	it('should work for mixed types of values in the input propValues array', () => {
		addProps(['invisible', 'anchorEdgeLabel', 'height'], [true, 'connection', 80], propObjectTest);
		expect(propObjectTest.invisible).toEqual(true);
		expect(propObjectTest.anchorEdgeLabel).toEqual('connection');
		expect(propObjectTest.height).toEqual(80);
	});

	it('should work if propsNames array is longer than propsValues array', () => {
		addProps(['a', 'b', 'c'], [0, 1], propObjectTest);
		expect(propObjectTest.a).toEqual(0);
		expect(propObjectTest.c).toEqual(undefined);
	});
});
