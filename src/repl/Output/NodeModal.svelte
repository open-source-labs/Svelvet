<script lang="ts">
	import { screen } from '@testing-library/svelte';
import { data, positionX, positionY, width, height, borderColor, borderRadius, bgColor, textColor, buildToggle, inputToggle, sourcePosition, target, nodeToggle, advancedNodeToggle, edgeToggle, advancedEdgeToggle, targetPosition, image, src, clickCallback, id, source, animate, arrow, edgeColor, labelBgColor, labelTextColor, noHandle, type, edgeLabel} from '../../playgroundStore';



let buttonCount = 0, divCount = 0;
</script>

<div>
  
<!-- <div id="myModal" class="modal"> -->
  <div class="modal-content">
    <button class='close'on:click={()=> {$inputToggle = false}}>x
    <span class="customPropertiesHeader">Custom Properties</span>
    </button>
    <div class="modal-header">
     
      <!-- <h1>Custom Properties</h1> -->
    </div>
    <br/>
    <div class="modal-body">
      <!-- regular node properties input options -->
     {#if ($nodeToggle === true)}
     <h2>Node Options</h2>
        <label for="data">Label:</label>
        <input id="data" bind:value={$data} type="text" /> <br />
        <label for="width">Width:</label>
        <input bind:value={$width} id="width" type="number"/> <br />
        <label for="height">Height:</label>
        <input bind:value={$height} id="height" type="number"/> <br />
        <hr>
       {/if}

<!-- come back to deal with image and src -->
  {#if ($advancedNodeToggle === true)}
  <h2>Advanced Node Options</h2>
       <label for="positionx">PositionX:</label>
       <input id="positionx" bind:value={$positionX} type="number"/> <br />
       <label for="positiony">PositionY:</label>
       <input bind:value={$positionY} id="positiony" type="number"/> <br />
        <label for="borderColor">Border Color:</label>
        <input bind:value={$borderColor} id="borderColor" type="color" /> <br />
        <label for="borderRadius">Border Radius:</label>
        <input bind:value={$borderRadius} id="borderRadius" type="number"/> <br />
        <label for="bgColor">Background Color:</label>
        <input bind:value={$bgColor} id="bgColor" type="color" /> <br />
        <label for="textColor">Text Color:</label> 
        <input bind:value={$textColor} id="textColor" type="color" /> <br />
        <label for="sourcePosition">Source Position:</label>
        <select id="sourcePosition">
            <option value="">Select Position</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="right">Right</option>
            <option value="left">Left</option>
        </select> <br>
        <label for="targetPosition">Target Position:</label>
<select id="targetPosition">
    <option value="">Select Position</option>
    <option value="top">Top</option>
    <option value="bottom">Bottom</option>
    <option value="right">Right</option>
    <option value="left">Left</option>
</select>
<hr>
  {/if}

        
  <!-- regular edge properties input options -->
  {#if ($edgeToggle === true)}
  <h2>Edge Options</h2>
    <label for="source">Source:</label>
    <input id="source" bind:value={$source} type="text" /> <br />
    <label for="width">Target:</label>
    <input bind:value={$target}/> <br />
    <label for="type">Type:</label>
    <input bind:value={$type} id="type" type="text" /> <br />
    <hr>
  {/if}


   {#if ($advancedNodeToggle === true)}
   <h2>Advanced Edge Options</h2>
   <label for="edgeLabel">Label:</label>
   <input id="edgeLabel" bind:value={$edgeLabel} type="text" /> <br />
   <label for="animate">Animate:</label>
    <input id="animate" bind:value={$animate} type="text" /> <br />
    <label for="arrow">arrow:</label>
    <input id="arrow" bind:value={$arrow} type="text" /> <br />
    <label for="edgeColor">edgeColor:</label>
    <input id="edgeColor" bind:value={$edgeColor} type="text" /> <br />
    <label for="labelBgColor">labelBgColor:</label>
    <input id="labelBgColor" bind:value={$labelBgColor} type="text" /> <br />
    <label for="labelTextColor">labelTextColor:</label>
    <input id="labelTextColor" bind:value={$labelTextColor} type="text" /> <br />
    <label for="edgeColor">edgeColor:</label>
    <input id="edgeColor" bind:value={$edgeColor} type="text" /> <br />
    <label for="noHandle">noHandle:</label>
    <input id="noHandle" bind:value={$noHandle} type="text" /> <br />
    <hr>
   {/if}
   
		
    </div>
    <footer>
      {#if ($advancedNodeToggle === false)}
      <button class="bouncy" id='btn' on:click={()=>{(!$advancedNodeToggle) ? $advancedNodeToggle = true : $advancedNodeToggle = false;}}>Expand Options</button>
      {/if}
      {#if ($advancedNodeToggle === true)}
      <button id='btn' on:click={()=>{(!$advancedNodeToggle) ? $advancedNodeToggle = true : $advancedNodeToggle = false;}}>Collapse Options</button>
      {/if}
      <button id='submitbtn' on:click={() => {$buildToggle = true; $inputToggle = false;}}> Submit<button/>
      </footer>
  </div>
</div>

<style>

@media screen and (max-width: 992px) {
h1 {
text-align: center;
 color: #ff3e00;
 font-size: x-large;
 text-decoration: underline;
}

h2 {
  line-height: 3;
  color: #40b2f8;
}

span {
  min-width: fit-content;
}

.bouncy{
animation:bouncy 5s infinite linear;
position:relative;
}
@keyframes bouncy {
  0%{top:0em}
40%{top:0em}
43%{top:-0.9em}
46%{top:0em}
48%{top:-0.4em}
50%{top:0em}
100%{top:0em;}
}
  #btn {
/* display:inline-block; */
padding:0.1rem 1rem;
box-sizing: border-box;
text-decoration-style: dashed;
font-family:'Roboto',sans-serif;
font-weight:300;
color: #676778;
/* background-color: #96a3ab; */
text-align:center;
transition: all 0.2s;
  }
  #submitbtn {
/* display:inline-block; */
padding:0.1rem 1rem;
margin: 0.3rem 0.3rem;
border-radius:1em;
box-sizing: border-box;
text-decoration-style: dashed;
font-family:'Roboto',sans-serif;
font-weight:300;
color: whitesmoke;
background-color: #737f87;
text-align:center;
transition: all 0.2s;
  }
  label {
    padding-left: 10%;
    left: 100px;
    color: #676778;
    line-height: 200%;
  }
  input {
    position: sticky;
    left: 200px;
    /* border: rgb(255, 170, 170) solid 2px; */
    border-radius: 7px;
    color: #888;
    height: 30px;
    width: 150px;
    margin: 4px;
    padding: 4px;
 
  }

  select {
    position: sticky;
    left: 200px;
    /* border: rgb(255, 170, 170) solid 2px; */
    border-radius: 7px;
    color: #888;
    height: 30px;
    width: 150px;
    margin: 4px;
    padding: 4px;
 
  }

  /* Modal Header */
  .modal-header {
    padding-left: 2rem;
    color: white;
    z-index: 49;
    justify-content: center;
    font-size: larger;
    min-width: 405px;
  }

  .customPropertiesHeader{
    /* padding-left: 75px; */
    /* padding-bottom: 200px; */
    /* margin-bottom: 40%; */
    font-size: x-large;
    color: black;
    font-weight: 10px;
    position: absolute;
    left: 10px;
    /* transform: translateX(-50%); */
    min-width: fit-content;
  }

   /* Modal Content 1479*/
   .modal-content {
    position: absolute;
    left: 15%;
    background-color: #FFEDEB;
    margin: 15% auto;
    padding-top: 1rem;
    border: 1px #888;
    border-radius: 10px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    animation-name: animatetop;
    animation-duration: 0.4s;
    /* justify-content: center; */
    /* display: grid; */
    z-index: 49;
    overflow: auto;
    max-width: fit-content;
    min-width: fit-content;
    /* max-width: 30%; */
  }

  
  /* Modal Body */
  .modal-body {
    z-index: 49;
    display: block;
    justify-content: center;
    overflow: scroll;
    height: 300px;
    width: 30vw;
    padding-left: 2rem;
    min-width: fit-content;
  }

 

  /* Add Animation */
  @keyframes animatetop {
    from {
      top: -200px;
      opacity: 5;
    }
    to {
      top: 2;
      opacity: 1000000;
    }
  }

 
  .close {
    width:auto;
    height:1px;
    align-self: right;
    color: darkgrey;
    padding-left: 1rem;
  }

  footer {
    padding: 1rem;
    display: flex;
    align-items: center;
    border-top: solid 1px #fcdee0;
  }
}



@media screen and (max-width: 1150px) {
  span {
  min-width: fit-content;
}
  h1 {
  text-align: center;
 color: #ff3e00;
 font-size: x-large;
 text-decoration: underline;
}

h2 {
  line-height: 2;
  color: #40b2f8;
}

.bouncy{
animation:bouncy 5s infinite linear;
position:relative;
}
@keyframes bouncy {
  0%{top:0em}
40%{top:0em}
43%{top:-0.9em}
46%{top:0em}
48%{top:-0.4em}
50%{top:0em}
100%{top:0em;}
}
  #btn {
/* display:inline-block; */
padding:0.1rem 1rem;
box-sizing: border-box;
text-decoration-style: dashed;
font-family:'Roboto',sans-serif;
font-weight:300;
color: #676778;
/* background-color: #96a3ab; */
text-align:center;
transition: all 0.2s;
  }
  #submitbtn {
/* display:inline-block; */
padding:0.1rem 1rem;
margin: 0.3rem 0.3rem;
border-radius:1em;
box-sizing: border-box;
text-decoration-style: dashed;
font-family:'Roboto',sans-serif;
font-weight:300;
color: whitesmoke;
background-color: #737f87;
text-align:center;
transition: all 0.2s;
  }
  label {
    padding-left: 1rem;
    color: #676778;
    line-height: 200%;
  }
  input {
    position: sticky;
    /* border: rgb(255, 170, 170) solid 2px; */
    border-radius: 7px;
    color: #888;
    height: 2rem;
    width: 9rem;
    margin: .3rem;
    padding: .3rem;
    left: 10rem;

 
  }

  select {
    position: sticky;
    /* border: rgb(255, 170, 170) solid 2px; */
    border-radius: 7px;
    color: #888;
    height: 1.8rem;
    width: auto;
    margin: .3rem;
    padding: .3rem;
    left: 20%;
 
  }

  /* Modal Header */
  .modal-header {
    padding-left: 2rem;
    color: white;
    z-index: 49;
    justify-content: center;
    font-size: larger;
    min-width: fit-content;
    padding:1rem 1rem;
  }

  .customPropertiesHeader{
    /* padding-left: 75px; */
    /* padding-bottom: 200px; */
    /* margin-bottom: 40%; */
    font-size: x-large;
    color: black;
    font-weight: 10px;
    position: relative;
    left: 10%;
    transform: translateX(-50%);
    min-width: fit-content;
  }

   /* Modal Content 1479*/
   .modal-content {
    position: absolute;
    left: 15%;
    background-color: #FFEDEB;
    margin: 15% auto;
    padding-top: 1rem;
    padding-right: 1rem;
    border: 1px #888;
    border-radius: 10px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    animation-name: animatetop;
    animation-duration: 0.4s;
    /* justify-content: center; */
    /* display: grid; */
    z-index: 49;
    overflow: auto;
    max-width: fit-content;
    min-width: fit-content;
    /* max-width: 30%; */
  }

  
  /* Modal Body */
  .modal-body {
    z-index: 49;
    display: block;
    justify-content: center;
    overflow: scroll;
    min-width: fit-content;
    height: 10rem;
    width: 22rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

 

  /* Add Animation */
  @keyframes animatetop {
    from {
      top: -200px;
      opacity: 5;
    }
    to {
      top: 2;
      opacity: 1000000;
    }
  }

 
  .close {
    width:auto;
    height:1px;
    align-self: right;
    color: darkgrey;
    padding-left: 1rem;
  }

  footer {
    padding: 1rem;
    display: flex;
    align-items: center;
    border-top: solid 1px #fcdee0;
  }
}

@media screen and (min-width: 1151px) {
  span {
  min-width: fit-content;
}
  h1 {
text-align: center;
 color: #ff3e00;
 font-size: x-large;
 text-decoration: underline;
}

h2 {
  line-height: 3;
  color: #40b2f8;
}

.bouncy{
animation:bouncy 5s infinite linear;
position:relative;
}
@keyframes bouncy {
  0%{top:0em}
40%{top:0em}
43%{top:-0.9em}
46%{top:0em}
48%{top:-0.4em}
50%{top:0em}
100%{top:0em;}
}
  #btn {
/* display:inline-block; */
padding:0.1rem 1rem;
box-sizing: border-box;
text-decoration-style: dashed;
font-family:'Roboto',sans-serif;
font-weight:300;
color: #676778;
/* background-color: #96a3ab; */
text-align:center;
transition: all 0.2s;
  }
  #submitbtn {
/* display:inline-block; */
padding:0.1rem 1rem;
margin: 0.3rem 0.3rem;
border-radius:1em;
box-sizing: border-box;
text-decoration-style: dashed;
font-family:'Roboto',sans-serif;
font-weight:300;
color: whitesmoke;
background-color: #737f87;
text-align:center;
transition: all 0.2s;
  }
  label {
    padding-left: 10%;
    left: 100px;
    color: #676778;
    line-height: 200%;
  }
  input {
    position: sticky;
    left: 200px;
    /* border: rgb(255, 170, 170) solid 2px; */
    border-radius: 7px;
    color: #888;
    height: 30px;
    width: 150px;
    margin: 4px;
    padding: 4px;
 
  }

  select {
    position: sticky;
    left: 200px;
    /* border: rgb(255, 170, 170) solid 2px; */
    border-radius: 7px;
    color: #888;
    height: 30px;
    width: 150px;
    margin: 4px;
    padding: 4px;
 
  }

  /* Modal Header */
  .modal-header {
    padding-left: 2rem;
    color: white;
    z-index: 49;
    justify-content: center;
    font-size: larger;
    min-width: fit-content;
  }

  .customPropertiesHeader{
    /* padding-left: 75px; */
    /* padding-bottom: 200px; */
    /* margin-bottom: 40%; */
    font-size: x-large;
    color: black;
    font-weight: 10px;
    position: relative;
    left: 35%;
    transform: translateX(-50%);
    min-width: fit-content;
  }

   /* Modal Content 1479*/
   .modal-content {
    position: absolute;
    left: 15%;
    background-color: #FFEDEB;
    margin: 15% auto;
    padding-top: 1rem;
    border: 1px #888;
    border-radius: 10px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    animation-name: animatetop;
    animation-duration: 0.4s;
    /* justify-content: center; */
    /* display: grid; */
    z-index: 49;
    overflow: auto;
    max-width: fit-content;
    min-width: fit-content;
    /* max-width: 30%; */
  }

  
  /* Modal Body */
  .modal-body {
    z-index: 49;
    display: block;
    justify-content: center;
    overflow: scroll;
    min-width: fit-content;
    height: 300px;
    width: 30vw;
    padding-left: 2rem;
  }

 

  /* Add Animation */
  @keyframes animatetop {
    from {
      top: -200px;
      opacity: 5;
    }
    to {
      top: 2;
      opacity: 1000000;
    }
  }

 
  .close {
    width:auto;
    height:1px;
    align-self: right;
    color: darkgrey;
    padding-left: 1rem;
  }

  footer {
    padding: 1rem;
    display: flex;
    align-items: center;
    border-top: solid 1px #fcdee0;
  }
}

  
  
</style>
