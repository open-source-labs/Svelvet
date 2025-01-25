<!-- @migration-task Error while migrating Svelte code: Unexpected token
https://svelte.dev/e/js_parse_error -->
<!-- @migration-task Error while migrating Svelte code: Unexpected token
https://svelte.dev/e/js_parse_error -->
<script context="module" lang="ts">
	import DefaultAnchor from './DefaultAnchor.svelte';
	import Edge from '../Edge/Edge.svelte';
	import EdgeContext from '../Edge/EdgeContext.svelte';
	import { onMount, getContext, onDestroy, afterUpdate } from 'svelte';
	import { writable, get } from 'svelte/store';
	import { createEdge, createAnchor, generateOutput } from '$lib/utils/creators';
	import type {
		Graph,
		Node,
		Connections,
		CSSColorString,
		EdgeStyle,
		EndStyle,
		EdgeConfig
	} from '$lib/types';
	import type {
		Anchor,
		Direction,
		AnchorKey,
		CustomWritable,
		AnchorConnectionEvent
	} from '$lib/types';
	import type { InputType, NodeKey, OutputStore, InputStore, ConnectingFrom } from '$lib/types';
	import type { ComponentType } from 'svelte';
	import type { Writable, Readable } from 'svelte/store';

	let animationFrameId: number;

	export const connectingFrom: Writable<ConnectingFrom | null> = writable(null);

	export function changeAnchorSide(anchorElement: HTMLElement, newSide: Direction, node: Node) {
		if (newSide === 'self') return;
		const parentNode = anchorElement.parentNode;
		if (!parentNode) return;
		// Remove the anchor from its current container
		parentNode.removeChild(anchorElement);

		// Add the anchor to the new container
		const newContainer = document.querySelector(`#anchors-${newSide}-${node.id}`);
		if (!newContainer) return;
		newContainer.appendChild(anchorElement);
		if (anchorElement) node.recalculateAnchors();
	}
</script>

