// backend/user-service/src/utils/logger.js

function timestamp() {
  return new Date().toISOString()
}

function info(...args) {
  console.log(timestamp(), 'INFO ', ...args)
}
function warn(...args) {
  console.warn(timestamp(), 'WARN ', ...args)
}
function error(...args) {
  console.error(timestamp(), 'ERROR', ...args)
}
function errorHandler(err, req, res, next) {
  error(err)
  if (res.headersSent) return next(err)
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' })
}

export { errorHandler }        // named
export default { info, warn, error }  // default
