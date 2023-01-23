# README

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
- Create new tables when adding new features. For example, if you want to add a new feature where a node wears a "hat", do not embed "hat" parameters in the Node table. Instead, create a new "Hat" table with a foreign key that links to the appropriate node. This increaes the modularity of the code.
- Avoid circular foreign key relationships. For example, currently an "edge" contains a foreign key to a "source anchor", which itself contains a foreign key to a "node". Avoid creating a foreign key from a "node" back to an "edge". The reason for this is to avoid complexity when populating the store; imagine populating a SQL database with foreign keys where the parents do not exist. Allowing nullable foreign keys is possible, but then you have to define the behavior of an edge without a node. Note that this also means that edges/anchors cannot exist in isolation; every edge must have two anchors, and every anchor must have a node. We believe this constraint is useful because it matches the definition of an edge in graph theory. We suggest that if you want to add functionality to create edges without nodes to define a separate table for nodeless edges and not hack changes onto edges.
