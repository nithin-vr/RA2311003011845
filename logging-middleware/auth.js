const logger = require("./logger");

function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    logger.warn("Unauthorized request", { url: req.originalUrl });
    return res.status(401).json({ error: "Missing authorization token" });
  }
  logger.info("Authorized request", { url: req.originalUrl });
  next();
}

module.exports = authMiddleware;
