// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorMsg = (error: any) => {
  const resp =
    error instanceof Error
      ? `An error occurred: ${error.message}`
      : typeof error == "undefined"
      ? "An error occurred, Try again"
      : String(error);
  return `Sanity Table: ${resp}`;
};
