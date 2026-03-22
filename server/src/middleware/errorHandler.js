export const notFound = (_req, res) => {
  res.status(404).json({ message: "Route not found." });
};

export const errorHandler = (error, _req, res, _next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: error.message || "Unexpected server error."
  });
};
