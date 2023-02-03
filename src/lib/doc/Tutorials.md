# Tutorials

This file contains instructions on how to do useful things such as generating developer documentation, publishing to npm, etc.

## TypeDoc

You may notice TSDoc comments throughout our code. These TSDoc comments can be converted into documentation using TypeDoc:

```
$ npx typedoc --entryPointStrategy expand src/lib
```

This command will create documentation in root folder `./docs`.

## Publishing to npm

- create an account on npm.js
- make sure you are in directory `src/lib/`
- `npm version patch` to increment version number
- `npm publish` to publish to npm. Note that you cannot "overwrite" previous publishes, you must increment the version number

## Testing npm package

- install locally `npm install svelvet-lime@latest -f`. Note that you must re-install, otherwise you will be using an outdated npm package.
- npm run dev
