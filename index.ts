import Discord from "discord.js";
import inquirer from "inquirer";

let answers: any;

(async () => {
  answers = await inquirer.prompt([
    {
      type: "input",
      name: "token",
      message: "Bot Token:",
    },
  ]);

  const client = new Discord.Client({ intents: [] });

  client.once("ready", async () => {
    const guilds = await client.guilds.fetch();

    answers = await inquirer.prompt([
      {
        type: "list",
        name: "guildId",
        choices: guilds.map((value) => ({ name: value.name, value: value.id })),
        message: "Select a guild.",
        loop: false,
      },
    ]);
    const guild = await guilds.get(answers.guildId)!.fetch();
    const me = await guild.members.fetch(client.user!.id);
    const channels = await guild.channels
      .fetch()
      .then((channels) =>
        channels
          .filter((channel) => channel.isText())
          .filter((channel) =>
            channel
              .permissionsFor(me)
              .has(Discord.Permissions.FLAGS.SEND_MESSAGES)
          )
      );

    answers = await inquirer.prompt([
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

    const channel = channels.get(answers.channelId)! as Discord.TextChannel;

    answers = await inquirer.prompt([
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

  client.login(answers.token).catch(() => console.log("The token is invalid."));
})();
