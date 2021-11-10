import { Interaction, MessageActionRow, MessageButton } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";

export type RoleMessage = {
  roles: string[];
  text: string;
  choices: {
    title: string;
    nextID: string;
  }[];
  action?: (interaction: Interaction) => void;
};

const receiveBDENotifications = async (interaction: Interaction) => {
  const messageComponents = new MessageActionRow().addComponents(new MessageButton().setCustomId("bde-ping").setLabel("Je souhaite recevoir les notifications du BDE").setEmoji("👍").setStyle(MessageButtonStyles.SUCCESS));

  await interaction.user.send({
    content:
      "ℹ️ Le Bureau des Élèves (BDE) utilise ce serveur afin d'envoyer des informations importantes à l'intention des étudiants. Souhaitez-vous recevoir une notification à chaque annonce ? Si vous ne souhaitez pas recevoir de notification, aucune action de votre part n'est requise.",
    components: [messageComponents],
  });
};

const roleConfig = {
  esir1: {
    informatique: "906828148002394122",
    tis: "906828259948392468",
    materiaux: "906828338327339008",
    snr: "906828448293584938",
    main: "750766287310815312",
  },
  esir2: {
    si: "902111903432708116",
    in: "902112103756861460",
    iot: "902112672642920459",
    tis: "902112395818860564",
    materiaux: "902112235739049994",
    snr: "902112549590421505",
    main: "882695460157022279",
  },
  esir3: {
    si: "906829447154507787",
    in: "906828561204277288",
    iot: "906828661523644447",
    tis: "906828756415565824",
    materiaux: "906828841274716160",
    snr: "906828920211505222",
    main: "882695521892962355",
  },
  preparatory1: {
    main: "879761516604305418",
  },
  preparatory2: {
    main: "750766922366451812",
  },
  idesir: {
    main: "898149804352348191",
  },
  esir: {
    main: "737911352106025070",
  },
  friend: {
    main: "666348080039198720",
  },
  istic: {
    main: "737911433106292826",
  },
  bde: {
    ping: "888340754722861066"
  }
};

