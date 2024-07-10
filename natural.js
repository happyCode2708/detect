const natural = require('natural');
const TfIdf = natural.TfIdf;

const paragraph1 = '29';
const paragraph2 = 29;

const p1 = 'gram';
const p2 = '';

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
