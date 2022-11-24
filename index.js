const discordjs = require("discord.js");
require("dotenv").config();
const Booru = require("booru");

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

let new_image = "";
setInterval(() => {
  Booru.search("gelbooru", ["re:zero_kara_hajimeru_isekai_seikatsu"], {
    limit: 1,
  }).then((posts) => {
    for (let post of posts)
      if (new_image != post.file_url) {
        try {
          cl.channels.cache.get("1044761372124266597").send(post.file_url);
          new_image = post.file_url;
        } catch (error) {
          console.error(error);
        }
      }
  });
}, 1000 * 6);
// cl.on("messageCreate", async (msg) => {

// });

//client
cl.once("ready", () => {
  console.log(`bot ready; logged in as ${cl.user.tag}\n--`.info);
  cl.user.setActivity(".pomoc", { type: "LISTENING" });
});
cl.login(process.env.TOKEN); // here comes the boooy
