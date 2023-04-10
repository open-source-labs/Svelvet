import type { CSSColorString } from '$lib/types';

const light: Theme = {
	node: '#F3F3F3',
	map: '#FFF',
	border: '#DDD',
	text: '#333',
	selection: '#222',
	header: '#666',
	edge: '#AAA',
	anchor: '#AAA',
	controls: '#EEE',
	dots: '#888'
};

const dark: Theme = {
	node: '#333',
	map: '#444',
	border: '#111',
	text: '#FFF',
	selection: '#DDD',
	header: '#888',
	edge: 'white',
	anchor: '#777',
	controls: '#555',
	dots: '#777'
};

const purple: Theme = {
	node: '#6C567B',
	map: '#34274E',
	border: '#3A2E58',
	text: '#E0E0E0',
	selection: '#DDD',
	header: '#5A3A69',
	edge: 'white',
	anchor: '#B39BC8',
	controls: '#7E6191',
	dots: '#685A87'
};

const sunset: Theme = {
	node: '#f18f01',
	map: '#F0B27A',
	border: '#D98880',
	text: '#6E2C00',
	selection: '#F0E68C',
	header: '#F1948A',
	edge: '#c73e1d',
	anchor: '#F5B7B1',
	controls: '#C39BD3',
	dots: '#2D9743'
};

const ocean: Theme = {
	node: '#AED6F1',
	map: '#5DADE2',
	border: '#2874A6',
	text: '#1F618D',
	selection: '#5499C7',
	header: '#3498DB',
	edge: 'white',
	anchor: '#85C1E9',
	controls: '#1B4F72',
	dots: '#2D9743'
};
const parchment = {
	map: '#E0DFD5',
	dots: '#313638',
	node: '#E8E9EB',
	edge: '#313638',
	anchor: '#313638',
	controls: '#E8E9EB',
	header: '#96705B',
	border: '#E0DFD5',
	text: '#313638',
	selection: '#313638'
};

export const THEMES = {
	light,
	dark,
	purple,
	ocean,
	sunset,
	parchment
};

export interface Theme {
	node: CSSColorString;
	border: CSSColorString;
	text: CSSColorString;
	selection: CSSColorString;
	header: CSSColorString;
	edge: CSSColorString;
	anchor: CSSColorString;
	map: CSSColorString;
	controls: CSSColorString;
	dots: CSSColorString;
}
