const {
  Client,
  ActivityType,
  GatewayIntentBits,
  REST,
  Routes,
} = require("discord.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();
const nodefs = require("node:fs");
const { hook } = require("./tools/booruhook");

const cl = new Client({
  presence: {
    status: "online",
    afk: false,
    activities: [
      {
        name: "Lurkuje by spać mógł ktoś",
        type: ActivityType.Listening,
      },
    ],
  },
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
  ],
});

setInterval(() => hook(cl, prisma), 1000 * 10);

const options = {
  prisma: prisma,
};

cl.on("interactionCreate", async (interaction) => {
  let type = "commands";
  let commandType;
  if (interaction.isCommand()) {
    interaction.commandName
      ? (commandType = interaction.commandName)
      : (commandType = interaction.commandId);
    const command = require(`./${type}/${commandType}`);
    command.execute(interaction, options);
  }
});

//client
cl.once("ready", async () => {
  const commands = [];
  cl.user.setActivity("", { type: "LISTENING" });
  const commandFiles = nodefs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
  }
  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
  await rest.put(Routes.applicationCommands(cl.user.id), {
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
