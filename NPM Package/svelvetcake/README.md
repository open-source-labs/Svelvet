v 1.0.0 - simply a clone of svelvet 3.0.0 so we can easily install the node module during production 

v 1.0.1 - added snap to grid functionality 
    - (added snap boolean to index.svelte.d.ts inside containers=>Svelvet=>index.svelte.d.ts)
        - inside Svelvet=>index.svelte, added functionality to so that snap variable sets snapgrid to true or false
    - changes made to Nodes => index.svelte (on mouseup, if snapgrid is true, will snap node to grid)
    - further changes made to both files in stores folder (added snapgrid as writable to coresvelvetstore)

v 1.1.1
• File: node_modules -> svelvetcake -> Nodes -> index.svelte
• Added import of: widthStore and heightStore from findOrCreateStore(key)
• Added boundaries to within on:mouse logic

v 1.1.2
- added changes to svelvetcake -> Containers -> Graphview -> index.svelte
- now, in nodes declaration, user has option to add data: { html : `<p> HTML DATA HERE </p>`}
- resolved github issue #112, added HTML data enhancement
- special thanks to ronvoluted for contributing to this feature