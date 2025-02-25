const { cmd } = require("../command");
const { fetchJson } = require("../lib/functions");
const yts = require('yt-search');
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

        // **Fetch MP3 from Custom API**
        let apiUrl = `https://manul-ofc-ytdl-paid-30a8f429a0a6.herokuapp.com/download/audio?url=${url}`;
        let response = await axios.get(apiUrl);
        
        if (!response.data || !response.data.result || !response.data.result.audio) {
            return reply('❌ *Failed to fetch the MP3 file. Try again later.*');
        }

        let downloadUrl = response.data.result.audio;

        // **Send Audio File**
        await conn.sendMessage(from, { 
            audio: { url: downloadUrl }, 
            mimetype: 'audio/mpeg',
            caption: `*🎶 Enjoy your song!*`
        }, { quoted: mek });

        // **Send as Document**
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
