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
    ]));
  await dmChannel.send({
    components: [schoolMessage],
    content: "Tu viens d'où ?",
  });
});

async function addRoleToUser(userID: string, roles: string[]) {
  const mainServer = await client.guilds.fetch(process.env.SERVER_ID ?? "");
  const user = await mainServer.members.fetch(userID);
  await user.roles.add(roles);
}

client.on("interactionCreate", async (interaction) => {
  if (interaction.isSelectMenu()) {
    if (!rolesConfig.has(interaction.values[0])) return;
    const roleConfig = rolesConfig.get(interaction.values[0]);
    if (roleConfig === undefined) return;
    //  Add the roles to the user
    await addRoleToUser(interaction.user.id, roleConfig.roles);
    //  Send a message to the user
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

    return;
  }
});

// Login to Discord with your client's token
client.login(process.env.TOKEN ?? "");
