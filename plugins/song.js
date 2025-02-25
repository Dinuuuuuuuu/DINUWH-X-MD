const { cmd } = require('../command');
const fetch = require("node-fetch");
const ytsearch = require("yt-search");

cmd({ 
    pattern: "mp3", 
    alias: ["audio", "song"], 
    react: "🎵", 
    desc: "Download YouTube audio", 
    category: "download", 
    use: '.mp3 < Yt URL or Name >', 
    filename: __filename 
}, async (conn, mek, m, { from, prefix, quoted, q, reply }) => { 
    try { 
        if (!q) return await reply("⚠️ Please provide a YouTube URL or song name!");

        const yt = await ytsearch(q);
        if (yt.results.length < 1) return reply("❌ No results found!");

        let yts = yt.results[0];  
        let apiUrl = `https://manul-ofc-api-site-afeb13f3dabf.herokuapp.com/ytmp3-fix?url=${encodeURIComponent(yts.url)}`;

        let response = await fetch(apiUrl);
        let data = await response.json();

        if (data.status !== 200 || !data.success || !data.result.download_url) {
            return reply("⚠️ Failed to fetch the audio. Please try again later.");
        }

        let ytmsg = `╭━━━〔 *🌟 DINUWH MD 🌟* 〕━━━┈⊷
┃▸╭─────────────────
┃▸┃ 🎵 *AUDIO DOWNLOADER*
┃▸└─────────────────···
╰──────────────────────┈⊷
╭━━❐━⪼
┇📌 *Title:* ${yts.title}
┇⏱️ *Duration:* ${yts.timestamp}
┇👀 *Views:* ${yts.views}
┇👤 *Author:* ${yts.author.name}
┇🔗 *Link:* ${yts.url}
╰━━❑━⪼

*💫 Quality Audio Downloader By DINUWH MD*`;

        await conn.sendMessage(from, { image: { url: data.result.thumbnail || '' }, caption: ytmsg }, { quoted: mek });
        await conn.sendMessage(from, { 
            audio: { url: data.result.download_url }, 
            mimetype: "audio/mp4", 
            ptt: false 
        }, { quoted: mek });

        await conn.sendMessage(from, { 
            document: { url: data.result.download_url }, 
            mimetype: "audio/mp4", 
            fileName: `${data.result.title}.mp3`, 
            caption: `🎵 *${yts.title}*\n\n*🌟 Created By:* DINUWH\n*🤖 Bot:* DINUWH MD`
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ An error occurred. Please try again later.");
    }
});
