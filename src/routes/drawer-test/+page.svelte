<script lang="ts">
	import { Drawer } from '$lib';
	import ThemeToggle from '$lib/components/ThemeToggle/ThemeToggle.svelte';
</script>

<Drawer height={1200} zoom={0.70} controls>
 <ThemeToggle main='light' alt='dark' slot='toggle'/>
</Drawer>
	

