<!-- <script>
	import {
		DataTable,
		Toolbar,
		ToolbarContent,
		ToolbarSearch,
		Pagination,
		Button
	} from 'carbon-components-svelte';

	let length = 2;

	$: rows = Array.from({ length }).map((_, i) => ({
		id: i,
		name: 'Load Balancer ' + (i + 1),
		protocol: 'HTTP',
		port: 3000 + i * 10,
		rule: i % 2 ? 'Round robin' : 'DNS delegation'
	}));
	let pageSize = 10;
	let page = 1;

	const handleAddRow = () => {
		length += 1;
		//setTimeout(handleAddRow, 1000);
	};
	//setTimeout(handleAddRow, 1000);
</script>

<div class="table-container">
	<Button on:click={handleAddRow}>Add Row</Button>
	<DataTable
		headers={[
			{ key: 'name', value: 'Name' },
			{ key: 'protocol', value: 'Protocol' },
			{ key: 'port', value: 'Port' },
			{ key: 'rule', value: 'Rule' }
		]}
		{rows}
		{pageSize}
		{page}
	/>

	<Pagination bind:pageSize bind:page totalItems={rows.length} pageSizes={[5, 10]} />
</div> -->
