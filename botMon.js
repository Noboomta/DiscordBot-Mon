const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const ytdl = require("ytdl-core");
const rp = require('request-promise');
const $ = require('cheerio');
const youtube = require('scrape-youtube').default;

const client = new Discord.Client();

const queue = new Map();
const random_user_queue = [ '364394461775790080', '694073806972518401', '421602435522625548' ];

const btext = ["ว้าวซ่า555", "....", "55555555555", "ไปคุยกับแม่ไป", "ชวนแม่ไปด้วยนะ", "อะไร5555555", "อร้ากกกกก", ";-;"];
const btext2 = ["เหงาก็ไปนอนดิ", "ไปคุยกับแม่ไป", "อะไร555555", ";-;"];

client.once("ready", () => {
  console.log("Ready!");
});

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});

client.on("message", async message => {
  // console.log(message.content);
  if (message.content === 'ม่อน') message.channel.send("ว่าไงเหล่าโนบิตะ");
  
  // if (message.content === 'สมาชิก')  console.log(message);
  if (message.content === (`${prefix}คุยด้วยหน่อย`))  {
    let i = random_user_queue[Math.floor(Math.random()*random_user_queue.length)]
    let lucky_user = client.users.cache.find(user => user.id === i);
    await message.channel.send(`${lucky_user} is the best!`);
  }
  if (message.content === 'หวัดดีม่อน') message.channel.send(btext[Math.floor(Math.random()*btext.length)]);
  if (message.content.startsWith("เหงา")) message.channel.send(btext2[Math.floor(Math.random()*btext2.length)]);
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}play`)) {
    // console.log(message);
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}เล่นด้วย`)){
    await message.channel.send('เพิ่มลงระบบสุ่มแล้ว!');
    add_user_random(message, serverQueue);
    return;
  }
   else if (message.content.startsWith(`${prefix}stop`)) {
    message.channel.send('หยุดก็ได้ๆๆ');
    stop(message, serverQueue);
    return;
  }
//   } else {
//     message.channel.send("You need to enter a valid command!");
//   }
});

async function execute(message, serverQueue) {
  const args = message.content.split(" ");
  console.log(args)
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

  var songInfo;
  var song;
  var i = message.content.indexOf(' ');
  var args2 = [message.content.slice(0,i), message.content.slice(i+1)];
  console.log("AFTER SSLICE: ", args2)
  // var url;
  try {
    songInfo = await ytdl.getInfo(args2[1]) 
    console.log("WITH arg2 is url", args2[1])
  } catch (error) {
    await youtube.search(args2[1]).then(results => {
      console.log("in catch");
      // Unless you specify a type, it will only return 'video' results
      console.log("WITH arg1 is url", args[1])
      console.log("WITH arg2 is not url", results.videos[0].link); 
      // console.log(typeof(results.videos[0].link))
      args2[1] = results.videos[0].link;
      
    });

    songInfo = await ytdl.getInfo(args2[1]) 
  }
  // songInfo = await ytdl.getInfo(args[1])  
  song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
  };

  try {
    
  } catch (error) {
    
  }

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} has been added to the queue!`);
  }
}

function add_user_random(message, serverQueue){
  if(random_user_queue.includes(message.author.id)){
    return message.channel.send(
      "ซึเนโอะเล่นหลายรอบแล้วนะ!"
    );
  }
  else{
    random_user_queue.push(message.author.id);
  }
  // random_user_queue.push(message.author.id);
  console.log(random_user_queue);
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "โนบิตะไม่ได้อยู่ในห้องพูด!"
    );
    
  if (!serverQueue)
    return message.channel.send("ไม่เห็นมีเพลงให้ม่อนปิด!");
    
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  try {
    const serverQueue = queue.get(guild.id);
    if (!song) {
      setTimeout(() => { 
        // message.channel.send("ฉันมีธุระที่โลกอนาคต กลับก่อนนะ!!!");
        serverQueue.voiceChannel.leave(); 
      }, 60000);
      // serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }

    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
      })
      .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`ม่อนกำลังเล่น: **${song.title}**`);
  } catch (error) {
    message.channel.send("โนบิตะส่งเป็น url ได้ไหมม");
  }
  
}

client.login(token);