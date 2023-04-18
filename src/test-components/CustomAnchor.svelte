<script lang="ts">
	export let linked: boolean;
	export let connecting: boolean;
	export let hovering: boolean;
</script>

<div class:linked class:hovering class:connecting class="my-anchor" />

<style>
	.my-anchor {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: solid 2px white;
		border-color: inherit;
	}
	.hovering {
		scale: 1.2;
	}
	.linked {
		background-color: rgb(17, 214, 17) !important;
	}
	.connecting {
		background-color: goldenrod;
		animation: pulse 1s infinite;
	}

	@keyframes pulse {
		0% {
			box-shadow: 0 0 0 0 goldenrod;
		}
		70% {
			box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
		}
	}
</style>
