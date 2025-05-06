const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async function(event, context) {
    // Check method
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        // Parse request data
        const { name, phone, message } = JSON.parse(event.body);

        const telegramMessage = `
🌟 LEAD с сайта https://liliya-trainer-owner.netlify.app/

👤 Имя: ${name}
📞 Телефон: ${phone}
✉️ Сообщение: ${message}

📆 ${new Date().toLocaleDateString('ru-RU')}
⏰ ${new Date().toLocaleTimeString('ru-RU')}
🌐 Источник: Website`;

        // Get tokens from environment variables
        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        // Send to Telegram
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: telegramMessage,
                parse_mode: 'HTML'
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.description || 'Failed to send message');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
