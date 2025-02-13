# Persistent cavas state.
The saveStore.ts and reloadStore.ts modules work together to manage the state of the canvas. saveStore.ts converts the current state into a JSON string and stores it, while reloadStore.ts retrieves that information, parses it, and rebuilds the canvas from the JSON object. This allows for maintaining state persistence and restoring previously saved diagrams.

The saveStore.ts functionality began to be developed in version 10, where the foundations for capturing nodes via a button were laid, and in version 11.0, we took advantage of this advancement and improved the implementation, ensuring that the Save button not only saves nodes, but also stores all their complete properties, allowing for accurate reconstruction of the canvas.

In addition, we worked intensively on the implementation of the reloadStore function, which aims to restore the graph from the stored data. However, we faced several issues that prevented the graph from being correctly rebuilt and will be integrated into the graphStore. For the team continuing this functionality in the next release, we recommend focusing on the way nodes are retrieved and initialized in the store, specifically the createGraph() function as this could be the main points of failure.

# Changelog on “Save Button” (UPDATED)
In this release, we updated the saveStore and reloadStore codebase to improve canvas state capture. Node positions are now correctly saved once they are dragged onto the canvas, ensuring their location is preserved in storage.
Initially, the functionality only allowed for capturing the existence of nodes, but did not store additional properties. With this improvement, we are able to save complete information for each node, facilitating a more accurate reconstruction.
Despite these advances, reloadStore still requires work to ensure that nodes are correctly rendered after a reload. Currently, the graph is not effectively rebuilt, which represents a key area for future iterations. We recommend that the next development team focus their efforts on properly integrating the graph store when reloading data.
