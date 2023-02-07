# README

This README provides suggestions to developers working on Svelvet.

## What is Svelvet?

Svelvet is a frontend library that allows users to programmatically create graph diagrams. Graphs are composed of nodes and edges; each edge connects two nodes. There are two main challenges when working with Svelvet: (1) nodes and edges interact in complex ways, making new features difficult to implement without interfering with old features, and (2) Svelvet has an active userbase, making breaking changes undesirable.

## Things to think about as a Svelvet developer

- Svelvet teams have 3.5 weeks to iterate on the project, less if you consider time spent on marketing/deployment. It is important for code to be readable, otherwise future teams will be unable to understand the codebase within a reasonable timeframe.
- A developer workign on Svelvet may have as little as six weeks of coding experience. It is important to write documentation that is easy understand.
- Writing non-modular code with zero tests and zero documentation increases technical debt and puts future teams in a bad place. Accumulated technical debt can kill projects.
- Svelvet has an active userbase. When possible, breaking changes should be avoided. However, if a breaking change must occur, it is better that it happen sooner rather than later.

## Suggested [do]s and [don't]s

- DO write modular code, separated by feature. For suggestions, see `./DESIGN_PATTERNS.md`

- DO write tests. If you write a feature with no tests, it is impossible for future teams to know whether a modifications to the codebase will break your feature. The fact that Svelvet components interact with each other in complex ways makes tests even more important.

- DO NOT approach development as a feature factory. Writing non-modular code with no documentation and no tests is setting up future teams for failure.

- DO write modular, tested, and documented features. Not only is this good for Svelvet, this is also good for you. A long list of features by itself makes for poor resume; instead, bullet points that mention testing and documentation and specific technologies used to implement specific features make for a stronger resume.

- DO remove poorly written features that have no tests and no documentation, preferably earlier rather than later. While this disrupts the functionality for the userbase, it is important for the long-term health of the OSP. On the flip side, if you want your feature to be maintained in the future, write clean code with tests and documentation.

- DO NOT write typescript and ignore warnings. There's no point in writing typescript without types, and

## Where to start

Here is one way to start understanding the Svelvet codebase

(1) Read the Node class (`$lib/nodes/models/Node.ts`)
(2) Create a new branch, delete all features except for nodes/container/store, then try to get Svelvet to running only rendering nodes to the screen. Note that you can test Svelvet through the `testingplayground` route at `http://localhost:3000/testingplayground`.
(3) Try to refactor Node.ts. You may notice that Node.ts has 16 fields, when really only six of them are important (id, canvasId, positionX, positionY, widthX, widthY). Create a new table `NodeAttributes` that links to Node via foreign key, move all attributes (bgColor, textColor, etc) to this new table and get Node rendering again.
(4) After understanding how Node works, add back the "edges" folder. Try to get Svelvet working rendering only nodes and edges to the screen.
(5) Node / Edge / Anchor form the core tables of Svelvet. All other feature build on top of these core tables.
