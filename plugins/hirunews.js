const axios = require('axios');
const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

// 🔥 This plugin is specially customized for DINUWH-MD!  
// ⚠️ Do not sell or modify this plugin!  
// 🚀 Stay connected with DINUWH-MD for more updates!  

cmd({
    pattern: "hirucheck",
    alias: ["hirunews", "newshiru", "hirulk"],
    react: "⭐",
    category: "Hiru News",
    desc: "Fetch the latest news from Hiru API.",
    use: "",
    filename: __filename,
},
    async (conn, mek, m, {
        from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber,
        botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName,
        participants, groupAdmins, isBotAdmins, isAdmins, reply
    }) => {
        try {
            const apiUrl = `https://suhas-bro-apii.vercel.app/hiru`;

            const response = await axios.get(apiUrl);
            const data = response.data;

            if (!data || !data.newsURL || !data.title || !data.image || !data.text) {
                return reply(`🚨 *No news available at the moment!* ❗`);
            }

            const { newsURL, title, image, text, Power } = data;

            let newsInfo = "🌟 *DINUWH-MD | Hiru News Update* 📰\n\n";
            newsInfo += `✨ *Title*: ${title}\n\n`;
            newsInfo += `📑 *Description*:\n${text}\n\n`;
            newsInfo += `🔗 *URL*: www.hirunews.lk\n\n`;
            newsInfo += `🚀 *© Powered By DINUWH 〽️MD*\n\n*${Power}*`;

            if (image) {
                await conn.sendMessage(m.chat, {
                    image: { url: image },
                    caption: newsInfo,
                }, { quoted: m });
            } else {
                await conn.sendMessage(m.chat, { text: newsInfo }, { quoted: m });
            }

        } catch (error) {
            console.error(error);
            reply(`⚠ *An error occurred while fetching news!* ❗`);
        }
    }
);
