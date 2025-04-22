function timestamp() {
  return new Date().toISOString();
}

export function info(...args) {
  console.log(timestamp(), 'INFO ', ...args);
}

export function warn(...args) {
  console.warn(timestamp(), 'WARN ', ...args);
}

export function error(...args) {
  console.error(timestamp(), 'ERROR', ...args);
}

export function errorHandler(err, req, res, next) {
  error(err);
  if (res.headersSent) return next(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || 'Internal Server Error' });
}