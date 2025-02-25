const { cmd } = require('../command')
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: "song",
    alias: ["ytmp3", "ytaudio"],
    desc: "Download audio from YouTube",
    category: "Media",
    usage: ".song <YouTube URL>",
    react: "🎵",
    start: async (bot, m, { text, prefix, pushName }) => {
        if (!text) return m.reply(`🔍 *Usage:* \n\`${prefix}song <YouTube URL>\``);

        console.log(`🎵 ${pushName} used .song command with URL: ${text}`);

        try {
            let apiUrl = `https://manul-ofc-ytdl-paid-30a8f429a0a6.herokuapp.com/download/audio?url=${encodeURIComponent(text)}`;
            console.log(`🔗 API URL: ${apiUrl}`);

            m.reply("⏳ *Downloading... Please wait!*");

            let { data } = await axios.get(apiUrl, { responseType: "arraybuffer" });

            let filePath = path.join(__dirname, "..", "temp", `song_${Date.now()}.mp3`);
            fs.writeFileSync(filePath, data);

            console.log(`✅ Downloaded audio saved at: ${filePath}`);

            await bot.sendMessage(m.from, { audio: fs.readFileSync(filePath), mimetype: "audio/mp4" }, { quoted: m });

            fs.unlinkSync(filePath);
            console.log(`🗑️ Deleted temp file: ${filePath}`);
        } catch (error) {
            console.error("❌ Error downloading audio:", error);
            m.reply("❌ *Failed to download audio. Check the link and try again!*");
        }
    },
};