<script lang="ts">
	const nodeDynamic = getContext<boolean>('dynamic');
	const node = getContext<Node>('node');
	const edgeStore = getContext<Graph['edges']>('edgeStore');
	const cursorAnchor = getContext<Anchor>('cursorAnchor');
	const graphDirection = getContext<string>('direction');
	const mounted = getContext<Writable<number | true>>('mounted');
	const graph = getContext<Graph>('graph');
	const nodeStore = getContext<Graph['nodes']>('nodeStore');
	const graphEdge = getContext<ComponentType>('graphEdge');
	const nodeConnectEvent = getContext<Writable<null | MouseEvent>>('nodeConnectEvent');
	const anchorsMounted = getContext<Writable<number>>('anchorsMounted');
	const flowChart = getContext<object>('flowchart') || undefined;

	$props = {
		bgColor: null,
		id: 0,
		input: false,
		output: false,
		multiple: output ? true : input ? false : true,
		dynamic: nodeDynamic || false,
		edge: null,
		inputsStore: null,
		key: null,
		outputStore: null,
		connections: [],
		edgeColor: writable(null),
		edgeLabel: '',
		locked: false,
		nodeConnect: false,
		edgeStyle: null,
		endStyles: [null, null],
		invisible: false,
		direction: graphDirection === 'TD' ? (input ? 'north' : 'south') : input ? 'west' : 'east',
		title: ''
	};

	const dispatchConnection = (event: CustomEvent<{ connection: AnchorConnectionEvent }>) => {
		const customEvent = new CustomEvent('connection', { detail: event.detail });
		dispatchEvent(customEvent);
	};

	const dispatchDisconnection = (event: CustomEvent) => {
		const customEvent = new CustomEvent('disconnection', { detail: event.detail });
		dispatchEvent(customEvent);
	};

	let anchorElement;
	$state = {
		tracking: false,
		hovering: false,
		previousConnectionCount: 0,
		type: input === output ? null : input ? 'input' : 'output',
		assignedConnections: []
	};

	const nodeEdge = node.edge;
	const anchors = node.anchors;
	const resizingWidth = node.resizingWidth;
	const resizingHeight = node.resizingHeight;
	const rotating = node.rotating;
	const nodeLevelConnections = node.connections;

	$derived connecting = $connectingFrom?.anchor === anchor;
	$derived connectedAnchors = anchor && anchor.connected;

	const anchorKey: AnchorKey = `A-${id || anchors.count() + 1}/${node.id}`;
	const anchor = createAnchor(
		graph,
		node,
		anchorKey,
		{ x: 0, y: 0 },
		{ width: 0, height: 0 },
		inputsStore || outputStore || null,
		edge || nodeEdge || graphEdge || null,
		type,
		direction,
		dynamic,
		key,
		edgeColor
	);
	anchors.add(anchor, anchor.id);

	onMount(() => {
		if (anchorElement) anchor.recalculatePosition();

		// Need to add this to the Anchor store as a native property
		const outputCount = Array.from(get(node.anchors)).reduce((acc, [, anchor]) => {
			if (anchor.type === 'output') acc++;
			return acc;
		}, 0);

		if ($nodeLevelConnections?.length && !input) {
			const remainingConnections = [];
			let first = null;
			$nodeLevelConnections.forEach((connection, i) => {
				if (!connection) return;
				if (first === null) first = i;

				if ((i - first) % outputCount === 0) {
					 $state.assignedConnections.push(connection);
					remainingConnections.push(null);
				} else {
					remainingConnections.push(connection);
				}
			});
			$nodeLevelConnections = remainingConnections;
		}
		$anchorsMounted++;
	});

	afterUpdate(() => {
		if (anchorElement) anchor.recalculatePosition();
	});

	// When the anchor is destroyed we remove the edge and cancel any animation
	onDestroy(() => {
		destroy();
		cancelAnimationFrame(animationFrameId);
	});

	$derived dynamicDirection = anchor?.direction;

	$effect(() => {
		if (dynamic && anchorElement) changeAnchorSide(anchorElement, $dynamicDirection, node);
	});

	$effect(() => {
		if ($mounted === nodeStore.count() && connections.length) {
			checkDirectConnections();
		}
	});

	$effect(() => {
		if (nodeConnect && $nodeConnectEvent) {
			handleMouseUp($nodeConnectEvent);
		}
	});

	$effect(() => {
		if ($mounted === nodeStore.count() && $state.assignedConnections.length) {
			checkNodeLevelConnections();
		}
	});

	$effect(() => {
		if (anchorElement) {
			$anchors;
			$connectedAnchors;
			$dynamicDirection;
			anchor.recalculatePosition();
		}
	});

	$effect(() => {
		if (! $state.tracking && ($resizingWidth || $resizingHeight || $rotating)) {
			 $state.tracking = true;
			trackPosition();
		} else if (!$resizingWidth && !$resizingHeight &&  $state.tracking && !$rotating) {
			 $state.tracking = false;
			cancelAnimationFrame(animationFrameId);
		}
	});

	$effect(() => {
		if ($connectedAnchors) {
			if ($connectedAnchors.size <  $state.previousConnectionCount) {
				// Need to add additional detail for disconnections here
				dispatchDisconnection(new CustomEvent('disconnection', { detail: { node, anchor } }));
			} else if ($connectedAnchors.size >  $state.previousConnectionCount) {
				const anchorArray = Array.from($connectedAnchors);
				const lastConnection = anchorArray[anchorArray.length - 1];
				dispatchConnection(new CustomEvent('connection', {
					detail: {
						node,
						anchor,
						connectedNode: lastConnection.node,
						connectedAnchor: lastConnection
					}
				}));
			}
			 $state.previousConnectionCount = $connectedAnchors.size;
		}
	});

	function touchBasedConnection(e) {
		edgeStore.delete('cursor');

		const touchPosition = {
			x: e.changedTouches[0].clientX,
			y: e.changedTouches[0].clientY
		};

		// This retrieves the child element at the touch position
		const otherAnchor = document.elementFromPoint(touchPosition.x, touchPosition.y);

		if (!otherAnchor) return;

		// This retrieves the parent element of the anchor, which has the ID
		const parentElement = otherAnchor.parentElement;

		if (!parentElement) return;

		const compoundId = parentElement.id;

		const nodeId = compoundId.split('/')[1];

		const connectingAnchor = nodeStore.get(nodeId)?.anchors.get(compoundId);

		if (!connectingAnchor) return;

		edgeStore.delete('cursor');

		attemptConnection(anchor, connectingAnchor, e);
	}

	function attemptConnection(source, target, e) {
		const success = connectAnchors(source, target);

		if (success) {
			connectStores();
		}

		if (!e.shiftKey) {
			clearLinking(success);
		}
	}

	function handleMouseUp(e) {
		// Touchend events fire on the original element rather than the "curent one"
		// So we need to check for this case and retieve the anchor to connect to
		if ('changedTouches' in e && connecting) {
			touchBasedConnection(e);
			return;
		}

		if (connecting) return; // If the anchor initiated the connection, do nothing

		// If the anchor receiving the event has connections
		// And it can't have multiple connections
		// Then this is an invalid connection
		// Delete the cursor edge and clear the linking store
		if ($connectedAnchors?.size && !multiple) {
			edgeStore.delete('cursor');
			if (!e.shiftKey) clearLinking(false);
			return;
		}
		// Otherwise, proceed with connection logic
		if ($connectingFrom) connectEdge(e);
	}

	function handleClick(e) {
		if (locked) return; // Return if the anchor is locked

		// If the Anchor being clicked has connections
		// And it can't have multiple connections
		// And there isn't an active connection being made
		// Then this is a disconnection event
		if ($connectedAnchors?.size && !multiple && !$connectingFrom) return disconnectEdge();

		// If there isn't an active connection being made, start a new edge
		if (!$connectingFrom) return startEdge();

		// Otherwise, proceed with the edge connection logic
		connectEdge(e);
	}

	// This can be condensed
	function startEdge() {
		if (input === output) {
			$connectingFrom = { anchor, store: null, key: null };
			createCursorEdge(anchor, cursorAnchor);
		} else if (input) {
			$connectingFrom = {
				anchor,
				store: inputsStore,
				key
			};
			createCursorEdge(cursorAnchor, anchor);
		} else if (output) {
			$connectingFrom = {
				anchor,
				store: outputStore,
				key: null
			};
			createCursorEdge(anchor, cursorAnchor);
		}
	}

	function createCursorEdge(source, target, disconnect = false) {
		const edgeConfig = {
			color: edgeColor,
			label: edgeLabel
		};

		if (disconnect) edgeConfig.disconnect = true;
		if (edgeStyle) edgeConfig.type = edgeStyle;
		if (endStyles[0]) edgeConfig.start = endStyles[0];
		if (endStyles[1]) edgeConfig.start = endStyles[1];
		// Create a temporary edge to track the cursor
		const newEdge = createEdge({ source, target }, source?.edge || null, edgeConfig);
		// Add the edge to the store
		edgeStore.add(newEdge, 'cursor');
	}

	function connectEdge(e) {
		// Delete the temporary edge
		edgeStore.delete('cursor');

		if (!$connectingFrom) return;

		const connectingType = $connectingFrom.anchor.type;

		if ($connectingFrom.anchor === anchor || (connectingType === anchor.type && connectingType)) {
			clearLinking(false);
			return;
		}

		anchor.recalculatePosition();

		// Create edge
		let source;
		let target;

		if (input === output) {
			if (connectingType === 'input') {
				source = anchor;
				target = $connectingFrom.anchor;
			} else {
				source = $connectingFrom.anchor;
				target = anchor;
			}
		} else if (input) {
			source = $connectingFrom.anchor;
			target = anchor;
		} else {
			source = anchor;
			target = $connectingFrom.anchor;
		}

		attemptConnection(source, target, e);
	}

	// Updates the connected anchors set on source and target
	// Creates the edge and add it to the store
	function connectAnchors(source, target) {
		// Don't connect an anchor to itself
		if (source === target) return false;
		// Don't connect if the anchors are already connected
		if (get(source.connected).has(anchor)) return false;
		const edgeConfig = {
			color: edgeColor,
			label: edgeLabel
		};

		// get edge style from flowchart if edge is defined in flowchart
		if (flowChart) {
			// check if source is in flowchart and target is a child of the source
			const sourceId = source.node.id.slice(2);
			const sourceInFlowchart = flowChart.nodeList[sourceId]; // type flowchart node obj
			// if source is in flowchart
			if (sourceInFlowchart) {
				const targetId = target.node.id.slice(2);
				const targetInSourceChildren = sourceInFlowchart.children.filter(
					(child) => child.node.id === targetId
				)[0];
				// check to see if target is its child
				if (targetInSourceChildren) {
					// configure the edge with data defined in the flowchart
					const edgeData = targetInSourceChildren;
					edgeConfig.label = edgeData.content;
				}
			}
		}

		if (edgeStyle) edgeConfig.type = edgeStyle;
		if (endStyles[0]) edgeConfig.start = endStyles[0];
		if (endStyles[1]) edgeConfig.start = endStyles[1];
		const newEdge = createEdge({ source, target }, source?.edge || null, edgeConfig);
		if (!source.node || !target.node) return false;
		edgeStore.add(newEdge, new Set([source, target, source.node, target.node]));
		return true;
	}

	// If both anchors have stores, we "link" them
	function connectStores() {
		if (input && $connectingFrom && $connectingFrom.store) {
			if (
				$inputsStore &&
				key &&
				inputsStore &&
				typeof inputsStore.set === 'function' &&
				typeof inputsStore.update === 'function'
			)
				$inputsStore[key] = $connectingFrom.store;
		} else if (output && $connectingFrom && $connectingFrom.store) {
			const { store, key } = $connectingFrom;
			if (store && key && typeof store.update === 'function')
				store.update((store) => {
					if (!outputStore) return store;
					store[key] = outputStore;
					return store;
				});
		}
	}

	function disconnectStore() {
		if ($inputsStore && key && $inputsStore[key])
			$inputsStore[key] = writable(get($inputsStore[key]));
	}

	function clearLinking(connectionMade) {
		if (connectionMade || !$nodeConnectEvent) {
			$connectingFrom = null;
			$nodeConnectEvent = null;
		}
	}

	// This just repeatedly calls updatePosition until cancelled
	function trackPosition() {
		if (! $state.tracking) return;
		if (anchorElement) anchor.recalculatePosition();
		animationFrameId = requestAnimationFrame(trackPosition);
	}

	// Destroy the edge and disconnect the anchors/stores
	function destroy() {
		// return;
		edgeStore.delete('cursor');

		// Get all edges connected to this anchor
		const connections = edgeStore.match(anchor);

		// Delete them from the store
		connections.forEach((edge) => edgeStore.delete(edge));

		clearLinking(false);
		disconnectStore();
	}

	// Disconnect edge and create a new cursor edge
	function disconnectEdge() {
		if (get(anchor.connected).size > 1) return;

		const source = Array.from(get(anchor.connected))[0];

		if (source.type === 'input') return;

		destroy();

		if (source.type === 'output') {
			createCursorEdge(source, cursorAnchor, true);
			disconnectStore();
			const store = source.store;
			$connectingFrom = { anchor: source, store, key: null };
		} else {
			createCursorEdge(source, cursorAnchor, true);
			$connectingFrom = { anchor: source, store: null, key: null };
		}
	}

	function checkNodeLevelConnections() {
		 $state.assignedConnections.forEach((connection, index) => {
			if (!connection) return;
			const connected = processConnection(connection);
			if (connected) connections[index] = null;
		});
		 $state.assignedConnections =  $state.assignedConnections.filter((connection) => connection !== null);
	}

	function checkDirectConnections() {
		connections.forEach((connection) => {
			if (!connection) return;
			processConnection(connection);
			// if (connected) connections[index] = null;
		});

		// connections = connections.filter((connection) => connection !== null);
	}

	export function disconnect(target) {
		const nodekey = `N-${target[0]}`;
		const node = nodeStore.get(nodekey);
		if (!node) return;
		const targetAnchor = node.anchors.get(`A-${target[1]}/N-${target[0]}`);
		if (!targetAnchor) return;
		const edgeKey = edgeStore.match(anchor, targetAnchor);
		if (!edgeKey) return;
		edgeStore.delete(edgeKey[0]);
	}

	const processConnection = (connection) => {
		let nodeId;
		let anchorId;
		let anchorToConnect = null;

		if (Array.isArray(connection)) {
			nodeId = connection[0].toString();
			anchorId = connection[1].toString();
		} else {
			nodeId = connection.toString();
			anchorId = null;
		}

		//Convert to node key used in store/DOM
		const nodekey = `N-${nodeId}`;
		// Look up node in store
		const nodeToConnect = nodeStore.get(nodekey);
		if (!nodeToConnect) {
			return false;
		}

		if (!anchorId) {
			// Connect to the anchor with the fewest connections
			const anchorStore = get(nodeToConnect.anchors);
			const anchors = Array.from(anchorStore.values());

			if (!anchors.length) {
				return false;
			}
			anchorToConnect = anchors.reduce((a, b) => {
				if (!a && b.type === 'output') return null;
				if (b.type === 'output') return a;
				if (!a) return b;
				if (get(b.connected).size < get(a.connected).size) return b;
				return a;
			}, null);
		} else {
			// Create anchor key
			const anchorKey = `A-${anchorId}/${nodekey}`;
			// Look up anchor in store
			anchorToConnect = nodeToConnect.anchors.get(anchorKey) || null;
		}

		if (!anchorToConnect) {
			return false;
		}

		connectAnchors(anchor, anchorToConnect);

		if (anchorToConnect.store && (inputsStore || outputStore)) {
			if (input && anchorToConnect.type === 'output') {
				if (
					$inputsStore &&
					key &&
					inputsStore &&
					typeof inputsStore.set === 'function' &&
					typeof inputsStore.update === 'function'
				)
					$inputsStore[key] = anchorToConnect.store;
			} else if (output && anchorToConnect.type === 'input') {
				const { store, inputKey } = anchorToConnect;
				if (store && inputKey && typeof store.update === 'function')
					store.update((store) => {
						if (!outputStore) return store;
						store[inputKey] = outputStore;
						return store;
					});
			}
		}
		return true;
	};
