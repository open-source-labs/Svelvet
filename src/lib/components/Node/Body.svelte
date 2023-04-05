<section class="parameters">
	{#if label && !header}<p class="node-name">{label}</p>{/if}
	{#if config}
		{#if $outputs || $outputs === 0}
			<Output outputStore={outputs} {connectingFrom} />
		{/if}

		{#each Object.entries($properties) as [key, property] (key)}
			<Parameter
				config={config ? config.properties[key] : null}
				label={key}
				parameterStore={property}
			/>
		{/each}

		{#each Object.entries($inputs) as [key, input] (key)}
			<Parameter
				connectable
				config={config ? config.inputs[key] : null}
				label={key}
				parameterStore={input}
			/>
		{/each}
	{/if}
	<!-- <h1>{JSON.stringify($inputAnchors)}</h1> -->
	{#each Object.entries($inputAnchors) as [key, params]}
		<Input placed={true} {params} />
	{/each}
	{#each Object.entries($outputAnchors) as [key, params]}
		<Output placed={true} {params} />
	{/each}
</section>
