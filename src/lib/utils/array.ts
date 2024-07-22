export const findIntersectionArrayString = (
  array1: string[],
  array2: string[]
) => {
  if (!array1 || !array2) return [];

  const intersection = array1.filter((element) => array2.includes(element));
  return intersection;
};
