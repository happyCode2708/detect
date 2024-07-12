const natural = require('natural');
const TfIdf = natural.TfIdf;

const paragraph1 = '29';
const paragraph2 = 29;
let a = [
  {
    Property: [
      {
        PropertyName: 'PANEL LABEL',
        PropertySource: 'NUTRITION FACTS',
        Amount: '',
        AmountUOM: '',
      },
      {
        PropertyName: 'PRIMARY SERVINGS PER CONTAINER',
        PropertySource: '',
        Amount: 'ABOUT 10',
        AmountUOM: '',
      },
      {
        PropertyName: 'PRIMARY SERVING SIZE',
        PropertySource: '',
        Amount: '2 Tbsp (29g)',
        AmountUOM: '',
      },
      {
        PropertyName: 'DAILY VALUE STATEMENT',
        PropertySource: '## DEBUG ANSWER:',
        AnalyticalValue: '',
        Amount: '',
        AmountUOM: '',
      },
      {
        PropertyName: 'CALORIES',
        PropertySource: '',
        AnalyticalValue: 110,
        Amount: 110,
        AmountUOM: '',
        Indicators: '',
      },
      {
        PropertyName: 'TOTAL FAT',
        PropertySource: '',
        AnalyticalValue: 12,
        Amount: 12,
        AmountUOM: 'GRAM',
        Percent: '15',
        Indicators: '',
      },
      {
        PropertyName: 'SATURATED FAT',
        PropertySource: '',
        AnalyticalValue: 1.5,
        Amount: 1.5,
        AmountUOM: 'GRAM',
        Percent: '9',
        Indicators: '',
      },
      {
        PropertyName: 'TRANS FAT',
        PropertySource: '',
        AnalyticalValue: 0,
        Amount: 0,
        AmountUOM: 'GRAM',
        Indicators: '',
      },
      {
        PropertyName: 'POLYUNSATURATED FAT',
        PropertySource: '',
        AnalyticalValue: 1.5,
        Amount: 1.5,
        AmountUOM: 'GRAM',
        Indicators: '',
      },
      {
        PropertyName: 'MONOUNSATURATED FAT',
        PropertySource: '',
        AnalyticalValue: 8,
        Amount: 8,
        AmountUOM: 'GRAM',
        Indicators: '',
      },
      {
        PropertyName: 'CHOLESTEROL',
        PropertySource: '',
        AnalyticalValue: 10,
        Amount: 10,
        AmountUOM: 'MILLIGRAM',
        Percent: '3',
        Indicators: '',
      },
      {
        PropertyName: 'SODIUM',
        PropertySource: '',
        AnalyticalValue: 260,
        Amount: 260,
        AmountUOM: 'MILLIGRAM',
        Percent: '12',
        Indicators: '',
      },
      {
        PropertyName: 'TOTAL CARBOHYDRATES',
        PropertySource: '',
        AnalyticalValue: 2,
        Amount: 2,
        AmountUOM: 'GRAM',
        Percent: '1',
        Indicators: '',
      },
      {
        PropertyName: 'DIETARY FIBER',
        PropertySource: '',
        AnalyticalValue: 0,
        Amount: 0,
        AmountUOM: 'GRAM',
        Percent: '0',
        Indicators: '',
      },
      {
        PropertyName: 'TOTAL SUGARS',
        PropertySource: '',
        AnalyticalValue: 1,
        Amount: 1,
        AmountUOM: 'GRAM',
        Indicators: '',
      },
      {
        PropertyName: 'ADDED SUGAR',
        PropertySource: '',
        AnalyticalValue: 1,
        Amount: 1,
        AmountUOM: 'GRAM',
        Percent: '2',
        Indicators: '',
      },
      {
        PropertyName: 'PROTEIN',
        PropertySource: '',
        AnalyticalValue: 0,
        Amount: 0,
        AmountUOM: 'GRAM',
        Indicators: '',
      },
      {
        PropertyName: 'VITAMIN D',
        PropertySource: '',
        AmountUOM: '',
        Percent: '0',
        Indicators: '',
      },
      {
        PropertyName: 'CALCIUM',
        PropertySource: '',
        AmountUOM: '',
        Percent: '0',
        Indicators: '',
      },
      {
        PropertyName: 'IRON',
        PropertySource: '',
        AmountUOM: '',
        Percent: '0',
        Indicators: '',
      },
      {
        PropertyName: 'POTASSIUM',
        PropertySource: '',
        AmountUOM: '',
        Percent: '0',
        Indicators: '',
      },
    ],
  },
];

