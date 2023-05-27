<script lang='ts'>
  import { Edge } from "$lib";
  import { edgePropsStore } from "./DrawerEdge.svelte";
  import { writable } from "svelte/store";
  import { beforeUpdate, onMount, setContext } from "svelte";
  import type { Graph } from "$lib/types";
	import type { NavigationType } from "@sveltejs/kit";
  import { getContext } from "svelte";
  import { edgeComponentStore } from "./DrawerEdge.svelte";

  // const graph = getContext<Graph>('graph');

  // const edges = graph.edges;  


  // const addToComponentStore = (edge: any) => {
  //   edgeComponentStore.update(edges => {
  //     console.log(edges)
  //     return [...edge]
  //   })
  // }

  // // onMount(()=> {
  // //   console.log('component', edgeComponent)
  // //   addToComponentStore(edgeComponent)
  // // })

  // onMount(()=> {
  //   const htmlEDGE = document.getElementsByClassName('edge')
  //   const htmlSVG = document.getElementsByClassName('edges-wrapper')
  //   console.log('htmlEDGE', htmlEDGE)
  //   console.log('htmlSVG', htmlSVG)
  //   addToComponentStore(htmlEDGE)

  // })

  beforeUpdate(() => {
    // const containers: HTMLElement = document.getElementsByClassName('edgeContainer')

    const contextEdge:any = getContext('edge')
    console.log('bob', contextEdge)
    edgeComponentStore.update(edges => {
      console.log('store', edges)
      if (edges.includes(contextEdge.source.node.edge)) return [...edges];
      return [...edges, contextEdge.source.node.edge]
    })
  })

</script>


{#each $edgePropsStore as edge, index}
  <div class=edgeContainer> 
    <Edge {...edge}></Edge>
  </div>
{/each}


