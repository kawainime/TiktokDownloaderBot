const Telegraf = require('node-telegram-bot-api');
const { tiktokdl } = require('tiktokdl');
const util = require('util');
const chalk = require('chalk');
const figlet = require('figlet');
const express = require('express'); 
const app = express();
const port = process.env.PORT || 8081;

//express endpoint
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const data = {
    status: 'true',
    message: 'Bot Successfully Activated!',
    author: 'BOTCAHX'
  };
  const result = {
    response: data
  };
  res.send(JSON.stringify(result, null, 2));
});

function listenOnPort(port) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
app.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is already in use. Trying another port...`);
      listenOnPort(port + 1);
    } else {
      console.error(err);
    }
  });
}

listenOnPort(port);

// Bot config token 
let token = '6254204466:AAEBpAQZNMHhrmgkz2UY_BIdvtQLljLEK5k'  //replace this part with your bot token
const bot = new Telegraf(token, { polling: true });
let Start = new Date();

const logs = (message, color) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(chalk[color](`[${timestamp}] => ${message}`));
};

const Figlet = () => {
  figlet('TIKTOK NO WM', { font: 'Block', horizontalLayout: 'default' }, function (err, data) {
    if (err) {
      console.log('Error:', err);
      return;
    }
    console.log(chalk.yellow.bold(data));
    console.log(chalk.yellow(`ROOTSEC`));
  });
};

bot.on('polling_error', (error) => {
  logs(`Polling error: ${error.message}`, 'blue');
});

bot.onText(/^\/runtime$/, (msg) => {
  const now = new Date();
  const uptimeMilliseconds = now - Start;
  const uptimeSeconds = Math.floor(uptimeMilliseconds / 1000);
  const uptimeMinutes = Math.floor(uptimeSeconds / 60);
  const uptimeHours = Math.floor(uptimeMinutes / 60);

  const From = msg.chat.id;
  const uptimeMessage = `Active : ${uptimeHours} hour ${uptimeMinutes % 60} minute ${uptimeSeconds % 60} second.`;

  bot.sendMessage(From, uptimeMessage);
});
bot.onText(/^\/start$/, (msg) => {
const From = msg.chat.id;
const caption = `
Bot ini dirancang khusus untuk membantu Anda mendownload video TikTok secara otomatis. Cukup kirimkan URL video TikTok yang ingin Anda download, dan bot ini akan menyelesaikan tugasnya dengan cepat dan mudah!`
bot.sendMessage(From, caption);
});

bot.on('message', async (msg) => {
  Figlet();
  logs('Success activated', 'green');
  const From = msg.chat.id;
  const body = /^https:\/\/.*tiktok\.com\/.+/;
   if (body.test(msg.text)) {
    const url = msg.text;
    try {
        const data = await tiktokdl(url);
        const { video } = data;   
        bot.sendVideo(From, video, { caption: `- NIH KAK HASILNYA -` });
    } catch (error) {
        bot.sendMessage(From, 'Sorry, an error occurred while downloading the TikTok video.');
        logs(`[ ERROR ] ${From}: ${error.message}`, 'red');
    }
}
})
