const fetch = require('node-fetch');
const ytsearch = require('yt-search');

cmd({ 
    pattern: "video", 
    alias: ["video2", "play"], 
    react: "🎥", 
    desc: "Download YouTube video", 
    category: "main", 
    use: '.video <YouTube URL or Name>', 
    filename: __filename 
}, async (conn, mek, m, { from, prefix, quoted, q, reply }) => { 
    try { 
        if (!q) return await reply("⚠️ Please provide a YouTube URL or video name!");

        const yt = await ytsearch(q);
        if (!yt || yt.results.length < 1) return reply("❌ No results found!");

        let yts = yt.results[0];  
        let apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(yts.url)}`;

        let response = await fetch(apiUrl);
        let data = await response.json();

        if (!data || data.status !== 200 || !data.success || !data.result.download_url) {
            return reply("⚠️ Failed to fetch the video. Please try again later.");
        }

        let ytmsg = `╭━━━〔 *🌟 DINUWH MD 🌟* 〕━━━┈⊷
┃▸╭─────────────────
┃▸┃ 📽️ *VIDEO DOWNLOADER*
┃▸└─────────────────···
╰──────────────────────┈⊷
╭━━❐━⪼
┇📌 *Title:* ${yts.title}
┇⏱️ *Duration:* ${yts.timestamp}
┇👀 *Views:* ${yts.views}
┇👤 *Author:* ${yts.author.name}
┇🔗 *Link:* ${yts.url}
╰━━❑━⪼

*💫 Quality Video Downloader By DINUWH MD*`;

        // Send Thumbnail & Info
        await conn.sendMessage(from, { 
            image: { url: data.result.thumbnail || '' }, 
            caption: ytmsg 
        }, { quoted: mek });

        // Send Video
        await conn.sendMessage(from, { 
            video: { url: data.result.download_url }, 
            mimetype: "video/mp4" 
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("❌ An error occurred. Please try again later.");
    }
});
