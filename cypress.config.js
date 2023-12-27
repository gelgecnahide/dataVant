const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "kd1d38",
  defaultCommandTimeout: 60000,
  pageLoadTimeout: 90000,
  video: true,
  screenshotOnRunFailure: true,
  trashAssetsBeforeRuns: true,
  e2e: {
    setupNodeEvents(on, config) {},
  },
});


