const {cmd , commands} = require('../command')
const yts = require('yt-search');
const fg = require('api-dylux');
const axios = require('axios');
const { Buffer } = require('buffer');

const GOOGLE_API_KEY = 'AIzaSyDebFT-uY_f82_An6bnE9WvVcgVbzwDKgU'; // Replace with your Google API key
const GOOGLE_CX = '45b94c5cef39940d1'; // Replace with your Google Custom Search Engine ID

// ---------------------- Song Download -----------------------
cmd({
    pattern: 'song',
    desc: 'download songs',
    react: "🎧",
    category: 'download',
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {

      const snm = [2025];
        
        // The quoted message template
        const qMessage = {
            key: {
                fromMe: false,
                participant: "0@s.whatsapp.net",
                remoteJid: "status@broadcast"
            },
            message: {
                orderMessage: {
                    itemCount: snm[Math.floor(Math.random() * snm.length)], // Random selection
                    status: 1,
                    surface: 1,
                    message: `✨ 𝐐𝐮𝐞𝐞𝐧 𝘀𝗮𝗱𝘂 𝗯𝗼𝘁 𝗯𝘆 𝗺𝗿 𝗱𝗶𝗻𝗲𝘀𝗵💗`,
                    orderTitle: "",
                    sellerJid: '94704227534@s.whatsapp.net'
                }
            }
        };
      
        if (!q) return reply('*Please enter a query or a url !*');

        const search = await yts(q);
        const data = search.videos[0];
        const url = data.url;

        let desc = `*🧚‍♂️⃝ QUEEN SADU MD SONG DOWNLOADER 🩷⃟🧚‍♂️*

*|__________________________*
*|-ℹ️ 𝗧𝗶𝘁𝗹𝗲 :* ${data.title}
*|-🕘 𝗧𝗶𝗺𝗲 :* ${data.timestamp}
*|-📌 𝗔𝗴𝗼 :* ${data.ago}
*|-📉 𝗩𝗶𝗲𝘄𝘀 :* ${data.views}
*|-🔗 𝗟𝗶𝗻𝗸 :* ${data.url}
*|__________________________*

*🔢 Reply Below Number :*

*1 Audio File🎶*
*2 Document File📁*

*👨‍💻 Qᴜᴇᴇɴ ꜱᴀᴅᴜ ᴍᴅ 👨‍💻*`;

        const vv = await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const selectedOption = msg.message.extendedTextMessage.text.trim();

            if (msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.stanzaId === vv.key.id) {
                switch (selectedOption) {
                    case '1':
                        let down = await fg.yta(url);
                        let downloadUrl = down.dl_url;
                        await conn.sendMessage(from, { audio: { url:downloadUrl }, caption: '*👨‍💻 Qᴜᴇᴇɴ ꜱᴀᴅᴜ ʙʏ ᴍʀ ᴅɪɴᴇꜱʜ👨‍💻*', mimetype: 'audio/mpeg'},{ quoted: qMessage });
                        break;
                    case '2':               
                        // Send Document File
                        let downdoc = await fg.yta(url);
                        let downloaddocUrl = downdoc.dl_url;
                        await conn.sendMessage(from, { document: { url:downloaddocUrl }, caption: '*👨‍💻 Qᴜᴇᴇɴ ꜱᴀᴅᴜ ʙʏ ᴍʀ ᴅɪɴᴇꜱʜ 👨‍💻*', mimetype: 'audio/mpeg', fileName:data.title + ".mp3"}, { quoted: qMessage });
                        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } })
                        break;
                    default:
                        reply("Invalid option. Please select a valid option🔴");
                }

            }
        });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
        reply('An error occurred while processing your request.');
    }
});

//==================== Video downloader
