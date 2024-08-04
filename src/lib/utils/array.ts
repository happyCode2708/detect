export const findIntersectionArrayString = (
  array1: string[],
  array2: string[]
) => {
  if (!array1 || !array2) return [];

  const intersection = array1.filter((element) => array2.includes(element));
  return intersection;
};

export const addUniqueStringToArrayString = (array: string[], item: string) => {
  if (!array.includes(item)) {
    array.push(item);
  }
  return array;
};
