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

##
