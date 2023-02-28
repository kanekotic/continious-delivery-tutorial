const configcat = require("configcat-node");

const logger = configcat.createConsoleLogger(configcat.LogLevel.Info); // Set the log level to INFO to track how your feature flags were evaluated. When moving to production, you can remove this line to avoid too detailed logging.

const configCatClient = configcat.getClient("u-TaCJhXWUqMMeDhFXtF1Q/2PHE9lrGoE6UkOGzCVuS8A", // <-- This is the actual SDK Key for your Production Environment environment
  configcat.PollingMode.AutoPoll,
  {
    dataGovernance: configcat.DataGovernance.EuOnly, // <-- Your Organization is configured to use EU CDN nodes only.
    logger: logger
  });

module.exports = configCatClient