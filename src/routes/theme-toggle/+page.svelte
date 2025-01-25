<script lang="ts">
	import { Svelvet, Node, ThemeToggle } from '$lib';
</script>

<body>
	<Svelvet width={500} height={500}>
		<Node />
		{#snippet toggle()}
				<ThemeToggle  />
			{/snippet}
	</Svelvet>
</body>
