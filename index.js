const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// --- UPDATED CONFIGURATION ---
const PAGE_ACCESS_TOKEN = 'EAAXV2JvH0csBRG6ZA3bub2f3vUQ586ALN1EZAQQnhBZC0cLLZAcJsFklCVhfxJYMddPnaJEP1YUNBZAxWPHWSFukpMHsXn7C42WemTHWjiDCVaANEyyGR5n99idZBmAenZCAvDJZBk17ZBcnFSFatIq1unuBuMcqtGhnLnnGZC3sJnOOnhbjqul1wbSkoR3iuBah6Sm6BQXT59Hwoq';
const VERIFY_TOKEN = 'Chemico@004';

// Root Route
app.get('/', (req, res) => {
    res.send('Sweet Cola Autobot is Live! 🧖‍♂️🇸🇦');
});

// 1. WEBHOOK VERIFICATION (Using new Chemico@004)
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        return res.status(200).send(challenge);
    }
    return res.sendStatus(403);
});

// 2. MESSAGE HANDLER
app.post('/webhook', async (req, res) => {
    try {
        const body = req.body;
        if (body.object !== 'whatsapp_business_account') return res.sendStatus(404);

        const entry = body.entry?.[0];
        const change = entry?.changes?.[0]?.value;
        const message = change?.messages?.[0];

        if (message && message.text) {
            const phone_number_id = change.metadata.phone_number_id;
            const from = message.from;
            const msg_body = message.text.body.toLowerCase();

            let reply_text = "";

            // --- SWEET COLA UPDATED LOGIC ---
            if (msg_body.includes("hi") || msg_body.includes("hello") || msg_body.includes("kumusta") || msg_body.includes("marhaba")) {
                reply_text = "╔═════════════════════╗\n        SWEET COLA WELLNESS SPA\n                  Riyadh - Exit 9\n╚═════════════════════╝\n\nHi, I’m 🪷 *Cola* 🪷. Welcome to Sweet Cola Massage! ✨\nHow can I help you today?\n\nمرحباً! أنا كولا. كيف يمكنني مساعدتك؟";
            } 
            else if (msg_body.includes("price") || msg_body.includes("magkano") || msg_body.includes("service") || msg_body.includes("how much")) {
                reply_text = "✨ *SERVICES & RATES* ✨\n\n💲 *150 SR – 45 Minutes*\n💆‍♂️ Thai / Swedish / Oil Massage\n🛁 Moroccan Bath (Skin Cleanse)\n\n⭐ *Premium Spa Package – 450 SAR*\n(2h 30m – includes Moroccan bath, hot stone, manicure & pedicure)\n\nتبدأ خدماتنا من ١٥٠ ريالاً. الباقة المميزة بـ ٤٥٠ ريالاً.";
            }
            else if (msg_body.includes("extra") || msg_body.includes("plus")) {
                // PAKIPOT VERSION 🙄🙄🙄
                reply_text = "🙄🙄🙄\n\nالأمر يعتمد على الهدية وكرمك عند الحضور للمشغل. 😉✨";
            }
            else if (msg_body.includes("location") || msg_body.includes("saan") || msg_body.includes("address") || msg_body.includes("ishbiliyah")) {
                reply_text = "📍 *LOCATION*\nQQXP+G9V, Ishbiliyah, Riyadh 13251\n🌐 Website: hotcola.net\n\n⚠️ *NOTICE:* Services are available ONLY inside the spa shop.\n\nموقعنا في حي إشبيلية. الخدمة داخل المشغل فقط.";
            }
            else if (msg_body.includes("time") || msg_body.includes("oras") || msg_body.includes("open")) {
                reply_text = "⏰ *BUSINESS HOURS*\nWe are open from **11:00 AM to 9:00 PM**.\n\nنحن متاحون من الساعة ١١ صباحاً حتى ٩ مساءً.";
            }
            else {
                // UPDATED ESCALATE TO HUMAN (Link to 966560958973)
                reply_text = "I'm sorry, I didn't quite catch that. 🪷 For more personalized assistance or 'fresh' updates, please chat with our specialist here:\n\n👉 https://wa.me/966560958973\n\n------------------\n\nعذراً، لم أفهم طلبك جيداً. 🪷 للمزيد من المساعدة الشخصية أو التحدث مع المختص مباشرة، يرجى الضغط على الرابط التالي:\n\n👉 https://wa.me/966560958973";
            }

            // Send Response back to Meta
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
            console.log("Reply sent successfully to " + from);
        }
        res.sendStatus(200);
    } catch (err) {
        console.error("Error: ", err.response ? JSON.stringify(err.response.data) : err.message);
        res.sendStatus(500);
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Sweet Cola Autobot running on port ${PORT}`);
});
