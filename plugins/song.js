const { cmd, commands } = require("../command");
const yts = require("yt-search");
const { ytmp3 } = require("@zulproject/ytdl");

cmd(
{
    pattern: "song",
    alias: "ytmp3",
    react: "🎵",
    desc: "Download Song",
    category: "download",
    filename: __filename,
},
async (
    robin,
    mek,
    m,
    {
        from,
        quoted,
        q,
        reply,
    }
) => {
    try {
        if (!q) return reply("🔍 *නමක් හරි ලින්ක් එකක් හරි දෙන්න!*");

        // YouTube Video Search  
        const search = await yts(q);
        if (!search.videos.length) return reply("❌ *Video not found!*");

        const data = search.videos[0];
        const url = data.url;

        // Song metadata description  
        let desc = `🎵 *DINUWH MD Song Downloader* 🎵
━━━━━━━━━━━━━━━━━━━━━
🎶 *Title:* ${data.title}
⏳ *Duration:* ${data.timestamp}
📅 *Uploaded:* ${data.ago}
👀 *Views:* ${data.views}
🔗 *Listen Here:* ${data.url}
━━━━━━━━━━━━━━━━━━━━━
⏳ *Fetching & Downloading...*`;

        // Send metadata message  
        await robin.sendMessage(from, { text: desc }, { quoted: mek });

        // Download song using @zulproject/ytdl  
        const quality = "128";  
        const songData = await ytmp3(url, quality);

        if (!songData || !songData.download) {
            return reply("❌ *Failed to download the song!*");
        }

        // Validate song duration (limit: 30 min)  
        let durationParts = data.timestamp.split(":").map(Number);
        let totalSeconds =
            durationParts.length === 3
                ? durationParts[0] * 3600 + durationParts[1] * 60 + durationParts[2]
                : durationParts[0] * 60 + durationParts[1];

        if (totalSeconds > 1800) {
            return reply("⏱️ *Audio limit is 30 minutes!*");
        }

        // **Send as Normal Audio File**  
        await robin.sendMessage(from, { audio: { url: songData.download }, mimetype: "audio/mpeg" }, { quoted: mek });

        // **Send as a Voice Note (PTT)**  
        await robin.sendMessage(from, { audio: { url: songData.download }, mimetype: "audio/mpeg", ptt: true }, { quoted: mek });

        return reply("✅ *Download complete! Enjoy your song!*");

    } catch (e) {
        console.error(e);
        reply(`❌ *Error:* ${e.message}`);
    }
}
);
