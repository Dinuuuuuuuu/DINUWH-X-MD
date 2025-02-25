const { cmd } = require('../command'); // Command Handler
const yts = require('yt-search'); // YouTube Search API
const axios = require('axios'); // HTTP Request Library
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "song",
    desc: "Download songs from YouTube",
    category: "download",
    async handler(m, { conn, text }) {
        if (!text) {
            return m.reply("Please provide a song name!");
        }

        // Searching for the song on YouTube
        const songName = text;
        const results = await yts(songName);

        // If no results found
        if (results && results.videos.length === 0) {
            return m.reply('Sorry, no results found for this song!');
        }

        const songUrl = results.videos[0].url; // Getting the first video URL

        // Prepare the API URL for downloading the song
        const apiUrl = `https://manul-ofc-ytdl-paid-30a8f429a0a6.herokuapp.com/download/audio?url=${encodeURIComponent(songUrl)}`;

        try {
            // Fetch audio file
            const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
            const audioBuffer = Buffer.from(response.data, 'binary');

            // Save audio file
            const audioPath = path.join(__dirname, 'song.mp3');
            fs.writeFileSync(audioPath, audioBuffer);

            // Send the audio to the user
            await conn.sendMessage(m.from, fs.readFileSync(audioPath), 'audio', { mimetype: 'audio/mp4', caption: `Here is your song: ${songName}` });

            // Clean up the saved audio file
            fs.unlinkSync(audioPath);
        } catch (error) {
            console.error('Error downloading song:', error);
            m.reply('Sorry, there was an error downloading the song!');
        }
    }
});
