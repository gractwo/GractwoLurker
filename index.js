const discordjs = require("discord.js");
require("dotenv").config();
const fs = require("fs");
const nodefs = require("node:fs");
const Booru = require("booru");
const { channel } = require("diagnostics_channel");

const cl = new discordjs.Client({
  presence: {
    status: "online",
    afk: false,
    activities: [
      {
        name: "Lurkuje by spać mógł ktoś",
        type: discordjs.ActivityType.Listening,
      },
    ],
  },
  intents: [
    discordjs.GatewayIntentBits.Guilds,
    discordjs.GatewayIntentBits.GuildMessages,
    discordjs.GatewayIntentBits.MessageContent,
    discordjs.GatewayIntentBits.GuildMessageReactions,
    discordjs.GatewayIntentBits.GuildMembers,
  ],
});

setInterval(() => {
  let last = require("./last.json");
  for (const [index, channel] of last.channels.entries()) {
    Booru.search(channel.server, channel.tags, {
      limit: 1,
    }).then((posts) => {
      for (let post of posts)
        if (channel.last != post.file_url) {
          try {
            if (post.rating == "s" || channel.unsafe) {
              cl.channels.cache.get(channel.channelid).send(post.file_url);
              last.channels[index].last = post.file_url;
              const data = JSON.stringify(last);
              fs.writeFile("last.json", data, (err) => {
                if (err) {
                  throw err;
                }
                console.log("JSON data is saved.");
              });
            }
          } catch (error) {
            console.error(error);
          }
        }
    });
  }
}, 1000 * 5);

cl.on("interactionCreate", async (interaction) => {
  let type = "commands";
  switch (true) {
    case interaction.isSelectMenu():
      type = "selectMenus";
      break;
    case interaction.isModalSubmit():
      type = "modals";
      break;
    case interaction.isContextMenuCommand():
      type = "contextMenus";
      break;
    case interaction.isButton():
      type = "buttons";
      break;
  }
  interaction.commandName
    ? (commandType = interaction.commandName)
    : (commandType = interaction.customId);

  const command = require(`./${type}/${commandType}`);
  command.execute(interaction);
});
//client
cl.once("ready", async () => {
  console.log(`bot ready; logged in as ${cl.user.tag}\n--`.info);
  cl.user.setActivity("", { type: "LISTENING" });
  const commands = [];
  const commandFiles = nodefs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
  }
  const rest = new discordjs.REST({ version: "10" }).setToken(
    process.env.TOKEN
  );
  await rest.put(discordjs.Routes.applicationCommands(cl.user.id), {
    body: commands,
  });
});
cl.login(process.env.TOKEN);
// here comes the boooy
// Bóg się rodzi, moc truchleje
// Pan niebiosów obnażony!
// Ogień krzepnie, blask ciemnieje
// Ma granice Nieskończony
// Wzgardzony, okryty chwałą
// Śmiertelny Król nad wiekami!
// A Słowo Ciałem się stało
// I mieszkało między nami
// Cóż niebo, masz nad ziemiany?
// Bóg porzucił szczęście Twoje
// Wszedł między lud ukochany
// Dzieląc z nim trudy i znoje
// Niemało cierpiał, niemało
// Żeśmy byli winni sami
// A Słowo
// W nędznej szopie urodzony
// Żłób Mu za kolebkę dano!
// Cóż jest czym był otoczony?
// Bydło, pasterze i siano
// Ubodzy, was to spotkało
// Witać Go przed bogaczami!
// A Słowo
// Potem królowie widziani
// Cisną się między prostotą
// Niosąc dary Panu w dani
// Mirrę, kadzidło i złoto
// Bóstwo to razem zmieszało
// Z wieśniaczymi ofiarami
// A Słowo
// Podnieś rękę, Boże Dziecię
// Błogosław Ojczyznę miłą!
// W dobrych radach, w dobrym bycie
// Wspieraj jej siłę swą siłą
// Dom nasz i majętność całą
// I wszystkie wioski z miastami
// A Słowo
