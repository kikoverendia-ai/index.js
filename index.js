const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// --- CONFIGURATION ---
const PAGE_ACCESS_TOKEN = 'EAAXV2JvH0csBRAc6CX9cn3uqTHdhMpvLRsIXYCZAZAcsmO3SITlFuxoClDm4PVdo7MxXJbvI71ZBjFSc1HZCJ9CMCEZC9q80C0ZCBXgTXRABZCKIPBMrFUiVU5BqsWoSjegLU9gdCb7sAERK79zsyDhvRhTomzNvw6oFYIcZBY9zUZAIXXT9AXDTqQZCYRNvREzDvJdgZDZD';
const VERIFY_TOKEN = 'Chemico@004';

app.get('/', (req, res) => res.send('Sweet Cola Pasarte Gold is Live! 🧖‍♂️🇸🇦'));

app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token === VERIFY_TOKEN) return res.status(200).send(challenge);
    res.sendStatus(403);
});

app.post('/webhook', async (req, res) => {
    try {
        const body = req.body;
        const entry = body.entry?.[0];
        const change = entry?.changes?.[0]?.value;
        const message = change?.messages?.[0];

        if (!message) return res.sendStatus(200);

        const phone_number_id = change.metadata.phone_number_id;
        const from = message.from;
        
        let input = "";
        if (message.type === 'text') {
            input = message.text.body.toLowerCase();
        } else if (message.type === 'interactive') {
            input = message.interactive.button_reply.id;
        }

        let responseData = null;

// --- MAHUSAY GREETING (CLEAN VERSION) ---
if (input.includes("hi") || input.includes("hello") || input.includes("مرحبا") || input.includes("start")) {
    responseData = {
        messaging_product: "whatsapp",
        to: from,
        type: "interactive",
        interactive: {
            type: "button",
            body: { 
                text: "Maharba! Welcome to Sweet Cola! 🧖‍♂️\nHow can I give you a refreshing mind and relaxing body today? Shukran Habibi.\n\nمهاربا،!! مرحبا بكم في Sweet Cola ، كيف يمكنني أن أعطيك عقلا منعشا وجسما مريحا اليوم؟ شكران حبيبي.\n\n╔══════════════════════╗\n 🪷 *SWEET COLA MASSAGE RIYADH*\n╚══════════════════════╝\n\nHi, I’m 🪷 *Cola* 🪷, a professional therapist from 🇵🇭 Philippines.\n\nمرحبا، أنا 🪷 *Cola* 🪷، معالجة تدليك محترفة من الفلبين 🇵🇭 أقدم التدليك التايلاندي، السويدي، وتدليك الزيت والحمام المغربي. ✨"
            },
            action: {
                buttons: [
                    { type: "reply", reply: { id: "btn_price", title: "View Services 💰" } },
                    { type: "reply", reply: { id: "btn_loc", title: "Location & Time 📍" } },
                    { type: "reply", reply: { id: "btn_admin", title: "Book Now 📱" } }
                ]
            }
        }
    };
}
        // --- 2. SERVICES (With Follow-up Buttons) ---
        else if (input === "btn_price" || input.includes("price")) {
            responseData = {
                messaging_product: "whatsapp",
                to: from,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: { 
                        text: "✨ *OUR PREMIUM SERVICES*\n\n💵 *150 SR* – 45 Minutes\n💆‍♂️ Thai / Swedish / Oil Massage\n🛁 Moroccan Bath\n\n🌟 *Package – 450 SAR*\n(Full VIP Service 2h 30m)\n\n*Choose your next step:* 👇" 
                    },
                    action: {
                        buttons: [
                            { type: "reply", reply: { id: "btn_loc", title: "Location & Time 📍" } },
                            { type: "reply", reply: { id: "btn_admin", title: "Book Now 📱" } }
                        ]
                    }
                }
            };
        }
        // --- 3. LOCATION (With Correct Ishbiliyah Map Link) ---
        else if (input === "btn_loc" || input.includes("location")) {
            responseData = {
                messaging_product: "whatsapp",
                to: from,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: { 
                        text: "📍 *LOCATION & TIMING*\n\n⏰ 11:00 am to 9:00 pm\n\nVisit our website for map & details:\nhttps://maps.app.goo.gl/u4L7LnbL7nDFNc6j9\n\n*Ready to proceed?* 👇" 
                    },
                    action: {
                        buttons: [
                            { type: "reply", reply: { id: "btn_price", title: "View Services 💰" } },
                            { type: "reply", reply: { id: "btn_admin", title: "Book Now 📱" } }
                        ]
                    }
                }
            };
        }
        // --- 4. BOOK NOW (With Follow-up Buttons) ---
        else if (input === "btn_admin" || input.includes("book")) {
            responseData = {
                messaging_product: "whatsapp",
                to: from,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: { 
                        text: "📲 *BOOK NOW*\n\nClick here to chat with our specialist:\nhttps://wa.me/966560958973\n\n*Need anything else?* 👇" 
                    },
                    action: {
                        buttons: [
                            { type: "reply", reply: { id: "btn_price", title: "View Services 💰" } },
                            { type: "reply", reply: { id: "btn_loc", title: "Location & Time 📍" } }
                        ]
                    }
                }
            };
        }

        if (responseData) {
            await axios.post(`https://graph.facebook.com/v18.0/${phone_number_id}/messages?access_token=${PAGE_ACCESS_TOKEN}`, responseData);
        }
        res.sendStatus(200);
    } catch (err) {
        console.error("Error:", err.message);
        res.sendStatus(200);
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Sweet Cola Pasarte Gold Running on ${PORT}`));
