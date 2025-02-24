const { cmd } = require('../command')
const { fetchJson } = require('../lib/functions')

const searchlink = 'https://suhas-bro-apii.vercel.app/' 
const downlink = 'https://suhas-bro-apii.vercel.app/video?q='


cmd({
    pattern: "video2",
    desc: "download videos.",
    category: "download",
    react: "📸",
    filename: __filename
},
async(conn, mek, m,{from, reply, q}) => {
try{

if(!q) return reply('*නමක් හරි url එකක් හරි දියම් 🥱"* !')
    
const search = await fetchJson(`${searchlink}/search/yt?q=${q}`)
const data = search.result.data[0];
const url = data.url
    
const ytdl = await fetchJson(`${downlink}/ytmp3?url=${data.url}` + '&quality=3' )
    
let message = `*⛶𝙳𝙸𝙽𝚄𝚆𝙷 𝙼𝙳 𝚈𝚃 𝚅𝙸𝙳𝙴𝙾 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁⛶*
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
