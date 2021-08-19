import { GuildMember } from "discord.js";
import StarModel from "../../../../database/models/StarModel";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

export const handleResetStars: CommandHandler = async (
  Becca,
  interaction
) => {
  try {
    const { member, guild } = interaction;

    if (!guild || !member) {
      await interaction.editReply({ content: Becca.responses.missing_guild });
      return;
    }

    if (!(member as GuildMember).permissions.has("MANAGE_GUILD")) {
      await interaction.editReply({ content: Becca.responses.no_permission });
      return;
    }

    const starData = await StarModel.findOne({ serverID: guild.id });

    if (!starData) {
      await interaction.editReply({
        content: "I cannot locate the star data for this server.",
      });
      return;
    }

    starData.users = [];
    starData.markModified("users");
    await starData.save();
    await interaction.editReply({
      content: "I have returned the stars to the heavens.",
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "reset stars command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "reset stars", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "reset stars", errorId)],
        })
      );
  }
};
