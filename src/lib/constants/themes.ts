import type { CSSColorString } from '$lib/types';

const light: Theme = {
	node: '#FFF',
	border: '#000',
	text: '#000',
	selection: '#000',
	header: '#000',
	edge: '#000',
	anchor: '#000'
};

const dark: Theme = {
	node: '#333',
	border: '#C76738',
	text: '#C76738',
	selection: '#38C7C7',
	header: '#C76738',
	edge: '#C76738',
	anchor: '#38C7C7'
};

const light2: Theme = {
	node: '#FFF',
	border: '#3878C7',
	text: '#3878C7',
	selection: '#C73838',
	header: '#3878C7',
	edge: '#3878C7',
	anchor: '#C73838'
};

const light3: Theme = {
	node: '#FFF',
	border: '#47C73D',
	text: '#47C73D',
	selection: '#C7479D',
	header: '#47C73D',
	edge: '#47C73D',
	anchor: '#C7479D'
};

const light4: Theme = {
	node: '#FFF',
	border: '#C7C038',
	text: '#C7C038',
	selection: '#3D38C7',
	header: '#C7C038',
	edge: '#C7C038',
	anchor: '#3D38C7'
};

export const THEMES = {
	light,
	dark,
	light2,
	light3,
	light4
};

export interface Theme {
	node: CSSColorString;
	border: CSSColorString;
	text: CSSColorString;
	selection: CSSColorString;
	header: CSSColorString;
	edge: CSSColorString;
	anchor: CSSColorString;
}
