<script>
  import { inputToggle, edgeToggle, nodeToggle, copyToggle } from '../../playgroundStore'
  import Menu from './Menu.svelte';
  import MenuOption from './MenuOption.svelte';
  import MenuDivider from './MenuDivider.svelte';

 let pos = { x: 0, y: 0 };
 let showMenu = false;

  async function onRightClick(e) {
    if (showMenu) {
      showMenu = false;
      await new Promise((res) => setTimeout(res, 100));
    }

    pos = { x: e.clientX, y: e.clientY };
    console.log(pos);
    showMenu = true;
  }

  function closeMenu() {
    showMenu = false;
  }
</script>

{#if showMenu}
  <Menu {...pos} on:click={closeMenu} on:clickoutside={closeMenu}>
    <MenuOption on:click={() => {$inputToggle = true; $nodeToggle = true; $edgeToggle = true;}} text="Add Node" />
      <MenuDivider />
    <MenuOption on:click={() =>{$inputToggle = true; $edgeToggle = true}} text="Add Edge" />
    <MenuDivider />
    <MenuOption on:click={() =>{$copyToggle = true;}} text="Copy to Clipboard" />
  </Menu>
{/if}


<svelte:body on:contextmenu|preventDefault={onRightClick} />
