<script lang="ts">
	import { Svelvet } from '$lib';

	const mermaidStr = `A[Start] --> B[Wake Up]
  B --> C[Do you want to get up yet?]
  C --> |Yes| D[Up and at 'em]
  C --> |No| E[Go back to sleep]`;
</script>

<body>
	<Svelvet
		theme="dark"
		width={800}
		height={800}
		title="flowchart-v2"
		controls
		mermaid={mermaidStr}
	/>
</body>
