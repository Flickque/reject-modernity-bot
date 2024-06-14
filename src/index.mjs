import TelegramBot from 'node-telegram-bot-api'
import cron from 'node-cron'
import { dictionaryMap } from './dictionary.mjs'
import { basicGifPath } from './conts.mjs'

import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

if (!process.env.TELEGRAM_BOT_API_KEY) {
    console.error('TELEGRAM API KEY IS MISSING')
    process.exit(1)
}

const bot = new TelegramBot(process.env.TELEGRAM_BOT_API_KEY, { polling: true })

bot.on('message', async (msg) => {
    const chatId = msg.chat.id
    const messageText = msg.text.toLowerCase()

    for (let [regex, gifName] of dictionaryMap.entries()) {
        if (regex.test(messageText)) {
            await bot.sendAnimation(chatId, `${basicGifPath}/${gifName}-1.mp4`)
            return
        }
    }
})

async function sendDailyGif(chatId) {
    const dayOfWeek = new Date()
        .toLocaleDateString('en-US', {
            weekday: 'long',
            timeZone: 'Europe/Moscow',
        })
        .toLowerCase()

    await bot.sendAnimation(chatId, `${basicGifPath}/${dayOfWeek}-1.mp4`)
}

const chatIds = new Set()

bot.on('new_chat_members', (msg) => {
    const chatId = msg.chat.id
    chatIds.add(chatId)
})

bot.on('left_chat_member', (msg) => {
    const chatId = msg.chat.id
    chatIds.delete(chatId)
})

cron.schedule(
    '0 10 * * *',
    () => {
        chatIds.forEach((chatId) => {
            sendDailyGif(chatId)
        })
    },
    {
        scheduled: true,
        timezone: 'Europe/Moscow',
    }
)

export default bot