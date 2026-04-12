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
        // --- Eto yung block na ilalagay mo sa loob ng app.post('/webhook'...) ---

else if (input === "btn_price" || input.includes("price") || input.includes("service")) {
    
    // Dito mo i-edit yung text sa loob ng backticks (``)
    const serviceText = `▁ ▂ ▄ ▅ █ PREMIUM PACKAGE █ ▆ ▅ ▄ ▂ ▁

*Premium Package Details:*
• ⭐ Premium Spa Package – *450 SAR*
• (2h 30m – includes Moroccan bath, hot stone, manicure & pedicure)

*تفاصيل الحزمة الممتازة:*
• ⭐ بريميوم سبا حزمة - *450 ريال سعودي*
• (2h 30m - يشمل الحمام المغربي والحجر الساخن والأظافر والباديكير)

━═━═━◥ *OUR PACKAGES* ◤━═━═━

• 💲 *150 SR* - 45 minutes
• 💆‍♂️ Thai Massage - (Deep Stretch)
• 💆‍♀️ Swedish Massage - (Stress Relief)
• 💧 Oil Massage - (Body Relax)
• 🛁 Moroccan Bath - (Skin Cleanse)

• 💲 *150 ريال* - 45 دقيقة
• 💆‍♂️ التدليك التايلاندي- (تمديد عميق)
• 💆‍♀️ التدليك السويدي- (تخفيف التوتر)
• 💧 تدليك الزيت- (استرخاء الجسم)
• 🛁 الحمام المغربي- (تطهير الجلد)

*What is your next choice?* 👇`;

    responseData = {
        messaging_product: "whatsapp",
        to: from,
        type: "interactive",
        interactive: {
            type: "button",
            body: { text: serviceText }, // Gagamitin nito yung in-edit mong text sa itaas
            action: {
                buttons: [
                    { type: "reply", reply: { id: "btn_loc", title: "Location & Time 📍" } },
                    { type: "reply", reply: { id: "btn_admin", title: "Book Now 📱" } }
                ]
            }
        }
    };
}
        // --- 4. BOOK NOW (With Follow-up Buttons) ---
// ==========================================
        // 🛡️ GUIDELINES PARA KAY BOSS (HIDDEN)
        // 1. Ang 'else' sa dulo ang sasalo sa lahat ng maling spelling.
        // 2. Dito babagsak ang bot kapag hindi 'Price' o 'Location' ang tinype.
        // 3. Siguraduhin na laging may buttons dito para hindi 'Dead End'.
        // ==========================================
        else {
            // Ito ang isasagot ni bot sa kahit anong maling spelling o random text
            const catchAllText = `Maharba! Welcome to Sweet Cola! 🧖‍♂️
How can I help you today? Please use the buttons below so I can assist you better. Shukran Habibi.

مرحباً بك في سويت كولا! 🧖‍♂️
كيف يمكنني مساعدتك اليوم؟ يرجى استخدام الأزرار أدناه لنتمكن من خدمتك بشكل أفضل. شكراً حبيبي.`;

            responseData = {
                messaging_product: "whatsapp",
                to: from,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: { text: catchAllText },
                    action: {
                        buttons: [
                            { type: "reply", reply: { id: "btn_price", title: "View Services 💰" } },
                            { type: "reply", reply: { id: "btn_loc", title: "Location & Time 📍" } },
                            { type: "reply", reply: { id: "btn_admin", title: "Book Now 📱" } }
                        ]
                    }
                }
            };
        } // <--- Dito nagtatapos ang Catch-all block
