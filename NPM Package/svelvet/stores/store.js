import { writable, derived, get, readable } from 'svelte/store';
const svelvetStores = {};
// refer to Svelvet/index, if store does not exist, then create one.

// Moved this out of the findOrCreateStore function to have it as more of a traditional? state that can be updated more easily
export const coreSvelvetStore = {
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
    backgroundColor: writable(),
    hoveredElement: writable(null),
    initZoom: writable(4),
    initLocation: writable({x:0, y:0}),
    isLocked: writable(false),
    boundary: writable(false),
    nodeLinkStore: writable(false),
    nodeCreateStore: writable(false),
    nodeEditStore: writable(false),
    shareable: writable(false),
    deleteNodes: writable(false)
};


// Creates one Svelvet component store using the unique key
export function findOrCreateStore(key) {
    //This just returns whatever we are requesting from store.js
    const existing = svelvetStores[key];
    if (existing) {
        return existing;
    }
   
    // This is the function handler for the mouseMove event to update the position of the selected node.
    // Changed from onMouseMove to onNodeMove because of addition of onEdgeMove function
    const onNodeMove = (e, nodeID) => {
      const bound = get(coreSvelvetStore.boundary);
      //if there is a boundary set, nodes cannot be moved passed the boundary 
      if(bound){
            coreSvelvetStore.nodesStore.update((n) => {
                const correctNode = n.find((node) => node.id === nodeID);
                
                const scale = get(coreSvelvetStore.d3Scale);
                //nodes can only move within 50px of the bounds
                if(correctNode.childNodes){
                    n.forEach((child) => {
                        if(correctNode.childNodes.includes(child.id)){
                          child.position.x = Math.min(Math.max(child.position.x + e.movementX / scale, 1), bound.x-50);
                          child.position.y = Math.min(Math.max(child.position.y +e.movementY / scale, 1), bound.y-50);
                        }
                    })
                    correctNode.position.x = Math.min(Math.max(correctNode.position.x + e.movementX / scale, 1), bound.x-50);
                    correctNode.position.y = Math.min(Math.max(correctNode.position.y +e.movementY / scale, 1), bound.y-50);
                }
                else {
                    // divide the movement value by scale to keep it proportional to d3Zoom transformations
                    correctNode.position.x = Math.min(Math.max(correctNode.position.x + e.movementX / scale, 1), bound.x-50);
                    correctNode.position.y = Math.min(Math.max(correctNode.position.y +e.movementY / scale, 1), bound.y-50);
    
                }
                return [...n];
            });}
              else{
              coreSvelvetStore.nodesStore.update((n) => {
                const correctNode = n.find((node) => node.id === nodeID);
    
                const scale = get(coreSvelvetStore.d3Scale);
    
                if(correctNode.childNodes){
                    n.forEach((child) => {
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
      };
            

    // Mostly copied from onNodeMove, this allows for the movement of new Edges that don't yet have targets/sources
    const onEdgeMove = (event, edgeID) => {
        coreSvelvetStore.edgesStore.update((e) => {
            const correctEdge = e.find((edge) => edge.id === edgeID);
            const scale = get(coreSvelvetStore.d3Scale);
            // divide the movement value by scale to keep it proportional to d3Zoom transformations
            if (!correctEdge.target) {
              correctEdge.targetX += event.movementX / scale;
              correctEdge.targetY += event.movementY / scale;
            } 
            if (!correctEdge.source) {
              correctEdge.sourceX += event.movementX / scale;
              correctEdge.sourceY += event.movementY / scale;
            }
            return [...e];
        });
    };

    // This is the function handler for the touch event on mobile to select a node.
    const onTouchMove = (e, nodeID) => {
            coreSvelvetStore.nodesStore.update((n) => {
                // restores mobile functionality
                n.forEach(node => {
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

            /*  
                Svelvet 4.0 dev code see:
                https://github.com/open-source-labs/Svelvet/blob/main/NPM%20Package/svelvet/Future%20Iteration/ParentNode.md
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
            */
    };
    const deleteNode = (e, $nodeIdSelected) => {
      const answer = confirm('Are you sure you want to delete this node?')
      //if confirm yes, access the nodes store in the svelvet store and return a filtered node array accounting for all nodes except the selected node
      if (answer) { 
        coreSvelvetStore.nodesStore.update((n) => {
            return n.filter(node => node.id !== $nodeIdSelected);
        })
      //if confirm yes, also remove all edges connected to selected node
      //access the edges store and return a filtered edges array without all edges connected to selected node
      coreSvelvetStore.edgesStore.update((e) => {
        return e.filter(edge => edge.source !== $nodeIdSelected && edge.target !== $nodeIdSelected)
      })
    }
  }
  /*
  This is the function that renders a new edge when an anchor is clicked
  */  
  const renderEdge = (e, node, role, position) => {
    e.preventDefault(); // preventing default behavior, not sure if necessary
    
    
    const uniq = (Math.random() + 1).toString(36).substring(7) + '-' + (Math.random() + 1).toString(36).substring(7);
    //grabs x y coordinates from setNewEdgeProps
    const [x, y] = setNewEdgeProps(role, position, node);
    // Setting the newEdge variable to an edge prototype
    const newEdge = role === 'source' ? { 
      id: uniq, // generate unique id
      source: node.id, // the source is the node that the anchor is on
      target: null, // until the mouse is released the target will be set to null
      targetX: x,
      targetY: y,
      animate: true,
    } : { 
      id: uniq, // generate unique id
      source: null, // until the mouse is released the source will be set to null
      target: node.id, // the target is the node that the anchor is on
      sourceX: x,
      sourceY: y,
      animate: true, 
    };
    coreSvelvetStore.edgesStore.set([...get(derivedEdges), newEdge]); // updating the edges in the store
    return newEdge;
  }

  
    /*
  This is the function that renders a new node when the mouse is released
  after clicking on an anchor, takes in the newEdge that was just created
  */  
  const renderNewNode = (event, node, edge, role, position) => {
    // Find the highest of the current id numbers
    const nodeIds = get(coreSvelvetStore.nodesStore).map(n => n.id);
    const highestId = Math.max(...nodeIds);
    
    event.preventDefault();
    let pos = position === 'bottom' ? { x: edge.targetX, y: edge.targetY } : { x: edge.sourceX, y: edge.sourceY };
    
    // setting newNode variable to a 'prototype' node
    const newNode = {
      id: highestId + 1, // set the id to one higher than the highest in the current array
      position: pos, // the position (top left corner) is at the target coords of the edge for now
      data: node.data ? {...node.data} : {label: ''}, // need ways to change the rest of the properties
      width: node.width,
      height: node.height,
      className: node.className || '',
      bgColor: node.bgColor,
      // image: node.image,
      // src: node.src,
      textColor: node.textColor,
      borderRadius: node.borderRadius,
      borderColor: node.borderColor,
      delete: node.delete
    };
    if (position === 'left') {
      if (role === 'source') {
        newNode.sourcePosition = 'left';
        newNode.targetPosition = 'right';
        edge.target = newNode.id; // set the new edge to target the new node
        newNode.position.x = edge.targetX - newNode.width / 2; // moves the node over to the correct position
        newNode.position.y = edge.targetY;
      }
      else {
        newNode.sourcePosition = 'right';
        newNode.targetPosition = 'left';
        edge.source = newNode.id;
        newNode.position.x = edge.sourceX - newNode.width / 2;
        newNode.position.y = edge.sourceY - newNode.height;
      }
    } else if (position === 'right') {
      if(role === 'source') {
        newNode.sourcePosition = 'right';
        newNode.targetPosition = 'left';
        edge.target = newNode.id; // set the new edge to target the new node
        newNode.position.x = edge.targetX - newNode.width / 2; // moves the node over to the correct position
        newNode.position.y = edge.targetY;
      }
      else {
        newNode.sourcePosition = 'left';
        newNode.targetPosition = 'right';
        edge.source = newNode.id;
        newNode.position.x = edge.sourceX - newNode.width / 2;
        newNode.position.y = edge.sourceY - newNode.height;
      }
    } else {
      if(role === 'source') {
        edge.target = newNode.id; // set the new edge to target the new node
        newNode.position.x = edge.targetX - newNode.width / 2; // moves the node over to the correct position
        newNode.position.y = edge.targetY;
      }
      else {
        edge.source = newNode.id;
        newNode.position.x = edge.sourceX - newNode.width / 2;
        newNode.position.y = edge.sourceY - newNode.height;
      }
    }
    coreSvelvetStore.nodesStore.set([...get(nodesStore), newNode]); // update the nodes in the store
  }

    // Getting the styles for a custom class, and adjusting the height and width if necessary
    const getStyles = (e, node) => {
        let width, height, innerText;
        
        const styleRules = document.styleSheets[1].cssRules; // getting the right stylesheet and cssRules from the CSS object model
        
        // Look through each CSS rule to find the one the user defined
        Object.values(styleRules).forEach(rule => {
          if (rule.selectorText === `.${node.className}`) {
            const initialText = rule.cssText; // getting the full text of the CSS rule 
            const i = initialText.indexOf('{'); // finding index of first bracket
            innerText = initialText.substring(i + 1, initialText.length - 1); // extracting the CSS to insert into inline style
        
            // Adjusting the width and height if they are set via the custom class
            const arr = innerText.split(' ');
            arr.forEach((str, i) => {
              if (str === 'width:') {
                width = str.concat(arr[i+1]); // go through the array and join width and the number
                const w = parseInt(arr[i+1]); // getting the number for the width
                width = w;
              }
              if (str === 'height:') {
                height = str.concat(arr[i+1]); // same as with the width
                const h = parseInt(arr[i+1]);
                height = h;
              }
            })
          }
        })
        // adjusting the properties on the node in the store 
        const newStore = get(coreSvelvetStore.nodesStore).map(n => {
          if (node.id === n.id) {
            n.width = width || node.width;
            n.height = height || node.height;
            return n;
          } else return n;
        })
        coreSvelvetStore.nodesStore.set(newStore);
        return [width, height, innerText];
      }


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
    // updates edgesStore with new object properties (edge.sourceX, edge.targetY, etc) for edgesArray
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
            
            //We find out what the sourceNode is or the targetNode is.
            $nodesStore.forEach((node) => {
                if (edge.source === node.id) {
                    sourceNode = node;
                }
                if (edge.target === node.id) {
                    targetNode = node;
                } 
            });

            // If the edge doesn't have a target yet, set the target to null rather than to the dummy node above
            if(!$nodesStore.some(node => node.id === edge.target)) targetNode = null;
            // Do the same for the source 
            if(!$nodesStore.some(node => node.id === edge.source)) sourceNode = null;

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
                    //the y coordinate of the top of the node
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

    // Sets the position of each anchor (top, bottom, left or right)
    const setAnchorPosition = (position, nodeWidth, nodeHeight, width, height) => {
        let top;
        let left;
        if(position === 'top') {
          top = -height / 2;
          left = nodeWidth / 2 - width / 2;
        }
        if(position === 'bottom') {
          top = nodeHeight - height / 2;
          left = nodeWidth / 2 - width / 2;
        }
        if(position === 'left') {
          top = nodeHeight / 2 - height / 2;
          left = -width / 2;
        }
        if(position === 'right') {
          top = nodeHeight / 2 - height / 2;
          left = nodeWidth - width / 2;
        }
        return [top, left];
      }

      const setNewEdgeProps = (role, position, node) => {
        let left = node.position.x;
        //top of the node selected
        let top = node.position.y;
        //declaring the middle point of the node
        let middle = node.width / 2;
        let x;
        let y;
        if(role === 'source') {
            if (position === 'top') {
                //the x coordinate of the middle of the node
                x = left + middle;
                //the y coordinate of the top of the node
                y = top;
            }
            else if (position === 'bottom') {
                x = left + middle;
                y = top + node.height;
            }
            else if (position === 'left') {
                x = left;
                y = top + node.height / 2;
            }
            else if (position === 'right') {
                x = left + node.width;
                y = top + node.height / 2;
            }
            return [x, y];
        } else {
            if (position === 'top') {
                //the x coordinate of the middle of the node
                x = left + middle;
                //the y coordinate of the top of the node
                y = top;
            }
            else if (position === 'bottom') {
                x = left + middle;
                y = top + node.height;
            }
            else if (position === 'left') {
                x = left;
                y = top + node.height / 2;
            }
            else if (position === 'right') {
                x = left + node.width;
                y = top + node.height / 2;
            }
            return [x, y];
        }
    } 

    
    //Puts everything together as the svelvet store and use the key so that it can be used.
    const svelvetStore = {
        ...coreSvelvetStore,
        onTouchMove,
        onEdgeMove,
        onNodeMove,
        onNodeClick,
        setAnchorPosition,
        setNewEdgeProps,
        renderEdge,
        renderNewNode,
        getStyles,
        deleteNode,
        derivedEdges
    };
    svelvetStores[key] = svelvetStore;
    return svelvetStore;
}
