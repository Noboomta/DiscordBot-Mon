"use strict";

var Discord = require("discord.js");

var _require = require("./config.json"),
    prefix = _require.prefix,
    token = _require.token;

var ytdl = require("ytdl-core");

var rp = require('request-promise');

var $ = require('cheerio');

var youtube = require('scrape-youtube')["default"];

var a;
youtube.search('ลงใจ').then(function (results) {
  // Unless you specify a type, it will only return 'video' results
  console.log(results.videos[0].link);
  a = results.videos[0].link;
}); // youtube.search('song', { type: 'playlist' }).then(results => {
//     console.log(results.videos);
//   })

console.log(a === "https://youtu.be/8AwyKlXOFZQ");