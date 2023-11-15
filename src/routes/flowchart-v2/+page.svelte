<script lang="ts">
	import { Svelvet } from '$lib';

	const mermaidStr = `A[Flowchart Time!] --> B[Choice of Tool]
    B --> |Ye Olde Static Flowchart| C[Back to the Stone Age]
    B --> |Svelvet's Flowchart Component| D[Smooth interactivity]
    D --> E[Effortless styling]
    D --> F[Unparalleled customization]`;
</script>

<body>
	<Svelvet theme="dark" width={800} height={800} title="flowchart" controls mermaid={mermaidStr} />
</body>
