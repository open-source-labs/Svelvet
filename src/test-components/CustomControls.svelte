<script>
	import { Controls } from '$lib';
</script>

<Controls let:zoomIn let:zoomOut corner="SW">
	<button on:click|stopPropagation={zoomIn}>ZOOMER</button>
	<button on:click|stopPropagation={zoomOut}>UN ZOOMER</button>
</Controls>
