import { toLower } from 'lodash';

export const isValueEmpty = (value: any) => {
  if (!value) return true;

  if (
    typeof value === 'string' &&
    (toLower(value?.trim()) === 'unknown' || toLower(value?.trim()) === 'na')
  ) {
    return true;
  }

  return false;
};
