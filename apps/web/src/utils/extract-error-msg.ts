export const extractErrorMsg = (error: unknown) => {
  return error instanceof Error
    ? `Error: ${error.message}, Cause: ${error.cause} `
    : typeof error == "undefined"
    ? "An error occurred, Try again"
    : String(error);
};
