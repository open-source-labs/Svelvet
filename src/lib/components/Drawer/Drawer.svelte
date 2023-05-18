<script lang="ts">
  import { getContext } from 'svelte';
	import type { CSSColorString, Graph, Corner } from '$lib/types';
	import type { Node } from '$lib/types';
	import { calculateRelativeCursor } from '$lib/utils';

  let graph: Graph = getContext<Graph>('graph');

  export let width = 100;
	export let height = width;
	export let mapColor: CSSColorString | null = null;
	export let nodeColor: CSSColorString | null = null;
	export let borderColor: CSSColorString | null = null;
	export let corner: Corner = 'NW';
	export let hideable = false; 

    
</script>


<nav class ='drawerWrapper'>
    <button>Node<button>    
</nav>



<style>

.drawerWrapper{
  position: absolute;
  border-radius: 6px;
  overflow: hidden;
  left: 10px;
  top: 10px;
  /* box-shadow: var(--minimap-shadow, var(--default-minimap-shadow)); */
  border: solid 1px;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
