const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// --- CONFIGURATION ---
const PAGE_ACCESS_TOKEN = 'EAAXV2JvH0csBRAc6CX9cn3uqTHdhMpvLRsIXYCZAZAcsmO3SITlFuxoClDm4PVdo7MxXJbvI71ZBjFSc1HZCJ9CMCEZC9q80C0ZCBXgTXRABZCKIPBMrFUiVU5BqsWoSjegLU9gdCb7sAERK79zsyDhvRhTomzNvw6oFYIcZBY9zUZAIXXT9AXDTqQZCYRNvREzDvJdgZDZD';
const VERIFY_TOKEN = 'Chemico@004';

app.get('/', (req, res) => res.send('Sweet Cola Premium Bot is Live! 🧖‍♂️🇸🇦'));

app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token === VERIFY_TOKEN) return res.status(200).send(challenge);
    return res.sendStatus(403);
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

        // --- WELCOME MESSAGE (THE SOSYAL LAYOUT) ---
        if (input.includes("hi") || input.includes("hello") || input.includes("start") || input.includes("مرحبا")) {
            responseData = {
                messaging_product: "whatsapp",
                to: from,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: { 
                        text: "مهاربا،!! مرحبا بكم في Sweet Cola، كيف يمكنني أن أعطيك عقلاً منعشاً وجسماً مريحاً اليوم؟ شكران حبيبي.\n\nMaharba,!! Welcome to Sweet Cola, How can I give you a refreshing mind and relaxing body today? Shukran Habibi.\n\n╔══════════════════════╗\n    🪷 *SWEET COLA MASSAGE RIYADH* \n╚══════════════════════╝\n\nمرحبا، أنا 🪷 *Cola* 🪷، معالجة تدليك محترفة من الفلبين 🇵🇭 أقدم التدليك التايلاندي، السويدي، وتدليك الزيت والحمام المغربي.\n\nHi, I’m 🪷 *Cola* 🪷, a professional massage therapist from 🇵🇭 Philippines offering Thai, Swedish, Oil Massage, and Moroccan Bath. Enjoy a relaxing experience to relieve stress and refresh your body. ✨"
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
        // SERVICES
        else if (input === "btn_price" || input.includes("price")) {
            responseData = {
                messaging_product: "whatsapp",
                to: from,
                type: "text",
                text: { 
                    body: "✨ *OUR PREMIUM SERVICES*\n\n💵 *150 SR* – 45 Minutes\n💆‍♂️ *Thai Massage* (Deep Stretch)\n💆‍♀️ *Swedish Massage* (Stress Relief)\n💧 *Oil Massage* (Body Relax)\n🛁 *Moroccan Bath* (Skin Cleanse)\n\n🌟 *Premium Spa Package – 450 SAR*\n(2h 30m – includes Moroccan bath, hot stone, manicure & pedicure)"
                }
            };
        }
        // LOCATION & TIMING
        else if (input === "btn_loc" || input.includes("location")) {
            responseData = {
                messaging_product: "whatsapp",
                to: from,
                type: "text",
                text: { 
                    preview_url: true, 
                    body: "📍 *LOCATION & TIMING*\n\n⏰ *Working Hours:* 11:00 am to 9:00 pm\n\nVisit our website for location details:\nhttps://hotcola.net" 
                }
            };
        }
        // BOOK NOW
        else if (input === "btn_admin" || input.includes("book")) {
            responseData = {
                messaging_product: "whatsapp",
                to: from,
                type: "text",
                text: { 
                    preview_url: true,
                    body: "📲 *BOOK NOW*\n\nClick here to chat with our specialist:\nhttps://wa.me/966560958973" 
                }
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
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(500);
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Sweet Cola Sosyal Bot Running`));
