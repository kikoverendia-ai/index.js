const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// --- CONFIGURATION ---
const PAGE_ACCESS_TOKEN = 'EAAXV2JvH0csBRFCpGZBqRYQmqtUZB0eZClFZBxoWbuVU502vMMZAqJUS1X2ZBNa5lbtVD4LSl91uL6ZCN6DPE0b1KaN9Jp4ZB3EZCUVz5q6AJJuJ65FbjtSalvumrRBL4lLVggwWDibfoEIZBKmezd435EClii58TENK8Ktutk1OlCBsBMTV4zofiZCOdSufZAp2wkf2ybwT8MOipGZBWOgBOj37bJGFjYDd5vOGefr9tiVZBCLXoZCtkOn19HubV8PZBr1ntIkGZCgrYOGOCYg9WZBzaaAonUg3DMiFsv58PbCD3qpQZDZD'
const VERIFY_TOKEN = 'Chemico@005'; 

// 1. WEBHOOK VERIFICATION
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// 2. MESSAGE HANDLER (Autobot Logic)
app.post('/webhook', async (req, res) => {
    const body = req.body;

    if (body.object === 'whatsapp_business_account') {
        if (body.entry && 
            body.entry[0].changes && 
            body.entry[0].changes[0].value.messages && 
            body.entry[0].changes[0].value.messages[0]) {

            const phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id;
            const from = body.entry[0].changes[0].value.messages[0].from; 
            const msg_body = body.entry[0].changes[0].value.messages[0].text.body;

            console.log("Incoming message: " + msg_body);

            // --- ENGLISH AUTO-REPLY ---
            const reply_text = "Hi! This is Kiko's Automated Assistant. We have received your message: \"" + msg_body + "\". We will get back to you shortly.";

            try {
                await axios({
                    method: "POST",
                    url: `https://graph.facebook.com/v18.0/${phone_number_id}/messages?access_token=${PAGE_ACCESS_TOKEN}`,
                    data: {
                        messaging_product: "whatsapp",
                        to: from,
                        text: { body: reply_text },
                    },
                    headers: { "Content-Type": "application/json" },
                });
                console.log("Reply sent successfully!");
            } catch (err) {
                console.log("Error sending reply: " + (err.response ? JSON.stringify(err.response.data) : err.message));
            }
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

// 3. SERVER START
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Autobot is running on port ${PORT}`);
});
