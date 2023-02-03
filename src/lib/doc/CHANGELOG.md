## custom-nodes

https://www.svelvet.io/docs/custom-nodes/

Anchor points no longer display on nodes in isolation. This is because anchor points are no longer tied to the node object.

<img src="./images/custom-nodes-before.png" width="150" height="150">
<img src="./images/custom-nodes-after.png" width="150" height="150">

## custom-edges

https://www.svelvet.io/docs/custom-edges/

Edges now use adaptive anchors by default. Previously, source/target anchors were placed on the top/bottom of the node by default. It looks nice in the specific causes when target nodes are located below source nodes, but in the general case there will be intersecting edges.

<img src="./images/custom-edges-before.png" width="150" height="150">
<img src="./images/custom-edges-after.png" width="150" height="150">

## panning and zooming

https://www.svelvet.io/docs/pan-and-zoom/

Panning and zooming is functional. Removed option to stop panning, lock nodes due to store pollution. This is simple to add back if it is a community requested feature.

TODO: need to update this text in docs:

```
play around with the flow diagram below! If you wish to stop panning, set the movement prop to false. If you wish to stop node dragging, pass in the locked prop.
```

## usage with typescript

https://www.svelvet.io/docs/typescript/

Type names changed from Node, Edge ,to UserNodeType, UserEdgeType. The main reason for this is:

- The internal state of Svelvet is stored in objects Node, Edge which are different from the specifications passed in by users (hereafter referred to as UserNode, UserEdge). For example, UserNodes have "sourcePosition" and "targetPosition" parameters. However, the internal node project does not have "sourcePosition" and "targetPosition"; instead that functionality has been abstracted to a separate Anchor class. This promotes greater code modularity.

## CSS-Background

https://www.svelvet.io/docs/CSS-Background/

<img src="./images/css-background-before.png" width="150" height="150">
<img src="./images/css-background-after.png" width="150" height="150">

No visual changes. Moved background color out of store in order to minimize store pollution. This means that background color will not be serialized using the import-export-store feature. We talk more about this later in import-export-store section.

## node-grouping

https://www.svelvet.io/docs/node-grouping/

No change in functionality.

## snap-to-grid

https://www.svelvet.io/docs/snap-to-grid/
http://localhost:3000/compatability-8-snap-to-grid/

No change in functionality
