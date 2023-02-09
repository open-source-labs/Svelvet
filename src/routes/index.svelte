<script lang="ts">
  import { tick } from 'svelte'
  import Svelvet from 'svelvet'
  import { windowStore } from '../stores/windowStore'

  let { width } = windowStore
  let heroHight: number = 650
  $: if ($width) updateNodesPosition()

  const updateNodesPosition = async () => {
    if ($width > 1536) {
      initialNodes[0].position = { x: $width - 600, y: 100 }
      initialNodes[1].position = { x: $width - 400, y: 280 }
      initialNodes[2].position = { x: $width - 600, y: 360 }
      initialNodes[3].position = { x: $width - 800, y: 280 }
      initialNodes[4].position = { x: $width - 400, y: 480 }
      initialNodes[5].position = { x: $width - 777.5, y: 460 }
      heroHight = 650
    }
    else if ($width > 1024) {
      initialNodes[0].position = { x: $width - 400, y: 100 }
      initialNodes[1].position = { x: $width - 200, y: 280 }
      initialNodes[2].position = { x: $width - 400, y: 360 }
      initialNodes[3].position = { x: $width - 600, y: 280 }
      initialNodes[4].position = { x: $width - 200, y: 480 }
      initialNodes[5].position = { x: $width - 577.5, y: 460 }
      heroHight = 650
    } 
    else {
      initialNodes[0].position = { x: $width / 2 - 25, y: 400 }
      initialNodes[1].position = { x: $width - 150, y: 580 }
      initialNodes[2].position = { x: $width / 2 - 25, y: 660 }
      initialNodes[3].position = { x: 20, y: 580 }
      initialNodes[4].position = { x: $width - 150, y: 780 }
      initialNodes[5].position = { x: 42.5, y: 760 }
      heroHight = 900
    }
    await tick()
    initialNodes = initialNodes
  }
  
  let initialNodes = [
    {
      id: 1,
      position: { x: 1450, y: 100 },
      data: { label: 'Add Images!' },
      width: 100,
      height: 100,
      bgColor: 'white',
      borderColor: 'transparent',
      image: true,
      src: 'https://svelvet.io/_app/assets/Logo%201-cc7b0baf.svg'
    },
    {
      id: 2,
      position: { x: 1650, y: 280 },
      data: { label: 'Mixed Anchors' },
      width: 125,
      height: 40,
      bgColor: 'white',
      textColor: 'black',
      targetPosition: 'left'
    },
    {
      id: 3,
      position: { x: 1250, y: 360 },
      data: { label: 'Output Node' },
      width: 100,
      height: 40,
      bgColor: '#FFE4E6',
      textColor: 'black'
    },
    {
      id: 4,
      position: { x: 1025, y: 280 },
      data: { label: 'Drag me!' },
      width: 125,
      height: 40,
      bgColor: 'white',
      textColor: 'black',
      targetPosition: 'right'
    },
    {
      id: 5,
      position: { x: 1450, y: 480 },
      data: { label: 'Custom Node' },
      width: 125,
      height: 40,
      bgColor: '#C8FFC7',
      textColor: 'black',
      borderColor: 'transparent',
      borderRadius: 0
    },
    {
      id: 6,
      position: { x: 1047.5, y: 460 },
      data: { label: 'Custom Node' },
      width: 80,
      height: 80,
      borderColor: '#FF4121',
      borderRadius: 30,
      bgColor: 'white',
      textColor: '#FF4121'
    }
  ];

  let initialEdges = [
    { id: 'e1-2', source: 1, target: 2, label: 'edge label' },
    { id: 'e2-3', source: 2, target: 3, animate: true, label: 'animated edges' },
    { id: 'e1-4', source: 1, target: 4, type: 'step', animate: true, edgeColor: '#FF4121' },
    { id: 'e2-5', source: 2, target: 5, label: 'colored edges', animate: true, arrow: true, edgeColor: '#FF4121', labelBgColor: '#1F2937', labelTextColor: '#FFE4E6' },
    { id: 'e2-6', source: 4, target: 6, type: 'straight' },
    { id: 'e2-7', source: 3, target: 6, type: 'smoothstep', label: 'colored label', labelBgColor: '#FF4561', labelTextColor: 'white', animate: true }
  ]

  // refactor contributors section - each block
  const contributors = [
    { first: 'Anu', last: 'Sharma', linkedin: 'anu-sharma-6936a686', github: 'anulepau' },
    { first: 'Andrew', last: 'Widjaja', linkedin: 'andrew-widjaja', github: 'andrew-widjaja' },
    { first: 'Aaron', last: 'Willett', linkedin: 'awillettnyc', github: 'awillettnyc' },
    { first: 'Alexander', last: 'Zambrano', linkedin: 'alexander-z-8b7716b0', github: 'azambran21' },
    { first: 'Justin', last: 'Wouters', linkedin: 'justinwouters', github: 'justinwouters' },
    { first: 'Damian', last: 'Lim', linkedin: 'lim-damian', github: 'limd96' },
    { first: 'Walter', last: 'DeVault', linkedin: 'walter-devault', github: 'TensionCoding' },
    { first: 'Von', last: 'Garcia', linkedin: 'gerard-von-g-3964bb160', github: 'vongarcia97' },
    { first: 'Ali', last: 'Adams', linkedin: 'alimadams', github: 'AliA12336' },
    { first: 'Christopher', last: 'Mander', linkedin: 'christopher-mander', github: 'cpmander' },
    { first: 'David', last: 'Jakubiec', linkedin: 'david-jakubiec-16783384', github: 'davidjakubiec' },
    { first: 'Jeffrey', last: 'Wentworth', linkedin: 'jeffrey-wentworth-501915248', github: 'jeffreywentworth' },
    { first: 'Johnny', last: 'Tran', linkedin: 'johnny-tran-4bb479151', github: 'JTraan' },
    { first: 'Samee', last: 'Vohra', linkedin: 'sameev', github: 'sameev' },
    { first: 'Abhi', last: 'Gullapalli', linkedin: 'viswa-gullapalli-442802253', github: 'aubertlone' },
    { first: 'Ian', last: 'Hnizdo', linkedin: 'ian-hnizdo-a1a198128', github: 'ianhnizdo' },
    { first: 'Mauricio', last: 'Castro', linkedin: 'mauricioacastro', github: 'sher85' },
    { first: 'Ryan', last: 'Potter', linkedin: 'ryan-potter-0105b6100', github: 'rpotter0811' },
    { first: 'Emma', last: 'Ferguson', linkedin: 'emma-ferguson-33858725a', github: 'emmanotly' },
    { first: 'Timmy', last: 'Lem', linkedin: 'timmy-lem', github: 'timmylem01' },
    { first: 'Tony', last: 'Lim', linkedin: 'tonylim467', github: 'tonyy467' },
    { first: 'Dillon', last: 'McKenna', linkedin: 'dillon-mckenna', github: 'dmckenna44' },
    { first: 'Taylor', last: 'Alan', linkedin: 'taylor-alan-026a49226', github: 'taylien96' },
  ]
