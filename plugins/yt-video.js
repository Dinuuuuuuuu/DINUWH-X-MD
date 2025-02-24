const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');
const yts = require('yt-search');
const axios = require('axios');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');


cmd({
    pattern: "video",
    alias: ["ytvideo", "yt"],
    description: "Download YouTube video in 360p",
    run: async ({ m, args }) => {
        if (!args[0]) return m.reply("🔗 Please provide a YouTube video link!");

        const videoUrl = args[0];
        const apiUrl = `https://manul-ofc-ytdl-paid-30a8f429a0a6.herokuapp.com/download/video?url=${videoUrl}`;
        
        try {
            m.reply("⏳ Downloading video, please wait...");
            
            const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
            const filePath = path.join(__dirname, "temp", `video.mp4`);
            
            fs.writeFileSync(filePath, response.data);
            
            await m.sendMessage(m.chat, { 
                video: fs.readFileSync(filePath), 
                caption: "🎥 Here is your 360p video!" 
            });
            
            fs.unlinkSync(filePath);
        } catch (error) {
            console.error(error);
            m.reply("❌ Failed to download the video!");
        }
    }
});
