const { cmd, commands } = require("../command");
const yts = require("yt-search");
const { fetchJson } = require('../lib/functions')

cmd({ 
    pattern: "video", 
    alias: ["video2", "play"], 
    react: "🎥", 
    desc: "Download Youtube song", 
    category: "main", 
    use: '.song < Yt url or Name >', 
    filename: __filename 
}, async (conn, mek, m, { from, prefix, quoted, q, reply }) => { 
    try { 
        if (!q) return await reply("⚠️ Please provide a YouTube URL or song name!");

        const yt = await ytsearch(q);
        if (yt.results.length < 1) return reply("❌ No results found!");

        let yts = yt.results[0];  
        let apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(yts.url)}`;

        let response = await fetch(apiUrl);
        let data = await response.json();

        if (data.status !== 200 || !data.success || !data.result.download_url) {
            return reply("⚠️ Failed to fetch the video. Please try again later.");
        }

        let ytmsg = `*⛶𝙳𝙸𝙽𝚄𝚆𝙷 𝙼𝙳 𝚈𝚃 𝚅𝙸𝙳𝙴𝙾 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁⛶*
> 📽️🎶🔥✇━━━━━━━━━━━━━━━✇ 🔥🎶📽️  
╭━━━━━━━━━━━━━━━━━━━━━╮  
┃ 🎵 Title: ${data.title}  
┃ ⏳ Duration: ${data.timestamp}  
┃ 📅 Uploaded: ${data.ago}  
┃ 👁️ Views: ${data.views}  
┃ 🎭 Creator: ${data.author.name}  
┃ 🔗 Watch & Download: ${data.url}  
╰━━━━━━━━━━━━━━━━━━━━━╯  

🚀 Fast ⚡ Secure 🔐 HIGH Quality 🎥  
╭═════════════════════╮  
║ 🔰 POWERED BY DINUWH MD 🔰  
║ 🔥 MADE BY DINUW🔥  
╰═════════════════════╯  

📥 **Download Now & Enjoy!** 🎶  

━━━━━━━━━━━━━━━━━━━━━  
📢 **Support Channel** 📢  
🔗 [Join Now]
(https://whatsapp.com/channel/0029Vat7xHl7NoZsrUVjN844)  

📹 **Status Video Uploader Channel** 📹  
🔗 (https://whatsapp.com/channel/0029VaxVCPi96H4VOKai4S3s)  
━━━━━━━━━━━━━━━━━━━━━`;

        await conn.sendMessage(from, { image: { url: data.result.thumbnail || '' }, caption: ytmsg }, { quoted: mek });
        await conn.sendMessage(from, { video: { url: data.result.download_url }, mimetype: "video/mp4" }, { quoted: mek });
        await conn.sendMessage(from, { 
            document: { url: data.result.download_url }, 
            mimetype: "video/mp4", 
            fileName: `${data.result.title}.mp4`, 
            caption: `🎥 *${yts.title}*\n\n*🌟 Created By:* Didula Rashmika\n*🤖 Bot:* Didula MD V2`
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ An error occurred. Please try again later.");
    }
});
