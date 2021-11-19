import { config } from "dotenv";
// Require the necessary discord.js classes
import { Client, Intents, MessageActionRow, MessageSelectMenu } from "discord.js";
import rolesConfig from "./roles-config";

config();

// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
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
        label: 'ESIR',
        value: 'esir',
      },
      {
        label: 'ISTIC',
        value: 'istic',
      },
      {
        label: 'IDESIR',
        value: 'idesir',
      },
      {
        label: 'Je suis un pote de pote d\'une connaissance',
        value: 'friend',
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

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    switch (interaction.commandName) {
      case "mute":
        const user = interaction.options.getUser("utilisateur");
        const reason = interaction.options.getString("raison");
        const guildMember = await interaction.guild.members.fetch(user)
        if (guildMember.roles.cache.has(process.env.ROLE_MUTED ?? "")) {
          await interaction.reply({
            content: "❌ Cet utilisateur est déjà muet.",
            ephemeral: true
          });
          return;
        }
        await guildMember.roles.add(process.env.ROLE_MUTED ?? "", reason);

        await user.send("⚠️ Vous avez été rendu muet par un administrateur du serveur." + (reason.length > 0 ? ` Raison : ${reason}` : ""));

        await interaction.reply({
          content: "☑️ Utilisateur rendu muet.",
          ephemeral: true,
        });
        break;
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
