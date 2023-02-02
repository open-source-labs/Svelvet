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
