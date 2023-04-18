<script lang="ts">
	import type { Graph, NodeConfig, NodeKey, Node as NodeType } from '$lib/types';

	import Node from '../Node/Node.svelte';
	import { onMount, getContext } from 'svelte';

	import { flowChartDrawer } from '$lib/utils/drawers/flowchartDrawer';
	import { flowChartParser } from '$lib/utils/helpers/parser';

	export let mermaid = '';
	export let mermaidConfig: Record<string, NodeConfig> = {};

	const flowChart = flowChartParser(mermaid);
	const grid = flowChartDrawer(flowChart, 'td');
	const graph = getContext<Graph>('graph');
	const MIN_X_SPACE = 100;
	const MIN_Y_SPACE = 100;

	let nodeList: Record<NodeKey, NodeType>;

	onMount(() => {
		graph.nodes.subscribe((nodes) => (nodeList = nodes));
		let y = 0;
		for (const row of grid) {
			let x = 0;
			let maxHeight = -Infinity;
			for (const node of row) {
				if (!node.ignore) {
					nodeList[`N-${node.id}`].position.x.update(() => x);
					nodeList[`N-${node.id}`].position.y.update(() => y);
					nodeList[`N-${node.id}`].dimensions.width.subscribe((width: number) => (x += width));
					nodeList[`N-${node.id}`].dimensions.height.subscribe(
						(height: number) => (maxHeight = Math.max(maxHeight, height))
					);
				}
				x += MIN_X_SPACE;
			}
			y += maxHeight + MIN_Y_SPACE;
		}
	});
</script>

{#each grid as row}
	{#each row as node}
		{#if !node.ignore}
			<Node
				label={node.id}
				id={node.id}
				TD={true}
				{...mermaidConfig[node.id]}
				connections={node.children.map((id) => [id, '0'])}
			/>
		{/if}
	{/each}
{/each}
