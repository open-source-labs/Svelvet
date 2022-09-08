<script>
  import { fade } from 'svelte/transition';
  import { clickOutside } from './clickoutside';
  import { tipsToggle } from '../../playgroundStore';
  import docsCommand from '../../assets/docstutortial.png';
  import copyCommand from '../../assets/copyimagetutorial.png';
  import tipsCommand from '../../assets/tipstutorial image.png';
  import nodeCommand from '../../assets/newnodetutorial.png';
  import tutorialGif from '../../assets/tutorialgif.gif';
</script>

<!-- The Modal -->
<div id="myModal" class="modal" in:fade>
  <!-- Modal content -->
  <div class="modal-content" in:fade use:clickOutside on:outclick={() => ($tipsToggle = false)}>
    <div>
      <h1 class="welcome">Welcome to the Svelvet Playground</h1>
      <hr />

      <br />

      <h1>Create custom nodes and edges with just a right click!</h1>

      <br /> <br /> <br />
      Watch this gif <i>gift with a silent 't'</i> below for a visual walkthrough:
      <br />

      <img id="gif" src={tutorialGif} alt="gif showing how to use the context menu" />
      <br />
      <li>Right click to open context menu</li>
      <li>Choose to either create a new Node or new Edge</li>
      <li>Fill the input box with the properties you'd like to have in the Node</li>
      <li>Hit control + shift+ D anytime to reference the propert documentation</li>
      <li>View more property options by clicking the Expand button</li>
      <li>Customize your Nodes and Edges as you see fit</li>
      <li>Submit the new nodes and edges</li>
      <li>Watch as they populate on the UI</li>
      <br />
      <hr />
      <br />
      <h6>OR....</h6>
      <br />
      <li>Just hit control + shift + N to quickly add a Node!</li>
      <br /><br /><br />
      <hr />
      <h1>Some keyboard shortcuts to remember:</h1>
      <br />
      <div class="label">
        <img class="kbrd" src={docsCommand} alt="control shift D" />will open the documentation
        cheat sheet
      </div>
      <br />

      <div class="label">
        <img class="kbrd" src={tipsCommand} alt="control shift T" /> will revisit this tutorial at any
        time
      </div>
      <br />
      <div class="label">
        <img class="kbrd" src={nodeCommand} alt="control shift N" />will quickly create a new node
      </div>
      <br />
      <div class="label">
        <img class="kbrd" src={copyCommand} alt="control shift C" />will copy your Svelvet code to
        your clipboard!
      </div>
    </div>
  </div>
</div>

