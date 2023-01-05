import { defineConfig } from "cypress";
//If you want to change the baseUrl in the CLI use this
  // cypress run --config baseUrl=http://[whatever you choose]
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  video: false,
});
