## Project Documentation: Svelvet Graph Component Issues & Iteration Progress
## Problem Statement

The current implementation of the Svelvet Graph component is encountering issues related to state management, event handling, and certain prop behaviors. Specifically, the following problems have been observed:

- Graph Initialization Issues:
-The graph variable is not always correctly initialized or updated after mounting.
-Local storage retrieval sometimes results in an inconsistent graph state.


- Drawer Prop Behavior:
-The drawer prop is not reliably affecting the Graph component’s behavior.
-The console logs confirm that the drawer value is passed but does not always trigger the expected UI updates.


- Edge Management Problems:
-The disconnect function does not always properly remove edges between nodes.
-Edges are not consistently detected or updated in edgeStore.

- Zoom and Translation Handling:
-Two-way binding for Zoom is inconsistent, making it difficult to maintain the expected behavior.
-The initial translation of the graph sometimes does not apply correctly.

- Event Dispatching Issues:
-onEdgeChange does not always correctly trigger events when edges are updated.
-Some events do not propagate as expected, leading to missing state updates.

# Documentation for Add Node Button
# Overview
The Add Node button in the Svelvet Graph Editor allows users to dynamically add new nodes to the graph. When clicked, it increments the total number of nodes and places them in a randomized position within the graph editor.

- Functionality
-The button is located inside a Node component.
-It increments the totalNodes variable.
-The new nodes are created using a Svelte {#each} loop, placing them at randomly generated positions.

```Code Snippet
<Node bgColor="red" inputs={4} position={{ x: 600, y: 200 }} draggable>
    <button on:click={() => totalNodes++}>Add Node</button>
</Node>
```

- Behavior
-When clicked, totalNodes increase by 1.
-The {#each} loop detects the change and renders a new Node at a randomized position.
-The new node is draggable and maintains the default properties.


- Usage
This feature is useful for users who want to expand their graph by dynamically adding new elements without manually configuring each node.


# Suspected Causes

- State Management & Context Issues:
-The graph variable is set using setContext, but it may not be updating across components as expected.
graphStore.add(graph, graphKey); might not be correctly persisting the graph state.

- Component Lifecycle Problems:
-onMount() logic depends on local storage but does not properly handle cases where stored data is incomplete or invalid.
-Some values such as zoom are reactive ($:) but may not be syncing properly with the graph.

- Event Handling & Dispatching Bugs:
-The disconnect function’s reliance on match() may fail when edge keys are not stored correctly.
-Edge events are not correctly linked to graph updates, possibly due to missing subscriptions.

- Drawer Prop Inconsistency:
-The drawer prop might not be reactive in all components where it is needed.
-There may be a missing bind: directive or event listener that causes UI updates to lag.


# Steps Taken So Far
- Debugging Graph Initialization:
-Added console logs in onMount() to check local storage retrieval.
-Verified that graphStore.add(graph, graph.id); is correctly adding graphs.
-Tested different cases where stateObject exists or does not exist.


- Testing Drawer Prop Behavior:
-Added a reactive statement ($: console.log("Svelvet drawer prop:", drawer);) to track updates.
-Verified that drawer is correctly passed as a prop to <Graph /> but does not always trigger updates.


- Edge Management Fix Attempts:
-Checked edgeStore updates with console.log(edgeStore);.
-Modified disconnect() to ensure it correctly retrieves sourceAnchor and targetAnchor before deleting.
-Observed cases where match() failed and edge keys were not found.


- Zoom & Translation Adjustments:
-Added $: reactive statements to monitor zoom changes.
-Tested explicit calls to update graph.transforms.scale.set(zoom);.


- Event Dispatching Debugging:
-Verified that onEdgeChange receives updates.
-Checked if dispatch(type, {...}) correctly sends expected event payloads.
-Found inconsistencies in when events were triggered.



# Future Work & Recommendations
- Refactor State Management:
-Ensure graphStore correctly reflects the current graph state.
-Consider adding an explicit updateGraph() function to handle changes.

- Fix Drawer Prop Issues:
-Investigate whether the drawer needs a Svelte store for reactivity.
-Ensure it is correctly passed to all necessary child components.


- Improve Edge Handling Logic:
-Debug disconnect() to confirm that edges are reliably removed.
-Add test cases where edges are added, removed, and re-added.


- Enhance Event Dispatching:
-Ensure onEdgeChange fires consistently.
-Investigate using graph.edges.subscribe() to track changes.


- Improve Zoom & Translation Behavior:
-Verify that zoom level updates propagate through all necessary components.
-Implement explicit setters for zoom and translation where necessary.


