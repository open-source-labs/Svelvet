<script context="module" lang="ts">
	import DefaultAnchor from './DefaultAnchor.svelte';
	import Edge from '../Edge/Edge.svelte';
	import EdgeContext from '../Edge/EdgeContext.svelte';
	import { onMount, getContext, onDestroy, afterUpdate } from 'svelte';
	import { writable, get } from 'svelte/store';
	import { createEdge, createAnchor, generateOutput } from '$lib/utils/creators';
	import { createEventDispatcher } from 'svelte';
	import type { Graph, Node, Connections, CSSColorString, EdgeStyle, EdgeConfig } from '$lib/types';
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

	export let bgColor: CSSColorString | null = null;
	export let id: string | number = 0;
	export let input = false;
	export let output = false;
	/**
	 * @default dependent on `input` and `output` props
	 * @description When `true`, the Anchor will accept multiple connections. This is set to true by default
	 * for output anchors or anchors that have not specified an input/output prop.
	 */
	export let multiple = output ? true : input ? false : true;
	/**
	 * @default 'false'
	 * @description When `true`, the Anchor will dynamically change its direction
	 * based on the relative positioning of connected Nodes
	 */
	export let dynamic = nodeDynamic || false;
	export let edge: ComponentType | null = null;
	export let inputsStore: InputStore | null = null;
	export let key: string | number | null = null;
	export let outputStore: OutputStore | null = null;
	export let connections: Connections = [];
	export let edgeColor:
		| Writable<CSSColorString | null>
		| CustomWritable<CSSColorString>
		| Readable<CSSColorString> = writable(null);
	export let edgeLabel = '';
	/**
	 * @default 'false'
	 * @description When `true`, connections and disconnections are not allowed. Updates the cursor on hover.
	 */
	export let locked = false;
	/**
	 * @default 'false'
	 * @description When `true`, mouse up events on the parent Node will trigger connections to this Anchor. If this value
	 * is true for multiple Anchors, connections will be assigned in order, unless an Anchor is set to accept multiple connections.
	 */
	export let nodeConnect = false;
	export let edgeStyle: EdgeStyle | null = null;
	/**
	 * @default 'false'
	 * @description When `true`, the default Anchor will not be rendered. It is not necessary to set this to true
	 * when passing custom Anchors as children. It likely only makes sense to use this
	 * in combination with the  `nodeConnect` prop.
	 */
	export let invisible = false;
	export let direction: Direction =
		graphDirection === 'TD' ? (input ? 'north' : 'south') : input ? 'west' : 'east';
	export let title = '';

	const dispatchConnection = createEventDispatcher<{ connection: AnchorConnectionEvent }>();
	const dispatchDisconnection = createEventDispatcher();

	let anchorElement: HTMLDivElement;
	let tracking = false;
	let hovering = false;
	let previousConnectionCount = 0;
	let type: InputType = input === output ? null : input ? 'input' : 'output';
	let assignedConnections: Connections = [];

	const nodeEdge = node.edge;
	const anchors = node.anchors;
	const resizingWidth = node.resizingWidth;
	const resizingHeight = node.resizingHeight;
	const rotating = node.rotating;
	const nodeLevelConnections = node.connections;

	$: connecting = $connectingFrom?.anchor === anchor;
	$: connectedAnchors = anchor && anchor.connected;

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
			const remainingConnections: Connections = [];
			let first: number | null = null;
			$nodeLevelConnections.forEach((connection, i) => {
				if (!connection) return;
				if (first === null) first = i;

				if ((i - first) % outputCount === 0) {
					assignedConnections.push(connection);
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

	$: dynamicDirection = anchor?.direction;

	$: if (dynamic && anchorElement) changeAnchorSide(anchorElement, $dynamicDirection, node);

	// $: if (!input && $anchorsMounted && $anchorsMounted === node.anchors.count()) {
	// 	console.log('Popping');
	// 	const poppedConnections = $nodeLevelConnections?.pop();
	// 	if (poppedConnections) connections.push(poppedConnections);
	// 	connections = connections;
	// }

	$: if ($mounted === nodeStore.count() && connections.length) {
		checkDirectConnections();
	}

	$: if (nodeConnect && $nodeConnectEvent) {
		handleMouseUp($nodeConnectEvent);
	}

	// If the user has specifcied connections, we check once all nodes have mounted
	$: if ($mounted === nodeStore.count() && assignedConnections.length) {
		checkNodeLevelConnections();
	}

	// If an anchor is added to the store, we update all anchor positions
	$: if (anchorElement) {
		$anchors;
		$connectedAnchors;
		$dynamicDirection;
		anchor.recalculatePosition();
	}

	// If the parent node is resizing, we actively track the position of the anchor
	$: if (!tracking && ($resizingWidth || $resizingHeight || $rotating)) {
		tracking = true;
		trackPosition();
	} else if (!$resizingWidth && !$resizingHeight && tracking && !$rotating) {
		tracking = false;
		cancelAnimationFrame(animationFrameId);
	}

	// This fires the connection/disconnection events
	// We track previous connections and fire a correct event accordingly
	$: if ($connectedAnchors) {
		if ($connectedAnchors.size < previousConnectionCount) {
			// Need to add additional detail for disconnections here
			dispatchDisconnection('disconnection', { node, anchor });
		} else if ($connectedAnchors.size > previousConnectionCount) {
			const anchorArray = Array.from($connectedAnchors);
			const lastConnection = anchorArray[anchorArray.length - 1];
			dispatchConnection('connection', {
				node,
				anchor,
				connectedNode: lastConnection.node,
				connectedAnchor: lastConnection
			});
		}
		previousConnectionCount = $connectedAnchors.size;
	}

	function touchBasedConnection(e: TouchEvent) {
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

		const compoundId: AnchorKey = parentElement.id as AnchorKey;

		const nodeId = compoundId.split('/')[1] as NodeKey;

		const connectingAnchor = nodeStore.get(nodeId)?.anchors.get(compoundId);

		if (!connectingAnchor) return;

		edgeStore.delete('cursor');

		attemptConnection(anchor, connectingAnchor, e);
	}

	function attemptConnection(source: Anchor, target: Anchor, e: MouseEvent | TouchEvent) {
		const success = connectAnchors(source, target);

		if (success) {
			connectStores();
		}

		if (!e.shiftKey) {
			clearLinking(success);
		}
	}

	function handleMouseUp(e: MouseEvent | TouchEvent) {
		// Touchend events fire on the original element rather than the "curent one"
		// So we need to check for this case and retieve the anchor to connect to
		if ('changedTouches' in e && connecting) {
			touchBasedConnection(e);
			return;
		}

		if (connecting) return; // If the anchor initiated the connection, do nothing

		// If the anchor receiving the event has connections
		// And it can't have multiple connections
		// Or the anchor is locked
		// Then this is an invalid connection
		// Delete the cursor edge and clear the linking store
		if (locked || ($connectedAnchors?.size && !multiple)) {
			edgeStore.delete('cursor');
			if (!e.shiftKey) clearLinking(false);
			return;
		}
		// Otherwise, proceed with connection logic
		if ($connectingFrom) connectEdge(e);
	}

	function handleClick(e: MouseEvent | TouchEvent) {
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

	function createCursorEdge(source: Anchor, target: Anchor, disconnect = false) {
		const edgeConfig: EdgeConfig = {
			color: edgeColor,
			label: { text: edgeLabel }
		};

		if (disconnect) edgeConfig.disconnect = true;
		if (edgeStyle) edgeConfig.type = edgeStyle;
		// Create a temporary edge to track the cursor
		const newEdge = createEdge({ source, target }, source?.edge || null, edgeConfig);
		// Add the edge to the store
		edgeStore.add(newEdge, 'cursor');
	}

	function connectEdge(e: MouseEvent | TouchEvent) {
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
		let source: Anchor;
		let target: Anchor;

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
	function connectAnchors(source: Anchor, target: Anchor) {
		// Don't connect an anchor to itself
		if (source === target) return false;
		// Don't connect if the anchors are already connected
		if (get(source.connected).has(anchor)) return false;
		const edgeConfig: EdgeConfig = {
			color: edgeColor,
			label: { text: edgeLabel }
		};

		if (edgeStyle) edgeConfig.type = edgeStyle;
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

	function clearLinking(connectionMade: boolean) {
		if (connectionMade || !$nodeConnectEvent) {
			$connectingFrom = null;
			$nodeConnectEvent = null;
		}
	}

	// This just repeatedly calls updatePosition until cancelled
	function trackPosition() {
		if (!tracking) return;
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
			const store: ReturnType<typeof generateOutput> = source.store as ReturnType<
				typeof generateOutput
			>;
			$connectingFrom = { anchor: source, store, key: null };
		} else {
			createCursorEdge(source, cursorAnchor, true);
			$connectingFrom = { anchor: source, store: null, key: null };
		}
	}

	function checkNodeLevelConnections() {
		assignedConnections.forEach((connection, index) => {
			if (!connection) return;
			const connected = processConnection(connection);
			if (connected) connections[index] = null;
		});
		assignedConnections = assignedConnections.filter((connection) => connection !== null);
	}

	function checkDirectConnections() {
		connections.forEach((connection) => {
			if (!connection) return;
			processConnection(connection);
			// if (connected) connections[index] = null;
		});

		// connections = connections.filter((connection) => connection !== null);
	}

	export function disconnect(target: [string | number, string | number]) {
		const nodekey: NodeKey = `N-${target[0]}`;
		const node = nodeStore.get(nodekey);
		if (!node) return;
		const targetAnchor = node.anchors.get(`A-${target[1]}/N-${target[0]}`);
		if (!targetAnchor) return;
		const edgeKey = edgeStore.match(anchor, targetAnchor);
		if (!edgeKey) return;
		edgeStore.delete(edgeKey[0]);
	}

	const processConnection = (connection: [string | number, string | number] | string | number) => {
		let nodeId: string;
		let anchorId: string | null;
		let anchorToConnect: Anchor | null = null;

		if (Array.isArray(connection)) {
			nodeId = connection[0].toString();
			anchorId = connection[1].toString();
		} else {
			nodeId = connection.toString();
			anchorId = null;
		}

		//Convert to node key used in store/DOM
		const nodekey: NodeKey = `N-${nodeId}`;
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
			anchorToConnect = anchors.reduce<Anchor | null>((a, b) => {
				if (!a && b.type === 'output') return null;
				if (b.type === 'output') return a;
				if (!a) return b;
				if (get(b.connected).size < get(a.connected).size) return b;
				return a;
			}, null);
		} else {
			// Create anchor key
			const anchorKey: AnchorKey = `A-${anchorId}/${nodekey}`;
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
	on:mouseenter={() => (hovering = true && !locked)}
	on:mouseleave={() => (hovering = false)}
	on:mousedown|stopPropagation|preventDefault={handleClick}
	on:mouseup|stopPropagation={handleMouseUp}
	on:touchstart|stopPropagation|preventDefault={handleClick}
	on:touchend|stopPropagation={handleMouseUp}
	bind:this={anchorElement}
>
	<slot linked={$connectedAnchors?.size >= 1} {hovering} {connecting}>
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
	</slot>
</div>

{#each Array.from($connectedAnchors) as target (target.id)}
	{@const edge = edgeStore.fetch(anchor, target)}
	{#if edge && edge.source === anchor}
		{@const CustomEdge = edge.component}
		<EdgeContext {edge}>
			<slot name="edge">
				{#if CustomEdge}
					<CustomEdge />
				{:else}
					<Edge />
				{/if}
			</slot>
		</EdgeContext>
	{/if}
{/each}

{#if connecting}
	{@const edge = edgeStore.get('cursor')}
	{#if edge}
		{@const CustomEdge = edge.component}
		<EdgeContext {edge}>
			<slot name="edge">
				{#if CustomEdge}
					<CustomEdge />
				{:else}
					<Edge />
				{/if}
			</slot>
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
