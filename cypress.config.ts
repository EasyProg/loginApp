import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      testEmail: "test@freshcells.de",
      testPassword: "KTKwXm2grV4wHzw",
      apiUrl: "http://localhost:5173",
      graphQlUrl: "https://cms.trial-task.k8s.ext.fcse.io/graphql",
      testJwt:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mn0.fake_signature_for_testing_12345",
    },
  },
});
