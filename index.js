const { Telegraf } = require('telegraf');
const dotenv = require('dotenv');

dotenv.config();
const bot = new Telegraf(process.env.TELEGRAM_BOT_API_KEY);
const port = 3005;
const domain = process.env.RENDER_EXTERNAL_URL ? process.env.RENDER_EXTERNAL_URL : 'https://reject-modernity-bot.onrender.com';

const dictionaryMap = new Map([
    ['понедельник', 'monday'],
    ['вторник', 'tuesday'],
    ['сред', 'wednesday'],
    ['четверг', 'thursday'],
    ['пятниц', 'friday'],
    ['суббот', 'saturday'],
    ['воскресень', 'sunday'],
    ['праздник', 'holiday'],
]);

bot.on('message', (ctx) => {
    const message = ctx.message.text ? ctx?.message?.text?.toLowerCase() : ctx?.message?.caption?.toLowerCase();
    const msg = message ?? '';

    for (let [key, value] of dictionaryMap.entries()) {
        if (msg.includes(key)) {
            try{
                const filePath = `public/videos/${value}-1.mp4`;

                ctx.replyWithAnimation({ source: filePath });
                return;
            } catch (e) {
                ctx.reply('Something went wrong...')
            }

        }
    }
});

bot
    .launch({ webhook: { domain, port: port } })
    .then(() => console.log("Webhook bot listening on port", port));