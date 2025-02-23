const { cmd, commands } = require('../command'); const { fetchJson } = require('../lib/functions'); const yts = require('yt-search');

const apiUrl = 'https://ytthama.vercel.app/mp4?url=';

cmd({ pattern: 'video', alias: ["vplay"], desc: 'Download YouTube Videos', use: '.video <YouTube Title or URL>', react: "📹", category: 'media', filename: __filename }, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }) => { try { if (!q) return reply('❌ Please provide a valid YouTube title or URL!');

const yt = await yts(q);
    const ytsResult = yt.videos[0];
    const videoUrl = ytsResult.url;
    
    const ytdl = await fetchJson(`${apiUrl}${videoUrl}`);
    if (!ytdl.success) return reply('❌ Unable to fetch video. Please try again later.');

    const videoTitle = ytsResult.title;
    const videoAuthor = ytsResult.author.name;
    const videoViews = ytsResult.views;
    const videoDuration = ytsResult.timestamp;
    const videoThumbnail = ytsResult.thumbnail;

    let desc = `◈     *DINUWH MD VIDEO DOWNLOADER*     ◈

┌─────────────────── ├ ℹ️ `Title:` ${videoTitle} ├ 👤 `Author:` ${videoAuthor} ├ 👁️‍🗨️ `Views:` ${videoViews} ├ 🕘 `Duration:` ${videoDuration} ├ 🔗 `Url:` ${videoUrl} └───────────────────

> Downloading video...`;



const msg = await conn.sendMessage(from, { image: { url: videoThumbnail }, caption: desc }, { quoted: mek });

    // Sending video
    await conn.sendMessage(from, { video: { url: ytdl.video }, caption: `> *Powered by DINUWH MD Video Downloader*`, mimetype: 'video/mp4' }, { quoted: msg });

    await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
} catch (e) {
    console.error(e);
    await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    reply('❌ An error occurred while processing your request.');
}

});

