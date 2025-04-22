function timestamp() {
  return new Date().toISOString();
}

const logger = {
  info:  (...args) => console.log(timestamp(), 'INFO ', ...args),
  warn:  (...args) => console.warn(timestamp(), 'WARN ', ...args),
  error: (...args) => console.error(timestamp(), 'ERROR', ...args)
};

export function errorHandler(err, req, res, next) {
  logger.error(err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
}

export default logger;

