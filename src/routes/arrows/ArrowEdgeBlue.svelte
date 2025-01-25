<!-- @migration-task Error while migrating Svelte code: Cannot read properties of undefined (reading 'end') -->
<!-- @migration-task Error while migrating Svelte code: Cannot read properties of undefined (reading 'end') -->
<script>
	import { Edge } from '$lib';
</script>

<Edge let:path start="arrow" end="arrow" color="blue" step={true} width={3} animate={true} />
