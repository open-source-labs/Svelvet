<script lang='ts'>
  import { Anchor } from '$lib';
  import { addProps } from '$lib/utils';
  import type { NodeConfig, CSSColorString, Direction} from '$lib/types';

  // Array of current anchors and nodes
  let anchors: any[] = [];
  let customNodes: NodeConfig[] = [];

  // types for anchor creation
  let invisible: boolean | undefined;
  let nodeConnect: boolean | undefined;
  let input: boolean | undefined;
  let output: boolean | undefined;
  let multiple: boolean | undefined;
  let direction: Direction | undefined;
  let dynamic: boolean | undefined;
  let anchorEdgeLabel: string | undefined;
  let anchorLocked: boolean | undefined;
  let anchorBgColor: CSSColorString | undefined;

  // Drag and drop functionality
  const handleDragStart = (e: any)  => {
        e.dataTransfer.dropEffect = "move"; 
    }

    const handleDragDrop = (e: any) => {
      e.preventDefault();
      const moveEvent = new MouseEvent('mousemove', {
			clientX: e.clientX,
			clientY: e.clientY,
			bubbles: true
		});
		e.target.dispatchEvent(moveEvent);
        dropped_in = true;
        
        // Object that stores properties for the created anchor
      const anchorProps: any = {};
      // Array of property names and values for anchor
      const anchorPropNames: any[] = ['invisible', 'nodeConnect', 'input', 'output', 'multiple', 'dynamic', 'edgeLabel', 'direction', 'locked', 'bgColor'];
      const anchorPropsArray: any[] = [invisible, nodeConnect, input, output, multiple, dynamic, anchorEdgeLabel, direction, anchorLocked, anchorBgColor];
      // Adds props to anchor if they exist
      addProps(anchorPropNames, anchorPropsArray, anchorProps);

      // If anchor props were given to create an anchor, an anchor has been created
      if (Object.keys(anchorProps).length) {
          // Add custom node to array and push the custom props
          customNodes = [...customNodes, {...nodeProps}]
          anchors.push(anchorProps)

          //If edge props were given to create an achor, a custom edge has been created
          if(Object.keys(edgeProps).length) {
              // Add edge props to edge array
              edges.push({...edgeProps});
              
          }
          
      } else {
          defaultNodes = [...defaultNodes, {...nodeProps}];
      }
    }
</script>