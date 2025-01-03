export const notFound = (req, res) =>
  res.status(404).json({
    status: "fail",
    message: `Route ${req.originalUrl} does not exist`,
  });
