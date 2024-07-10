const { toLower } = require('lodash');

const run = (statement) => {
  const [foundEnumValue, test] =
    Object.entries(STORAGE_MAPPING)?.find(([key, words]) => {
      return words.every((word) => {
        return toLower(statement).includes(word);
      });
    }) || [];

  console.log('result', foundEnumValue);
};
const STORAGE_MAPPING = {
  'COOL DARK PLACE': ['cool', 'dark', 'place'],
  'COOL DRY PLACE': ['cool', 'dry', 'place'],
  'DO NOT FREEZE': ['not', 'freeze'],
  'DO NOT REFRIGERATE': ['not', 'refrigerate'],
  'DRY PLACE': ['dry', 'place'],
  'KEEP FROZEN': ['keep', 'frozen'],
  'KEEP REFRIGERATED': ['keep', 'refrigerated'],
  'REFRIGERATE AFTER OPENING': ['refrigerate', 'after', 'open'],
  'SEAL FOR FRESHNESS': ['seal', 'freshness'],
  'STORE AT ROOM TEMPERATURE': ['at', 'room temperature'],
};

run('store in dry place');
