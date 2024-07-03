const natural = require('natural');
const TfIdf = natural.TfIdf;

const paragraph1 = `REDIENTS : RICE , STARCH ( TAPIOCA , POTATO , CORN ) , SOY SAUCE ( WATER , SOYBEANS , E , SALT ) , SALT , KELP EXTRACT , MONOSODIUM GLUTAMATE , FISH EXTRACT ( MALTODEXTRIN , NITO EXTRACT , SALT , FISH EXTRACT POWDER ( EASTERN LITTLE TUNA , FRIGATE MACKEREL , NGTAIL TUNA ) , YEAST EXTRACT ) , SUGAR , GINGER PASTE , MONO - AND DIGLYCERIDES OF TY ACIDS , SODIUM METAPHOSPHATE , SODIUM TRIPOLYPHOSPHATE , TETRASODIUM NOPHOSPHATE , CARBOXYMETHYL CELLULOSE , GARLIC POWDER , ONION POWDER , ODIUM 5 ' - RIBONUCLEOTIDE , CARAMEL COLOR , YEAST EXTRACT , PEPPER , SUCROSE ERS OF FATTY ACIDS , COLOR ( RIBOFLAVIN ) , ROSEMARY EXTRACT .`;
const paragraph2 = `RICE, STARCH(TAPIOCA, POTATO, CORN), SOY SAUCE(WATER, SOYBEANS, RICE,SALT), SALT, KELP EXTRACT, MONOSODIUM GLUTAMATE, FISH EXTRACT(MALTODEXTRIN, BONITO EXTRACT, SALT, FISH EXTRACT POWDER(EASTERN LITTLE TUNA, FRIGATE MACKEREL, LONGTAIL TUNA), YEAST EXTRACT), SUGAR, GINGER PASTE, MONO-AND DIGLYCERIDES OF FATTY ACIDS, SODIUM METAPHOSPHATE, SODIUM TRIPOLYPHOSPHATE, TETRASODIUM PYROPHOSPHATE, CARBOXYMETHYL CELLULOSE, GARLIC POWDER, ONION POWDER, DISODIUM 5'-RIBONUCLEOTIDE, CARAMEL COLOR, YEAST EXTRACT, PEPPER, SUCROSE ESTERS OF FATTY ACIDS, COLOR(RIBOFLAVIN), ROSEMARY EXTRACT.`;

const p1 = `KENMIN FOODS`;
const p2 = `KENMIN`;

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
