<script>
    import CommunitySideNav from '../../components/CommunitySideNav.svelte';
  </script>
  
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />

  <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet">
      
  <svelte:head>
    <title>Svelvet Community Page</title>
  </svelte:head>
  <!-- Ask Team: Clarify with team how slots are working and each different "main" page is rendering based on what user is clicking -->
  <div class="flex justify-start text-gray-800 overflow-x-hidden sticky">
    <nav class="hidden md:block border-r min-w-fit px-8 overflow-y-auto pb-24">
      <CommunitySideNav />
    </nav>
    <main class="md:max-w-6xl w-auto overflow-y-auto overflow-x-hidden h-fit p-8 pb-24">
      <slot />
    </main>
  </div>
  