const { cmd } = require('../command');
const fetch = require("node-fetch");
const ytsearch = require("yt-search");
const apiUrl = `https://manul-official-api-site-2025-bc8a57492a5f.herokuapp.com/ytmp3-fix?url`
cmd({ 
    pattern: "song", 
    alias: ["audio", "mp3"], 
    react: "🎵", 
    desc: "Download YouTube audio", 
    category: "download", 
    use: '.song <YouTube URL or Name>', 
    filename: __filename 
}, async (conn, mek, m, { from, q, reply }) => { 
    try { 
        if (!q) return await reply("⚠️ Please provide a YouTube URL or song name!");

        const yt = await ytsearch(q);
        if (!yt.videos.length) return reply("❌ No results found!");

        let yts = yt.videos[0];  
        let apiUrl = `https://manul-official-api-site-2025-bc8a57492a5f.herokuapp.com/ytmp3-fix?url=${encodeURIComponent(yts.url)}`;

        let response = await fetch(apiUrl);
        let data = await response.json();

        if (!data || !data.status || !data.result || !data.result.download_url) {
            return reply("⚠️ Failed to fetch the audio. Please try again later.");
        }

        let audioUrl = data.result.download_url;
        let caption = `🎵 *Title:* ${yts.title}\n⏱️ *Duration:* ${yts.timestamp}\n👀 *Views:* ${yts.views}\n👤 *Author:* ${yts.author.name}\n🔗 *Link:* ${yts.url}\n\n*🤖 Powered by DINUWH MD*`;

        await conn.sendMessage(from, { image: { url: yts.thumbnail || '' }, caption }, { quoted: mek });
        await conn.sendMessage(from, { audio: { url: audioUrl }, mimetype: "audio/mpeg", ptt: false }, { quoted: mek });

        await reply("✅ *Download complete!*");

    } catch (e) {
        console.error(e);
        reply("❌ An error occurred. Please try again later.");
    }
});

module.exports = { cmd };
