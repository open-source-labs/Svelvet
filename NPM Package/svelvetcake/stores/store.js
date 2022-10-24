import { writable, derived, get, readable } from 'svelte/store';
const svelvetStores = {};
// refer to Svelvet/index, if store does not exist, then create one.
// Creates one Svelvet component store using the unique key
export function findOrCreateStore(key) {
    const existing = svelvetStores[key];
    if (existing) {
        return existing;
    }
    //Setting defaults of core svelvet store and making them a store using writable
    const coreSvelvetStore = {
        nodesStore: writable([]),
        edgesStore: writable([]),
        widthStore: writable(600),
        heightStore: writable(600),
        backgroundStore: writable(false),
        movementStore: writable(true),
        nodeSelected: writable(false),
        nodeIdSelected: writable(-1),
        d3Scale: writable(1),
        snapgrid: writable(false),
        snapResize: writable(30),
        backgroundColor: writable()
    };
    // This is the function handler for the mouseMove event to update the position of the selected node.
    const onMouseMove = (e, nodeID) => {
        coreSvelvetStore.nodesStore.update((n) => {
            const correctNode = n.find((node) => node.id === nodeID);

            const scale = get(coreSvelvetStore.d3Scale);

            if(correctNode.childNodes){
                n.forEach((child) =>{
                    if(correctNode.childNodes.includes(child.id)){
                        child.position.x += e.movementX / scale;
                        child.position.y += e.movementY / scale;
                    }
                })
                correctNode.position.x += e.movementX / scale;
                correctNode.position.y += e.movementY / scale;
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
                const correctNode = n.find((node) => node.id === nodeID);
    
                const { x, y, width, height } = e.target.getBoundingClientRect();
                const offsetX = ((e.touches[0].clientX - x) / width) * e.target.offsetWidth;
                const offsetY = ((e.touches[0].clientY - y) / height) * e.target.offsetHeight;
    
                if(correctNode.childNodes){
                    n.forEach((child)=>{
                        //conditional fails, make it recognize the nodes in childNodes
                        if(correctNode.childNodes.includes(child.id)){
                            //All nodes within child nodes will move with the parent container node.
                            child.position.x += offsetX - correctNode.width/2;
                            child.position.y += offsetY - correctNode.height/2;
                        }
                    })
                    correctNode.position.x += offsetX - correctNode.width/2;
                    correctNode.position.y += offsetY - correctNode.height/2;
                }  else {
                    // centers the node consistently under the user's touch
                    correctNode.position.x += offsetX - correctNode.width/2;
                    correctNode.position.y += offsetY - correctNode.height/2;
    
                }
            });
            return [...n];
    };

    const nodeIdSelected = coreSvelvetStore.nodeIdSelected;
    // if the user clicks a node without moving it, this function fires allowing a user to invoke the callback function
    const onNodeClick = (e, nodeID) => {
        get(nodesStore).forEach((node) => {
            if (node.id === get(nodeIdSelected)) {
                node.clickCallback?.(node);
            }
        });
    };
    const edgesStore = coreSvelvetStore.edgesStore;
    const nodesStore = coreSvelvetStore.nodesStore;
    // derive from nodesStore and edgesStore, pass in array value from each store
    // updates edgesStore with new object properties (edge,sourceX, edge.targetY, etc) for edgesArray
    // $nodesStore and its individual object properties are reactive to node.position.x and node.position.y
    // so derivedEdges has access to node.position.x and node.position.y changes inside of this function
    const derivedEdges = derived([nodesStore, edgesStore], ([$nodesStore, $edgesStore]) => {
        $edgesStore.forEach((edge) => {
            // any -> edge should follow type DerivedEdge, but we are assigning to any so the typing meshes together
            // These are dummy nodes to resolve a typescripting issue. They are overwritten in the following forEach loop
            let sourceNode = {
                id: 0,
                position: { x: 25, y: 475 },
                data: { label: '9' },
                width: 175,
                height: 40,
                targetPosition: 'right',
                sourcePosition: 'left'
            };
            let targetNode = {
                id: 10,
                position: { x: 750, y: 475 },
                data: { label: '10' },
                width: 175,
                height: 40,
                targetPosition: 'right',
                sourcePosition: 'left'
            };
            $nodesStore.forEach((node) => {
                if (edge.source === node.id)
                    sourceNode = node;
                if (edge.target === node.id)
                    targetNode = node;
            });
            if (sourceNode) {
                //left side of the node selected
                let left = sourceNode.position.x;
                //top of the node selected
                let top = sourceNode.position.y;
                //declaring the middle point of the node
                let middle = sourceNode.width / 2;
                //Default sourcePosition to bottom if sourcePosition not defined
                if (sourceNode.sourcePosition === 'bottom' || sourceNode.sourcePosition === undefined) {
                    //the x coordinate of the middle of the node
                    edge.sourceX = left + middle;
                    //the y coordinate of the bottom of the node
                    edge.sourceY = top + sourceNode.height;
                    //assign sourcePosition to the edge for usage in the various edge components
                    edge.sourcePosition = 'bottom';
                }
                else if (sourceNode.sourcePosition === 'top') {
                    edge.sourceX = left + middle;
                    edge.sourceY = top;
                    edge.sourcePosition = sourceNode.sourcePosition;
                }
                else if (sourceNode.sourcePosition === 'left') {
                    edge.sourceX = left;
                    edge.sourceY = top + sourceNode.height / 2;
                    edge.sourcePosition = sourceNode.sourcePosition;
                }
                else if (sourceNode.sourcePosition === 'right') {
                    edge.sourceX = left + sourceNode.width;
                    edge.sourceY = top + sourceNode.height / 2;
                    edge.sourcePosition = sourceNode.sourcePosition;
                }
            }
            if (targetNode) {
                //left side of the node selected
                let left = targetNode.position.x;
                //top of the node selected
                let top = targetNode.position.y;
                //declaring the middle point of the node
                let middle = targetNode.width / 2;
                //Default to top targetPosition if targetPosition undefined
                if (targetNode.targetPosition === 'top' || targetNode.targetPosition === undefined) {
                    //the x coordinate of the middle of the node
                    edge.targetX = left + middle;
                    //the y coordinate of the bottom of the node
                    edge.targetY = top;
                    //assign sourcePosition to the edge for usage in the various edge components
                    edge.targetPosition = 'top';
                }
                else if (targetNode.targetPosition === 'bottom') {
                    edge.targetX = left + middle;
                    edge.targetY = top + targetNode.height;
                    edge.targetPosition = targetNode.targetPosition;
                }
                else if (targetNode.targetPosition === 'left') {
                    edge.targetX = left;
                    edge.targetY = top + targetNode.height / 2;
                    edge.targetPosition = targetNode.targetPosition;
                }
                else if (targetNode.targetPosition === 'right') {
                    edge.targetX = left + targetNode.width;
                    edge.targetY = top + targetNode.height / 2;
                    edge.targetPosition = targetNode.targetPosition;
                }
            }
        });
        return [...$edgesStore];
    });
    //Puts everything together as the svelvet store and use the key so that it can be used.
    const svelvetStore = {
        ...coreSvelvetStore,
        onTouchMove,
        onMouseMove,
        onNodeClick,
        derivedEdges
    };
    svelvetStores[key] = svelvetStore;
    return svelvetStore;
}
