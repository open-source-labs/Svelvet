import type { CSSColorString, ThemeGroup } from '$lib/types';

const light: ThemeGroup = {
	node: '#F3F3F3',
	map: '#FFF',
	border: '#DDD',
	text: '#333',
	selection: '#222',
	header: '#666',
	edge: '#444',
	anchor: '#AAA',
	controls: '#EEE',
	dots: '#888',
	alt: '#FFF',
	primary: 'lightgray'
};

const dark: ThemeGroup = {
	node: '#333',
	map: '#444',
	border: '#111',
	text: '#FFF',
	selection: '#DDD',
	header: '#888',
	edge: 'white',
	anchor: '#777',
	controls: '#555',
	dots: '#999',
	alt: '#111',
	primary: 'darkgray'
};

const purple: ThemeGroup = {
	node: '#6C567B',
	map: '#34274E',
	border: '#3A2E58',
	text: '#E0E0E0',
	selection: '#DDD',
	header: '#5A3A69',
	edge: 'white',
	anchor: '#B39BC8',
	controls: '#7E6191',
	dots: '#685A87',
	alt: '#34274E'
};

const sunset: ThemeGroup = {
	node: '#f18f01',
	map: '#F0B27A',
	border: '#D98880',
	text: '#6E2C00',
	selection: '#F0E68C',
	header: '#F1948A',
	edge: '#c73e1d',
	anchor: '#F5B7B1',
	controls: '#C39BD3',
	dots: '#2D9743',
	alt: '#F0B27A'
};

const ocean: ThemeGroup = {
	node: '#AED6F1',
	map: '#5DADE2',
	border: '#2874A6',
	text: '#1F618D',
	selection: '#5499C7',
	header: '#3498DB',
	edge: 'white',
	anchor: '#85C1E9',
	controls: '#1B4F72',
	dots: '#2D9743',
	alt: '#5DADE2'
};
const parchment: ThemeGroup = {
	map: '#E0DFD5',
	dots: '#313638',
	node: '#E8E9EB',
	edge: '#313638',
	anchor: '#313638',
	controls: '#E8E9EB',
	header: '#96705B',
	border: '#E0DFD5',
	text: '#313638',
	selection: '#313638',
	alt: '#E0DFD5'
};

export const THEMES = {
	light,
	dark,
	purple,
	ocean,
	sunset,
	parchment
};
