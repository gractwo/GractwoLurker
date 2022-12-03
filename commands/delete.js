const { SlashCommandBuilder } = require(`discord.js`);
module.exports = {
  data: new SlashCommandBuilder()
    .setName("delete")
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
  async execute(interaction, options) {
    await interaction.deferReply({ ephemeral: true });
    const webhookDelete = await options.prisma.webhook.deleteMany({
      where: {
        channelid: interaction.channel.id,
        source: interaction.options.getString("source"),
        unsafe: !interaction.options.getBoolean("safe"),
        tags: {
          hasEvery: [
            interaction.options.getString("tag_1"),
            // interaction.options.getString("tag_2"),
            // interaction.options.getString("tag_3"),
            // interaction.options.getString("tag_4"),
          ],
        },
      },
    });
    await interaction.editReply("I cały misterny tag w pizdu");
  },
};
