import natural from 'natural';

export const getMatchPercent = ({ v1, v2 }: { v1: string; v2: string }) => {
  if (v1 === v2) return 100;

  if (v1 === '' && v2 === '') return 100;

  if (isNumber(v1) || isNumber(v2)) {
    if (v1 === v2) {
      return 100;
    } else {
      return 0;
    }
  }

  const TfIdf = natural.TfIdf;

  const tfidf = new TfIdf();
  tfidf.addDocument(v1);
  tfidf.addDocument(v2);

  const getVector = (docIndex: any) => {
    const vector = {} as any;
    tfidf.listTerms(docIndex).forEach((item: any) => {
      vector[item.term] = item.tfidf;
    });
    return vector;
  };

  const vector1 = getVector(0);
  const vector2 = getVector(1);

  const dotProduct = (vec1: any, vec2: any) => {
    let product = 0;
    for (let key in vec1) {
      if (vec2[key]) {
        product += vec1[key] * vec2[key];
      }
    }
    return product;
  };

  const magnitude = (vec: any) => {
    let sum = 0;
    for (let key in vec) {
      sum += vec[key] * vec[key];
    }
    return Math.sqrt(sum);
  };

  const cosineSimilarity = (vec1: any, vec2: any) => {
    const dot = dotProduct(vec1, vec2);
    const mag1 = magnitude(vec1);
    const mag2 = magnitude(vec2);
    return dot / (mag1 * mag2);
  };

  const similarity = cosineSimilarity(vector1, vector2);

  return (similarity * 100).toFixed(2);

  // console.log(
  //   `The cosine similarity between the two paragraphs is: ${(
  //     similarity * 100
  //   ).toFixed(2)}%`
  // );
};

const isNumber = (input: any) => {
  return !isNaN(input);
};
