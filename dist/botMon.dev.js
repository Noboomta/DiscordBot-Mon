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
var random_user_queue = ['364394461775790080', '694073806972518401', '421602435522625548'];
var btext = ["ว้าวซ่า555", "....", "55555555555", "ไปคุยกับแม่ไป", "ชวนแม่ไปด้วยนะ", "อะไร5555555", "อร้ากกกกก", ";-;"];
var btext2 = ["เหงาก็ไปนอนดิ", "ไปคุยกับแม่ไป", "อะไร555555", ";-;"];
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
  var i, lucky_user, serverQueue;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // console.log(message.content);
          if (message.content === 'ม่อน') message.channel.send("ว่าไงเหล่าโนบิตะ"); // if (message.content === 'สมาชิก')  console.log(message);

          if (!(message.content === "".concat(prefix, "\u0E04\u0E38\u0E22\u0E14\u0E49\u0E27\u0E22\u0E2B\u0E19\u0E48\u0E2D\u0E22"))) {
            _context.next = 6;
            break;
          }

          i = random_user_queue[Math.floor(Math.random() * random_user_queue.length)];
          lucky_user = client.users.cache.find(function (user) {
            return user.id === i;
          });
          _context.next = 6;
          return regeneratorRuntime.awrap(message.channel.send("".concat(lucky_user, " is the best!")));

        case 6:
          if (message.content === 'หวัดดีม่อน') message.channel.send(btext[Math.floor(Math.random() * btext.length)]);
          if (message.content.startsWith("เหงา")) message.channel.send(btext2[Math.floor(Math.random() * btext2.length)]);

          if (!message.author.bot) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return");

        case 10:
          if (message.content.startsWith(prefix)) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return");

        case 12:
          serverQueue = queue.get(message.guild.id);

          if (!message.content.startsWith("".concat(prefix, "play"))) {
            _context.next = 18;
            break;
          }

          // console.log(message);
          execute(message, serverQueue);
          return _context.abrupt("return");

        case 18:
          if (!message.content.startsWith("".concat(prefix, "skip"))) {
            _context.next = 23;
            break;
          }

          skip(message, serverQueue);
          return _context.abrupt("return");

        case 23:
          if (!message.content.startsWith("".concat(prefix, "\u0E40\u0E25\u0E48\u0E19\u0E14\u0E49\u0E27\u0E22"))) {
            _context.next = 30;
            break;
          }

          _context.next = 26;
          return regeneratorRuntime.awrap(message.channel.send('เพิ่มลงระบบสุ่มแล้ว!'));

        case 26:
          add_user_random(message, serverQueue);
          return _context.abrupt("return");

        case 30:
          if (!message.content.startsWith("".concat(prefix, "stop"))) {
            _context.next = 34;
            break;
          }

          message.channel.send('หยุดก็ได้ๆๆ');
          stop(message, serverQueue);
          return _context.abrupt("return");

        case 34:
        case "end":
          return _context.stop();
      }
    }
  });
});

function execute(message, serverQueue) {
  var args, voiceChannel, permissions, songInfo, song, i, args2, queueContruct, connection;
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
          i = message.content.indexOf(' ');
          args2 = [message.content.slice(0, i), message.content.slice(i + 1)];
          console.log("AFTER SSLICE: ", args2); // var url;

          _context2.prev = 11;
          _context2.next = 14;
          return regeneratorRuntime.awrap(ytdl.getInfo(args2[1]));

        case 14:
          songInfo = _context2.sent;
          console.log("WITH arg2 is url", args2[1]);
          _context2.next = 25;
          break;

        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](11);
          _context2.next = 22;
          return regeneratorRuntime.awrap(youtube.search(args2[1]).then(function (results) {
            console.log("in catch"); // Unless you specify a type, it will only return 'video' results

            console.log("WITH arg1 is url", args[1]);
            console.log("WITH arg2 is not url", results.videos[0].link); // console.log(typeof(results.videos[0].link))

            args2[1] = results.videos[0].link;
          }));

        case 22:
          _context2.next = 24;
          return regeneratorRuntime.awrap(ytdl.getInfo(args2[1]));

        case 24:
          songInfo = _context2.sent;

        case 25:
          // songInfo = await ytdl.getInfo(args[1])  
          song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url
          };

          try {} catch (error) {}

          if (serverQueue) {
            _context2.next = 46;
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
          _context2.prev = 31;
          _context2.next = 34;
          return regeneratorRuntime.awrap(voiceChannel.join());

        case 34:
          connection = _context2.sent;
          queueContruct.connection = connection;
          play(message.guild, queueContruct.songs[0]);
          _context2.next = 44;
          break;

        case 39:
          _context2.prev = 39;
          _context2.t1 = _context2["catch"](31);
          console.log(_context2.t1);
          queue["delete"](message.guild.id);
          return _context2.abrupt("return", message.channel.send(_context2.t1));

        case 44:
          _context2.next = 48;
          break;

        case 46:
          serverQueue.songs.push(song);
          return _context2.abrupt("return", message.channel.send("".concat(song.title, " has been added to the queue!")));

        case 48:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[11, 18], [31, 39]]);
}

function add_user_random(message, serverQueue) {
  if (random_user_queue.includes(message.author.id)) {
    return message.channel.send("ซึเนโอะเล่นหลายรอบแล้วนะ!");
  } else {
    random_user_queue.push(message.author.id);
  } // random_user_queue.push(message.author.id);


  console.log(random_user_queue);
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
      setTimeout(function () {
        // message.channel.send("ฉันมีธุระที่โลกอนาคต กลับก่อนนะ!!!");
        serverQueue.voiceChannel.leave();
      }, 60000); // serverQueue.voiceChannel.leave();

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