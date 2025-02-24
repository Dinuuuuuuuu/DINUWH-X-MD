const { cmd, commands } = require("../command");
const yts = require("yt-search");
const axios = require("axios");

cmd(
{
pattern: "video",
alias: "ytmp4",
react: "🎬",
desc: "Download Video",
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
body,
isCmd,
command,
args,
q,
isGroup,
sender,
senderNumber,
botNumber2,
botNumber,
pushname,
isMe,
isOwner,
groupMetadata,
groupName,
participants,
groupAdmins,
isBotAdmins,
isAdmins,
reply,
}
) => {
try {
if (!q) return reply("ඔබට වාසනාවන්ත URL එකක් හෝ video නමක් අවශ්‍යයි 🌚❤️");

// Send the query to the plugin
const videoUrl = `https://ytthama.vercel.app/mp4?url=${q}`;
const { data } = await axios.get(videoUrl);

if (!data || !data.url) return reply("❌ Video not found!");

// Generate metadata for the video
let desc = `

⛶ ꜱʜᴀꜱɴɪ-ᴍᴅ ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴀᴅ ⛶
✇━━━━━━━━━━━━━━━━━━━━✇

⛛
⛛
⛛
╔═══◈ 🎬 Now Playing... ◈═══╗
═════════════════════

📌 Title:  ${data.title}
✇━━━━━━━━━━━━━━━━━━━
⏳ Duration:  ${data.duration}
✇━━━━━━━━━━━━━━━━━━━
📅 Uploaded:  ${data.uploaded}
✇━━━━━━━━━━━━━━━━━━━
👀 Views:  ${data.views}
✇━━━━━━━━━━━━━━━━━━━
🔗 Watch Here:  ${data.url}
✇━━━━━━━━━━━━━━━━━━━

╠═══════════════════════════╣
⬇️ Fetching & Downloading...
╚═══════════════════════════╝

🧑‍💻 ꜱʜᴀꜱɴɪ-ᴍᴅ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ 👨‍💻
👨‍💻 ꜱʜᴀꜱɴɪ-ᴍᴅ ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴅᴇɴᴜᴡᴀɴ ᴋᴀᴜꜱʜɪᴋᴀ 👨‍💻
`;

// Send externalAdReply with views under channel name
await robin.sendMessage(
from,
{
text: desc,
contextInfo: {
externalAdReply: {
title: "ꜱʜᴀꜱɴɪ-ᴍᴅ",
body: `👀 Views: ${data.views}`, // Views count below the channel name
thumbnail: { url: data.thumbnail },
sourceUrl: data.url,
mediaType: 1,
renderLargerThumbnail: true,
},
},
},
{ quoted: mek }
);

// Download video
await robin.sendMessage(
from,
{
video: { url: data.url },
mimetype: "video/mp4",
caption: `> ꜱʜᴀꜱɴɪ-ᴍᴅ ʙʏ ᴅᴇɴᴜᴡᴀɴ ᴋᴀᴜꜱʜɪᴋᴀ ❤️`,
},
{ quoted: mek }
);

return reply("✅ Download complete! Enjoy your video!");
} catch (e) {
console.error(e);
reply(`❌ Error: ${e.message}`);
}
}
);
