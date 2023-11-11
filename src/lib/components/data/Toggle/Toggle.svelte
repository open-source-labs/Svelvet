<script lang="ts">
	import type { CustomWritable } from '$lib/types';

	export let parameterStore: CustomWritable<boolean>;

	const handleKeyToggle = (event: KeyboardEvent) => {
		event.stopPropagation();
		if (event.key === 'Enter') {
			$parameterStore = !$parameterStore;
		}
	};
	const handleClickToggle = (event: MouseEvent) => {
		event.stopPropagation();
		$parameterStore = !$parameterStore;
	};
</script>

<div
	class="toggle-wrapper"
	role="switch"
	on:keydown|stopPropagation={handleKeyToggle}
	tabindex={0}
	aria-checked={$parameterStore}
	aria-label="Toggle Switch"
>
	<label class="switch">
		<input
			type="checkbox"
			on:click|stopPropagation={handleClickToggle}
			bind:checked={$parameterStore}
		/>
		<span class="slider round" />
	</label>
</div>

<style>
	.switch {
		position: relative;
		display: inline-block;
		width: 60px;
		height: 34px;
		cursor: pointer;
	}

	.switch input {
		opacity: 0;
		width: 60px;
		height: 30px;
		cursor: pointer;
	}

	.slider {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		-webkit-transition: 0.4s;
		transition: 0.4s;
	}

	.slider:before {
		position: absolute;
		content: '';
		height: 26px;
		width: 26px;
		left: 4px;
		bottom: 4px;
		background-color: white;
		-webkit-transition: 0.4s;
		transition: 0.4s;
	}

	input:checked + .slider {
		background-color: #2196f3;
	}

	input:focus + .slider {
		box-shadow: 0 0 1px #2196f3;
	}

	input:checked + .slider:before {
		-webkit-transform: translateX(26px);
		-ms-transform: translateX(26px);
		transform: translateX(26px);
	}

	.slider.round {
		border-radius: 34px;
		pointer-events: none;
	}

	.slider.round:before {
		border-radius: 50%;
	}
</style>
