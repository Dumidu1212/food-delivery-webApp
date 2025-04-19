const timestamp = () => new Date().toISOString();

export const info  = (...args) => console.log(timestamp(), 'INFO ', ...args);
export const warn  = (...args) => console.warn(timestamp(), 'WARN ', ...args);
export const error = (...args) => console.error(timestamp(), 'ERROR', ...args);