<style>
  @font-face {
    src: url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700&display=swap');
    font-family: 'Inter', sans-serif;
  }

  @media screen and (max-width: 992px) {
    .modal {
      /* display: none; */
      position: fixed; /* Stay in place */
      z-index: 1111; /* Sit on top */
      left: 0;
      top: 0;
      width: 100%; /* Full width */
      height: 100%; /* Full height */
      overflow: auto; /* Enable scroll if needed */
      background-color: rgb(0, 0, 0); /* Fallback color */
      background-color: rgba(0, 0, 0, 0.6); /* Black w/ opacity */
      font-family: 'Inter', sans-serif;
    }
    .kbrd {
      display: inline;
    }
    #gif {
      height: auto;
      width: auto;
    }
    /* Modal Content/Box */
    .modal-content {
      background-color: #fffafa;
      margin: 25% auto; /* 15% from the top and centered */
      padding: 20px;
      border: 1px solid #888;
      width: 85%; /* Could be more or less, depending on screen size */
      min-width: 65%;
      height: 700px;
      overflow: auto; /* Enable scroll if needed */
      color: #232b2b;
      font-family: 'Inter', sans-serif;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      border-radius: 1rem;
    }
    .welcome {
      /* justify-content: center; */
      color: #ff3e01;
      font-size: clamp(2rem, 10vw, 3rem);
      /* height: 100px; */
    }

    h1 {
      font-size: larger;
      font-weight: bold;
    }

    .label {
      font-size: larger;
    }

    li {
      list-style-type: circle;
    }
  }

  @media screen and (max-width: 1025px) {
    .modal {
      /* display: none; */
      position: fixed; /* Stay in place */
      z-index: 1111; /* Sit on top */
      left: 0;
      top: 0;
      width: 100%; /* Full width */
      height: 100%; /* Full height */
      overflow: auto; /* Enable scroll if needed */
      background-color: rgb(0, 0, 0); /* Fallback color */
      background-color: rgba(0, 0, 0, 0.6); /* Black w/ opacity */
      font-family: 'Inter', sans-serif;
    }
    .kbrd {
      display: inline;
    }
    #gif {
      height: auto;
      width: auto;
    }
    /* Modal Content/Box */
    .modal-content {
      background-color: #fffafa;
      margin: 25% auto; /* 15% from the top and centered */
      padding: 20px;
      border: 1px solid #888;
      width: 85%; /* Could be more or less, depending on screen size */
      min-width: 65%;
      height: 700px;
      overflow: auto; /* Enable scroll if needed */
      color: #232b2b;
      font-family: 'Inter', sans-serif;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      border-radius: 1rem;
    }
    .welcome {
      /* justify-content: center; */
      color: #ff3e01;
      font-size: clamp(2rem, 10vw, 3rem);
      /* height: 100px; */
    }

    h1 {
      font-size: larger;
      font-weight: bold;
    }

    .label {
      font-size: larger;
    }

    li {
      list-style-type: circle;
    }
  }

  @media screen and (max-width: 1150px) {
    .modal {
      /* display: none; */
      position: fixed; /* Stay in place */
      z-index: 1111; /* Sit on top */
      left: 0;
      top: 0;
      width: 100%; /* Full width */
      height: 100%; /* Full height */
      overflow: auto; /* Enable scroll if needed */
      background-color: rgb(0, 0, 0); /* Fallback color */
      background-color: rgba(0, 0, 0, 0.6); /* Black w/ opacity */
      font-family: 'Inter', sans-serif;
    }
    .kbrd {
      display: inline;
    }
    #gif {
      height: auto;
      width: auto;
    }
    /* Modal Content/Box */
    .modal-content {
      background-color: #fffafa;
      margin: 25% auto; /* 15% from the top and centered */
      padding: 20px;
      border: 1px solid #888;
      width: 85%; /* Could be more or less, depending on screen size */
      min-width: 65%;
      height: 700px;
      overflow: auto; /* Enable scroll if needed */
      color: #232b2b;
      font-family: 'Inter', sans-serif;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      border-radius: 1rem;
    }
    .welcome {
      /* justify-content: center; */
      color: #ff3e01;
      font-size: clamp(2rem, 10vw, 3rem);
      /* height: 100px; */
    }

    h1 {
      font-size: larger;
      font-weight: bold;
    }

    .label {
      font-size: larger;
    }

    li {
      list-style-type: circle;
    }
  }
  @media screen and (min-width: 1151px) {
    .modal {
      /* display: none; */
      position: fixed; /* Stay in place */
      z-index: 1111; /* Sit on top */
      left: 0;
      top: 0;
      width: 100%; /* Full width */
      height: 100%; /* Full height */
      overflow: auto; /* Enable scroll if needed */
      background-color: rgb(0, 0, 0); /* Fallback color */
      background-color: rgba(0, 0, 0, 0.6); /* Black w/ opacity */
      font-family: 'Inter', sans-serif;
    }
    .kbrd {
      display: inline;
    }
    #gif {
      height: auto;
      width: auto;
    }
    /* Modal Content/Box */
    .modal-content {
      background-color: #fffafa;
      margin: 25% auto; /* 15% from the top and centered */
      padding: 20px;
      border: 1px solid #888;
      width: 85%; /* Could be more or less, depending on screen size */
      min-width: 65%;
      height: 700px;
      overflow: auto; /* Enable scroll if needed */
      color: #232b2b;
      font-family: 'Inter', sans-serif;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      border-radius: 1rem;
      max-width: fit-content;
    }
    .welcome {
      /* justify-content: center; */
      color: #ff3e01;
      font-size: clamp(2rem, 10vw, 3rem);
      /* height: 100px; */
    }

    h1 {
      font-size: larger;
      font-weight: bold;
    }

    .label {
      font-size: larger;
    }

    li {
      list-style-type: circle;
    }
  }
</style>
