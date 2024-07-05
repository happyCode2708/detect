const { toUpper } = require('lodash');

const test = (a) => {
  let words = a.toLowerCase().split(/[\s,]+/);
  let fullFormWords = words.map((word) => shortFormMap[word] || toUpper(word));
  let mappedNutrientName = fullFormWords.join(' ');
  console.log(mappedNutrientName);
};

const shortFormMap = {
  'vit. a': 'VITAMIN A',
  'vit. b1': 'VITAMIN B1',
  'vit. b2': 'VITAMIN B2',
  'vit. b3': 'VITAMIN B3',
  'vit. b5': 'VITAMIN B5',
  'vit. b6': 'VITAMIN B6',
  'vit. b7': 'VITAMIN B7',
  'vit. b9': 'VITAMIN B9',
  'vit. b12': 'VITAMIN B12',
  'vit. c': 'VITAMIN C',
  'vit. d': 'VITAMIN D',
  'vit. e': 'VITAMIN E',
  'vit. k': 'VITAMIN K',
  'vit.': 'VITAMIN',
  ca: 'CALCIUM',
  fe: 'IRON',
  mg: 'MAGNESIUM',
  zn: 'ZINC',
  na: 'SODIUM',
  k: 'POTASSIUM',
  p: 'PHOSPHORUS',
  cu: 'COPPER',
  mn: 'MANGANESE',
  se: 'SELENIUM',
  i: 'IODINE',
  cr: 'CHROMIUM',
  mo: 'MOLYBDENUM',
  pro: 'PROTEIN',
  carbs: 'CARBOHYDRATES',
  fat: 'FAT',
  'sat. fat': 'SATURATED FAT',
  'trans. fat': 'TRANS FAT',
  chol: 'CHOLESTEROL',
  sug: 'SUGARS',
  fib: 'FIBER',
  'omega-3': 'OMEGA-3 FATTY ACIDS',
  'omega-6': 'OMEGA-6 FATTY ACIDS',
  ala: 'ALPHA-LINOLENIC ACID',
  dha: 'DOCOSAHEXAENOIC ACID',
  epa: 'EICOSAPENTAENOIC ACID',
  bcaas: 'BRANCHED-CHAIN AMINO ACIDS',
  cal: 'CALORIES',
  kcal: 'KILOCALORIES',
  //   iu: 'INTERNATIONAL UNITS',
  'total carbohydrate': 'TOTAL CARBOHYDRATES',
  carbohydrate: 'CARBOHYDRATES',
};

test('total carbohydrate');
