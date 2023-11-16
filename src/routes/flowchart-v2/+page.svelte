<script>
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

<style>
	@import url(https://fonts.googleapis.com/css?family=Rubik);

	:global(#N-A) {
		top: 50px !important;
		left: 50px !important;
	}
	:global(#N-B) {
		left: 300px !important;
	}
	:global(#N-C) {
		left: 50px !important;
	}
	:global(#N-D) {
		left: 550px !important;
	}
	:global(#N-E) {
		left: 550px !important;
	}
	:global(#N-F) {
		left: 300px !important;
	}
</style>
