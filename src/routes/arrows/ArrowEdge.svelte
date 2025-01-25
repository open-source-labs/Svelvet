<!-- @migration-task Error while migrating Svelte code: Cannot read properties of undefined (reading 'end') -->
<!-- @migration-task Error while migrating Svelte code: Cannot read properties of undefined (reading 'end') -->
<script>
	import { Edge } from '$lib';
</script>

<Edge
	let:path
	end="arrow"
	color="green"
	step={true}
	width={2}
	animate={true}
	label="New Arrows!"
	labelColor="green"
	textColor="white"
/>
