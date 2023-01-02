Svelvet has come a long way in providing greater visualization tools to assist svelte users in their work in addtion to providing an easier path for future svelte users. This is an open source product so we are always happy to hear about any ways we can improve this technology or any bugs that exist that need to be fixed up. It is not easy to get on board and understand a codebase so here are some useful tips to assist future developers and some features that could be implemented.

We have provided excalidraws that provide diagrams that were made within the project to showcase the flow of data within. Any future changes should update these existing files to assist users. Please feel free to provide further diagrams to assist in understanding the technology.

Future Iteration Possibilities

***Svelvet 5.0***
*We attempted to implement a deletion of nodes and edges which seemed to work in removing the selected nodes from the nodes/edges array but had a problem concerning inheritance, specifically with the styling properties
    ---> The node following the deleted node from the nodes array would inherit the deleted nodes properties 
    ---> The edge following the deleted edge from the edges array would inherit the source and target positions from the deleted edge
*Ultimately we removed the proposed feature entirely due to this huge bug and because we believe it would take an entire revamp of the entire node/edge relationship with each other as well as the GraphView container
*Seems like deletion of nodes/edges is not a highly requested community feature neither so could be scrapped
*Logic we implemented: accessed the nodes array, select the node and remove it from the array while removing its' relational target and source edges from the edges array

***Svelvet 4.0***
* We attempted to implement a parent child relationship within svelvet that actually worked however it had multiple bugs that slowed down performance. We have left the logic we tried to implement within ParentNode.md for future reference.
* We are attempting to create more tutorial based resources for users and could always use more templates to help Svelte users or any refactors/additions to components to help explain features.
* Interactive node linking and creation is a major requested feature that has been requested that react-flow has. This is a difficult feature to replicate and it would be a major accomplishment for future iteration work.
* UI/UX, Svelvet could use some additonal buttons to improve the user experience to allow node customization. Currently most of these features do exist within Svelvet but require manual input into the Svelvet declaration seen in <Svelvet nodes={initialNodes} edges={initialEdges} width={1100} height={1100} bgColor={`blue`} background />. The `initialNodes` and `initialEdges` themseleves need to be manually defined and passed into the declaration. An easier edit to allow users to change colors, width, height, node contents, add/delete functionality with mouse clicks and automatic button creation would improve the convenience of the website.
* We were trying to implement a persistent state function to reflect changes on the nodes iframe to the svelte declarations to the left seen in REPL. Currently if you move around nodes in the iframe it does not update the coordinate position of the nodes.
* We were able to implement Svelvet npm updates onto the website however there was a break between svelvet and its display on the main page versus that of the REPL. Any future work would need to find out why there is an inconsistency between this functionality.
* Github issues are a great resource to inspect any suggestions for further improvements or find bugs that other engineers have found. Inspect them for any ideas to implement and reach out the github users that posted the issues for further information.