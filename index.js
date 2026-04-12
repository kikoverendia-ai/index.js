const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// --- CONFIGURATION ---
const PAGE_ACCESS_TOKEN = 'EAAXV2JvH0csBRAc6CX9cn3uqTHdhMpvLRsIXYCZAZAcsmO3SITlFuxoClDm4PVdo7MxXJbvI71ZBjFSc1HZCJ9CMCEZC9q80C0ZCBXgTXRABZCKIPBMrFUiVU5BqsWoSjegLU9gdCb7sAERK79zsyDhvRhTomzNvw6oFYIcZBY9zUZAIXXT9AXDTqQZCYRNvREzDvJdgZDZD';
const VERIFY_TOKEN = 'Chemico@004';

app.get('/', (req, res) => res.send('Sweet Cola Pasarte Ultimate Final is Live! 🧖‍♂️🇸🇦'));

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

        // --- 1. FULL WELCOME MESSAGE (No Cuts) ---
        if (input.includes("hi") || input.includes("hello") || input.includes("مرحبا") || input.includes("start")) {
            const welcomeText = `Maharba! Welcome to Sweet Cola! 🧖‍♂️
How can I give you a refreshing mind and relaxing body today? Shukran Habibi.

مهاربا،!! مرحبا بكم في Sweet Cola ، كيف يمكنني أن أعطيك عقلا منعشا وجسما مريحا اليوم؟ شكران حبيبي.

╔══════════════════════╗
   🪷 *SWEET COLA MASSAGE RIYADH* ╚══════════════════════╝

Hi, I’m 🪷 *Cola* 🪷, a professional massage therapist from 🇵🇭 Philippines offering Thai Massage, Swedish Massage, Oil Massage, and Moroccan Bath. Enjoy a relaxing wellness experience designed to relieve stress, refresh your body, and restore balance.

مرحبا، أنا 🪷 *Cola* 🪷، معالج تدليك محترف من 🇵🇭 Philippines يقدم التدليك التايلاندي والتدليك السويدي وتدليك الزيت والحمام المغربي. استمتع بتجربة صحية مريحة مصممة لتخفيف التوتر ، وتحديث جسمك ، واستعادة التوازن.`;

            responseData = {
                messaging_product: "whatsapp",
                to: from,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: { text: welcomeText },
                    action: {
                        buttons: [
                            { type: "reply", reply: { id: "btn_price", title: "View Services 💰" } },
                            { type: "reply", reply: { id: "btn_loc", title: "Location & Time 📍" } },
                            { type: "reply", reply: { id: "btn_admin", title: "Escalate to Human 👤" } }
                        ]
                    }
                }
            };
        }
        // --- 2. SERVICES & PRICES (Premium Encoding) ---
        else if (input === "btn_price") {
            const serviceText = `▁ ▂ ▄ █ *PREMIUM PACKAGE* █ ▅ ▄ ▂ ▁

• ⭐ Premium Spa Package – *450 SAR*
• (2h 30m – includes Moroccan bath, hot stone, manicure & pedicure)

*تفاصيل الحزمة الممتازة:*
• ⭐ بريميوم سبا حزمة - *450 ريال سعودي*
• (2h 30m - يشمل الحمام المغربي والحجر الساخن والأظافر والباديكير)

━═━═━◥ *OUR PACKAGES* ◤━═━═━

• 💲 *150 SR* - 45 minutes
• 💆‍♂️ Thai Massage / 💆‍♀️ Swedish Massage
• 💧 Oil Massage / 🛁 Moroccan Bath

• 💲 *150 ريال* - 45 دقيقة
• 💆‍♂️ التدليك التايلاندي / 💆‍♀️ التدليك السويدي
• 💧 تدليك الزيت / 🛁 الحمام المغربي

*Choose your next step:* 👇`;

            responseData = {
                messaging_product: "whatsapp",
                to: from,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: { text: serviceText },
                    action: {
                        buttons: [
                            { type: "reply", reply: { id: "btn_loc", title: "Location & Time 📍" } },
                            { type: "reply", reply: { id: "btn_admin", title: "Escalate to Human 👤" } }
                        ]
                    }
                }
            };
        }
        // --- 3. LOCATION & TIMING (Ishbiliyah Link) ---
        else if (input === "btn_loc") {
            responseData = {
                messaging_product: "whatsapp",
                to: from,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: { 
                        text: "📍 *LOCATION & TIMING*\n\n⏰ 11:00 am to 9:00 pm\n\nVisit our website for map & details:\nhttps://maps.app.goo.gl/u4L7LnbL7nDFNc6j9\n\nReady to proceed? 👇" 
                    },
                    action: {
                        buttons: [
                            { type: "reply", reply: { id: "btn_price", title: "View Services 💰" } },
                            { type: "reply", reply: { id: "btn_admin", title: "Escalate to Human 👤" } }
                        ]
                    }
                }
            };
        }
        // --- 4. ESCALATE TO HUMAN (Finalized Link) ---
        else if (input === "btn_admin") {
            responseData = {
                messaging_product: "whatsapp",
                to: from,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: { 
                        text: "📲 *ESCALATE TO HUMAN / BOOK NOW*\n\nClick the link below to chat with our specialist for manual booking:\n\n🔗 https://wa.me/966560958973\n\nتصعيد إلى الإنسان. يرجى الضغط على الرابط أعلاه للتحدث معنا مباشرة." 
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
        // --- 5. THE MAHUSAY CATCH-ALL (Spelling Protector) ---
        else {
            responseData = {
                messaging_product: "whatsapp",
                to: from,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: { 
                        text: "Maharba! I'm sorry, I didn't quite get that. Please use the buttons below so I can help you better.\n\nعذراً، لم أفهم ذلك تماماً. يرجى استخدام الأزرار أدناه لنتمكن من خدمتك بشكل أفضل." 
                    },
                    action: {
                        buttons: [
                            { type: "reply", reply: { id: "btn_price", title: "View Services 💰" } },
                            { type: "reply", reply: { id: "btn_loc", title: "Location & Time 📍" } },
                            { type: "reply", reply: { id: "btn_admin", title: "Escalate to Human 👤" } }
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
app.listen(PORT, () => console.log(`Sweet Cola Ultimate Final is Running`));
