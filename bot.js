import dotenv from "dotenv";
import { Client, Intents } from "discord.js";
import words from "./data.js";

const prefix = "$";
const defaultValues = {
  wordList: words,
  timeInterval: "10",
  maxTime: "5",
};
const intervalList = {};

dotenv.config();

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", () => {
  console.log(client.user.tag + " logged in.");
});

// event on sending messages
client.on("messageCreate", (message) => {
  //preventing reading bot messages
  if (message.author.bot) return;

  //   finding user who pinged @everyone
  if (message.content === `@everyone`) {
    message.reply(`<@${message.author.id}> pinged everyone`);
  }

  //   finding user who pinged @here
  if (message.content === `@here`) {
    message.reply(`<@${message.author.id}> pinged here`);
  }

  //   getting commands
  if (message.content.startsWith(prefix)) {
    const [CMD_NAME, ...args] = message.content
      .trim()
      .substring(prefix.length)
      .split(/\s+/); //splitting by empty spaces
    console.log(args);

    // for ping
    if (CMD_NAME === "ping") {
      message.channel.send(
        `Latency${
          Date.now() - message.createdTimestamp
        }ms.\nAPI Latency-${Math.round(client.ws.ping)}ms`
      );
    }

    // if command is roast
    if (CMD_NAME === "roast") {
      // Checking user already issued a command
      if (intervalList[message.author.id]) {
        message.channel.send(
          `<@${message.author.id}> Your command is already on queue`
        );
        return;
      }
      const sampleArgs = `\`$roast @user maxtime[minimum 5m] interval[minimum 10s] worldlist[optional]\``;

      // checking number of arguments
      if (args.length === 0 || args.length < 2) {
        return message.channel.send(
          `<@${message.author.id}>` + "provide enough arguments\n" + sampleArgs
        );
      }

      //checking number of tagged users
      if (message.mentions.users.size > 1) {
        return message.channel.send(
          `<@${message.author.id}> don't mention more than one member`
        );
      }

      //checking arguements
      const idForPing = args[0];
      const maxTime =
        parseInt(args[1]) >= 5 ? parseInt(args[1]) : defaultValues.maxTime;
      const interval =
        parseInt(args[2]) >= 10
          ? parseInt(args[2])
          : defaultValues.timeInterval;

      const wordList =
        typeof args[3] === "string"
          ? args[3].split(",")
          : defaultValues.wordList;
      console.log(idForPing + " " + maxTime + " " + interval);

      message.channel.send(
        `<@${message.author.id}> Bot will stop them pinging after ${maxTime}\n\`if you wish to interrupt use $stop\``
      );
      sendRandomMsg(message, idForPing, maxTime, interval, wordList);
    }

    // stop command
    if (CMD_NAME === "stop") {
      stopMessage(message.author.id, message);
    }
  }
});

function sendRandomMsg(message, idForPing, maxTime, interval, wordList) {
  // getting interval id
  let intervalID = setInterval(() => {
    const word = wordList[getRandomNumber(wordList.length - 1)];
    message.channel.send(idForPing + word);
  }, interval * 1000);

  // adding id to intervalList;
  intervalList[message.author.id] = intervalID;
  console.log(
    "author " +
      message.author.id +
      " interval " +
      intervalList[message.author.id]
  );

  //calling timeout function
  let msgToPass = message;
  setTimeout(() => {
    stopMessage(message.author.id, msgToPass);
  }, maxTime * 60 * 1000 + 2000);
  return intervalID;
}

function stopMessage(intervalId, message) {
  clearInterval(intervalList[intervalId]);
  if (removeUser(intervalId)) {
    message.channel.send("stopped");
    console.log("Removed user from queue");
  }
}

function getRandomNumber(max) {
  const min = 0;
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function removeUser(id) {
  //if it exists, remove it
  if (intervalList[id]) {
    delete intervalList[id];
    console.log("Removing " + id);
    return true;
  }
  //else return false
  return false;
}

client.login(process.env.BOT_TOKEN);
