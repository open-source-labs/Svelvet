<script>
    import Contributor from './Contributor.svelte';
    export let contributors;
  </script>
  
  <article class="wrapper">
    <h2>Svelvet Contributors</h2>
    <ul class="contributors">
      {#each contributors as contributor}
        <Contributor {...contributor} />
      {/each}
    </ul>
  </article>
  
  <style>
    .wrapper {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: rgb(255, 255, 255);
      background: linear-gradient(to right, #F66F52, #f86f6f, rgb(251 113 133));
      padding-top: 2rem;
      padding-bottom: 5rem;
    }
    .wrapper h2 {
        font-size: 1.5rem;
        padding: 1rem;
        font-weight:300;
    }
    .contributors {
      width: 50%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 0 auto;
    }
  </style>
  