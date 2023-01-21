# README

## Motivation

Svelvet was originally written as a monolith. This increased the speed of development for early teams but made iteration difficult for later teams. For example, the Svelvet4 team implemented a feature to delete nodes and edges, but found that "it would take an entire revamp of the entire node/edge relationship" and ended up scrapping the feature entirely.

One major goal of the Svelvet6 to was to refactor Svelvet away from its initial monolith architecture to a more robust design pattern.

## Design philosphy

We refactored Svelvet to follow MVC architectural principles.

- The Svelvet store is the "model" of MVC. To quote the Svelvet4 team, the store is the "heart of the program" and holds the single source of truth that determines the state of Svelvet. The store is implemented in `$lib/stores/svelvetStore.ts`
- The Svelvet api is the "controller" of MVC. The store should be segregated and interactions with the store should take place through the api. The api is implemented in `$lib/stores/storeApi.ts`.
- Svelvet components are the "views" of MVC. Components never access the store directly and instead interact through the api. Components are implemented in `$lib/Containers`, `$lib/Edges`, `$lib/Nodes`.

We urge future developers to continue with this design pattern in order to ensure a clean architecture.
