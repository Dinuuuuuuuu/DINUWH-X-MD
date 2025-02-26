const config = require('../config');
const { cmd } = require('../command');
const fetch = require('node-fetch');

cmd({
    pattern: "ytmp3",
    category: "downloader",
    react: "🎧",
    desc: "Download YouTube audios as MP3",
    filename: __filename
},
async (conn, mek, m, { from, quoted, q, reply }) => {
    try {
        if (!q) return await reply('❌ Please provide a YouTube video URL or song name.');

        const url = encodeURIComponent(q);
        const response = await fetch(`https://dark-shan-yt.koyeb.app/download/ytmp3?url=${url}`);
        const data = await response.json();

        if (!data.status) return await reply('⚠️ Failed to fetch audio details. Please check the URL and try again.');

        const audio = data.data;
        const message = `
🎶 *YouTube MP3 Downloader* 📥

🎵 *Title:* ${audio.title}
🕒 *Duration:* ${audio.timestump || 'N/A'}
📅 *Uploaded:* ${audio.ago || 'N/A'}
👁 *Views:* ${audio.views || 'N/A'}
👍 *Likes:* ${audio.likes || 'N/A'}
📎 *URL:* ${q}
`;

        // Send thumbnail with details
        await conn.sendMessage(from, {
            image: { url: audio.thumbnail },
            caption: message
        });

        // Send audio as a document
        await conn.sendMessage(from, {
            document: { url: audio.download },
            mimetype: 'audio/mp3',
            fileName: `${audio.title}.mp3`,
            caption: `Downloaded by *DINUWH MD*`
        });

        // React success ✅
        await conn.sendMessage(from, {
            react: { text: '✅', key: mek.key }
        });

    } catch (e) {
        console.error(e);
        await reply(`📕 An error occurred: ${e.message}`);
    }
});
