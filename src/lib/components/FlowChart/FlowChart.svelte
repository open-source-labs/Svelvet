<!-- @migration-task Error while migrating Svelte code: Cannot use rune without parentheses
https://svelte.dev/e/rune_missing_parentheses -->
<!-- @migration-task Error while migrating Svelte code: Cannot use rune without parentheses
https://svelte.dev/e/rune_missing_parentheses -->
<script lang="ts">
	import type { Graph, NodeConfig, NodeKey, Node as NodeType } from '$lib/types';
	import type { FlowChart } from '$lib/types/parser';
	import Node from '../Node/Node.svelte';
	import { onMount, getContext, setContext } from 'svelte';
	import { flowChartDrawer } from '$lib/utils/drawers/flowchartDrawer';
	import { flowChartParser } from '$lib/utils/helpers/parser';

	$props = {
		mermaid: '',
		mermaidConfig: {}
	};

	const flowChart: FlowChart = flowChartParser($props.mermaid);

	setContext('flowchart', flowChart);

	const grid = flowChartDrawer(flowChart);
	const graph = getContext<Graph>('graph');

	const MIN_X_SPACE = 100;
	const MIN_Y_SPACE = 100;

	$state = {
		nodeList: {} as Record<NodeKey, NodeType>
	};

	onMount(() => {
		graph.nodes.subscribe((nodes) => ($state.nodeList = Object.fromEntries(nodes)));
		let y = 0;
		for (const row of grid) {
			let x = 0;
			let maxHeight = -Infinity;
			for (const node of row) {
				if (!node.ignore) {
					try {
						$state.nodeList[`N-${node.id}`].position.update(() => {
							return { x, y };
						});

						$state.nodeList[`N-${node.id}`].dimensions.width.subscribe((width: number) => (x += width));
						$state.nodeList[`N-${node.id}`].dimensions.height.subscribe(
							(height: number) => (maxHeight = Math.max(maxHeight, height))
						);
					} catch (error) {
						console.error(`Error positioning node ${node.id}:`, error);
					}
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
				label={node.label}
				id={node.id}
				TD={true}
				{...$props.mermaidConfig[node.id]}
				connections={node.children.map((id) => [id, '1'])}
			/>
		{/if}
	{/each}
{/each}
