const { Telegraf } = require('telegraf');
const dotenv = require('dotenv');

dotenv.config();
const bot = new Telegraf(process.env.TELEGRAM_BOT_API_KEY);
const port = 3005;
const domain = process.env.RENDER_EXTERNAL_URL ? process.env.RENDER_EXTERNAL_URL : 'https://reject-modernity-bot.onrender.com';

const dictionaryMap = new Map([
    ['понедельник', {name: 'monday', length: 3}],
    ['вторник',  {name: 'tuesday', length: 3}],
    ['сред',  {name: 'wednesday', length: 4}],
    ['четверг',  {name: 'thursday', length: 3}],
    ['пятниц',  {name: 'friday', length: 3}],
    ['суббот',  {name: 'saturday', length: 2}],
    ['воскресень',  {name: 'sunday', length: 3}],
    ['праздник',  {name: 'holiday', length: 1}],
    ['харош',  {name: 'chad', length: 1}],
]);

const getRandomNumber = (n) => {
    if (!n) return 1
    return Math.floor(Math.random() * n) + 1;
}

bot.on('message', (ctx) => {
    const message = ctx.message.text ? ctx?.message?.text?.toLowerCase() : ctx?.message?.caption?.toLowerCase();
    const msg = message ?? '';

    for (let [key, value] of dictionaryMap.entries()) {
        if (msg.includes(key)) {
            try{
                const filePath = `public/videos/${value.name}-${getRandomNumber(value.length)}.mp4`;

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