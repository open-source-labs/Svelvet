<div align="center">

![banner](./src/assets/banner.png)

![MIT License](https://img.shields.io/badge/license-MIT-%23fb7182)
![NPM Downloads](https://img.shields.io/npm/dt/svelvet?color=%23fb7182&label=downloads)
![GitHub Stars](https://img.shields.io/github/stars/oslabs-beta/svelvet?color=%23fb7182)
![NPM Version](https://img.shields.io/npm/v/svelvet?color=%23fb7182&label=version)

# Simplify Diagramming with Svelvet!

Svelvet is a lightweight Svelte component library for building interactive node-based diagrams.

[⚡ Getting Started](https://svelvet.io/docs/installation/) | [📚 Documentation](https://svelvet.io/docs/core-concepts/) | [⌨️ Blog](https://medium.com/@alexander.zambrano/simplify-application-diagramming-with-svelvet-a8f664731243) | [💬 Twitter](https://twitter.com/svelvet_oslabs) | [💼 LinkedIn](https://www.linkedin.com/company/svelvet/)

</div>

## Version Updates

Shout out to our contributors! Here's what's new: 

### Changelog 
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
- **Reliable:** Svelvet is written in TypeScript and tested with [Vitest](https://vitest.dev/), [Playwright](https://playwright.dev/) and [Svelte Testing Library](https://testing-library.com/docs/svelte-testing-library/intro/). Svelvet is maintained by motivated engineers seeking to contribute to the larger Svelte developer community and library ecosystem.
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

Testing is done with Vitest and the Svelte Testing Library. You can find tests in the [/tests](https://github.com/oslabs-beta/Svelvet/tree/main/tests) folder. In order to run the tests use the command:

```bash
npm run test
```

## The Svelvet Team

- Aaron Willett • [LinkedIn](https://www.linkedin.com/in/awillettnyc/) • [Github](https://github.com/awillettnyc)
- Alexander Zambrano • [LinkedIn](https://www.linkedin.com/in/alexander-z-8b7716b0/) • [Github](https://github.com/azambran21)
- Andrew Widjaja • [LinkedIn](https://www.linkedin.com/in/andrew-widjaja/) • [Github](https://github.com/andrew-widjaja)
- Anu Sharma • [LinkedIn](https://www.linkedin.com/in/anu-sharma-6936a686/) • [Github](https://github.com/anulepau)

## How to Contribute

The following is a list of features and improvements for future open source developers. If you have any additional ideas, feel free to implement those as well!

- Default values for nodes
- Contextual menus
- Custom error handling
- Increase test coverage for scalability
- Integration with mobile (click and drag nodes on your phone/tablet)
- More styling and customization of nodes and edges for complex Svelvet flow diagrams
- Add a full stack feature to the documentation website with authentication and database that allows users to login, create and save their Svelvet diagrams

Additional feature and improvement requests from the Svelte community: 

- Customize nodes via html templates/Svelte components
- Constant node drag speed when zooming in and out
- Customize edges (source/target) with icons 
- Include left and right anchor locations 
- Multiple sockets and socket compatibility for links

## Credits

Inspired by [React Flow](https://github.com/wbkd/react-flow), Svelvet expands the tools available to Svelte developers and makes Svelte more inviting to both new and seasoned software engineers. Under the hood, Svelvet depends on the [d3-zoom](https://github.com/d3/d3-zoom) library to zoom and pan across the graph.

## License

Svelvet is developed under the [MIT license](https://github.com/oslabs-beta/Svelvet/blob/main/LICENSE).
