# README

## TODO

- move Svelvet5 code into its own "libOld" folder. Should be independent of changes to new codebase
- render anchors. file: `$lib/views/RefactoredComponents/EdgeAnchor.svelte`
- Update the setPosition method for Anchors to use the callback. This is necessary for resizing nodes
  file: store.js
- Write a StoreEditor component to read/update the store (like a spreadsheet). This will be necessary to develop deleting/resizing nodes and anchors. This can be a brand new file. You will want separate the controller to $lib/controllers/storeEditor.ts (already created)
- Implement the delete functionality on Anchors/Nodes/Edges. We probably want the store-editor component to be finished first for testing. file: store.js
- Think through how you would update the store to allow for functionality to resize a component. I have an idea on how to do this but I think this is a learning experience to think through.
- sanitize user input so that all id's are strings. Change types/toString() to reflect that all types are strings now

## Motivation

Svelvet was originally written as a monolith. This increased development speed but made the code fragile. For example, one Svelvet team attempted to implement deletion of edges but found "it would take an entire revamp of the entire node/edge relationship" to fix bugs and ended up scrapping the feature entirely.

One major goal of Svelvet6 was to refactor Svelvet away from its initial monolith architecture to a more robust design pattern.

## Architechure Philosophy of Svelvet6

We refactored Svelvet to follow MVC architectural principles.

- The Svelvet store is the "model" of MVC. To quote the Svelvet4 team, the store is the "heart of the program" and holds the single source of truth that determines the state of Svelvet. The store is implemented in `$lib/models/store.ts`
- The Svelvet api is the "controller" of MVC. The store should be segregated and interactions with the store should take place through the api. The api is implemented in `$lib/controllers/storeApi.ts`.
- Svelvet components are the "views" of MVC. Components never write to the store directly and instead interact through the api. Reading the store directly should be fine. Components are implemented in `$lib/views/`.

## Store Philosophy

We refactored the Svelvet store to (loosely) model a relational database.

We suggest the following to future developers:

- The most important suggestion can be summed up as: make the store look more like PostgreSQL and less like mongoDB. (TODO: read up Codd's rules for databases)
- Preserve the relational nature of the Svelvet store and avoid the document model. For example, if you want to find out node that is the "source" for a given edge, do not store that node id on the edge table. Instead, do a lookup on the source anchor foreign key, then go to the anchor table and do a lookup on the node foreign key. While this is more work, it also preserves a single state of truth for node/anchor/edge relationships and will make implementing new features easier.
- Create new tables when adding new features. For example, if you want to add a new feature where a node wears a "hat", do not embed "hat" parameters in the Node table. Instead, create a new "Hat" table with a foreign key that links to the appropriate node. This increaes the modularity of the code; you can easily remove the hat feature without disturbing core Svelvet.
- Avoid circular foreign key relationships. For example, currently an "edge" contains a foreign key to a "source anchor", which itself contains a foreign key to a "node". Avoid creating a foreign key from a "node" back to an "edge". This makes the flow of information easier to reason about; moving a node will cause an update to anchors, which will itself cause an update to edges.

## Important files

- `$lib/models/store.ts`
  This implements the Svelvet store. It exports `stores` which is an object of stores; each store within stores corresponds to a different Svelvet canvas (this is so we can have multiple canvases on a single page). It also exports classes `Node`, `Anchor`, and `Edge`. Note that each `Anchor` has a foreign key to `Node`, and that each `Edge` has two foreign keys to source and target `Anchor`.

  The easiest way to understand the store is to think about it like relational database. You have `Node`, `Anchor`, `Edge` tables. Updating a `Node` object (for example dragging it arround) will have cascading changes applied to associated `Anchors`, where the changes will cascade to associated `Edges`. The flow of information is one way, from `Node` to `Anchor` to `Edge`.

- `$lib/controllers/storeApi.ts`
  This implements api methods to interact with the Svelvet store.

- `$lib/views/DevTools`
  This contains the Svelvet components we pair-programmed our way through. We will not be developing these further, but I have kept them because I think they might be useful for our own learning. You can visualize them on `http://localhost:3000/testingplayground/`

- `$lib/views/RefactoredComponents`
  This contains Svelvet components. You can see them rendered on `http://localhost:3000/testingplayground3/`. This is what we are working on; we should be changing RefactoredComponents to look like the the original components (more about this below). You can visualize them on `http://localhost:3000/testingplayground3/`

- `$lib/views/`
  All folders that are not for `DevTools` and `RefactoredComponents` are Svelvet components from the original team. We will eventually be deleting these but they are useful to have around so we can `diff` files and see what fixes need to be made. You can visualize these components on `http://localhost:3000/testingplayground2/`

- `$lib/types/`
  this these are legacy types needed to run the old Svelvet5 components, we will delete these later

- `$lib/store/store_old.ts`
  this is the Svelvet5 store needed to run old components, we will delete this later
