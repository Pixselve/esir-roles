import { config } from "dotenv";

config();
const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const commands = [
  new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Rend muet un utilisateur.")
    .addUserOption((builder) =>
      builder
        .setName("utilisateur")
        .setDescription("L'utilisateur à rendre muet")
        .setRequired(true)
    )
    .addStringOption((builder) =>
      builder.setName("raison").setDescription("Raison du mute").setRequired(false)
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN ?? "");

rest
  .put(
    Routes.applicationGuildCommands(
      process.env.BOT_ID ?? "",
      process.env.SERVER_ID ?? ""
    ),
    { body: commands }
  )
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
