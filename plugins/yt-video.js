const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');
const yts = require('yt-search');

const videoInfoAPI = "https://manul-ofc-ytdl-paid-30a8f429a0a6.herokuapp.com/video-info?url=";
const downloadAPI = "https://manul-ofc-ytdl-paid-30a8f429a0a6.herokuapp.com/download/video?url=";

cmd({
    pattern: 'video',
    alias: ["vplay"],
    desc: 'Download YouTube Videos',
    use: '.video <YouTube Title or URL>',
    react: "📹",
    category: 'media',
    filename: __filename,
    async handle({ msg, conn, args }) {
        if (args.length < 1) {
            return msg.reply('Please provide a YouTube title or URL!');
        }

        const query = args.join(' ');

        // Search for the video based on the provided query
        const videoSearch = await yts(query);
        if (!videoSearch || !videoSearch.all.length) {
            return msg.reply('No results found!');
        }

        const video = videoSearch.all[0];
        const videoUrl = video.url;
        const videoTitle = video.title;

        try {
            // Fetch video info
            const videoInfo = await fetchJson(videoInfoAPI + encodeURIComponent(videoUrl));
            if (!videoInfo) {
                return msg.reply('Failed to fetch video details.');
            }

            // Fetch download links
            const downloadLinks = await fetchJson(downloadAPI + encodeURIComponent(videoUrl));
            if (!downloadLinks || !downloadLinks.download) {
                return msg.reply('Failed to fetch download links.');
            }

            // Send download link to the user
            const downloadLink = downloadLinks.download;
            return msg.reply(`Here is the download link for *${videoTitle}*:\n${downloadLink}`);
        } catch (err) {
            return msg.reply('Something went wrong while processing your request.');
        }
    }
});
