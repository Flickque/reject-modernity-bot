const { Telegraf } = require('telegraf');
const dotenv = require('dotenv');

dotenv.config();
const bot = new Telegraf(process.env.TELEGRAM_BOT_API_KEY);

const dictionaryMap = new Map([
    ['понедельник', 'monday'],
    ['вторник', 'tuesday'],
    ['среда', 'wednesday'],
    ['четверг', 'thursday'],
    ['пятница', 'friday'],
    ['суббота', 'saturday'],
    ['воскресенье', 'sunday'],
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

const PORT = process.env.PORT || 3000;

bot.launch({
    webhook: {
        port: PORT
    }
}).then(() => {
    console.log(`Bot is running on port ${PORT}`);
}).catch((err) => {
    console.error('Error starting bot:', err);
});

