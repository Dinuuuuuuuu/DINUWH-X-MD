const { cmd } = require('../command')
const fetch = require("node-fetch");
const ytsearch = require("yt-search");

cmd({ 
    pattern: "video2", 
    alias: ["video", "play"], 
    react: "🎥", 
    desc: "Download Youtube song", 
    category: "download", 
    use: '.song < Yt url or Name >', 
    filename: __filename 
}, async (conn, mek, m, { from, prefix, quoted, q, reply }) => { 
    try { 
        if (!q) return await reply("⚠️ Please provide a YouTube URL or song name!");

        // Try first with direct URL info
        let videoInfo, downloadData;
        if (q.includes('youtu.be') || q.includes('youtube.com')) {
            videoInfo = await fetch(`https://manul-ofc-ytdl-paid-30a8f429a0a6.herokuapp.com/video-info?url=${encodeURIComponent(q)}`).then(res => res.json());
            downloadData = await fetch(`https://manul-ofc-ytdl-paid-30a8f429a0a6.herokuapp.com/download/video?url=${encodeURIComponent(q)}`).then(res => res.json());
        }

        // If direct URL fails or search term provided, use ytsearch
        if (!videoInfo?.status) {
            const yt = await ytsearch(q);
            if (yt.results.length < 1) return reply("❌ No results found!");
            
            let yts = yt.results[0];
            videoInfo = await fetch(`https://manul-ofc-ytdl-paid-30a8f429a0a6.herokuapp.com/video-info?url=${encodeURIComponent(yts.url)}`).then(res => res.json());
            downloadData = await fetch(`https://manul-ofc-ytdl-paid-30a8f429a0a6.herokuapp.com/download/video?url=${encodeURIComponent(yts.url)}`).then(res => res.json());
        }

        if (!videoInfo?.status || !downloadData?.status) {
            return reply("⚠️ Failed to fetch the video. Please try again later.");
        }

        let ytmsg = `╭━━━〔 *🌟 DIDULA MD V2 🌟* 〕━━━┈⊷
┃▸╭─────────────────
┃▸┃ 📽️ *VIDEO DOWNLOADER*
┃▸└─────────────────···
╰──────────────────────┈⊷
╭━━❐━⪼
┇📌 *Title:* ${videoInfo.title}
┇⏱️ *Duration:* ${videoInfo.duration}s
┇👀 *Views:* ${videoInfo.views}
┇👤 *Author:* ${videoInfo.creator}
┇📅 *Uploaded:* ${videoInfo.uploaded}
┇🔗 *Link:* ${videoInfo.url}
╰━━❑━⪼

*💫 Quality Video Downloader By Didula MD V2*`;

        await conn.sendMessage(from, { image: { url: videoInfo.thumbnail }, caption: ytmsg }, { quoted: mek });
        await conn.sendMessage(from, { video: { url: downloadData.downloadUrl }, mimetype: "video/mp4" }, { quoted: mek });
        await conn.sendMessage(from, { 
            document: { url: downloadData.downloadUrl }, 
            mimetype: "video/mp4", 
            fileName: `${videoInfo.title}.mp4`, 
            caption: `🎥 *${videoInfo.title}*\n\n*🌟 Created By:* Didula Rashmika\n*🤖 Bot:* Didula MD V2`
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ An error occurred. Please try again later.");
    }
});  

cmd({ 
     pattern: "song2", 
     alias: ["ytdl3", "yta"], 
     react: "🎵", 
     desc: "Download Youtube song",
     category: "download", 
     use: '.song < Yt url or Name >', 
     filename: __filename 
}, async (conn, mek, m, { from, prefix, quoted, q, reply }) => { 
    try { 
        if (!q) return await reply("⚠️ Please provide a YouTube URL or song name!");

        // Try first with direct URL info
        let videoInfo, audioData;
        if (q.includes('youtu.be') || q.includes('youtube.com')) {
            videoInfo = await fetch(`https://manul-ofc-ytdl-paid-30a8f429a0a6.herokuapp.com/video-info?url=${encodeURIComponent(q)}`).then(res => res.json());
            audioData = await fetch(`https://manul-ofc-ytdl-paid-30a8f429a0a6.herokuapp.com/download/audio?url=${encodeURIComponent(q)}`).then(res => res.json());
        }

        // If direct URL fails or search term provided, use ytsearch
        if (!videoInfo?.status) {
            const yt = await ytsearch(q);
            if (yt.results.length < 1) return reply("❌ No results found!");
            
            let yts = yt.results[0];
            videoInfo = await fetch(`https://manul-ofc-ytdl-paid-30a8f429a0a6.herokuapp.com/video-info?url=${encodeURIComponent(yts.url)}`).then(res => res.json());
            audioData = await fetch(`https://manul-ofc-ytdl-paid-30a8f429a0a6.herokuapp.com/download/audio?url=${encodeURIComponent(yts.url)}`).then(res => res.json());
        }

        if (!videoInfo?.status || !audioData?.status) {
            return reply("⚠️ Failed to fetch the audio. Please try again later.");
        }

        let ytmsg = `╭━━━〔 *🌟 DIDULA MD V2 🌟* 〕━━━┈⊷
┃▸╭─────────────────
┃▸┃ 🎵 *MUSIC DOWNLOADER*
┃▸└─────────────────···
╰──────────────────────┈⊷
╭━━❐━⪼
┇🎧 *Title:* ${videoInfo.title}
┇⏱️ *Duration:* ${videoInfo.duration}s
┇👀 *Views:* ${videoInfo.views}
┇👤 *Author:* ${videoInfo.creator}
┇📅 *Uploaded:* ${videoInfo.uploaded}
┇🔗 *Link:* ${videoInfo.url}
╰━━❑━⪼

*💫 High Quality Audio By Didula MD V2*`;

        await conn.sendMessage(from, { image: { url: videoInfo.thumbnail }, caption: ytmsg }, { quoted: mek });
        await conn.sendMessage(from, { audio: { url: audioData.downloadUrl }, mimetype: "audio/mpeg" }, { quoted: mek });
        await conn.sendMessage(from, { 
            document: { url: audioData.downloadUrl }, 
            mimetype: "audio/mpeg", 
            fileName: `${videoInfo.title}.mp3`, 
            caption: `🎵 *${videoInfo.title}*\n\n*🌟 Created By:* Didula Rashmika\n*🤖 Bot:* Didula MD V2`
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ An error occurred. Please try again later.");
    }
});
