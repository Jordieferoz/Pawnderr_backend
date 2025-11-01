/**
 * Simple logging middleware for Express
 * Logs request method, URL, timestamp, and response status
 */
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log request details
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  
  // Log response details after completion
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[${timestamp}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
};

