<script lang="ts">
  import { Position } from '$lib/types/utils';
  export let x: number;
  export let y: number;
  console.log('x-->', x, 'y-->', y)
</script>

<circle cx={x} cy={y} r={5} stroke="white" fill="black" />

<style>
  circle {
    position: absolute;
  }
</style>
