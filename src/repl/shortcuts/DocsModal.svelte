<script>
import { docsToggle } from '../../playgroundStore';
import { fade } from 'svelte/transition';
import nodeDoc from '../../assets/svelvetnodedocsquickref.png';
import edgeDoc from '../../assets/svelvetedgesdocsquickref.png';
import {clickOutside} from './clickoutside';
</script>





<div id="myModal" class="modal" in:fade>

  <!-- Modal content -->
  <div class="modal-content" in:fade>
    <div id='buttondiv'>
      <button on:click={() => ($docsToggle = false)}>X</button>
    </div>
    <div class='modal-body'>
      <h1 class ="welcome">Svelvet Docs Quick Reference</h1>

      <img src={nodeDoc} alt='svelvet node documentation quick reference cheat sheet'/>
      <br/>
      <img src={edgeDoc} alt='svelvet edge documentation quick reference cheat sheet'/>
    </div>
    

  </div>
  </div>

  <style>

@font-face {
		src: url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700&display=swap');
		font-family: 'Inter', sans-serif;
	}
    .modal {
    /* display: none; */
    position: fixed; /* Stay in place */
    z-index: 20;
    right: 15%;
    top: 5%;
    /* width: 100%;
    height: 100%; */
    /* background-color: rgb(0,0,0); 
    background-color: rgba(0,0,0,0.6); */
    padding: 2rem;
    font-family: 'Inter', sans-serif;
  }
  #buttondiv {
    color: #888;
    position: absolute;
    background-color: #fffafa;
    display: block;
  }
  /* Modal Content/Box */
  .modal-content {
    background-color: #fffafa;
    margin: 6% 45%; /* 15% from the top and centered */
    padding: 20px;
    border: 2px dotted #888;
    border-radius: 1.5rem;
    min-width: 40rem;
    min-height: 10rem;
    max-height: 20rem;
    overflow: scroll;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    font-family: 'Inter', sans-serif;
    z-index: 20;
  }
  .modal-body {
    top: 2rem;
    padding-top: 1rem;
    background-color: #fffafa;
    overflow: scroll;
    font-family: 'Inter', sans-serif;
    z-index: 20;
  }
  img {
    height:auto;
    width: auto;
    min-height: 50%;
    min-width: 50%;

  }
  .welcome{
    justify-content: center;
 color: #ff3e01;
 font-size: clamp(2rem, 10vw, 3rem);
 height: auto;
 font-family: 'Inter', sans-serif;
  }
  </style>