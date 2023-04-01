<script lang="ts">
	import Node from '$lib/components/Node/Node.svelte';
	import Edge from '$lib/components/Edge/Edge.svelte';
	import type { Graph } from '../../types';
	import GroupBoundingBox from '$lib/components/GroupBoundingBox/GroupBoundingBox.svelte';
	import { initialClickPosition } from '$lib/stores/CursorStore';
	import { moveNodes } from '$lib/components/Node/moveNodes';
	import { writable } from 'svelte/store';

	export let nodes: Graph['nodes'];
	export let edges: Graph['edges'];
	export let graph: Graph;
	export let connectingFrom: Graph['connectingFrom'];

	const { groups, groupProperties, cursor: cursorStore, activeGroup } = graph;

	$: hidden = $groups.hidden;

	let dummyNodePosition = {
		x: writable(0),
		y: writable(0)
	};

	$: {
		dummyNodePosition.x.set($cursorStore.x);
		dummyNodePosition.y.set($cursorStore.y);
	}

	import { get } from 'svelte/store';

	function unpackStores(obj: any) {
		if (typeof obj !== 'object' || obj === null) {
			return obj;
		}

		if (obj.hasOwnProperty('subscribe')) {
			return get(obj);
		}

		const result = Array.isArray(obj) ? [] : {};

		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				const value = obj[key];
				result[key] = unpackStores(value);
			}
		}

		return result;
	}

	// $: if ($activeGroup) {
	// 	console.log('moving');
	// 	const newX = cursor.x - $initialClickPosition.x;
	// 	const newY = cursor.y - $initialClickPosition.y;
	// 	moveNodes(graph, newX, newY, $groups[$activeGroup], 1);
	// }
</script>

{#each Object.entries($nodes) as [id, node] (id)}
	{#if !$hidden.has(node)}
		<Node on:nodeClicked {...node} {graph} />
	{/if}
{/each}

{#each Array.from($edges) as [anchorId, connection] (`${connection.targetNode}-${anchorId}`)}
	<Edge
		sourceNode={connection.sourceNode}
		targetNode={connection.targetNode}
		sourceAnchor="output"
		targetAnchor={anchorId.split('-')[1]}
	/>
{/each}

{#if $connectingFrom}
	<Edge
		active
		sourceNode={$connectingFrom}
		targetNode={{
			anchors: { cursor: { x: 0, y: 0.5 } },
			position: dummyNodePosition,
			dimensions: { width: writable(0), height: writable(0) }
		}}
		animate
		cursor
	/>
{/if}

{#each Object.entries($groupProperties) as [id, group] (id)}
	<GroupBoundingBox on:groupClick {...group} groupName={id} />
{/each}
