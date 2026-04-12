const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// --- CONFIGURATION ---
const PAGE_ACCESS_TOKEN = 'EAAXV2JvH0csBRFI8izQm2xjC43d3huDSRnAvj7Q8ZCyVghXrWTc2GV3yCJ5NEgCxIPUY4CyP8FmKRlMbclsJ3jbjk7UXmomGXMT8iMFsumy7IbpFd6V5Kcq3D7PaBa5HkjVmMARHiq98CJfjBr4lt4Pkr2typsHsyDX2nwUOy4dUd8ZBPQZCcNstVqI9e7GrYBRuNB7k788oAAGXha4SI9C7plVZCwJ013dZA3xK527TZAInPNdQFyxE17twlz1J5fGRdXa99ZBptvuD3IoJSKepm9XUkVqLg4O2Yf9a28ZD'; // <--- Palitan mo ito ng galing sa Meta
const VERIFY_TOKEN = 'Chemico@005'; 

// 1. WEBHOOK VERIFICATION (Para sa Meta handshake)
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

// 2. MESSAGE HANDLER (Dito gagana ang Autobot)
app.post('/webhook', async (req, res) => {
    const body = req.body;

    // Check kung message galing sa WhatsApp
    if (body.object === 'whatsapp_business_account') {
        if (body.entry && 
            body.entry[0].changes && 
            body.entry[0].changes[0].value.messages && 
            body.entry[0].changes[0].value.messages[0]) {

            const phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id;
            const from = body.entry[0].changes[0].value.messages[0].from; 
            const msg_body = body.entry[0].changes[0].value.messages[0].text.body;

            console.log("May nag-chat: " + msg_body);

            // --- AUTO-REPLY LOGIC ---
            const reply_text = "Hello! Ako ang Autobot ni Kiko. Nareceive ko ang message mo: " + msg_body;

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
                console.log("Reply sent!");
            } catch (err) {
                console.log("Error sa pag-send: " + (err.response ? JSON.stringify(err.response.data) : err.message));
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