let b = [
  {
    Property: [
      {
        PropertyName: 'DIETARY FIBER',
        PropertySource: '',
        AnalyticalValue: 0,
        Amount: '0',
        AmountUOM: 'GRAM',
        Percent: 0,
      },
      {
        PropertyName: 'TRANS FAT',
        PropertySource: '',
        AnalyticalValue: 0,
        Amount: '0',
        AmountUOM: 'GRAM',
      },
      {
        PropertyName: 'CALCIUM',
        PropertySource: '',
        Amount: '',
        Percent: 0,
      },
      {
        PropertyName: 'PROTEIN',
        PropertySource: '',
        AnalyticalValue: 0,
        Amount: '0',
        AmountUOM: 'GRAM',
      },
      {
        PropertyName: 'TOTAL CARBOHYDRATES',
        PropertySource: '',
        AnalyticalValue: 2,
        Amount: '2',
        AmountUOM: 'GRAM',
        Percent: 1,
      },
      {
        PropertyName: 'PRIMARY SERVING SIZE',
        PropertySource: '',
        Amount: '2 TBSP (29G)',
        AmountUOM: '',
      },
      {
        PropertyName: 'CALORIES',
        PropertySource: '',
        AnalyticalValue: 110,
        Amount: '110',
        AmountUOM: '',
      },
      {
        PropertyName: 'SODIUM',
        PropertySource: '',
        AnalyticalValue: 260,
        Amount: '260',
        AmountUOM: 'MILLIGRAM',
        Percent: 12,
      },
      {
        PropertyName: 'POTASSIUM',
        PropertySource: '',
        Amount: '',
        Percent: 0,
      },
      {
        PropertyName: 'SATURATED FAT',
        PropertySource: '',
        AnalyticalValue: 1.5,
        Amount: '1.5',
        AmountUOM: 'GRAM',
        Percent: 9,
      },
      {
        PropertyName: 'TOTAL SUGARS',
        PropertySource: '',
        AnalyticalValue: 1,
        Amount: '1',
        AmountUOM: 'GRAM',
      },
      {
        PropertyName: 'POLYUNSATURATED FAT',
        PropertySource: '',
        AnalyticalValue: 1.5,
        Amount: '1.5',
        AmountUOM: 'GRAM',
      },
      {
        PropertyName: 'MONOUNSATURATED FAT',
        PropertySource: '',
        AnalyticalValue: 8,
        Amount: '8',
        AmountUOM: 'GRAM',
      },
      {
        PropertyName: 'PRIMARY SERVINGS PER CONTAINER',
        PropertySource: '',
        Amount: 'ABOUT 10',
        AmountUOM: '',
      },
      {
        PropertyName: 'ADDED SUGAR',
        PropertySource: '',
        AnalyticalValue: 1,
        Amount: '1',
        AmountUOM: 'GRAM',
        Percent: 2,
      },
      {
        PropertyName: 'IRON',
        PropertySource: '',
        Amount: '',
        Percent: 0,
      },
      {
        PropertyName: 'CHOLESTEROL',
        PropertySource: '',
        AnalyticalValue: 10,
        Amount: '10',
        AmountUOM: 'MILLIGRAM',
        Percent: 3,
      },
      {
        PropertyName: 'PANEL LABEL',
        PropertySource: 'NUTRITION FACTS',
        Amount: '',
        AmountUOM: '',
      },
      {
        PropertyName: 'TOTAL FAT',
        PropertySource: '',
        AnalyticalValue: 12,
        Amount: '12',
        AmountUOM: 'GRAM',
        Percent: 15,
      },
      {
        PropertyName: 'VITAMIN D',
        PropertySource: '',
        Amount: '',
        Percent: 0,
      },
    ],
  },
];

let test1 = {
  PropertyName: 'CHOLESTEROL',
  PropertySource: '',
  AnalyticalValue: 10,
  Amount: '10',
  AmountUOM: 'MILLIGRAM',
  Percent: 3,
};

let test2 = {
  PropertyName: 'PANEL LABEL',
  PropertySource: 'NUTRITION FACTS',
  Amount: '',
  AmountUOM: '',
};

const p1 = JSON.stringify(a);
const p2 = JSON.stringify(b);

const tfidf = new TfIdf();
tfidf.addDocument(p1);
tfidf.addDocument(p2);

const getVector = (docIndex) => {
  const vector = {};
  tfidf.listTerms(docIndex).forEach((item) => {
    vector[item.term] = item.tfidf;
  });
  return vector;
};

const vector1 = getVector(0);
const vector2 = getVector(1);

const dotProduct = (vec1, vec2) => {
  let product = 0;
  for (let key in vec1) {
    if (vec2[key]) {
      product += vec1[key] * vec2[key];
    }
  }
  return product;
};

const magnitude = (vec) => {
  let sum = 0;
  for (let key in vec) {
    sum += vec[key] * vec[key];
  }
  return Math.sqrt(sum);
};

const cosineSimilarity = (vec1, vec2) => {
  const dot = dotProduct(vec1, vec2);
  const mag1 = magnitude(vec1);
  const mag2 = magnitude(vec2);
  return dot / (mag1 * mag2);
};

const similarity = cosineSimilarity(vector1, vector2);

console.log(
  `The cosine similarity between the two paragraphs is: ${(
    similarity * 100
  ).toFixed(2)}%`
);
