<script lang="ts">
	import { Drawer } from '$lib';
	import ThemeToggle from '$lib/components/ThemeToggle/ThemeToggle.svelte';
</script>

<Drawer height={1200} zoom={0.7} controls>
	{#snippet toggle()}
		<ThemeToggle main="light" alt="dark"  />
	{/snippet}
</Drawer>
