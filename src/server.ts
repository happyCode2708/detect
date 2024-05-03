import express from 'express';
import next from 'next';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import OpenAI from 'openai';

require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = Number(process.env.PORT) || 3000;
// when using middleware `hostname` and `port` must be provided below

const nextApp = next({ dev, hostname, port });
const nextHandler = nextApp.getRequestHandler();

const app = express();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const uploadsDir = path.join(__dirname, 'uploads');
const resultsDir = path.join(__dirname, 'results');

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    // Check if the directory exists, create it if not
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log(`Directory created: ${uploadsDir}`);
    }
    cb(null, uploadsDir);
  },
  filename: (req: any, file: any, cb: any) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Express route for file uploads
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file?.path) return res.json({ isSuccess: false, message: 'failed' });
  const file = req.file;
  const otherParams = req.body;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const maxTokens = 4000;
    const base64Image = encodeImageToBase64(req.file.path);
    const imagePath = `data:image/jpeg;base64,${base64Image}`;
    const resultFileName = req.file.filename + '.json';

    console.log('resultFileName: ', resultFileName);

    res.json({ resultFileName, image: imagePath });

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Carefully examine the image provided and created a neatly formatted JSON output containing a list of objects. Each object should contain:
              json
              [
               {
               "panelName": string ,
               "amountPerServing": {"value": float?, "uom": string},
               "servingSize": {"value": string, "uom": string},
               "servingPerContainer": {"value": float?, "uom": string},
               "nutrients": [{"name": string, "value": float?, "uom": string, "percentDailyValue": float}],
               "note": string,
               "ingredients": string
               }
              ]
              
              Some rules for you:
              
              1) Extract exact numbers provided. No calculations or approximations are permitted.
              
              2) Notations like 'Includes 7g of Added Sugars' should be recorded as "name": "Added Sugars", "value": 7, "uom": "g".
              
              3) Each nutritional line's values must stay unique. Do not interchange numbers between lines or make false inferences. For instance, "total sugar 18g, included 5g added sugar 4%," should create two objects: one as "name": "total sugar", "value": 18, "uom": "g", "percentDailyValue": null, and another as "name": "added sugar", "value": 5, "uom": "g", "percentDailyValue": 14%.
              
              4) The fields 'value', 'uom' (unit of measure), and 'percentDailyValue' can be empty or null. The 'value' is a float number, 'uom' is a string with no numeric characters, and 'percentDailyValue' is a float (without the percentage symbol).
              
              5) Be cautious of potential typos and characters that may look similar but mean different (e.g., '8g' may appear as 'Bg', '0mg' as 'Omg').
              
              6) Special characters like *, +, ., before the note section are crucial - they usually have specific implications.
              
              7) In case of multiple panels in the image, create separate panel objects for each. Attempt to decipher the panel name from the adjacent text. It might be challenging to find it sometimes.
              
              8) If there is only the name of the nutrient and the percentage, then it is considered the 'percentDailyValue', and 'value' and 'uom' are both null.
              
              9) Ingredients usually appear below or next to the nutrition panel and start with "ingredients:".
              
              10) The fact info could be put side by side and may need to be extract data just like we are reading a table 
              
              11) The fact panel has two or more than two different nutrition info for two different sizes of serving. Please read the image carefully to check how many sizes of serving on the the fact panel

              12) Please only return the json in the response
              `,
            },
            {
              type: 'image_url',
              image_url: { url: imagePath },
            },
          ],
        },
      ],
      temperature: 1,
      max_tokens: maxTokens,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const result = response.choices[0]?.message?.content;

    if (!result) return;
    const proc_result = result.split('```json\n')[1].split('```')[0];

    writeJsonToFile(resultsDir, resultFileName, JSON.stringify(proc_result));

    console.log('response', response.choices[0].message);
    res.json({ result, image: imagePath });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).send('Failed to generate text');
  }
});

app.get('/api/get-result/:filename', (req, res) => {
  // Validate that the file extension is .json
  if (!req.params.filename.endsWith('.json')) {
    return res
      .status(400)
      .send('Invalid file type. Only JSON files are allowed.');
  }

  // Construct the full file path
  const filePath = path.join(resultsDir, req.params.filename);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read file:', err);
      // Send a 404 error if the file is not found
      return res.status(404).send('File not found.');
    }
    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).send('Error parsing data file.');
    }
  });
});

app.get('/api/upload', (req, res) => {
  console.log('get');
  res.send('test');
});

app.use((req, res) => nextHandler(req, res));

nextApp.prepare().then(() => {
  app.listen(port, async () => {
    console.log(`Next.js App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`);
  });
});

// Function to encode image to Base64
const encodeImageToBase64 = (filePath: string) => {
  // Ensure the file path is absolute or correctly relative
  const absolutePath = path.resolve(filePath);
  // Read the file's buffer
  const fileBuffer = fs.readFileSync(absolutePath);
  // Convert the file's buffer to a Base64 string
  const base64Image = fileBuffer.toString('base64');
  return base64Image;
};

function writeJsonToFile(directory: string, fileName: string, content: any) {
  // Check if the directory exists
  if (!fs.existsSync(directory)) {
    // If it does not exist, create it
    fs.mkdirSync(directory, { recursive: true });
  }

  // Define the complete file path
  const filePath = path.join(directory, fileName);

  // Write the JSON string to a file
  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.log('Error writing file:', err);
    } else {
      console.log(
        `JSON data is written to the file successfully at ${filePath}.`
      );
    }
  });
}
