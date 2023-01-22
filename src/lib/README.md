# README

## Motivation

Svelvet was originally written as a monolith. This increased development speed but made the code fragile. For example, the Svelvet5 team implemented a feature to delete nodes and edges but found that "it would take an entire revamp of the entire node/edge relationship" to fix bugs and ended up scrapping the feature entirely.

One major goal of Svelvet6 was to refactor Svelvet away from its initial monolith architecture to a more robust design pattern.

## Architechure Philosophy of Svelvet6

We refactored Svelvet to follow MVC architectural principles.

- The Svelvet store is the "model" of MVC. To quote the Svelvet4 team, the store is the "heart of the program" and holds the single source of truth that determines the state of Svelvet. The store is implemented in `$lib/models/store.ts`
- The Svelvet api is the "controller" of MVC. The store should be segregated and interactions with the store should take place through the api. The api is implemented in `$lib/controllers/storeApi.ts`.
- Svelvet components are the "views" of MVC. Components never access the store directly and instead interact through the api. Components are implemented in `$lib/views/`.

We suggest that future developers continue with this design pattern in order to ensure clean code.

## Store Philosophy

We refactored the Svelvet store to (loosely) model a relational database.

We suggest the following to future developers:

- The most important suggestion can be summed up as: make the store look more like PostgreSQL and less like mongoDB. (TODO: read Codd's rules for databases)
- Preserve the relational nature of the Svelvet store and avoid the document model. Keep things simple and flat and avoid deeply nested hierchies.
- There should be a one-to-one mapping between tables and components. For example, the "nodesStore" table should contain all information needed to render a Node component, the "anchorsStore" table should
  contain all information needed to render an Anchor component, etc.
- Create new tables when adding new features. For example, if you want to add a new feature where a node wears a "hat", do not embed "hat" parameters in the Node table. Instead, create a new "Hat" table with a foreign key that links to the appropriate node. This increaes the modularity of the code.
