const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const PAGE_ACCESS_TOKEN = 'EAAXV2JvH0csBRAc6CX9cn3uqTHdhMpvLRsIXYCZAZAcsmO3SITlFuxoClDm4PVdo7MxXJbvI71ZBjFSc1HZCJ9CMCEZC9q80C0ZCBXgTXRABZCKIPBMrFUiVU5BqsWoSjegLU9gdCb7sAERK79zsyDhvRhTomzNvw6oFYIcZBY9zUZAIXXT9AXDTqQZCYRNvREzDvJdgZDZD';
const VERIFY_TOKEN = 'Chemico@004';

app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token === VERIFY_TOKEN) return res.status(200).send(challenge);
    res.sendStatus(403);
});

app.post('/webhook', async (req, res) => {
    try {
        const entry = req.body.entry?.[0];
        const change = entry?.changes?.[0]?.value;
        const message = change?.messages?.[0];
        if (!message) return res.sendStatus(200);

        const phone_number_id = change.metadata.phone_number_id;
        const from = message.from;
        let input = message.type === 'interactive' ? message.interactive.button_reply.id : message.text?.body.toLowerCase();

        let responseData = null;

        // --- 1. MAHUSAY GREETING ---
        if (input.includes("hi") || input.includes("hello") || input.includes("مرحبا") || input.includes("start")) {
            responseData = {
                messaging_product: "whatsapp", to: from, type: "interactive",
                interactive: {
                    type: "button",
                    text: "مهاربا،!! مرحبا بكم في Sweet Cola، كيف يمكنني أن أعطيك عقلاً منعشاً وجسماً مريحاً اليوم؟ شكران حبيبي.\n\nMaharba,!! Welcome to Sweet Cola, How can I give you a refreshing mind and relaxing body today? Shukran Habibi.\n\n╔══════════════════════╗\n  🪷 *SWEET COLA MASSAGE RIYADH* \n╚══════════════════════╝\n\nمرحبا، أنا 🪷 *Cola* 🪷، معالجة تدليك محترفة من الفلبين 🇵🇭 أقدم التدليك التايلاندي، السويدي، وتدليك الزيت والحمام المغربي.\n\nHi, I’m 🪷 *Cola* 🪷, a professional massage therapist from 🇵🇭 Philippines offering Thai, Swedish, Oil Massage, and Moroccan Bath. Enjoy a relaxing experience to relieve stress and refresh your body. ✨" },
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
        // --- 2. MAHUSAY SERVICES (After list, show Loc & Book) ---
        else if (input === "btn_price") {
            responseData = {
                messaging_product: "whatsapp", to: from, type: "interactive",
                interactive: {
                    type: "button",
                    body: { text: "✨ *OUR PREMIUM SERVICES*\n\n💵 *150 SR* – 45 Minutes\n💆‍♂️ Thai / Swedish / Oil Massage\n🛁 Moroccan Bath\n\n🌟 *Package – 450 SAR*\n(Full VIP Service 2h 30m)\n\n*What would you like to check next?* 👇" },
                    action: {
                        buttons: [
                            { type: "reply", reply: { id: "btn_loc", title: "Location & Time 📍" } },
                            { type: "reply", reply: { id: "btn_admin", title: "Book Now 📱" } }
                        ]
                    }
                }
            };
        }
        // --- 3. MAHUSAY LOCATION (After info, show Price & Book) ---
        else if (input === "btn_loc") {
            responseData = {
                messaging_product: "whatsapp", to: from, type: "interactive",
                interactive: {
                    type: "button",
                    body: { text: "📍 *LOCATION & TIMING*\n\n⏰ 11:00 am to 9:00 pm\n\nVisit our website for map & details:\nhttps://maps.app.goo.gl/u4L7LnbL7nDFNc6j9\n\n*Ready to proceed?* 👇" },
                    action: {
                        buttons: [
                            { type: "reply", reply: { id: "btn_price", title: "View Services 💰" } },
                            { type: "reply", reply: { id: "btn_admin", title: "Book Now 📱" } }
                        ]
                    }
                }
            };
        }
        // --- 4. MAHUSAY BOOKING (After info, show Price & Loc) ---
        else if (input === "btn_admin") {
            responseData = {
                messaging_product: "whatsapp", to: from, type: "interactive",
                interactive: {
                    type: "button",
                    body: { text: "📲 *BOOK NOW*\n\nClick to chat with our specialist:\nhttps://wa.me/966560958973\n\n*Anything else we can help with?* 👇" },
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
    } catch (err) { res.sendStatus(200); }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Sweet Cola Pasarte Gold Edition Running on ${PORT}`));
