const config = require("./config");

const levels = ["error", "warn", "info", "debug"];

function log(level, message, meta = {}) {
  if (levels.indexOf(level) > levels.indexOf(config.logLevel)) return;
  const entry = {
    timestamp: new Date().toISOString(),
    app: config.appName,
    level,
    message,
    ...meta,
  };
  console.log(JSON.stringify(entry));
}

const logger = {
  error: (msg, meta) => log("error", msg, meta),
  warn:  (msg, meta) => log("warn",  msg, meta),
  info:  (msg, meta) => log("info",  msg, meta),
  debug: (msg, meta) => log("debug", msg, meta),
};

// Express middleware
logger.middleware = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    logger.info("HTTP request", {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${Date.now() - start}ms`,
    });
  });
  next();
};

module.exports = logger;
