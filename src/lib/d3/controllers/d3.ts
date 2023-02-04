import { zoom, zoomTransform } from 'd3-zoom';
import { select, selectAll } from 'd3-selection';
import { writable, derived, get, readable } from 'svelte/store';

export function zoomInit(
  d3,
  canvasId,
  d3Zoom,
  d3Translate,
  initialLocation,
  initialZoom,
  d3Scale
) {
  //set default zoom logic
  d3.select(`.Edges-${canvasId}`)
    //makes sure translation is default at center coordinates
    .transition()
    .duration(0)
    .call(d3Zoom.translateTo, 0, 0)
    //moves camera to coordinates
    .transition()
    .duration(0)
    .call(d3Zoom.translateTo, initialLocation.x, initialLocation.y)
    // zooms in on selected point
    .transition()
    .duration(0)
    .call(
      d3Zoom.scaleBy,
      Number.parseFloat(0.4 + 0.16 * initialZoom).toFixed(2)
    );

  // updates d3Translate with d3 object with x, y, and k values to be sent down to the minimap to be further calculated further
  // d3Translate = d3.zoomIdentity
  //   .translate(initialLocation.x, initialLocation.y)
  //   .scale(Number.parseFloat(0.4 + 0.16 * initialZoom).toFixed(2));

  d3.select(`.Nodes-${canvasId}`)
    .transition()
    .duration(0)
    .call(d3Zoom.translateTo, 0, 0)
    .transition()
    .duration(0)
    .call(d3Zoom.translateTo, initialLocation.x, initialLocation.y)
    .transition()
    .duration(0)
    .call(
      d3Zoom.scaleBy,
      Number.parseFloat(0.4 + 0.16 * initialZoom).toFixed(2)
    );

  // sets D3 scale to current k of object
  d3Scale.set(d3.zoomTransform(d3.select(`.Nodes-${canvasId}`)).k);

  return d3Translate;
}

// create d3 instance conditionally based on boundary prop
export function determineD3Instance(
  boundary,
  d3,
  nodeSelected,
  width,
  height,
  movementStore,
  backgroundStore,
  gridSize,
  dotSize,
  canvasId,
  d3Scale
) {
  if (boundary) {
    return d3
      .zoom()
      .filter(() => !get(nodeSelected))
      .scaleExtent([0.4, 2]) // limits for zooming in/out
      .translateExtent([
        [0, 0],
        [boundary.x, boundary.y],
      ]) // world extent
      .extent([
        [0, 0],
        [width, height],
      ])
      .on('zoom', handleZoom);
  } else {
    return d3
      .zoom()
      .filter(() => !get(nodeSelected))
      .scaleExtent([0.4, 2])
      .on('zoom', handleZoom);
  }

  function handleZoom(e) {
    if (!get(movementStore)) return;
    //add a store that contains the current value of the d3-zoom's scale to be used in onMouseMove function
    d3Scale.set(e.transform.k);
    // should not run d3.select below if backgroundStore is false
    if (backgroundStore) {
      d3.select(`#background-${canvasId}`)
        .attr('x', e.transform.x)
        .attr('y', e.transform.y)
        .attr('width', gridSize * e.transform.k)
        .attr('height', gridSize * e.transform.k)
        .selectAll('#dot')
        .attr('x', (gridSize * e.transform.k) / 2 - dotSize / 2)
        .attr('y', (gridSize * e.transform.k) / 2 - dotSize / 2)
        .attr('opacity', Math.min(e.transform.k, 1));
    }
    // transform 'g' SVG elements (edge, edge text, edge anchor)
    d3.select(`.Edges-${canvasId} g`).attr('transform', e.transform);
    // transform div elements (nodes)
    let transform = d3.zoomTransform(this);
    let d3Translate = transform;

    // selects and transforms all node divs from class 'Node' and performs transformation
    d3.select(`.Node-${canvasId}`)
      .style(
        'transform',
        'translate(' +
          transform.x +
          'px,' +
          transform.y +
          'px) scale(' +
          transform.k +
          ')'
      )
      .style('transform-origin', '0 0');
  }
}
