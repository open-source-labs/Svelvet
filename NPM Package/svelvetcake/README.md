v 1.0.0 - simply a clone of svelvet 3.0.0 so we can easily install the node module during production 

v 1.0.1 - added snap to grid functionality
- this functionality/feature resolves gitub issue #107
- (added snap boolean to index.svelte.d.ts inside containers=>Svelvet=>index.svelte.d.ts)
    - inside Svelvet=>index.svelte, added functionality to so that snap variable sets snapgrid to true or false
- changes made to Nodes => index.svelte (on mouseup, if snapgrid is true, will snap node to grid)
- further changes made to both files in stores folder (added snapgrid as writable to coresvelvetstore)


v 1.1.1
• File: node_modules -> svelvetcake -> Nodes -> index.svelte
• Added import of: widthStore and heightStore from findOrCreateStore(key)
• Added boundaries to within on:mouse logic

v 1.1.2
- added changes to svelvetcake -> Containers -> Graphview -> index.svelte
- now, in nodes declaration, user has option to add data: { html : \`  HTML DATA HERE `}; html value should be enclosed in template literals
- resolved github issue #112, added HTML data enhancement
- special thanks to ronvoluted (Ron Au) for contributing this feature

v 1.1.3
 - added comments demarcating & explaining Snap-to-Grid functionality & HTML data option
 - removed dotenv as a dependency from package.json (unused library with it's own dependencies)
 - have previously removed node.env dependency upon creation of svelvetcake
 - removal of both these dependencies from package.json of NPM Package resolves github issue #118

v 1.1.4
- added a parendNode and childNode definition in types.d.ts
- implemented logic within store.js for onMouseMove and onTouchMove childNodes so that every node id included in the childNodes array will move with the parent
- Refactored existing code in store.js to improve readability and cleanliness
- Added a feature to allow grouping of certain nodes; this resolves github issues #97

v 1.1.5
- updated functionality to stop magnetic node to use node.postion.x & node.position.y instead of client.X & client.Y
- commented out previous code, but left in function because unsure of path forward in fixing this issue

v 1.1.6
 - Replaces updates driven by GitHub issue 120 and addresses GitHub issue 125
 - This update allows nodes to be dragged outside the visible boundaries and not become magnetized when the mouse is unclicked. Refactor based on @FractalHQ ‘s github issue recommendation.
 
 v 1.1.7
 - Declared a variable that sets size of default snap functionality; Updated snap functionality to reflect new variable in store
 - Fixed snap to grid so that edges move in relation to node immediately upon snap
 - Variable declaration for snapTo (user defined prop for size of snap-to-grid); Invoked functionality passing in new prop


v 1.1.8
- Updated the store.js file to have a backgroundColor property that is updated in the componenet declaration to provide different background colors within the iframe container.
- Imported previous logic on Parent Child relationships into a new folder called "Future Iteration Features" called ParentNode.md.

v 1.1.9
- Created a folder called Future Iteraiton to provide information on further updates developers can implement to improve Svelvet in the future.
- Uploaded excalidraw png's to provide visualization on how data moves and is loaded within the svelvetcake npm package.
- Provided a ParentNode.md file documenting the code that attempted to create a parent child node relationship within svelvet. It is currently causing performance issues so it has been left unimplemented but is available for reference for future developers.