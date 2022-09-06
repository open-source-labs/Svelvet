<div align="center">

![banner](./src/assets/banner.png)

![MIT License](https://img.shields.io/badge/license-MIT-%23fb7182)
![NPM Downloads](https://img.shields.io/npm/dt/svelvet?color=%23fb7182&label=downloads)
![GitHub Stars](https://img.shields.io/github/stars/open-source-labs/svelvet?color=%23fb7182)
![GitHub Forks](https://img.shields.io/github/forks/open-source-labs/Svelvet?color=%23fb7182)
![NPM Version](https://img.shields.io/npm/v/svelvet?color=%23fb7182&label=version)

# Simplify Diagramming with Svelvet!

Svelvet is a lightweight Svelte component library for building interactive node-based diagrams.

[⚡ Getting Started](https://svelvet.io/docs/installation/) | [📚 Documentation](https://svelvet.io/docs/core-concepts/) | [⌨️ Blog](https://medium.com/@alexander.zambrano/simplify-application-diagramming-with-svelvet-a8f664731243) | [💬 Twitter](https://twitter.com/svelvet_oslabs) | [💼 LinkedIn](https://www.linkedin.com/company/svelvet/)

</div>

## Version Updates

Shout out to our contributors! Here's what's new:

### Changelog
<details><summary>v2.0.2</summary>
<ul>
  <li>Added left and right anchor points</li>
  <li>Added step and smoothstep edge types</li>
  <li>Incorporated mixed edge functionality</li>
  <li>Refactored how edge text and labels render for every edge</li>
  <li>Fixed D3Zoom bias bug</li>
  <li>Expanded styling options, including label color, label background, and edge color</li>
  <li>Nodes are now able to contain images and will render differently based on the presence of label text</li>
  <li>Nodes are now draggable on touch screens and reposition themselves to center on your touch</li>
  <li>Implemented data reactivity</li>
  <li>Expanded TypeScripting</li>
  <li>Added E2E testing using Cypress</li>
  <li>Expanded unit tests</li>
  <li>Added a REPL to our documentation site</li>
  <li>Added SQL database to our REPL</li>
  <li>Added GitHub OAuth to enable users to save their custom diagrams created in our new REPL</li>
  <li>Expanded documentation for new features</li>
  <li>Added full CI/CD pipeline</li>
</ul>
</details>
<details><summary>v1.0.3</summary>
<ul>
  <li>Fixed bug with running tests</li>
  <li>Added ability to render multiple unique Svelvet components</li> 
  <li>Added a 'clickCallback' customization option for nodes</li>
</ul>
</details>
<details><summary>v1.0.2</summary>
<ul>
  <li>Fixed bug with importing types for TypeScript applications</li>
  <li>Added a 'borderRadius' customization option for nodes</li>
  <li>Fixed SVG zoom/pan bug (zoom/pan is now limited to Svelvet component only)</li> 
</ul>
</details>

## Key Features

- **Easy to use:** To get [started](https://svelvet.io/docs/basic-usage/) with Svelvet, all you need is data for nodes and edges. Visit our [documentation website](https://svelvet.io/) for streamlined, user-friendly tutorials and examples on how to get the most out of your Svelvet flowchart!
- **Interactive:** Elegant and smooth interface when selecting a node to drag it across the graph.
- **Customizable:** Ability to customize your nodes and edges (node size, color, border and edge type, label, anchor). More coming soon!
- **Fast rendering:** Re-rendering is based on changes to initial values for nodes, edges and optional background.
- **Reliable:** Svelvet is written in TypeScript and tested with [Vitest](https://vitest.dev/), [Cypress](https://www.cypress.io/) and [Svelte Testing Library](https://testing-library.com/docs/svelte-testing-library/intro/). Svelvet is maintained by motivated engineers seeking to contribute to the larger Svelte developer community and library ecosystem.
- **Room to Grow:** There is so much we can do to improve, add features and make Svelvet the best version of itself - we welcome feedback and contributions! Scroll below for suggestions on what to contribute.

![screenshot](./src/assets/readme-gif.gif)

## Installation

Svelvet is available as both an npm and a yarn package. You can install it by running one of the two commands:

```bash
npm install svelvet
```

```bash
yarn add svelvet
```

## Quick Start

Start by importing Svelvet into your application:

```bash
import Svelvet from 'svelvet';
```

A Svelvet component consists of nodes and edges (or just nodes). You can pass nodes and edges as props to the Svelvet component. You can add a dot-grid background like the example below. With the information that you provide for your nodes and edges, Svelvet will do all of the work behind-the-scenes to render your flowchart!

```bash
<Svelvet nodes={nodes} edges={edges} background />
```

Visit our [website](https://svelvet.io) to learn more on how to customize your nodes and edges to your liking!

## Testing

Testing is done with Vitest and the Svelte Testing Library. You can find tests in the [/tests](https://github.com/open-source-labs/Svelvet/tree/main/tests) folder. In order to run the tests use the command:

For Unit testing

```bash
npm run test:unit
```

For End-to-End testing

```bash
npm run cypress:open
```

## The Svelvet Team

- Aaron Willett • [LinkedIn](https://www.linkedin.com/in/awillettnyc/) • [Github](https://github.com/awillettnyc)
- Alexander Zambrano • [LinkedIn](https://www.linkedin.com/in/alexander-z-8b7716b0/) • [Github](https://github.com/azambran21)
- Andrew Widjaja • [LinkedIn](https://www.linkedin.com/in/andrew-widjaja/) • [Github](https://github.com/andrew-widjaja)
- Anu Sharma • [LinkedIn](https://www.linkedin.com/in/anu-sharma-6936a686/) • [Github](https://github.com/anulepau)
- Justin Wouters • [LinkedIn](https://www.linkedin.com/in/justinwouters/) • [Github](https://github.com/justinwouters)
- Walter DeVault • [LinkedIn](https://www.linkedin.com/in/walter-devault/) • [Github](https://github.com/TensionCoding)
- Ali Adams • [LinkedIn](https://www.linkedin.com/in/alimadams/) • [Github](https://github.com/AliA12336)
- Von Garcia • [LinkedIn](https://www.linkedin.com/in/gerard-von-g-3964bb160/) • [Github](https://github.com/vongarcia97)
- Damian Lim • [LinkedIn](https://www.linkedin.com/in/lim-damian/) • [Github](https://github.com/limd96)
- Christopher Mander • [LinkedIn](https://www.linkedin.com/in/christopher-mander/) • [Github](https://github.com/cpmander)
- David Jakubiec • [LinkedIn](https://www.linkedin.com/in/david-jakubiec-16783384/) • [Github](https://github.com/davidjakubiec)
- Jeffrey Wentworth • [LinkedIn](https://www.linkedin.com/in/jeffreywentworth/) • [Github](https://github.com/jeffreywentworth)
- Johnny Tran • [LinkedIn](https://www.linkedin.com/in/tranpjohnny/) • [Github](https://github.com/JTraan)
- Samee Vohra • [LinkedIn](https://www.linkedin.com/in/sameev/) • [Github](https://github.com/sameev)

## How to Contribute



The following is a list of features and improvements by ourselves and the larger Svelte community for any open source developer to contribute. If you have any additional ideas, feel free to raise the issue or implement them as well!

- Contextual menus
- Customize nodes via html templates/Svelte components
- Multiple sockets and socket compatibility for links
- Custom error handling
- Increase test coverage for scalability
- More styling and customization of nodes and edges for complex Svelvet flow diagrams
- Create a community page for users to share saved REPL Svelvet Prototypes

## Credits

Inspired by [React Flow](https://github.com/wbkd/react-flow), Svelvet expands the tools available to Svelte developers and makes Svelte more inviting to both new and seasoned software engineers. Under the hood, Svelvet depends on the [d3-zoom](https://github.com/d3/d3-zoom) library to zoom and pan across the graph.

## License

Svelvet is developed under the [MIT license](https://github.com/open-source-labs/Svelvet/blob/main/LICENSE).
