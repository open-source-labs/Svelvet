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

    <p class="text-gray-100 text-center mt-5 md:mb-0">
      Svelvet is open source and has room for many more features. We welcome
      contributors!
    </p>
    <a
      href="https://github.com/open-source-labs/Svelvet"
      target="_blank"
      class="self-center w-fit border-2 border-transparent hover:border-white mt-4 py-2 px-5 rounded-full hover:ease-in duration-100 hover:text-white hover:bg-transparent bg-white text-gray-800 "
      >See Svelvet on GitHub</a
    >
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
  