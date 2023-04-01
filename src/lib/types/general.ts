import type { Writable } from 'svelte/store';

export interface XYPosition {
	x: Writable<number>;
	y: Writable<number>;
}

export interface XYPair {
	x: number;
	y: number;
}

export interface NodeDOMBounds {
	id: string;
	top: number;
	left: number;
	width: number;
	height: number;
}

export interface Dimensions {
	width: Writable<number>;
	height: Writable<number>;
}

export interface ActiveKeys {
	[key: string]: boolean | number;
}

export type BackgroundStyles = 'lines' | 'dots' | 'none';

export interface ActiveIntervals extends Record<string, NodeJS.Timer | undefined> {
	[key: string]: NodeJS.Timer | undefined;
}

export type CSSColorString =
	| NamedColors
	| `#${string}`
	| `rgb(${number},${number},${number})`
	| `rgba(${number},${number},${number},${number | string})`
	| `hsl(${number},${number}%,${number}%)`
	| `hsla(${number},${number}%,${number}%,${number | string})`;

type NamedColors =
	| 'aliceblue'
	| 'antiquewhite'
	| 'aqua'
	| 'aquamarine'
	| 'azure'
	| 'beige'
	| 'bisque'
	| 'black'
	| 'blanchedalmond'
	| 'blue'
	| 'blueviolet'
	| 'brown'
	| 'burlywood'
	| 'cadetblue'
	| 'chartreuse'
	| 'chocolate'
	| 'coral'
	| 'cornflowerblue'
	| 'cornsilk'
	| 'crimson'
	| 'cyan'
	| 'darkblue'
	| 'darkcyan'
	| 'darkgoldenrod'
	| 'darkgray'
	| 'darkgreen'
	| 'darkgrey'
	| 'darkkhaki'
	| 'darkmagenta'
	| 'darkolivegreen'
	| 'darkorange'
	| 'darkorchid'
	| 'darkred'
	| 'darksalmon'
	| 'darkseagreen'
	| 'darkslateblue'
	| 'darkslategray'
	| 'darkslategrey'
	| 'darkturquoise'
	| 'darkviolet'
	| 'deeppink'
	| 'deepskyblue'
	| 'dimgray'
	| 'dimgrey'
	| 'dodgerblue'
	| 'firebrick'
	| 'floralwhite'
	| 'forestgreen'
	| 'fuchsia'
	| 'gainsboro'
	| 'ghostwhite'
	| 'gold'
	| 'goldenrod'
	| 'gray'
	| 'green'
	| 'greenyellow'
	| 'grey'
	| 'honeydew'
	| 'hotpink'
	| 'indianred'
	| 'indigo'
	| 'ivory'
	| 'khaki'
	| 'lavender'
	| 'lavenderblush'
	| 'lawngreen'
	| 'lemonchiffon'
	| 'lightblue'
	| 'lightcoral'
	| 'lightcyan'
	| 'lightgoldenrodyellow'
	| 'lightgray'
	| 'lightgreen'
	| 'lightgrey'
	| 'lightpink'
	| 'lightsalmon'
	| 'lightseagreen'
	| 'lightskyblue'
	| 'lightslategray'
	| 'lightslategrey'
	| 'lightsteelblue'
	| 'lightyellow'
	| 'lime'
	| 'limegreen'
	| 'linen'
	| 'magenta'
	| 'maroon'
	| 'mediumaquamarine'
	| 'mediumblue'
	| 'mediumorchid'
	| 'mediumpurple'
	| 'mediumseagreen'
	| 'mediumslateblue'
	| 'mediumspringgreen'
	| 'mediumturquoise'
	| 'mediumvioletred'
	| 'midnightblue'
	| 'mintcream'
	| 'mistyrose'
	| 'moccasin'
	| 'navajowhite'
	| 'navy'
	| 'oldlace'
	| 'olive'
	| 'olivedrab'
	| 'orange'
	| 'orangered'
	| 'orchid'
	| 'palegoldenrod'
	| 'palegreen'
	| 'paleturquoise'
	| 'palevioletred'
	| 'papayawhip'
	| 'peachpuff'
	| 'peru'
	| 'pink'
	| 'plum'
	| 'powderblue'
	| 'purple'
	| 'rebeccapurple'
	| 'red'
	| 'rosybrown'
	| 'royalblue'
	| 'saddlebrown'
	| 'salmon'
	| 'sandybrown'
	| 'seagreen'
	| 'seashell'
	| 'sienna'
	| 'silver'
	| 'skyblue'
	| 'slateblue'
	| 'slategray'
	| 'slategrey'
	| 'snow'
	| 'springgreen'
	| 'steelblue'
	| 'tan'
	| 'teal'
	| 'thistle'
	| 'tomato'
	| 'turquoise'
	| 'violet'
	| 'wheat'
	| 'white'
	| 'whitesmoke'
	| 'yellow'
	| 'yellowgreen'
	| 'transparent';
