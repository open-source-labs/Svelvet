/**
 *  When a user install svelvet package into their repo and import Svelvet from Svelvet,
 *  To create a node, the user needs to provide the following information:
 *  [{id, position {x, y}, data, width, height, bgColor}, {}] all required
 *  The position x, y is for the left top corner of the node
 * 
 * 
 *  To create an edge, the user needs to provide the following information:
 *  {id, source, target} required
 *  {label, labelTextColor, labelBgColor, animate, type, arrow, edgeColor} optional
 *  For now, only focus on the required information for edges
 * 
 * 
 *  1. We do not want to change the information our user needs to provide to create a node or an edge
 *  2. Is it possible to do OOP for node and edge?
 *  3. Situations for node: Node created / Node moved / Node deleted
 *  4. Situations for edge: Edge created / Edge deleted
 *  
 */


class Edge {
    constructor(id, source, target) {
        this.id = id;
        //source is the id of the source node
        this.source = source;
        //target is the id of the target node
        this.target = target;
    }

    handleDelete() {

    }
}

//refactore the nodeStore from array to object

class Anchor {
    constructor(node_id, edge_id, sourceOrSink, callbackPosition=() => {
        //access the nodeStore[node_id]
        //will look up the node.positionX and node.positionY
        //will calculate X. Y position of the anchor 
    }) {

    }

}

class Node {
    constructor(id, positionX, positionY, width, height, bgColor, data) {
        this.id = id;
        this.positionX = positionX;
        this.positionY = positionY;
        this.width = width;
        this.height = height;
        this.bgColor = bgColor;
        this.data = data;
    }

    setPosition(movementX, movementY) {
        //update all necessary data
    }

    // handleOnMove() {

    // }

    handleDelete() {

    }
}

