const { cmd } = require('../command')
const yts = require('yt-search');
const fg = require('api-dylux');
const axios = require('axios');

cmd({
    pattern: 'song',
    desc: 'Download songs automatically',
    react: "🎧",
    category: 'download',
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('*Please enter a song name or a URL!*');

        const search = await yts(q);
        const data = search.videos[0];
        const url = data.url;

        let desc = `*🎵 SONG DETAILS 🎵*

*🎼 Title:* ${data.title}
*⏳ Duration:* ${data.timestamp}
*📅 Uploaded:* ${data.ago}
*📊 Views:* ${data.views}
*🔗 Link:* ${data.url}

🎧 *Downloading audio...*`;

        await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

        // **Download Audio (MP3)**
        let down = await fg.yta(url);
        let downloadUrl = down.dl_url;
        await conn.sendMessage(from, { 
            audio: { url: downloadUrl }, 
            mimetype: 'audio/mpeg',
            caption: `*🎶 Enjoy your song!*`
        }, { quoted: mek });

        // **Download as Document**
        await conn.sendMessage(from, { 
            document: { url: downloadUrl }, 
            mimetype: 'audio/mpeg',
            fileName: `${data.title}.mp3`,
            caption: `*📁 MP3 File*`
        }, { quoted: mek });

        // Reaction (Success)
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply('*❌ An error occurred while processing your request.*');
    }
});
