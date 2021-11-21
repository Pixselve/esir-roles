import { Interaction, UserResolvable } from "discord.js";

export enum MuteError {
  AlreadyMuted,
}

export default async function (userID: UserResolvable, interaction: Interaction, reason: string = "") {
  const guildMember = await interaction.guild.members.fetch(userID);
  if (guildMember.roles.cache.has(process.env.ROLE_MUTED ?? "")) throw MuteError.AlreadyMuted;
  await guildMember.roles.add(process.env.ROLE_MUTED ?? "");

  await guildMember.send("⚠️ Vous avez été rendu muet par un administrateur du serveur." + (reason?.length > 0 ? ` Raison : ${ reason }` : ""));

}
