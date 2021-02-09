const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const ytdl = require("ytdl-core");
const rp = require('request-promise');
const $ = require('cheerio');
const youtube = require('scrape-youtube').default;
youtube.search('เพลงช้า').then(results => {
    // Unless you specify a type, it will only return 'video' results
    console.log(results.videos[0].link); 
});

youtube.search('song', { type: 'playlist' }).then(results => {
    console.log(results.videos);
  })
