<script lang='ts'>
  import { Edge } from "$lib";
  import { edgeNodeProps } from "./DrawerEdge.svelte";

  // const graph = getContext<Graph>('graph');

  // const edges = graph.edges;  

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



