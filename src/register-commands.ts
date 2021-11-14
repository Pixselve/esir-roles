import { config } from "dotenv";
config();
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [
  new SlashCommandBuilder().setName('rappel').setDescription("Lance la procédure d\'attribution des roles aux utilisateurs qui n'ont pas."),
]
  .map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN ?? "");

rest.put(Routes.applicationGuildCommands(process.env.BOT_ID ?? "", process.env.SERVER_ID ?? ""), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
