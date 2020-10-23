const readline = require("readline");
const Bot = require("./bot");

console.log("Setting env variables...");
require("dotenv").config();

const bot = new Bot({
    name: process.env.BOT_NAME || "Bot",
    password: process.env.BOT_PASS,
    host: process.env.SERVER_HOST,
});

bot.connect();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});

rl.on("line", (line) => {
    if (line === "") {
        return;
    } else if (line === "/quit") {
        bot.quit();
        return;
    } else if (line === "/end") {
        console.info("Forcibly ended client");
        process.exit(0);
    }
    bot.chat(line);
});
