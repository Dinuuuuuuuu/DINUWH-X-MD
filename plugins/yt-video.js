const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');
const yts = require('yt-search');

const videoInfoAPI = "https://manul-ofc-ytdl-paid-30a8f429a0a6.herokuapp.com/video-info?url=";
const downloadAPI = "https://manul-ofc-ytdl-paid-30a8f429a0a6.herokuapp.com/download/video?url=";

cmd({
    pattern: 'video',
    alias: ["vplay"],
    desc: 'Download YouTube Videos',
    use: '.video <YouTube Title or URL>',
    react: "📹",
    category: 'media',
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('❌ Please provide a valid YouTube title or URL!');

        // Search for YouTube video
        const yt = await yts(q);
        const ytsResult = yt.videos[0];
        if (!ytsResult) return reply('❌ *No results found!*');

        const videoUrl = ytsResult.url;
        const videoInfo = await fetchJson(`${videoInfoAPI}${videoUrl}`);
        if (!videoInfo.success) return reply('❌ *Failed to fetch video details!*');

        const { title, author, duration, thumbnail, views } = videoInfo;

        let desc = `🎬 *YouTube Video Details:*\n\n📌 *Title:* ${title}\n👤 *Author:* ${author}\n⏳ *Duration:* ${duration}\n👁️ *Views:* ${views}\n🔗 *URL:* ${videoUrl}\n\n> *Select the quality to download!*\n\n1️⃣ *240p*\n2️⃣ *360p*\n3️⃣ *480p*\n4️⃣ *720p*`;

        const vv = await conn.sendMessage(from, { image: { url: thumbnail }, caption: desc }, { quoted: mek });

        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const selectedOption = msg.message.extendedTextMessage.text.trim();
            if (msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.stanzaId === vv.key.id) {
                let videoQuality;
                switch (selectedOption) {
                    case '1️⃣': videoQuality = '240p'; break;
                    case '2️⃣': videoQuality = '360p'; break;
                    case '3️⃣': videoQuality = '480p'; break;
                    case '4️⃣': videoQuality = '720p'; break;
                    default: return reply('❌ Invalid option! Please select 1️⃣, 2️⃣, 3️⃣, or 4️⃣.');
                }

                const videoLink = `${downloadAPI}${videoUrl}&quality=${videoQuality}`;
                await conn.sendMessage(from, { video: { url: videoLink }, caption: `📥 *Downloading in ${videoQuality}...*` }, { quoted: mek });
            }
        });

    } catch (e) {
        console.error(e);
        reply('❌ An error occurred while processing your request.');
    }
});
