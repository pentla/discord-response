import { Client, SlashCommandBuilder, GatewayIntentBits } from 'discord.js';
import { Firestore } from '@google-cloud/firestore'
import { createResponse, getResponse, listResponse, deleteResponse } from './firestore';
import { CustomResponse } from './type';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent,
  ]
});

const TOKEN = process.env.DISCORD_TOKEN
const PROJECT_ID = process.env.PROJECT_ID

const commands = [
  new SlashCommandBuilder().setName('create').setDescription('キーワードと返答を登録します')
    .addStringOption(option =>
      option.setName('keyword')
        .setDescription('呼び出すときに使うキーワード')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('response')
        .setDescription('呼び出される返答')
        .setRequired(true)),
  new SlashCommandBuilder().setName('list').setDescription('キーワード一覧を表示します'),
  new SlashCommandBuilder().setName('delete').setDescription('キーワードを削除します')
    .addStringOption(option =>
      option.setName('keyword')
        .setDescription('削除したいキーワード')
        .setRequired(true)),
]

client.on('ready', async () => {
  client.application?.commands.set(commands)
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('messageCreate', async (message) => {
  if (message.member?.id === client.user?.id) {
    return
  }
  const guildID = message.guildId
  if (!guildID) return
  getResponse(firestoreClient, guildID, message.content).then(res => {
    message.reply(res.response)
  }).catch(() => {
    // 見つからなかったのでなにもしない
  })
});

const firestoreClient = new Firestore({ projectId: PROJECT_ID });

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;
  const guildID = interaction.guildId
  if (!guildID) {
    throw new Error('serverID (guild id) is requried')
  }

  if (commandName === 'create') {
    let customResponse: CustomResponse = {
      response: interaction.options.getString('response') || '',
      keyword: interaction.options.getString('keyword') || ''
    }
    if (!customResponse.response || !customResponse.keyword) {
      throw new Error('keyword or response is required')
    }
    await createResponse(firestoreClient, guildID, customResponse)
    await interaction.reply(`${customResponse.keyword} を登録しました`);
  }
  if (commandName === 'delete') {
    const keyword = interaction.options.getString('keyword') || ''
    if (!keyword) {
      await interaction.reply(`キーワードが空です`);
    }
    deleteResponse(firestoreClient, guildID, keyword)
      .then(() => {
        interaction.reply(`${keyword} を削除しました`);
      })
      .catch(reason => {
        if (reason === 'NOTFOUND') {
          interaction.reply(`${keyword} 存在しません`);
        }
      })
  }
  if (commandName === 'list') {
    const keywords = await listResponse(firestoreClient, guildID)
    if (!keywords.length) {
      await interaction.reply(`登録されているキーワードはありません`)
      return
    }
    await interaction.reply(`登録済みキーワード: ${keywords.join(', ')}`)
  }
});

client.login(TOKEN);