</script>

<svelte:head>
  <title>Svelvet</title>
</svelte:head>

<main>
  <section class="relative container h-[900px] lg:h-[650px] cursor-default">
    <div class="absolute top-10 left-1/2 -translate-x-1/2 
                lg:top-1/2 lg:-translate-y-1/2 lg:left-0 lg:-translate-x-0 
                w-[calc(100%-32px)] lg:max-w-[600px] z-10">
      <h1 class="text-4xl md:text-6xl font-bold text-gray-800">
        Map your ideas in Flow with Svelvet
      </h1>
      <p class="text-lg my-6 text-gray-500">
        A customizable and lightweight Svelte component library for 
        building node-based editors and interactive flow diagrams
      </p>
      <div class="flex items-center space-x-6">
        <a href="/docs/installation" class="btn btn-primary">Documentation</a>
        <a href="/playground" class="btn btn-gray-dark">REPL</a>
      </div>
    </div>

    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-screen overflow-hidden cursor-text">
      <Svelvet nodes={initialNodes} 
               edges={initialEdges}
               initialZoom={2}
               width={$width}
               height={heroHight}
               movement={false}
               background />
    </div>
  </section>

  <section class="w-screen py-12 text-white bg-gray-800">
    <div class="container flex flex-col lg:flex-row items-center lg:justify-between lg:space-x-6 space-y-6">
      <div class="flex items-start lg:items-center space-x-8 lg:space-x-20">
        <div>
          <p class="font-bold text-2xl lg:text-4xl mb-1">1.6K</p>
          <p>Github Stars</p>
        </div>
        <div>
          <p class="font-bold text-2xl lg:text-4xl mb-1">2.4K</p>
          <p>Weekly Installs</p>
        </div>
        <div>
          <p class="font-bold text-2xl lg:text-4xl mb-1">MIT</p>
          <p>License</p>
        </div>
      </div>

      <div class="lg:max-w-[50%] flex flex-col space-y-4">
        <p>
          Svelvet is a MIT-licensed open source library.
          You can help to ensure the further development and maintenance by contributing to Svelvet on Github.
        </p>
        <a href="https://github.com/open-source-labs/Svelvet" target="_blank" class="w-fit text-primary">See Svelvet on Github</a>
      </div>
    </div>
  </section>

  <!-- cant render more than 1 Svelvet component -->
  
  <!-- <section class="gradient-primary py-20">
    <div class="container flex flex-col md:flex-row">
      <div class="w-full md:w-1/2 flex flex-col space-y-4">
        <h3 class="text-4xl font-bold">Beautiful and Customizable</h3>
        <p>
          Svelvet allows you to easily create intuitive flow diagrams using pre-built components with
          seamless zooming and panning, draggable interactivity, customizable edges and nodes and
          more!
        </p>
        <a href="/docs/core-concepts" class="btn btn-white">Learn More</a>
      </div>


    </div>
  </section> -->

  <section class="py-20">
    <div class="container flex flex-col-reverse items-center md:flex-row">
      <div class="w-full md:w-1/2 my-4 md:h-full md:py-12 flex flex-col justify-center items-center text-center">
        <div class="overflow-hidden rounded-lg bg-gray-100 w-[320px] md:w-[380px] grid place-items-center wrapper">
          <div class="h-7 w-full bg-gray-300 flex items-center">
            <div class="mac-ctrl bg-[#FF605C]" />
            <div class="mac-ctrl bg-[#FFBD44]" />
            <div class="mac-ctrl bg-[#00CA4E]" />
          </div>
          <div class="typing-demo my-3">npm install svelvet</div>
        </div>
      </div>
      <div class="sm:mt-0 w-full md:w-1/2 h-full flex flex-col justify-center">
        <h3 class="text-4xl font-bold my-4 text-center md:text-left text-gray-700">
          Get Started Easily
        </h3>
        <p class="mb-4 text-gray-500 text-center md:text-left">
          Start mapping out your ideas with our NPM package. Simply provide your node data to the
          <code class="bg-rose-100 rounded-lg p-1">Svelvet</code> component and you're ready to show off
          your interactive diagram - no extra configuration needed!
        </p>
        <a href="/docs/installation" class="btn btn-primary">Install Now</a>
      </div>
    </div>
  </section>

  <section class="gradient-primary py-20">
    <h3 class="text-4xl font-bold mb-14 text-center text-white">Contributors</h3>
    <div class="container flex flex-wrap items-center justify-center gap-12">
      <!-- refactor contributors section - each block -->
      {#each contributors as contributor}
        <div class="w-[180px] flex flex-col items-center space-y-2 p-4 bg-white text-gray-600 rounded-xl shadow-lg">
          <img src={`/assets/profiles/${contributor.first}-small.png`} alt="" class="h-32 rounded-full" />
          <p class="text-lg leading-6 text-center">{contributor.first} <br /> {contributor.last}</p>
          <div class="flex space-x-4">
            <a target="_blank" href={`https://www.linkedin.com/in/${contributor.linkedin}`}>
              <img src="/assets/linkedin-svgrepo-com.svg" alt="LinkedIn Icon" />
            </a>
            <a target="_blank" href={`https://github.com/${contributor.github}`}>
              <img src="/assets/github-svgrepo-com.svg" alt="GitHub Icon" />
            </a>
          </div>
        </div>
      {/each}
    </div>
    
    <div class="mt-14 text-center">
      <p class="mb-6 text-gray-100">Svelvet is open source and has room for many more features. We welcome contributors!</p>
      <a href="https://github.com/open-source-labs/Svelvet" target="_blank" class="btn btn-white">See Svelvet on Github</a>
    </div>
  </section>
</main>


<style>

  .wrapper {
    box-shadow: 3px 3px 15px 3px rgba(0, 0, 0, 0.1);
  }

  .mac-ctrl {
    float: left;
    margin-left: 7px;
    width: 12px;
    height: 12px;
    border-radius: 100%;
  }

  .typing-demo {
    width: 20ch;
    animation: typing 4s steps(20), blink 0.5s step-end infinite alternate;
    animation-iteration-count: infinite;
    white-space: nowrap;
    overflow: hidden;
    border-right: 3px solid;
    font-family: monospace;
    font-size: 16px;
  }

  @media (max-width: 768px) {
    .typing-demo {
      animation: blink 0.5s step-end infinite alternate;
    }
  }

  @keyframes typing {
    0% {
      width: 0%;
    }
    25%,
    100% {
      width: 20ch;
    }
  }

  @keyframes blink {
    50% {
      border-color: transparent;
    }
  }
</style>
