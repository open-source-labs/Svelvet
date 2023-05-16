<script lang='ts'>
   import { Node, Svelvet} from '$lib';
   import type { NodeConfig, CSSColorString, InitialDimensions} from '$lib/types';

   let nodes: NodeConfig[] = [];
   let dropped_in :boolean;

   // types for node creation
   let bgColor: CSSColorString = '#f2f2f2';
   let borderColor: CSSColorString = '#dedede';
   let label: string | undefined = '';
   let width: number = 200;
   let height: number = 100;

   const handleDragEnter = (e: any) => {
        dropped_in = true;
    }

    const handleDragLeave = (e: any) => {
        dropped_in = false;
    }

    const handleDragEnd = (e: any) => {
      dropped_in = false;
    }

    const onDragOver = (e: Event) => {
		e.preventDefault();
		return false;
	};

    const handleDragStart = (e: any)  => {
        e.dataTransfer.dropEffect = "move"; 
    }

    const handleDragDrop = (e: any) => {
        e.preventDefault();

        let dimensions = {width, height};
        const moveEvent = new MouseEvent('mousemove', {
			clientX: e.clientX,
			clientY: e.clientY,
			bubbles: true
		});
		e.target.dispatchEvent(moveEvent);
        dropped_in = true;
		nodes = [...nodes, {bgColor, borderColor, label, dimensions}];	
    }

    const handleClick = (e: any) => {
		bgColor = '#f2f2f2';
	 	borderColor = '#dedede';
        label = '';
		width = 200;
		height = 100;
	}
	

</script>

<div	
	id = 'drop_zone'
	on:dragenter={handleDragEnter}
	on:dragleave={handleDragLeave}
	on:drop={handleDragDrop}   
    on:dragover = {onDragOver}
>
	<Svelvet height={600} zoom={0.75} minimap controls>
		{#each nodes as node}
			<Node {...node} drop="cursor"/>			
		{/each}
	</Svelvet>
</div>


<div id='drawer'>
    <ul>
        <li class='list-item'>
            <label for='bgColor'>Background Color : </label>
            <input id='bgColor' class='colorWheel' type='color' bind:value={bgColor}>
        </li>
        <li class='list-item'>
            <label for='borderColor'>Border Color : </label>
            <input id='borderColor' class='colorWheel' type='color' bind:value={borderColor}>
        </li>
        <li class='list-item'>
            <label for='label'>Label : </label>
            <input id='label' type="text" bind:value={label}>
        </li>
        <li class="list-item">
            <h4>Dimensions: </h4>
            <label for='width'>Height:</label>
                <input id='width' type='input' bind:value={width}>
            <label for='height'>Width:</label> 
                <input id='height' type='input' bind:value={height}>
        </li>
        <li class='list-item'>
            <div class='nodes' draggable='true' on:dragstart={handleDragStart} on:dragend={handleDragEnd}> Node </div>
            <button on:click|stopPropagation={handleClick}>Reset</button>
        </li>
    </ul>
</div>


<style>
    .nodes{
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
        width: 100px;
        border: 1px solid gray;
    }
    .list-item{
        display: flex;
        flex-direction: row;
        align-items: center;
        list-style: none;
        margin-bottom: 10px;
    }
    .colorWheel{
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-color: transparent;
        border: none;
        width: 40px;
        height: 40px;
        cursor: pointer;
        border-radius: 50%;
    }

    .colorWheel::-webkit-color-swatch{
        border-radius: 50%;
    }
    .colorWheel::-moz-color-swatch{
        border-radius: 50%;
    }

</style>