const Booru = require("booru");
const { EmbedBuilder, UserFlagsBitField } = require("discord.js");
module.exports = {
  hook: async function (cl, prisma) {
    const webhook = await prisma.webhook.findMany();
    for (const channel of webhook) {
      try {
        let posts = await Booru.search(channel.source, channel.tags, {
          limit: 1,
        });
        for (let post of posts) {
          if (channel.last != post.file_url) {
            if (post.rating == "s" || channel.unsafe) {
              const art = new EmbedBuilder()
                .setTitle(post.id)
                .setColor(Math.floor(Math.random() * 16777215).toString(16))
                .setImage(post.file_url)
                .addFields(
                  { name: "Used tags", value: channel.tags.toString() },
                  { name: "Link", value: post.source }
                );
              console.log(art);
              cl.channels.cache.get(channel.channelid).send({ embeds: [art] });
              await prisma.webhook.update({
                where: {
                  id: channel.id,
                },
                data: {
                  last: post.file_url,
                },
              });
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  },
};
