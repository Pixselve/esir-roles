import { config } from "dotenv";
// Require the necessary discord.js classes
import { Client, Intents, MessageActionRow, MessageSelectMenu } from "discord.js";
import rolesConfig from "./roles-config";
import randomAnimalEmoji from "./randomAnimal";
import mute, { MuteError } from "./mute";

config();

// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES],
});

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!");
});

client.on("guildMemberAdd", async (member) => {
  const dmChannel = await member.createDM();
  const schoolMessage = new MessageActionRow()
    .addComponents(new MessageSelectMenu().setCustomId("school-select").setPlaceholder("Choisissez votre école").addOptions([
      {
        label: 'Je suis étudiant à l\'ESIR',
        value: 'esir',
      },
      {
        label: 'Je suis étudiant à l\'ISTIC',
        value: 'istic',
      },
      {
        label: 'Je suis un ancien de l\'ESIR',
        value: 'idesir',
      },
      {
        label: 'Je suis un ami d\'un étudiant à l\'ESIR',
        value: 'friend',
      },
      {
        label: "Je suis intéressé par l'école et je souhaite en savoir plus",
        value: 'curious',
      },
    ]));
  await dmChannel.send({
    components: [schoolMessage],
    content: "Bienvenue sur le serveur de l'ESIR ! Afin de pouvoir te donner accès aux salons de te promotion, je vais besoin d'en apprendre un peu plus sur toi. Pour commencer. D'où viens-tu ?",
  });
});

async function addRoleToUser(userID: string, roles: string[]) {
  const mainServer = await client.guilds.fetch(process.env.SERVER_ID ?? "");
  const user = await mainServer.members.fetch(userID);
  await user.roles.add(roles);
}


client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (message.member.roles.cache.has(process.env.ROLE_MUTED ?? "")) {
    await message.delete();
    return;
  }

});

let createdChannelsIDs: Set<string> = new Set();

client.on("voiceStateUpdate", async (oldState, newState) => {
  const channelID = newState.channelId;

  if (channelID === process.env.CHANNEL_VOICE_HOME) {
    const voiceChannel = await newState.guild.channels.create(randomAnimalEmoji(), {
      type: "GUILD_VOICE",
      parent: process.env.CATEGORY_VOICE,
      reason: `temporary channel created by ${ newState.member.user.username }`,
      permissionOverwrites: [
        {
          id: newState.member.user.id,
          allow: ["VIEW_CHANNEL", "MANAGE_CHANNELS", "MANAGE_ROLES"],

        },
      ],
    });
    createdChannelsIDs.add(voiceChannel.id);
    await newState.setChannel(voiceChannel);
  }
  if (createdChannelsIDs.has(oldState.channelId) && oldState.channel.members.size === 0) {
    await oldState.channel.delete("The temporary channel is empty");
  }
});

client.on("interactionCreate", async (interaction) => {

  if (interaction.isContextMenu()) {
    switch (interaction.commandName) {
      case "mute":
        try {
          if (interaction.targetType !== "USER") return;
          const userID = interaction.targetId;
          await mute(userID, interaction, "Muted by context");

          await interaction.reply({
            content: "☑️ Utilisateur rendu muet.",
            ephemeral: true,
          });
        } catch (e) {
          if (e === MuteError.AlreadyMuted) {
            await interaction.reply({
              content: "❌ Utilisateur déjà muet.",
              ephemeral: true,
            });
          }
        } finally {
          break;
        }



    }

  } else if (interaction.isCommand()) {
    switch (interaction.commandName) {
      case "mute":
        try {
          const user = interaction.options.getUser("utilisateur");
          const reason = interaction.options.getString("raison");

          await mute(user, interaction, reason);

          await interaction.reply({
            content: "☑️ Utilisateur rendu muet.",
            ephemeral: true,
          });
        } catch (e) {
          console.log(e);
          if (e === MuteError.AlreadyMuted) {
            await interaction.reply({
              content: "❌ Utilisateur déjà muet.",
              ephemeral: true,
            });
          }
        } finally {
          break;
        }
    }
  } else {
    let interactionID;
    if (interaction.isSelectMenu()) {
      interactionID = interaction.values[0];
    } else if (interaction.isButton()) {
      interactionID = interaction.customId;
    } else {
      return;
    }

    if (!rolesConfig.has(interactionID)) return;
    const roleConfig = rolesConfig.get(interactionID);
    if (roleConfig === undefined) return;
    //  Add the roles to the user
    await addRoleToUser(interaction.user.id, roleConfig.roles);
    //  Send a message to the user

    if (roleConfig.action !== undefined) roleConfig.action(interaction);

    if (roleConfig.choices.length > 0) {
      const message = new MessageActionRow();
      message.addComponents(new MessageSelectMenu().setCustomId(roleConfig.text).addOptions(roleConfig.choices.map(choice => ({
        label: choice.title,
        value: choice.nextID
      }))).setMinValues(1).setMaxValues(1).setPlaceholder("Faites votre choix"));
      await interaction.reply({ components: [message], content: roleConfig.text });
    } else {
      await interaction.reply({ content: roleConfig.text });
    }
  }
});

// Login to Discord with your client's token
client.login(process.env.TOKEN ?? "");
