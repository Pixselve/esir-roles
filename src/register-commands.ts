import { config } from "dotenv";
import { ContextMenuCommandBuilder } from "@discordjs/builders";
import { ApplicationCommandType } from "discord-api-types";

config();
const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN ?? "");

async function setPermissions() {
  const res = await rest.get(
    Routes.applicationGuildCommands(
      process.env.BOT_ID ?? "",
      process.env.SERVER_ID ?? ""
    )
  );
  console.log({ res });

  //
  // await rest.put(Routes.applicationCommandPermissions(
  //   process.env.BOT_ID ?? "",
  //   process.env.SERVER_ID ?? "",
  //   "911255396637900840"
  // ), {
  //   body: {
  //     permissions: [
  //       {
  //         id: "619500708844011550",
  //         type: 1,
  //         permission: true,
  //       },
  //     ],
  //   }
  // })


  await rest.put(
    Routes.guildApplicationCommandsPermissions(
      process.env.BOT_ID ?? "",
      process.env.SERVER_ID ?? ""
    ),
    {
      body:
        [
          {
            id: "911255396637900840",
            permissions: [
              {
                id: "619500708844011550",
                type: 1,
                permission: true,
              },
            ],
          },
          {
            id: "911982722837262336",
            permissions: [
              {
                id: "619500708844011550",
                type: 1,
                permission: true,
              },
            ],
          },],
    }
  );
}

// setPermissions();

async function registerCommands() {
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
        builder
          .setName("raison")
          .setDescription("Raison du mute")
          .setRequired(false)
      )
      .setDefaultPermission(false),
    new ContextMenuCommandBuilder()
      .setType(ApplicationCommandType.User)
      .setName("mute")
      .setDefaultPermission(false),
  ].map((command) => command.toJSON());

  await rest.put(
    Routes.applicationGuildCommands(
      process.env.BOT_ID ?? "",
      process.env.SERVER_ID ?? ""
    ),
    { body: commands }
  );
}

registerCommands()
