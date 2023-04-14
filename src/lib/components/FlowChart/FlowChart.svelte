<script lang='ts'>
	import type { Graph } from '$lib/types';

  import Node from "../Node/Node.svelte";
  import {onMount, getContext} from 'svelte';

  import {flowChartDrawer} from '$lib/utils/drawers/flowchartDrawer';
	import { flowChartParser } from '$lib/utils/helpers/parser';

  export let mermaid = '';
  export let mermaidConfig: {[key:string] : {[key: string]: any}};

  const flowChart = flowChartParser(mermaid);
  const grid = flowChartDrawer(flowChart, 'td');
  const graph = getContext<Graph>('graph');
  const MIN_X_SPACE = 100;
  const MIN_Y_SPACE = 100;

  const nodesObj: {[key: string]: any} = {};
  let nodeList : any;

  onMount(() => {
    graph.nodes.subscribe((nodes) => nodeList = nodes);
    let y = 0;
    for (const row of grid) {
      let x = 0;
      let maxHeight = -Infinity;
      for (const node of row) {
        if (!node.ignore) {
          console.log('id', node.id);
          nodeList[`N-${node.id}`].position.x.update(() => x);
          nodeList[`N-${node.id}`].position.y.update(() => y);
          nodeList[`N-${node.id}`].dimensions.width.subscribe((width: number) => x += width);
          nodeList[`N-${node.id}`].dimensions.height.subscribe((height: number) => maxHeight = Math.max(maxHeight, height));
        }
        x += MIN_X_SPACE;
      }
      y += maxHeight + MIN_Y_SPACE;
    }
  })

</script>

{#each grid as row}
  {#each row as node}
    {#if !node.ignore}
      {@const childNodes = []}
      {#each node.children as child}
        {childNodes.push([child, "1"])}
      {/each}
        {#if node.propsId}
          <Node label={node.id} id={node.id} TD={true} {childNodes} {...mermaidConfig[node.propsId]}></Node>
        {:else}
          <Node label={node.id} id={node.id} TD={true} {childNodes}></Node>
        {/if}
    {/if}
  {/each}
{/each}