</script>

<div
	id={anchor?.id}
	class="anchor-wrapper"
	role="button"
	tabindex="0"
	class:locked
	title={title || ''}
	onmouseenter={() => ( $state.hovering = true)}
	onmouseleave={() => ( $state.hovering = false)}
	onclick={handleClick}
	onmouseup={handleMouseUp}
	ontouchstart={handleClick}
	ontouchend={handleMouseUp}
	bind:this={anchorElement}
>
	{@render linked={$connectedAnchors?.size >= 1} {hovering} {connecting}}
		{#if !invisible}
			<DefaultAnchor
				{output}
				{input}
				{connecting}
				{hovering}
				{bgColor}
				connected={$connectedAnchors?.size >= 1}
			/>
		{/if}
</div>

{#each Array.from($connectedAnchors) as target (target.id)}
	{@const edge = edgeStore.fetch(anchor, target)}
	{#if edge && edge.source === anchor}
		{@const CustomEdge = edge.component}
		<EdgeContext {edge}>
			{@render name="edge"}
				{#if CustomEdge}
					<CustomEdge />
				{:else}
					<Edge />
				{/if}
		</EdgeContext>
	{/if}
{/each}

{#if connecting}
	{@const edge = edgeStore.get('cursor')}
	{#if edge}
		{@const CustomEdge = edge.component}
		<EdgeContext {edge}>
			{@render name="edge"}
				{#if CustomEdge}
					<CustomEdge />
				{:else}
					<Edge />
				{/if}
		</EdgeContext>
	{/if}
{/if}

<style>
	* {
		box-sizing: border-box;
	}
	.anchor-wrapper {
		z-index: 10;
		width: fit-content;
		height: fit-content;
		pointer-events: all;
	}

	.locked {
		cursor: not-allowed !important;
	}
	div {
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
	}
</style>
