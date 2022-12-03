const { SlashCommandBuilder, EmbedBuilder } = require(`discord.js`);
module.exports = {
  data: new SlashCommandBuilder()
    .setName("list")
    .setDescription("list all channel webhooks"),
  async execute(interaction, options) {
    await interaction.deferReply({ ephemeral: true });
    const webhookList = await options.prisma.webhook.findMany({
      where: {
        channelid: interaction.channel.id,
      },
    });
    const hooklist = new EmbedBuilder()
      .setAuthor({
        name: interaction.member.nickname,
        icon_url: interaction.member.avatarURL(),
      })
      .setTitle("Webhook list")
      .setColor(Math.floor(Math.random() * 16777215).toString(16))
      .setDescription("All anime art hooks added to this channel")
      .addFields(
        { name: "Source", value: "\u200b", inline: true },
        { name: "Tags", value: "\u200b", inline: true },
        { name: "Safe", value: "\u200b", inline: true }
      );
    console.log(webhookList);
    for (const hook of webhookList) {
      hooklist.addFields(
        { name: "\u200b", value: hook.source, inline: true },
        { name: "\u200b", value: hook.tags.toString(), inline: true },
        { name: "\u200b", value: (!hook.unsafe).toString(), inline: true }
      );
    }
    console.log(hooklist);
    interaction.channel.send({ embeds: [hooklist] });
    await interaction.editReply("Prosze szefuńciu");
  },
};