const rolesConfig: Map<string, RoleMessage> = new Map<string, RoleMessage>([
  [
    "esir",
    {
      roles: [roleConfig.esir.main],
      text: "Super ! Quelle promotion ?",
      choices: [
        {
          title: "CUPGE1",
          nextID: "cupge1",
        },
        {
          title: "CUPGE2",
          nextID: "cupge2",
        },
        {
          title: "ESIR1",
          nextID: "esir1",
        },
        {
          title: "ESIR2",
          nextID: "esir2",
        },
        {
          title: "ESIR3",
          nextID: "esir3",
        },
      ],
    },
  ],
  [
    "istic",
    {
      roles: [roleConfig.istic.main],
      text: "Bienvenue à l'ISTIC !",
      choices: [],
    },
  ],
  [
    "idesir",
    {
      roles: [roleConfig.idesir.main],
      text: "Bienvenue à l'IDEDIR !",
      choices: [],
    },
  ],
  [
    "friend",
    {
      roles: [roleConfig.friend.main],
      text: "Bienvenue à toi l'ami !",
      choices: [],
    },
  ],

  [
    "cupge1",
    {
      roles: [roleConfig.preparatory1.main],
      text: "Bienvenue en CUPGE1 !",
      choices: [],
    },
  ],
  [
    "cupge2",
    {
      roles: [roleConfig.preparatory2.main],
      text: "Bienvenue en CUPGE2 !",
      choices: [],
    },
  ],

  [
    "esir1",
    {
      roles: [roleConfig.esir1.main],
      text: "Quelle spécialité ?",
      choices: [
        {
          title: "Informatique",
          nextID: "esir1-informatique",
        },
        {
          title: "TIS",
          nextID: "esir1-tis",
        },
        {
          title: "Matériaux",
          nextID: "esir1-materiaux",
        },
        {
          title: "SNR",
          nextID: "esir1-snr",
        },
      ],
    },
  ],
  [
    "esir2",
    {
      roles: [roleConfig.esir2.main],
      text: "Quelle spécialité ?",
      choices: [
        {
          title: "SI",
          nextID: "esir2-si",
        },
        {
          title: "IN",
          nextID: "esir2-in",
        },
        {
          title: "IoT",
          nextID: "esir2-iot",
        },
        {
          title: "TIS",
          nextID: "esir2-tis",
        },
        {
          title: "Matériaux",
          nextID: "esir2-materiaux",
        },
        {
          title: "SNR",
          nextID: "esir2-snr",
        },
      ],
    },
  ],
  [
    "esir3",
    {
      roles: [roleConfig.esir3.main],
      text: "Quelle spécialité ?",
      choices: [
        {
          title: "SI",
          nextID: "esir3-si",
        },
        {
          title: "IN",
          nextID: "esir3-in",
        },
        {
          title: "IoT",
          nextID: "esir3-iot",
        },
        {
          title: "TIS",
          nextID: "esir3-tis",
        },
        {
          title: "Matériaux",
          nextID: "esir3-materiaux",
        },
        {
          title: "SNR",
          nextID: "esir3-snr",
        },
      ],
    },
  ],
  //  ESIR 1
  [
    "esir1-informatique",
    {
      roles: [roleConfig.esir1.informatique],
      text: "Bienvenue !",
      choices: [],
      action: receiveBDENotifications
    },
  ],
  [
    "esir1-tis",
    {
      roles: [roleConfig.esir1.tis],
      text: "Bienvenue !",
      choices: [],
      action: receiveBDENotifications
    },
  ],
  [
    "esir1-materiaux",
    {
      roles: [roleConfig.esir1.materiaux],
      text: "Bienvenue !",
      choices: [],
      action: receiveBDENotifications
    },
  ],
  [
    "esir1-snr",
    {
      roles: [roleConfig.esir1.snr],
      text: "Bienvenue !",
      choices: [],
      action: receiveBDENotifications
    },
  ],
  //  ESIR 2
  [
    "esir2-si",
    {
      roles: [roleConfig.esir2.si],
      text: "Bienvenue !",
      choices: [],
      action: receiveBDENotifications
    },
  ],
  [
    "esir2-in",
    {
      roles: [roleConfig.esir2.in],
      text: "Bienvenue !",
      choices: [],
      action: receiveBDENotifications
    },
  ],
  [
    "esir2-iot",
    {
      roles: [roleConfig.esir2.iot],
      text: "Bienvenue !",
      choices: [],
      action: receiveBDENotifications
    },
  ],
  [
    "esir2-tis",
    {
      roles: [roleConfig.esir2.tis],
      text: "Bienvenue !",
      choices: [],
      action: receiveBDENotifications
    },
  ],
  [
    "esir2-materiaux",
    {
      roles: [roleConfig.esir2.materiaux],
      text: "Bienvenue !",
      choices: [],
      action: receiveBDENotifications
    },
  ],
  [
    "esir2-snr",
    {
      roles: [roleConfig.esir2.snr],
      text: "Bienvenue !",
      choices: [],
      action: receiveBDENotifications
    },
  ],
  //  ESIR 3
  [
    "esir3-si",
    {
      roles: [roleConfig.esir3.si],
      text: "Bienvenue !",
      choices: [],
      action: receiveBDENotifications
    },
  ],
  [
    "esir3-in",
    {
      roles: [roleConfig.esir3.in],
      text: "Bienvenue !",
      choices: [],
      action: receiveBDENotifications
    },
  ],
  [
    "esir3-iot",
    {
      roles: [roleConfig.esir3.iot],
      text: "Bienvenue !",
      choices: [],
      action: receiveBDENotifications
    },
  ],
  [
    "esir3-tis",
    {
      roles: [roleConfig.esir3.tis],
      text: "Bienvenue !",
      choices: [],
      action: receiveBDENotifications
    },
  ],
  [
    "esir3-materiaux",
    {
      roles: [roleConfig.esir3.materiaux],
      text: "Bienvenue !",
      choices: [],
      action: receiveBDENotifications
    },
  ],
  [
    "esir3-snr",
    {
      roles: [roleConfig.esir3.snr],
      text: "Bienvenue !",
      choices: [],
      action: receiveBDENotifications
    },
  ],

  [
    "bde-ping",
    {
      roles: [roleConfig.bde.ping],
      text: "☑️ Vous receverez maintenant une notification à chaque annonce du BDE.",
      choices: [],
    },
  ],
]);

export default rolesConfig;
