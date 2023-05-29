<script lang='ts'>
  import { Edge } from "$lib";
	import Page from "../../../routes/+page.svelte";
  import { edgeNodeProps } from "./DrawerEdge.svelte";
  // import { writable } from "svelte/store";
  import { beforeUpdate, onMount, setContext } from "svelte";
  // import type { Graph } from "$lib/types";
	// import type { NavigationType } from "@sveltejs/kit";
  // import { getContext } from "svelte";
  // import { edgeComponentStore } from "./DrawerEdge.svelte";
	// import { createNode } from "$lib/utils";

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

  // beforeUpdate(() => {
  //   let containers: any = document.getElementsByClassName('edges-wrapper')
  //   containers = containers[containers.length - 1]
  //   const contextEdge:any = getContext('edge')
  //   console.log('bob', containers)
  //   // edgeComponentStore.update(edges => {
  //   //   console.log('store', edges)
  //   //   if (edges.includes(contextEdge.source.node.edge)) return [...edges];
  //   //   return [...edges, contextEdge.source.node.edge]
  //   // })
  //   edgeComponentStore.set(containers);
  // })

</script>



<Edge {...$edgeNodeProps}></Edge>



