const { cmd } = require('../command')
const yts = require('yt-search')
const { fetchJson } = require('../lib/functions')

const downlink = 'https://manul-ofc-ytdl-paid-30a8f429a0a6.herokuapp.com/download/audio?url='

cmd({
    pattern: "song",
    desc: "Download songs from YouTube",
    category: "download",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply('Give me a song name or YouTube URL!')

        let videoUrl = q

        // If input is not a direct YouTube link, search YouTube
        if (!q.includes('youtube.com') && !q.includes('youtu.be')) {
            const searchResults = await yts(q)
            if (!searchResults.videos.length) return reply('No results found!')
            videoUrl = searchResults.videos[0].url
        }

        const audioUrl = `${downlink}${encodeURIComponent(videoUrl)}`
        
        let message = `🎵 YT SONG DOWNLOADER 🎵

📎 URL: ${videoUrl}
🎧 Downloading your song...`

        await conn.sendMessage(from, { text: message }, { quoted: mek })

        // Send audio as document
        await conn.sendMessage(from, { document: { url: audioUrl }, mimetype: "audio/mp3", fileName: "song.mp3", caption: "Here is your song!" }, { quoted: mek })

    } catch (e) {
        console.log(e)
        reply('Error downloading the song. Check the input and try again!')
    }
})
