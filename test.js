const { toLower } = require('lodash');

const checkUserOfFreezeBy = async (statement) => {
  let validInstructionStatement = '';

  Object.entries(USE_OR_FREEZE_BY_MAPPING)?.forEach(
    ([key, phraseWorldList]) => {
      if (
        phraseWorldList
          ?.map((wordList) => {
            return wordList
              .map((word) => {
                if (toLower(statement)?.includes(word)) {
                  return true;
                } else {
                  return false;
                }
              })
              .every((result) => result === true);
          })
          .some((result) => result === true)
      ) {
        validInstructionStatement = statement;
      }
    }
  );

  // console.log(validInstructionStatement);

  if (!validInstructionStatement) {
    return Promise.resolve(false);
  }

  return Promise.resolve(validInstructionStatement);
};

const USE_OR_FREEZE_BY_MAPPING = {
  'WITH IN': [
    ['consume', 'within'],
    ['use', 'within'],
    ['enjoy', 'within'],
  ],
};

const test = async () => {
  const result = await checkUserOfFreezeBy('DO NOT FREEZE.');
  console.log(result);
};

test();
