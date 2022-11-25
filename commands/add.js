const { SlashCommandBuilder } = require(`discord.js`);
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("add adnime art webhook")
    .addStringOption((option) =>
      option
        .setName("source")
        .setDescription("art source")
        .setRequired(true)
        .addChoices(
          { name: "Danbooru", value: "danbooru" },
          { name: "Gelbooru", value: "gelbooru" }
        )
    )
    .addBooleanOption((option) =>
      option
        .setName("safe")
        .setDescription("Is content should be SFW?")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("tag_1").setDescription("primary_tag").setRequired(true)
    ),
  // .addStringOption((option) =>
  //   option.setName("tag_2").setDescription("additional_tag")
  // )
  // .addStringOption((option) =>
  //   option.setName("tag_3").setDescription("additional_tag")
  // )
  // .addStringOption((option) =>
  //   option.setName("tag_4").setDescription("additional_tag")
  // ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    let last = require("../last.json");
    last.channels.push({
      channelid: interaction.channel.id,
      server: interaction.options.getString("source"),
      unsafe: !interaction.options.getBoolean("safe"),
      tags: [
        interaction.options.getString("tag_1"),
        // interaction.options.getString("tag_2"),
        // interaction.options.getString("tag_3"),
        // interaction.options.getString("tag_4"),
      ],
      last: "",
    });
    console.log(last);
    const data = JSON.stringify(last);
    fs.writeFile("../last.json", data, async (err) => {
      if (err) {
        await interaction.editReply("Coś sie zepsuło i nie było mnie słychać");
      } else {
        await interaction.editReply("bazowany tag bracie");
      }
    });
  },
};
