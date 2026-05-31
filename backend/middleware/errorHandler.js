export const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join('. ') });
  }

  if (err.code === 11000) {
    return res.status(400).json({ message: 'Email already registered.' });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid resource ID.' });
  }

  let message = err.message || 'Server error';

  if (message.includes('MONGODB_URI')) {
    message = 'Database not configured. Set MONGODB_URI in environment variables.';
  } else if (
    message.includes('MongoServerSelectionError') ||
    message.includes('ECONNREFUSED') ||
    message.includes('ENOTFOUND') ||
    message.includes('timed out')
  ) {
    message =
      'Unable to connect to MongoDB. Check MONGODB_URI, Atlas network access (IP whitelist), and that the cluster is running.';
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { detail: err.message, stack: err.stack }),
  });
};
