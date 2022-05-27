// Svelvet Initial State props:
export type SvelvetInitialState = {};

// interface for Viewport functions
// export interface ViewportFuncs {
// 	zoomIn: ZoomInOut;
// 	zoomOut: ZoomInOut;
// 	resetViewport: ResetViewport;
// }

// type for Viewport
export type Viewport = {
	x: number;
	y: number;
	zoom: number;
};

// interface for Connection (edges)
export interface Connection {
	source: string | null;
	target: string | null;
	sourceHandle: string | null;
	targetHandle: string | null;
}

// // type for Viewport Helper function option
// export type ViewportHelperFunctionOptions = {
// 	duration?: number;
// };

// // type for zoom in and
// export type ZoomInOut = (options?: ViewportHelperFunctionOptions) => void;

