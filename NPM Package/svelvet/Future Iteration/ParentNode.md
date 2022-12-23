Earlier on we worked on implementing a parent child node relationship in the svelvet library and it seemed to work. However, there were multiple bug issues that hindered its functionality that we were unable to fix. This logic was entirely implemented in the store.js file within onMouseMove, onTouchMove, and onNodeClick.





// This is the function handler for the mouseMove event to update the position of the selected node.
    const onMouseMove = (e, nodeID) => {
        coreSvelvetStore.nodesStore.update((n) => {

            const correctNode = n.find((node) => node.id === nodeID);

            const scale = get(coreSvelvetStore.d3Scale);

            if(correctNode.childNodes){
                n.forEach((child)=>{
                    //conditional fails, make it recognize the nodes in childNodes
                    if(correctNode.childNodes.includes(child.id)){
                        //Don't need the child position set to node positon, it just needs to move with the mouse.
                        child.position.x += e.movementX / scale;
                        
                        child.position.y += e.movementY / scale;
                        
                    }
                    
                    
                })
                correctNode.position.x += e.movementX / scale;
                correctNode.position.y += e.movementY / scale;  
            } 
            else if(correctNode.parentNode){
                //Logic to ensure the child node does not go beyond the scope of the parent
                const parent = n.find(el => el.id === correctNode.parentNode);
                if(correctNode.position.x < parent.position.x || correctNode.position.x + correctNode.width > parent.position.x + parent.width || correctNode.position.y < parent.position.y || correctNode.position.y+correctNode.height > parent.position.y+parent.height){
                    console.log('out of bounds');
                    //it recognizes when it goes past the parent bounds but doesn't know how to stop
                    return [...n];
                }else{
                correctNode.position.x += e.movementX / scale;
                correctNode.position.y += e.movementY / scale;
                }
            }
            else {
                // divide the movement value by scale to keep it proportional to d3Zoom transformations
                correctNode.position.x += e.movementX / scale;
                correctNode.position.y += e.movementY / scale;

            }

            return [...n];
        });
    };
    // This is the function handler for the touch event on mobile to select a node.
    const onTouchMove = (e, nodeID) => {
        coreSvelvetStore.nodesStore.update((n) => {

            // const correctNode = n.find((node) => node.id === nodeID);

            // const { x, y, width, height } = e.target.getBoundingClientRect();
            // const offsetX = ((e.touches[0].clientX - x) / width) * e.target.offsetWidth;
            // const offsetY = ((e.touches[0].clientY - y) / height) * e.target.offsetHeight;

            // if(correctNode.childNodes){
            //     n.forEach((child)=>{
            //         //conditional fails, make it recognize the nodes in childNodes
            //         if(correctNode.childNodes.includes(child.id)){
            //             //Don't need the child position set to node positon, it just needs to move with the mouse.
            //             child.position.x += offsetX - correctNode.width/2;
            //             child.position.y += offsetY - correctNode.height/2;
            //         }
                    
                    
            //     })
                
            //     correctNode.position.x += offsetX - correctNode.width/2;
            //     correctNode.position.y += offsetY - correctNode.height/2;
            // } 
            // else if(correctNode.parentNode){
            //     //Logic to ensure the child node does not go beyond the scope of the parent
            //     const parent = n.find(el => el.id === correctNode.parentNode);
            //     if(correctNode.position.x < parent.position.x || correctNode.position.x + correctNode.width > parent.position.x + parent.width || correctNode.position.y < parent.position.y || correctNode.position.y+correctNode.height > parent.position.y+parent.height){
            //         console.log('out of bounds');
            //         //it recognizes when it goes past the parent bounds but doesn't know how to stop
            //         return [...n];
            //     }else{
            //     // centers the node consistently under the user's touch
            //     correctNode.position.x += offsetX - correctNode.width/2;
            //     correctNode.position.y += offsetY - correctNode.height/2;
            //     }
            // }
            // else {
                

            //     // centers the node consistently under the user's touch
            //     correctNode.position.x += offsetX - correctNode.width/2;
            //     correctNode.position.y += offsetY - correctNode.height/2;

            // }
            n.forEach((node) => {
                if (node.id === nodeID) {
                    //calculates the location of the selected node
                    const { x, y, width, height } = e.target.getBoundingClientRect();
                    const offsetX = ((e.touches[0].clientX - x) / width) * e.target.offsetWidth;
                    const offsetY = ((e.touches[0].clientY - y) / height) * e.target.offsetHeight;
                    // centers the node consistently under the user's touch
                    node.position.x += offsetX - node.width / 2;
                    node.position.y += offsetY - node.height / 2;
                }
            });
            return [...n];
        });
    };

    const nodeIdSelected = coreSvelvetStore.nodeIdSelected;

    // if the user clicks a node without moving it, this function fires allowing a user to invoke the callback function
    const onNodeClick = (e, nodeID) => {
        // console.log(nodeID);

        let boolean = [true];
        // let count = 0
        get(nodesStore).forEach((node) => {

            //Click callback must be defined in the +page.svelte otherwise it will be undefined here.
            node.clickCallback?.(node);
            
            if (node.id === get(nodeIdSelected)) {
                if(node.parentNode){
                    //This is an inefficient solution in terms of O(n^2)
                    const parent = get(coreSvelvetStore.nodesStore).find(value => value.id === node.parentNode);
                   
                    node.width = Math.round(parent.width/2);
                    node.height = Math.round(parent.height/2);

                    // We use this criteria to ensure the box stays within the parent
                    if(node.position.x < parent.position.x || node.position.x + node.width > parent.position.x + parent.width || node.position.y < parent.position.y || node.position.y+node.height > parent.position.y+parent.height){
                        
                        node.position.x=(parent.position.x +Math.round(parent.width/4));
                        node.position.y=parent.position.y + Math.round(parent.height/4);

                        //we set the node.position.x and node.position.y into an array to update it on svelvet/Nodes/index.svelte and ImageNode
                        boolean = [false, node.position.x, node.position.y];
                    }
                   
                    // node.position.y=parent.position.y+ 30
                    // node.position.x=parent.position.x + (count * 90)
                    // count++
                }
                
            }
        });
        //The idea is
        return boolean;
    };


    Within index.svelte and ImageNode.svelte

     on:mousedown={(e) => {
    e.preventDefault();
    $nodeIdSelected = node.id;
    $nodeSelected = true;
    

    //This is to keep child components into parent upon click
    const reset = onNodeClick(e, node.id);
    console.log(reset);
    moving = reset[0];
    // console.log(node.position.x, node.position.y);

    //The idea is to update the nodeposition in the stores and the web page.
    if(!moving){
      node.position.x = reset[1];
      node.position.y = reset[2];
    }
    console.log(node.position.x, node.position.y);

  }}