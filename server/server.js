const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

app.post('/api/process-expense', async (req, res) => {
    const { text } = req.body;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
        Read the user's text describing an expense, extract and format the necessary information into a JSON object. Each description will include details about the amount, the title of the expense, optional description or remarks, how the expense should be split among the group members, and the currency used. Identify these elements from the text and construct a JSON object with the fields: amount, title, description (optional), splitType, and currency.

        Clarify the meanings of each field and the formats they should take, especially explaining how to interpret the split types:
        Equal: The amount is divided equally among all members.
        Shared: The amount is divided based on the percentage shares specified.
        Fixed: Each member pays a fixed amount, and the total might need to be calculated.

        If the input text does not specify the currency, default to 'USD'. If the split type is unclear from the user's description, assume 'equal' split unless stated otherwise.

        User's text: ${text}

        Respond with only the JSON object, no additional text.
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const generatedText = response.text();

        try {
            const jsonResponse = JSON.parse(generatedText);
            res.json(jsonResponse);
        } catch (parseError) {
            res.status(400).json({ error: "text-can-not-be-understood" });
        }
    } catch (error) {
        console.error('Error calling Gemini AI:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));