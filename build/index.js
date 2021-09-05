"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const inquirer_1 = __importDefault(require("inquirer"));
let answers;
(async () => {
    answers = await inquirer_1.default.prompt([
        {
            type: "input",
            name: "token",
            message: "Bot Token:",
        },
    ]);
    const client = new discord_js_1.default.Client({ intents: [] });
    client.once("ready", async () => {
        const guilds = await client.guilds.fetch();
        answers = await inquirer_1.default.prompt([
            {
                type: "list",
                name: "guildId",
                choices: guilds.map((value) => ({ name: value.name, value: value.id })),
                message: "Select a guild.",
                loop: false,
            },
        ]);
        const guild = await guilds.get(answers.guildId).fetch();
        const me = await guild.members.fetch(client.user.id);
        const channels = await guild.channels
            .fetch()
            .then((channels) => channels
            .filter((channel) => channel.isText())
            .filter((channel) => channel
            .permissionsFor(me)
            .has(discord_js_1.default.Permissions.FLAGS.SEND_MESSAGES)));
        answers = await inquirer_1.default.prompt([
            {
                type: "list",
                name: "channelId",
                choices: channels.map((channel) => ({
                    name: channel.name,
                    value: channel.id,
                })),
                message: "Select a channel.",
                loop: false,
            },
        ]);
        const channel = channels.get(answers.channelId);
        answers = await inquirer_1.default.prompt([
            {
                type: "input",
                default: "you leaked your bot token lmao",
                name: "message",
                message: "Spam Message:",
            },
            {
                type: "number",
                default: 500,
                name: "interval",
                message: "Spam Interval:",
            },
        ]);
        console.log("The bot is now spamming! To stop, press Ctrl+C.");
        setInterval(() => channel.send(answers.message), answers.interval);
    });
    client.login(answers.token);
})();
