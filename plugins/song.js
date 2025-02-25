const { cmd } = require('../command')
const yts = require('yt-search')
const axios = require('axios')

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

        // If input is not a YouTube link, search YouTube
        if (!q.includes('youtube.com') && !q.includes('youtu.be')) {
            const searchResults = await yts(q)
            if (!searchResults.videos.length) return reply('No results found!')
            const data = searchResults.videos[0]
            videoUrl = data.url

            let msg = `🎵 *YT SONG DOWNLOADER* 🎵\n\n📌 *Title:* ${data.title}\n⏱ *Duration:* ${data.timestamp}\n📅 *Uploaded:* ${data.ago}\n📺 *Views:* ${data.views}\n🎤 *Channel:* ${data.author.name}\n🔗 *URL:* ${data.url}`

            await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: msg }, { quoted: mek })
        }

        const audioUrl = `${downlink}${encodeURIComponent(videoUrl)}`

        // Download & Send Audio
        const response = await axios.get(audioUrl, { responseType: 'arraybuffer' })
        if (!response.data) return reply('Download failed!')

        await conn.sendMessage(from, { audio: response.data, mimetype: "audio/mp3" }, { quoted: mek })

    } catch (e) {
        console.log(e)
        reply('Error downloading the song. Check the input and try again!')
    }
})
