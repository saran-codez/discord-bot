#simple discord bot using node and discord.js. Feel free to fork ✌️.

This bot has two functions:

1. Finding users who pinged @everyone or @here and mentions them as reply to that
   message.

2. Sends a random message to a user in specific interval of time for given time.

Bot prefix = $.

Command list = $ping, $roast.

The ping command gives ping from bot, if online.

The roast command takes 4 arguements - $roast @username maxtime interval wordlist(optional).

If arguments don't met condition correct syntax of command will be sent or it uses default values.

If wordlist is not provided the bot takes words for message from file called words.txt and converts it to an array of words.

External libraries used: discord.js, dotenv.
