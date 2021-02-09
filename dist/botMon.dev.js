"use strict";

var Discord = require("discord.js");

var _require = require("./config.json"),
    prefix = _require.prefix,
    token = _require.token;

var ytdl = require("ytdl-core");

var rp = require('request-promise');

var $ = require('cheerio');

var youtube = require('scrape-youtube')["default"];

var client = new Discord.Client();
var queue = new Map();
client.once("ready", function () {
  console.log("Ready!");
});
client.once("reconnecting", function () {
  console.log("Reconnecting!");
});
client.once("disconnect", function () {
  console.log("Disconnect!");
});
client.on("message", function _callee(message) {
  var serverQueue;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (message.content === 'ม่อน') message.channel.send("ว่าไงเหล่าโนบิตะ");

          if (!message.author.bot) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return");

        case 3:
          if (message.content.startsWith(prefix)) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return");

        case 5:
          serverQueue = queue.get(message.guild.id);

          if (!message.content.startsWith("".concat(prefix, "play"))) {
            _context.next = 11;
            break;
          }

          execute(message, serverQueue);
          return _context.abrupt("return");

        case 11:
          if (!message.content.startsWith("".concat(prefix, "skip"))) {
            _context.next = 16;
            break;
          }

          skip(message, serverQueue);
          return _context.abrupt("return");

        case 16:
          if (!message.content.startsWith("".concat(prefix, "stop"))) {
            _context.next = 19;
            break;
          }

          stop(message, serverQueue);
          return _context.abrupt("return");

        case 19:
        case "end":
          return _context.stop();
      }
    }
  });
});

function execute(message, serverQueue) {
  var args, voiceChannel, permissions, songInfo, song, queueContruct, connection;
  return regeneratorRuntime.async(function execute$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          args = message.content.split(" ");
          console.log(args);
          voiceChannel = message.member.voice.channel;

          if (voiceChannel) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", message.channel.send("You need to be in a voice channel to play music!"));

        case 5:
          permissions = voiceChannel.permissionsFor(message.client.user);

          if (!(!permissions.has("CONNECT") || !permissions.has("SPEAK"))) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", message.channel.send("I need the permissions to join and speak in your voice channel!"));

        case 8:
          _context2.next = 10;
          return regeneratorRuntime.awrap(ytdl.getInfo(args[1]));

        case 10:
          songInfo = _context2.sent;
          song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url
          }; // try {
          //   songInfo = await ytdl.getInfo(args[1])  
          //   song = {
          //     title: songInfo.videoDetails.title,
          //     url: songInfo.videoDetails.video_url,
          //   };
          // } catch (error) {
          //   var ur = ""
          //   youtube.search(args[1]).then(results => {
          //     console.log(results.videos[0].link);
          //     ur = results.videos[0].link
          //   });
          //   console.log(ur);
          //   console.log(ur);
          //   songInfo = await ytdl.getInfo(ur)  
          //   song = {
          //     title: songInfo.videoDetails.title,
          //     url: songInfo.videoDetails.video_url,
          //   };
          // }
          // songInfo = await ytdl.getInfo(args[1])  
          // const song = {
          //   title: songInfo.videoDetails.title,
          //   url: songInfo.videoDetails.video_url,
          // };    

          if (serverQueue) {
            _context2.next = 31;
            break;
          }

          queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
          };
          queue.set(message.guild.id, queueContruct);
          queueContruct.songs.push(song);
          _context2.prev = 16;
          _context2.next = 19;
          return regeneratorRuntime.awrap(voiceChannel.join());

        case 19:
          connection = _context2.sent;
          queueContruct.connection = connection;
          play(message.guild, queueContruct.songs[0]);
          _context2.next = 29;
          break;

        case 24:
          _context2.prev = 24;
          _context2.t0 = _context2["catch"](16);
          console.log(_context2.t0);
          queue["delete"](message.guild.id);
          return _context2.abrupt("return", message.channel.send(_context2.t0));

        case 29:
          _context2.next = 33;
          break;

        case 31:
          serverQueue.songs.push(song);
          return _context2.abrupt("return", message.channel.send("".concat(song.title, " has been added to the queue!")));

        case 33:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[16, 24]]);
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel) return message.channel.send("You have to be in a voice channel to stop the music!");
  if (!serverQueue) return message.channel.send("There is no song that I could skip!");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel) return message.channel.send("โนบิตะไม่ได้อยู่ในห้องพูด!");
  if (!serverQueue) return message.channel.send("ไม่เห็นมีเพลงให้ม่อนปิด!");
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  try {
    var serverQueue = queue.get(guild.id);

    if (!song) {
      serverQueue.voiceChannel.leave();
      queue["delete"](guild.id);
      return;
    }

    var dispatcher = serverQueue.connection.play(ytdl(song.url)).on("finish", function () {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    }).on("error", function (error) {
      return console.error(error);
    });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send("\u0E21\u0E48\u0E2D\u0E19\u0E01\u0E33\u0E25\u0E31\u0E07\u0E40\u0E25\u0E48\u0E19: **".concat(song.title, "**"));
  } catch (error) {
    message.channel.send("โนบิตะส่งเป็น url ได้ไหมม");
  }
}

client.login(token);