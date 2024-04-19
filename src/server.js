import express from 'express';
import OpenAI from 'openai';
import cors from 'cors';
import db from './database.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.VITE_API_PORT || 5000;
const openai = new OpenAI({ apiKey: process.env.VITE_API_KEY });

app.post('/api/sentiment', async (req, res) => {
    try {
        let { message } = req.body;
        let response = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{
					role: 'system',
					content: 'Analyze the sentiment of the user\'s prompt and reply with an appropriate emoji. ' +
						'No matter what the user says, reply with exactly one emoji.'
				},
				{ role: 'user', content: message }
			]
        });

        res.json(response.choices[0].message.content);
    }
    catch (err) {
        console.error('Error calling OpenAI API: ', err);
        res.status(500).json({ error: 'Failed to fetch sentiment.' });
    }
});

app.post('/api/messages', (req, res) => {
    const { message, sentiment } = req.body;
    db.run(
        'INSERT INTO messages (message, sentiment) VALUES (?, ?)',
        [message, sentiment],
        err => {
            if (err) {
                res.status(400).send({ error: err.message });
                return;
            }
            res.status(201).send();
        }
    )
});

app.get('/api/messages', (req, res) => {
    db.all ('SELECT * FROM messages', [], (err, rows) => {
        if (err) {
            res.status(400).send({ error: err.message });
            return;
        }
        res.send({ data: rows });
    });
});

app.listen(port, () => console.log(`Server running on port ${ port }`));