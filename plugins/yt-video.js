const { cmd } = require('../command')
const { fetchJson } = require('../lib/functions')

const searchlink = 'https://dark-yasiya-api.site' 
const downlink = 'https://dark-shan-yt.koyeb.app/download'


cmd({
    pattern: "video",
    desc: "download videos.",
    category: "download",
    react: "📸",
    filename: __filename
},
async(conn, mek, m,{from, reply, q}) => {
try{

if(!q) return reply('Give me song name or url !')
    
const search = await fetchJson(`${searchlink}/search/yt?q=${q}`)
const data = search.result.data[0];
const url = data.url
    
const ytdl = await fetchJson(`${downlink}/ytmp3?url=${data.url}` + '&quality=3' )
    
let message = `‎‎📽️🎶🔥 YT VIDEO DOWNLOADER 🔥🎶📽️  

╭━━━━━━━━━━━━━━━━━━━━━╮  
┃ 🎵 Title: ${data.title}  
┃ ⏳ Duration: ${data.timestamp}  
┃ 📅 Uploaded: ${data.ago}  
┃ 👁️ Views: ${data.views}  
┃ 🎭 Creator: ${data.author.name}  
┃ 🔗 Watch & Download: ${data.url}  
╰━━━━━━━━━━━━━━━━━━━━━╯  

🚀 Fast ⚡ Secure 🔐 HD Quality 🎥  

╭═════════════════════╮  
║ 🔰 POWERED BY DINUWH MD 🔰  
║ 🔥 MADE BY DINUWH MD 🔥  
╰═════════════════════╯  

📥 **Download Now & Enjoy!** 🎶  

━━━━━━━━━━━━━━━━━━━━━  
📢 **Support Channel** 📢  
🔗 [Join Now]
(https://whatsapp.com/channel/0029Vat7xHl7NoZsrUVjN844)  

📹 **Status Video Uploader Channel** 📹  
🔗 (https://whatsapp.com/channel/0029VaxVCPi96H4VOKai4S3s)  
━━━━━━━━━━━━━━━━━━━━━`
  
await conn.sendMessage(from, { image: { url : data.thumbnail }, caption: message }, { quoted : mek })
  
// SEND VIDEO NORMAL TYPE and DOCUMENT TYPE
await conn.sendMessage(from, { video: { url: ytdl.data.download }, mimetype: "video/mp4" }, { quoted: mek })
await conn.sendMessage(from, { document: { url: ytdl.data.download }, mimetype: "video/mp4", fileName: data.title + ".mp3", caption: `${data.title}`}, { quoted: mek })
  
} catch(e){
console.log(e)
reply(e)
}
})
