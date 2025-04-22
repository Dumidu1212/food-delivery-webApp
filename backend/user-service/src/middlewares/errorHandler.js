import ApiError from '../utils/ApiError.js';

export default (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }

  console.error(err);
  res
    .status(500)
    .json({ success: false, message: 'Internal server error' });
};
