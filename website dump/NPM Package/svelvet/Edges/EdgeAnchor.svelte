<script>import { Position } from '../types/utils';
export let x;
export let y;
</script>

<!-- renders simple half-circle for the anchor point of the edge -->
<circle cx={x} cy={y} r={5} stroke="white" fill="black" />

<style>
  circle {
    position: absolute;
  }
</style>
