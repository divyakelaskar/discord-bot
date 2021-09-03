import { Interaction } from "discord.js";
import { bookmark } from "../../contexts/bookmark";
import { BeccaInt } from "../../interfaces/BeccaInt";
import { currencyListener } from "../../listeners/currencyListener";
import { usageListener } from "../../listeners/usageListener";
import { getSettings } from "../../modules/settings/getSettings";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const interactionCreate = async (
  Becca: BeccaInt,
  interaction: Interaction
): Promise<void> => {
  try {
    if (interaction.isCommand()) {
      const target = Becca.commands.find(
        (el) => el.data.name === interaction.commandName
      );
      if (!target) {
        interaction.reply({
          content: `That ${interaction.commandName} interaction is not valid...`,
        });
        return;
      }
      if (!interaction.guildId || !interaction.guild) {
        await interaction.reply({
          content: `I prefer my privacy. Please talk to me in a guild instead.`,
        });
        return;
      }
      const config = await getSettings(
        Becca,
        interaction.guildId,
        interaction.guild.name
      );
      if (!config) {
        await interaction.reply({
          content: "I could not find your guild record.",
        });
        return;
      }
      await target.run(Becca, interaction, config);
      await usageListener.run(Becca, interaction);
      await currencyListener.run(Becca, interaction);
    }

    if (interaction.isContextMenu()) {
      const target = Becca.contexts.find(
        (el) => el.data.name === interaction.commandName
      );
      if (!target) {
        interaction.reply({
          content: `That ${interaction.commandName} interaction is not valid...`,
        });
        return;
      }
      await target.run(Becca, interaction);
    }
  } catch (err) {
    beccaErrorHandler(Becca, "interaction create event", err);
  }
};
