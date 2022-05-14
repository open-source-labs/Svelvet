import type { Connection } from './general';
import type { HandleElement, HandleType } from './handles';
import type { Node } from './nodes';
import type { Position } from './utils';

// interface for the user edge items
export interface Edge<T = any> {
	id: string;
	type?: string;
	source: string;
	target: string;
	sourceHandle?: string | null;
	targetHandle?: string | null;
	label?: string | any; //ReactNode
	labelStyle?: any; //CSS Properties
	labelShowBg?: boolean;
	labelBgStyle?: any; // CSS Properties
	labelBgPadding?: [number, number];
	labelBgBorderRadius?: number;
	style?: any; // CSSProperties
	animated?: boolean;
	hidden?: boolean;
	data?: T;
	className?: string;
	sourceNode?: Node;
	targetNode?: Node;
	selected?: boolean;
	markerStart?: EdgeMarkerType;
	markerEnd?: EdgeMarkerType;
	zIndex?: number;
}

export type DefaultEdgeOptions = Omit<
	Edge,
	'id' | 'source' | 'target' | 'sourceHandle' | 'targetHandle' | 'sourceNode' | 'targetNode'
>;

// props that get passed to a custom edge
export interface EdgeProps<T = any> {
	id: string;
	source: string;
	target: string;
	sourceX: number;
	sourceY: number;
	targetX: number;
	targetY: number;
	selected?: boolean;
	animated?: boolean;
	sourcePosition: Position;
	targetPosition: Position;
	label?: string | any; //ReactNode
	labelStyle?: any; // CSS Properties
	labelShowBg?: boolean;
	labelBgStyle?: any; // CSS Properties
	labelBgPadding?: [number, number];
	labelBgBorderRadius?: number;
	style?: any; // CSS Properties
	data?: T;
	sourceHandleId?: string | null;
	targetHandleId?: string | null;
	markerStart?: string;
	markerEnd?: string;
	curvature?: number;
}

export type BaseEdgeProps = Pick<
	EdgeProps,
	| 'label'
	| 'labelStyle'
	| 'labelShowBg'
	| 'labelBgStyle'
	| 'labelBgPadding'
	| 'labelBgBorderRadius'
	| 'style'
	| 'markerStart'
	| 'markerEnd'
> & {
	centerX: number;
	centerY: number;
	path: string;
};

export type EdgeMouseHandler = (event: any, edge: Edge) => void; //event used to be React.MouseEvent

export interface WrapEdgeProps<T = any> {
	id: string;
	className?: string;
	type: string;
	data?: T;
	onClick?: EdgeMouseHandler;
	onEdgeDoubleClick?: EdgeMouseHandler;
	selected: boolean;
	animated?: boolean;
	label?: string | any; // ReactNode
	labelStyle?: any; //CSS Properties
	labelShowBg?: boolean;
	labelBgStyle?: any; // CSS Properties
	labelBgPadding?: [number, number];
	labelBgBorderRadius?: number;
	style?: any; // CSS Properties
	source: string;
	target: string;
	sourceHandleId?: string | null;
	targetHandleId?: string | null;
	sourceX: number;
	sourceY: number;
	targetX: number;
	targetY: number;
	sourcePosition: Position;
	targetPosition: Position;
	elementsSelectable?: boolean;
	hidden?: boolean;
	onEdgeUpdate?: OnEdgeUpdateFunc;
	onContextMenu?: EdgeMouseHandler;
	onMouseEnter?: EdgeMouseHandler;
	onMouseMove?: EdgeMouseHandler;
	onMouseLeave?: EdgeMouseHandler;
	edgeUpdaterRadius?: number;
	onEdgeUpdateStart?: (event: any, edge: Edge, handleType: HandleType) => void; // any is React.MouseEvent
	onEdgeUpdateEnd?: (event: MouseEvent, edge: Edge, handleType: HandleType) => void;
	markerStart?: EdgeMarkerType;
	markerEnd?: EdgeMarkerType;
}

export interface EdgeSmoothStepProps<T = any> extends EdgeProps<T> {
	borderRadius?: number;
}

// export interface EdgeTextProps extends HTMLAttributes<SVGElement> {
// 	//extends HTMLAttributes
// 	x: number;
// 	y: number;
// 	label?: string | any; // ReactNode
// 	labelStyle?: any; // CSS Properties
// 	labelShowBg?: boolean;
// 	labelBgStyle?: any; // CSS Properties
// 	labelBgPadding?: [number, number];
// 	labelBgBorderRadius?: number;
// }

export enum ConnectionLineType {
	Bezier = 'default',
	Straight = 'straight',
	Step = 'step',
	SmoothStep = 'smoothstep',
	SimpleBezier = 'simplebezier'
}

export type ConnectionLineComponentProps = {
	sourceX: number;
	sourceY: number;
	sourcePosition?: Position;
	targetX: number;
	targetY: number;
	targetPosition?: Position;
	connectionLineStyle?: any; // CSS Properties
	connectionLineType: ConnectionLineType;
	fromNode?: Node;
	fromHandle?: HandleElement;
	// backward compatibility, mark as deprecated?
	sourceNode?: Node;
	sourceHandle?: HandleElement;
};

// export type ConnectionLineComponent = ComponentType<ConnectionLineComponentProps>;

export type OnEdgeUpdateFunc<T = any> = (oldEdge: Edge<T>, newConnection: Connection) => void;

export interface EdgeMarker {
	type: MarkerType;
	color?: string;
	width?: number;
	height?: number;
	markerUnits?: string;
	orient?: string;
	strokeWidth?: number;
}

export type EdgeMarkerType = string | EdgeMarker;

export enum MarkerType {
	Arrow = 'arrow',
	ArrowClosed = 'arrowclosed'
}
