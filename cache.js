const NodeCache = require("node-cache");

const cache = new NodeCache({
  stdTTL: 300,      // Cache expires in 5 minutes
  checkperiod: 120, // Check every 2 minutes
});

module.exports = cache;