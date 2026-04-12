const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// --- CONFIGURATION (UPDATED NUMBER & TOKENS) ---
const PAGE_ACCESS_TOKEN = 'EAAXV2JvH0csBRG6ZA3bub2f3vUQ586ALN1EZAQQnhBZC0cLLZAcJsFklCVhfxJYMddPnaJEP1YUNBZAxWPHWSFukpMHsXn7C42WemTHWjiDCVaANEyyGR5n99idZBmAenZCAvDJZBk17ZBcnFSFatIq1unuBuMcqtGhnLnnGZC3sJnOOnhbjqul1wbSkoR3iuBah6Sm6BQXT59Hwoq';
const VERIFY_TOKEN = 'Chemico@004';

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
        if (body.object !== 'whatsapp_business_account') return res.sendStatus(404);

        const entry = body.entry?.[0];
        const change = entry?.changes?.[0]?.value;
        const message = change?.messages?.[0];

        if (message && message.text) {
            const phone_number_id = change.metadata.phone_number_id;
            const from = message.from;
            const input = message.text.body.toLowerCase();
            let reply_text = "";

            // --- PRIVATE / SENSITIVE KEYWORDS ---
            const privateKeywords = ["pic", "picture", "photo", "body", "sex", "pussy", "vagina", "dick", "naked", "bold", "video", "صورة", "جسم", "جنس"];
            const isPrivateRequest = privateKeywords.some(keyword => input.includes(keyword));

            if (isPrivateRequest) {
                reply_text = "For these requests and private details, please talk to our specialist directly to get 'fresh' information:\n\n👉 https://wa.me/966560958973\n\n------------------\n\nلهذه الطلبات والتفاصيل الخاصة، يرجى التحدث مع المختص مباشرة:\n\n👉 https://wa.me/966560958973";
            }
            // GREETINGS
            else if (input.includes("hi") || input.includes("hello") || input.includes("marhaba") || input.includes("سلام")) {
                reply_text = "Welcome to *Sweet Cola Wellness Spa*! 🪷\nHow can we assist you today?\n\nمرحباً بك في سويت كولا سبا! كيف يمكننا مساعدتك اليوم؟";
            }
            // PRICE / SERVICES
            else if (input.includes("price") || input.includes("magkano") || input.includes("service") || input.includes("how much") || input.includes("كم")) {
                reply_text = "✨ *OUR SERVICES* ✨\n\n💆‍♂️ *Full Body Massage* – 150 SR\n🛁 *Moroccan Bath* – 150 SR\n👑 *VIP Full Package* – 450 SR\n\nتبدأ خدماتنا من ١٥٠ ريالاً. الباقة المميزة بـ ٤٥٠ ريالاً.";
            }
            // HADIYA / GIFT
            else if (input.includes("hadiya") || input.includes("gift") || input.includes("tip") || input.includes("هدية")) {
                reply_text = "🎁 *HADIYA / GIFT*\nIt is entirely **up to you, sir**. A gift is something that comes from the bottom of your heart to show appreciation for our service. 🙏✨\n\nالأمر يعتمد عليك تماماً يا سيدي. الهدية هي شيء نابع من القلب تقديرًا للخدمة.";
            }
            // PAYMENT
            else if (input.includes("pay") || input.includes("payment") || input.includes("cash") || input.includes("card")) {
                reply_text = "💳 *PAYMENT*\nWe accept Cash, Mada, and STC Pay.\n\nنقبل الدفع نقداً، بطاقة مدى، أو STC Pay.";
            }
            // LOCATION
            else if (input.includes("location") || input.includes("saan") || input.includes("address") || input.includes("اين")) {
                reply_text = "📍 *LOCATION*\nQQXP+G9V, Ishbiliyah, Riyadh 13251\n🌐 hotcola.net\n\nموقعنا في حي إشبيلية. الخدمة داخل المشغل فقط.";
            }
            // DEFAULT ESCALATION (966560958973)
            else {
                reply_text = "I'm sorry, I didn't quite catch that. For more info or booking, please chat here:\n\n👉 https://wa.me/966560958973\n\n------------------\n\nعذراً، لم أفهم طلبك جيداً. للمزيد من التفاصيل، يرجى التواصل هنا:\n\n👉 https://wa.me/966560958973";
            }

            // SEND MESSAGE
            await axios({
                method: "POST",
                url: `https://graph.facebook.com/v18.0/${phone_number_id}/messages?access_token=${PAGE_ACCESS_TOKEN}`,
                data: { messaging_product: "whatsapp", to: from, text: { body: reply_text } },
                headers: { "Content-Type": "application/json" },
            });
        }
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(500);
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Sweet Cola Final Bot Running on ${PORT}`));
