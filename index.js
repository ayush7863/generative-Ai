const express = require('express');
const axios = require('axios');
require("dotenv").config()
const app = express();

const cors=require("cors")
const port = process.env.PORT
const chatGptApiUrl = 'https://api.openai.com/v1/engines/text-davinci-003/completions';

app.use(express.json());
app.use(cors())

app.post('/convert', async (req, res) => {
  const { code, targetLanguage } = req.body;
  //  console.log( targetLanguage )
  try {
    const response = await axios.post(chatGptApiUrl, {
      prompt: `Translate the following ${code} code to another programming language:\n\n${targetLanguage}`,
      max_tokens: 150,
      temperature: 0,
      n: 1,
      stop: ['###'],
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CHATGPT_API_KEY}`, // Add your ChatGPT API key here
      },
    });

    const translatedCode = response.data.choices[0].text.trim();
    res.json({ translatedCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while converting the code.' });
  }
});

app.post('/debug', async (req, res) => {
  const { code } = req.body;

  try {
    const response = await axios.post(chatGptApiUrl, {
      prompt: `Debug the following code:\n\n${code}`,
      max_tokens: 100,
      temperature: 0,
      n: 1,
      stop: ["###"],
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CHATGPT_API_KEY}`, // Add your ChatGPT API key here
      },
    });

    const debugResponse = response.data.choices[0].text.trim();
    res.json({ debugResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the debug request.' });
  }
});

app.post('/quality-check', async (req, res) => {
  const { code } = req.body;

  try {
    const response = await axios.post(chatGptApiUrl, {
      prompt: `Evaluate the quality of the following code:\n\n${code}`,
      max_tokens: 150,
      temperature: 0,
      n: 1,
      stop: ['###'],
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CHATGPT_API_KEY}`, // Add your ChatGPT API key here
      },
    });

    const qualityScore = response.data.choices[0].text.trim();
    res.json({ qualityScore });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while evaluating the code quality.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
