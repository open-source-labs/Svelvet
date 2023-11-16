<script lang="ts">
	import { Svelvet } from '$lib';

	const mermaidStr = `A(Coffee machine not working) --> B{Machine has power?} 
      B{Machine has power?} --> C(Test Node 1)
      B{Machine has power?} --> D(Test Node 2)
      C(Test Node 1) --> E(Test Node 3)`;
</script>

<body>
	<Svelvet
		theme="dark"
		width={800}
		height={800}
		title="flowchart-tests"
		controls
		mermaid={mermaidStr}
	/>
</body>
