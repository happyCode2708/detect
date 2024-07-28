export const trimPeriodsAndCommas = (str: string) => {
  if (!str) {
    return undefined;
  }
  return str.replace(/^[.,]+|[.,]+$/g, '');
};
