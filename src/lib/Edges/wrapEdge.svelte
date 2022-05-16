<script lang="typescript">
	// import React, { memo, ComponentType, useCallback, useState, useMemo } from 'react';
	// import cc from 'classcat';
	// import shallow from 'zustand/shallow';

	// import { useStore, useStoreApi } from '../../store';
	import type { Edge, EdgeProps, WrapEdgeProps, ReactFlowState, Connection } from '$lib/types'; //change to SvelvetState later
	import { onMouseDown } from '$lib/components/Handle/handler';
	// import { EdgeAnchor } from './EdgeAnchor';
	import { getMarkerId } from '$lib/utils/graph';

	const selector = (s: ReactFlowState) => ({
		//change to s: SvelvetState later
		addSelectedEdges: s.addSelectedEdges,
		connectionMode: s.connectionMode
	});

	let updating: boolean = false;

	export function wrapEdge(EdgeComponent: any) {
		// ComponentType<EdgeProps> type
		const EdgeWrapper = ({
			id,
			className,
			type,
			data,
			onClick,
			onEdgeDoubleClick,
			selected,
			animated,
			label,
			labelStyle,
			labelShowBg,
			labelBgStyle,
			labelBgPadding,
			labelBgBorderRadius,
			style,
			source,
			target,
			sourceX,
			sourceY,
			targetX,
			targetY,
			sourcePosition,
			targetPosition,
			elementsSelectable,
			hidden,
			sourceHandleId,
			targetHandleId,
			onContextMenu,
			onMouseEnter,
			onMouseMove,
			onMouseLeave,
			edgeUpdaterRadius,
			onEdgeUpdate,
			onEdgeUpdateStart,
			onEdgeUpdateEnd,
			markerEnd,
			markerStart
		}: WrapEdgeProps): any | null => {
			// JSX.Element | null
			const store = useStoreApi();
			const { addSelectedEdges, connectionMode } = useStore(selector, shallow);

			// const [updating, setUpdating] = useState<boolean>(false);

			const inactive = !elementsSelectable && !onClick;
			const handleEdgeUpdate = typeof onEdgeUpdate !== 'undefined';
			const edgeClasses = cc([
				'react-flow__edge',
				`react-flow__edge-${type}`,
				className,
				{ selected, animated, inactive, updating }
			]);

			const edgeElement = useMemo<Edge>(() => {
				const el: Edge = {
					id,
					source,
					target,
					type
				};

				if (sourceHandleId) {
					el.sourceHandle = sourceHandleId;
				}

				if (targetHandleId) {
					el.targetHandle = targetHandleId;
				}

				if (typeof data !== 'undefined') {
					el.data = data;
				}

				return el;
			}, [id, source, target, type, sourceHandleId, targetHandleId, data]);

			const onEdgeClick =
				// event type: React.MouseEvent<SVGGElement, MouseEvent>
				(event: any): void => {
					if (elementsSelectable) {
						store.setState({ nodesSelectionActive: false });
						addSelectedEdges([edgeElement.id]);
					}

					onClick?.(event, edgeElement);
				};

			const onEdgeDoubleClickHandler = (event: any) => {
				onEdgeDoubleClick?.(event, edgeElement);
			};

			const onEdgeContextMenu = (event: any): void => {
				onContextMenu?.(event, edgeElement);
			};

			const onEdgeMouseEnter = (event: any): void => {
				onMouseEnter?.(event, edgeElement);
			};

			const onEdgeMouseMove = (event: any): void => {
				onMouseMove?.(event, edgeElement);
			};

			const onEdgeMouseLeave = (event: any): void => {
				onMouseLeave?.(event, edgeElement);
			};

			const handleEdgeUpdater = (event: any, isSourceHandle: boolean) => {
				const nodeId = isSourceHandle ? target : source;
				const handleId = (isSourceHandle ? targetHandleId : sourceHandleId) || null;
				const handleType = isSourceHandle ? 'target' : 'source';
				const isValidConnection = () => true;
				const isTarget = isSourceHandle;

				onEdgeUpdateStart?.(event, edgeElement, handleType);

				const _onEdgeUpdate = onEdgeUpdateEnd
					? (evt: MouseEvent): void => onEdgeUpdateEnd(evt, edgeElement, handleType)
					: undefined;

				const onConnectEdge = (connection: Connection) => {
					const { edges } = store.getState();
					const edge = edges.find((e: any) => e.id === id);

					if (edge && onEdgeUpdate) {
						onEdgeUpdate(edge, connection);
					}
				};

				onMouseDown(
					event,
					handleId,
					nodeId,
					store.setState,
					onConnectEdge,
					isTarget,
					isValidConnection,
					connectionMode,
					handleType,
					_onEdgeUpdate,
					store.getState
				);
			};

			const onEdgeUpdaterSourceMouseDown = (event: any): void => {
				handleEdgeUpdater(event, true);
			};

			const onEdgeUpdaterTargetMouseDown = (event: any): void => {
				handleEdgeUpdater(event, false);
			};

			const onEdgeUpdaterMouseEnter = () => (updating = true);
			const onEdgeUpdaterMouseOut = () => (updating = false);
			// const markerStartUrl = useMemo(() => `url(#${getMarkerId(markerStart)})`, [markerStart]); // this function used useMemo
			const markerStartUrl = () => `url(#${getMarkerId(markerStart)})`; // this function used useMemo
			const markerEndUrl = () => `url(#${getMarkerId(markerEnd)})`; // this function used useMemo

			if (hidden) {
				return null;
			}

			const edgeAnchors = handleEdgeUpdate
				? `<g
							onMouseDown=${onEdgeUpdaterSourceMouseDown}
							onMouseEnter=${onEdgeUpdaterMouseEnter}
							onMouseOut=${onEdgeUpdaterMouseOut}
						>
							<EdgeAnchor
								position=${sourcePosition}
								centerX=${sourceX}
								centerY=${sourceY}
								radius=${edgeUpdaterRadius}
							/>
						</g>
						<g
							onMouseDown=${onEdgeUpdaterTargetMouseDown}
							onMouseEnter=${onEdgeUpdaterMouseEnter}
							onMouseOut=${onEdgeUpdaterMouseOut}
						>
							<EdgeAnchor
								position=${targetPosition}
								centerX=${targetX}
								centerY=${targetY}
								radius=${edgeUpdaterRadius}
							/>
						</g>`
				: null;

			return `<g
					class=${edgeClasses}
					onClick=${onEdgeClick}
					onDoubleClick=${onEdgeDoubleClickHandler}
					onContextMenu=${onEdgeContextMenu}
					onMouseEnter=${onEdgeMouseEnter}
					onMouseMove=${onEdgeMouseMove}
					onMouseLeave=${onEdgeMouseLeave}
				>
					<EdgeComponent
						id=${id}
						source=${source}
						target=${target}
						selected=${selected}
						animated=${animated}
						label=${label}
						labelStyle=${labelStyle}
						labelShowBg=${labelShowBg}
						labelBgStyle=${labelBgStyle}
						labelBgPadding=${labelBgPadding}
						labelBgBorderRadius=${labelBgBorderRadius}
						data=${data}
						style=${style}
						sourceX=${sourceX}
						sourceY=${sourceY}
						targetX=${targetX}
						targetY=${targetY}
						sourcePosition=${sourcePosition}
						targetPosition=${targetPosition}
						sourceHandleId=${sourceHandleId}
						targetHandleId=${targetHandleId}
						markerStart=${markerStartUrl}
						markerEnd=${markerEndUrl}
					/>
                    ${edgeAnchors}
				</g>`;
		};

		EdgeWrapper.displayName = 'EdgeWrapper';

		return EdgeWrapper;
	}
</script>

<!-- <script lang="typescript">
	// import React, { memo, ComponentType, useCallback, useState, useMemo } from 'react';
	// import cc from 'classcat';
	// import shallow from 'zustand/shallow';

	// import { useStore, useStoreApi } from '../../store';
	import type { Edge, EdgeProps, WrapEdgeProps, ReactFlowState, Connection } from '$lib/types'; //change to SvelvetState later
	import { onMouseDown } from '$lib/components/Handle/handler';
	// import { EdgeAnchor } from './EdgeAnchor';
	import { getMarkerId } from '$lib/utils/graph';

	const selector = (s: ReactFlowState) => ({
		//change to s: SvelvetState later
		addSelectedEdges: s.addSelectedEdges,
		connectionMode: s.connectionMode
	});
</script> -->
