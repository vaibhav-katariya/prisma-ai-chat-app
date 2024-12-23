export const Responce = async ({res ,  statusCode = 200, message, data }) => {
  res.status(statusCode).json({
    message,
    data,
  });
};
export const ErrorResponse = async ({ res ,  statusCode = 500, message, error }) => {
    res.status(statusCode).json({
        message,
        error,
    });
};
