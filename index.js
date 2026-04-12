const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// --- CONFIGURATION ---
const PAGE_ACCESS_TOKEN = 'EAAXV2JvH0csBRAc6CX9cn3uqTHdhMpvLRsIXYCZAZAcsmO3SITlFuxoClDm4PVdo7MxXJbvI71ZBjFSc1HZCJ9CMCEZC9q80C0ZCBXgTXRABZCKIPBMrFUiVU5BqsWoSjegLU9gdCb7sAERK79zsyDhvRhTomzNvw6oFYIcZBY9zUZAIXXT9AXDTqQZCYRNvREzDvJdgZDZD';
const VERIFY_TOKEN = 'Chemico@004';
const LOGO_URL = 'https://hotcola.net/wp-content/uploads/2024/03/cropped-sweet-cola-logo.png'; // Link ng Gold Logo mo

app.get('/', (req, res) => res.send('Sweet Cola Premium Bot is Live! 🧖‍♂️🇸🇦'));

// 1. WEBHOOK VERIFICATION
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token === VERIFY_TOKEN) return res.status(200).send(challenge);
    return res.sendStatus(403);
});

// 2. MESSAGE HANDLER
app.post('/webhook', async (req, res) => {
    try {
        const body = req.body;
        const entry = body.entry?.[0];
        const change = entry?.changes?.[0]?.value;
        const message = change?.messages?.[0];

        if (message) {
            const phone_number_id = change.metadata.phone_number_id;
            const from = message.from;
            
            let input = "";
            if (message.type === 'text') {
                input = message.text.body.toLowerCase();
            } else if (message.type === 'interactive') {
                input = message.interactive.button_reply.id;
            }

            let responseData = null;

            // --- START MESSAGE (WITH LOGO & BUTTONS) ---
            if (input.includes("hi") || input.includes("hello") || input.includes("start") || input.includes("marhaba")) {
                responseData = {
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    to: from,
                    type: "interactive",
                    interactive: {
                        type: "button",
                        header: {
                            type: "image",
                            image: { link: LOGO_URL }
                        },
                        body: { text: "Welcome to *Sweet Cola Wellness Spa*! 🪷\n\nExperience the best massage in Riyadh. How can we help you today?\n\nمرحباً بك في سويت كولا سبا! كيف يمكننا مساعدتك اليوم؟" },
                        action: {
                            buttons: [
                                { type: "reply", reply: { id: "btn_price", title: "View Prices 💰" } },
                                { type: "reply", reply: { id: "btn_loc", title: "Location 📍" } },
                                { type: "reply", reply: { id: "btn_admin", title: "Talk to Human 📱" } }
                            ]
                        }
                    }
                };
            }
            // PRICES
            else if (input.includes("price") || input === "btn_price") {
                responseData = {
                    messaging_product: "whatsapp",
                    to: from,
                    type: "text",
                    text: { body: "✨ *PREMIUM SERVICES* ✨\n\n💆‍♂️ *Full Body Massage* – 150 SR\n🛁 *Moroccan Bath* – 150 SR\n👑 *VIP Full Package* – 450 SR\n\n_All services include premium oils and professional therapists._" }
                };
            }
            // LOCATION
            else if (input.includes("location") || input === "btn_loc" || input.includes("where")) {
                responseData = {
                    messaging_product: "whatsapp",
                    to: from,
                    type: "text",
                    text: { body: "📍 *OUR LOCATION*\n\nQQXP+G9V, Ishbiliyah, Riyadh 13251\n\nClick the link below for Google Maps:\nhttps://maps.google.com/?q=24.8021,46.7915" }
                };
            }
            // TALK TO HUMAN / SENSITIVE
            else if (input === "btn_admin" || input.includes("pic") || input.includes("sex") || input.includes("body")) {
                responseData = {
                    messaging_product: "whatsapp",
                    to: from,
                    type: "text",
                    text: { body: "Our specialist is ready to assist you. Click the link below to chat directly:\n\n👉 https://wa.me/966560958973\n\n_Wait for a few moments, a human will be with you._" }
                };
            }

            if (responseData) {
                await axios({
                    method: "POST",
                    url: `https://graph.facebook.com/v18.0/${phone_number_id}/messages?access_token=${PAGE_ACCESS_TOKEN}`,
                    data: responseData,
                    headers: { "Content-Type": "application/json" },
                });
            }
        }
        res.sendStatus(200);
    } catch (err) {
        console.error("Error:", err.response ? err.response.data : err.message);
        res.sendStatus(500);
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Sweet Cola Sosyal Bot Running on ${PORT}`));
