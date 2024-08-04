import vision, { ImageAnnotatorClient } from '@google-cloud/vision';

export const getGoogleApiOcr = () => {
  const googleCredentialString = Buffer.from(
    process.env.GOOGLE_CREDENTIALS as string,
    'base64'
  ).toString('utf-8');

  const googleCredential = JSON.parse(googleCredentialString);

  // Initialize the Vision API client with the credentials from memory
  const client = new vision.ImageAnnotatorClient({
    credentials: googleCredential,
  });

  (global as any).ggVision = client;
};
