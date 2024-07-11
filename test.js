const { toLower } = require('lodash');

const run = (reason, claim) => {
  let final = NON_CERTIFICATE_REASON?.[toLower(claim)]
    ?.map((wordList) => {
      return wordList
        .map((word) => {
          if (toLower(reason)?.includes(word)) {
            return true;
          } else {
            return false;
          }
        })
        .every((result) => result === true);
    })
    .every((result) => result === false);

  console.log('final', final);
};

const NON_CERTIFICATE_REASON = {
  '100% natural ingredients': [['100%', 'natural', 'ingredient']],
  '100% natural': [['100%', 'natural']],
  'vegetarian or vegan diet/feed': [
    ['vegetarian'],
    ['vegan', 'diet'],
    ['vegan', 'feed'],
  ],
};

run('vegan diet', 'vegetarian or vegan diet/feed');
