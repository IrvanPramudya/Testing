const {defineConfig} = require("cypress");
const installLogsPrinter = require("cypress-terminal-report/src/installLogsPrinter");

module.exports = defineConfig({
  e2e: {
    supportFile: false,
    baseUrl: "https://gorest.co.in",
    viewportWidth: 1920,
    viewportHeight: 1080,
    defaultCommandTimeout: 10000,
    video: true,
    videoCompression: 10,
    screenshotOnRunFailure: true,
    retries: {
      runMode: 0,
      openMode: 0,
    },
    env: {
      apiUrl: "https://gorest.co.in",
      auth_email: "test@example.com",
      auth_password: "test123",
    },
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      installLogsPrinter(on, {
        printLogsToConsole: "always",
        printLogsToFile: "always",
        outputRoot: "cypress/logs/",
        outputTarget: {
          "out.txt": "txt",
          "out.json": "json",
        },
      });
      return config;
    },
  },
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/reports",
    overwrite: false,
    html: true,
    json: true,
    timestamp: "mmddyyyy_HHMMss",
  },
});
