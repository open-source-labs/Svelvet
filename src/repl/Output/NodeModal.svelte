<script lang="ts">
import { nodeProps, idNumber, data, positionX, positionY, width, height, borderColor, borderRadius, bgColor, textColor, buildToggle, inputToggle } from "$lib/stores/store";
const datalog = () => console.log("this is data", $data);
</script>


<!-- <div id="myModal" class="modal"> -->
  <div class="modal-content">
    <div class="modal-header">
      <span class="close">&times;</span>
      <h2>CustomNode Properties</h2>
    </div>
    <div class="modal-body">
      <form>
        <label for="data">Label:</label>
        <input on:input={datalog} id="data" bind:value={$data} type="text" /> <br />
        <label for="positionx">PositionX:</label>
        <input id="positionx" bind:value={$positionX} type="number" min="50" max="250" /> <br />
        <label for="positiony">PositionY:</label>
        <input bind:value={$positionY} id="positiony" type="number" min="50" max="250" /> <br />
        <label for="width">Width:</label>
        <input bind:value={$width} id="width" type="number" min="50" max="250" /> <br />
        <label for="height">Height:</label>
        <input bind:value={$height} id="height" type="number" min="50" max="250" /> <br />
        <label for="borderColor">Border Color:</label>
        <input bind:value={$borderColor} id="borderColor" type="color" /> <br />
        <label for="borderRadius">Border Radius:</label>
        <input bind:value={$borderRadius} id="borderRadius" type="number" min="0" max="50" /> <br />
        <label for="bgColor">Background Color:</label>
        <input bind:value={$bgColor} id="bgColor" type="color" /> <br />
        <label for="textColor">Text Color:</label>
        <input bind:value={$textColor} id="textColor" type="color" /> <br />
      </form>
			<button class="bouncy" on:click={() => {$buildToggle = true; $inputToggle = false;} }> SUBMIT<button/>
    </div>
  </div>
<!-- </div> -->

<style>
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
  button {
/* display:inline-block; */
padding:0.1rem 1rem;
margin: 0.3rem 0.3rem;
border-radius:2em;
box-sizing: border-box;
text-decoration-style: dashed;
font-family:'Roboto',sans-serif;
font-weight:300;
color: grey;
background-color:white;
text-align:center;
transition: all 0.2s;
  }
  label {
    color: white;
  }
  input {
    position: absolute;
    left: 50%;
    border: rgb(255, 170, 170) solid 2px;
    border-radius: 7px;
    color: #888;
    height: 28px;
    width: 125px;
    margin: 3px;
  }
  /* Modal Header */
  .modal-header {
    padding: 2px 16px;
    color: white;
    z-index: 999;
  }

  /* Modal Body */
  .modal-body {
    /* padding: 2px 16px; */
    /* opacity: 100; */
    z-index: 999;
    /* justify-content: center; */


  }

  /* Modal Content */
  .modal-content {
    position: absolute;
    left: 20%;
    background-color: #f87171ba;
    margin: 15% auto;
    padding: 1rem;
    border: 1px solid #888;
    border-radius: 10px;
    max-width: 45vw;
    max-height: 30vw;
    min-width: 30vw;
    min-height: 30vw;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    animation-name: animatetop;
    animation-duration: 0.4s;
    z-index: 999;
    /* justify-content: center; */
    /* display: grid; */
    z-index: 999;
  }

  /* Add Animation */
  @keyframes animatetop {
    from {
      top: -200px;
      opacity: 0;
    }
    to {
      top: 0;
      opacity: 20;
    }
  }
</style>
