// BASE DO GUTO
// YouTube: @gutoxtazv9
// WhatsApp: +55 51 8992-6591
// Telegram: t.me/gutox9

// Use e modifique como quiser 🤝
// Só mantenha os créditos 😉

// Não é necessário alterar nada        
// se você não quiser erros.

const {
  default: makeWASocket,
  jidDecode,
  DisconnectReason,
  useMultiFileAuthState,
  Browsers,
  getContentType,
  proto,
  makeInMemoryStore,
  downloadContentFromMessage,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  jidNormalizedUser,
} = require("@whiskeysockets/baileys");
global.instanciasZap = global.instanciasZap || {};
const executarComandos = require("./WhatsApp_bot.js");
const NodeCache = require("node-cache");
const _ = require('lodash');
const EventEmitter = require("events");
const { Boom } = require('@hapi/boom');
const PhoneNumber = require('awesome-phonenumber');
const readline = require("readline");
const pino = require('pino');
const FileType = require('file-type');
const fs = require('fs');
const path = require('path');
const pairingEvents = new EventEmitter();
let chalk;
(async () => {
  chalk = (await import('chalk')).default;
})();
const { isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, sleep, reSize } = require('./gutoxtaz/myfunc.js');
let phoneNumber = "555189926591";
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code");
const useMobile = process.argv.includes("--mobile");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const store = makeInMemoryStore({
  logger: pino({ level: "silent" })
});


// ======================================================
// 🧹🔥 FUNÇÃO PARA LIMPAR A SESSÃO (MANTÉM SÓ creds.json)
// ======================================================

function limparSessao(sessionPath) {
    try {
        if (!fs.existsSync(sessionPath)) {
            console.log("Pasta da sessão não existe:", sessionPath);
            return;
        }

        const itens = fs.readdirSync(sessionPath);

        itens.forEach(item => {
            if (item === "creds.json") return; // mantém apenas este arquivo

            const caminho = path.join(sessionPath, item);

            if (fs.lstatSync(caminho).isFile()) {
                fs.unlinkSync(caminho);
            } else if (fs.lstatSync(caminho).isDirectory()) {
                fs.rmSync(caminho, { recursive: true, force: true });
            }
        });

       console.log("Sessão limpa — apenas creds.json mantido!");
    } catch (err) {
        console.error("Erro ao limpar sessão:", err);
    }
}

// ======================================================
function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach(file => {
      const curPath = path.join(folderPath, file);
      fs.lstatSync(curPath).isDirectory() ? deleteFolderRecursive(curPath) : fs.unlinkSync(curPath);
    });
    fs.rmdirSync(folderPath);
  }
}
async function startpairing(gutoNumber) {
  if (global.isRestarting) return;
  global.isRestarting = true;
const sessionPath = './gutoxtaz/lib/pairing/' + gutoNumber; limparSessao(sessionPath);
  const { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds } = await useMultiFileAuthState('./gutoxtaz/lib/pairing/' + gutoNumber);  
  const uwu = makeWASocket({
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    auth: state,
    version,
    getMessage: async key => {
      const jid = jidNormalizedUser(key.remoteJid);
      const msg = await store.loadMessage(jid, key.id);
      return msg?.message || undefined;
    },
    shouldSyncHistoryMessage: () => false,
    syncFullHistoryMessage: false,
    markOnlineOnConnect: true,
  }, store);
      
  
 uwu.public = true; //aqui torna o bot privado
 
// ======================================== 
      

  if (pairingCode && !state.creds.registered) {
    if (useMobile) throw new Error('Não é possível usar o código de emparelhamento com a API móvel.');

    let phoneNumber = gutoNumber.replace(/[^0-9]/g, '');

    setTimeout(async () => {
      let code = await uwu.requestPairingCode(phoneNumber);
      code = code?.match(/.{1,4}/g)?.join("-") || code;

      fs.writeFile(
        './gutoxtaz/lib/pairing/pairing.json',
        JSON.stringify({ "code": code }, null, 2),
        'utf8',
        err => { }
      );
    }, 1703);
  }

  uwu.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return decode.user && decode.server && `${decode.user}@${decode.server}` || jid;
    } else {
      return jid;
    }
  };
  
uwu.ev.removeAllListeners('messages.upsert');

uwu.ev.on('messages.upsert', async (chatUpdate) => {
    try {
      const messages = chatUpdate.messages;
      if (!messages || messages.length === 0) return;

      let gutojid = messages[0];
      if (!gutojid.message) return;
      
      // Filtro de mensagens antigas (mais de 10 segundos)
      if (gutojid.messageTimestamp && gutojid.messageTimestamp < (Date.now() / 1000) - 10) return;

      gutojid.message = (gutojid.message.ephemeralMessage)
        ? gutojid.message.ephemeralMessage.message
        : gutojid.message;

      if (gutojid.key && gutojid.key.remoteJid === 'status@broadcast') return;
      if (!uwu.public && !gutojid.key.fromMe && chatUpdate.type === 'notify') return;
      if (gutojid.key.id.startsWith('BAE5') && gutojid.key.id.length === 16) return;

      const gutoyConnect = uwu;
      const mek = smsg(gutoyConnect, gutojid, store);

      // CHAMADA OTIMIZADA:
     executarComandos(gutoyConnect, mek, chatUpdate, store);                  

    } catch (err) {
      console.error("Erro no processamento de mensagem:", err);
    }
  });
                    
  uwu.sendText = (jid, text, quoted = '', options) => uwu.sendMessage(jid, { text: text, ...options }, { quoted });

  uwu.getFile = async (PATH, save) => {
    let res;
    let data = Buffer.isBuffer(PATH)
      ? PATH
      : /^data:.*?\/.*?;base64,/i.test(PATH)
      ? Buffer.from(PATH.split`,`[1], 'base64')
      : /^https?:\/\//.test(PATH)
      ? await (res = await getBuffer(PATH))
      : fs.existsSync(PATH)
      ? (filename = PATH, fs.readFileSync(PATH))
      : typeof PATH === 'string'
      ? PATH
      : Buffer.alloc(0);

    let type = await FileType.fromBuffer(data) || { mime: 'application/octet-stream', ext: '.bin' };
    filename = path.join(__filename, '../src/' + new Date * 1 + '.' + type.ext);
    if (data && save) fs.promises.writeFile(filename, data);
    return { res, filename, size: await getSizeMedia(data), ...type, data };
  };

  uwu.ments = (teks = "") => {
    return teks.match("@")
      ? [...teks.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + "@s.whatsapp.net")
      : [];
  };



uwu.ev.on("connection.update", async (update) => {
  const { connection, lastDisconnect } = update;

  if (connection === "close") {

    const meuNumero = uwu?.user?.id?.split(':')[0] || gutoNumber;

    // pequeno delay
    await sleep(500);

    // 🔌 fecha conexão antiga
    if (meuNumero && global.instanciasZap[meuNumero]) {
      try {
        global.instanciasZap[meuNumero].end();
      } catch {}
      delete global.instanciasZap[meuNumero];

      console.log(`Instância removida da memória: ${meuNumero}`);
    }

    let reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
    console.log("Motivo:", reason);

    if (reason === DisconnectReason.badSession) {

    } else if ([
      DisconnectReason.connectionClosed,
      DisconnectReason.connectionLost,
      DisconnectReason.restartRequired,
      DisconnectReason.timedOut,
      405
    ].includes(reason)) {

      await sleep(2000);

      // 🔁 reconexão protegida (ANTI LOOP)
      if (!global.reconnecting) {
        global.reconnecting = true;
        try {
          await sleep(3000);
          await startpairing(gutoNumber);
        } catch (e) {
          console.error("Erro ao reconectar:", e);
        } finally {
          global.reconnecting = false;
        }
      }

    } else if (reason === DisconnectReason.loggedOut) {

      deleteFolderRecursive('./gutoxtaz/lib/pairing/' + gutoNumber);
      console.log(chalk.redBright(`${gutoNumber} desconectado do uso do bot`));

    } else {

      console.log(`Motivo da desconexão: desconhecido ${reason}`);
    }
  }

  else if (connection === "open") {

    console.log(chalk.blueBright(`bot ativado ${gutoNumber}`));

    const meuNumero = uwu?.user?.id?.split(':')[0] || gutoNumber;

    // 🔥 evita duplicação de conexão
    if (global.instanciasZap[meuNumero] && global.instanciasZap[meuNumero] !== uwu) {
      try {
        global.instanciasZap[meuNumero].end();
      } catch {}
    }

    global.instanciasZap[meuNumero] = uwu;

    // salva status
    try {
      fs.writeFileSync(
        "./gutoxtaz/lib/pairing/status.json",
        JSON.stringify({ connected: true }, null, 2)
      );
    } catch (err) {
      console.error("Erro ao salvar status.json:", err);
    }

    pairingEvents.emit("connected", gutoNumber);
  }
});

uwu.ev.on('creds.update', saveCreds);
global.isRestarting = false;

}


module.exports = startpairing;
module.exports.events = pairingEvents;


function smsg(uwu, m, store) {
    try {       
        if (!m || typeof m !== 'object') {
            console.warn('smsg: entrada inválida (não é objeto):', typeof m);
            return m;
        }        
        if (!m.message || typeof m.message !== 'object') m.message = {};
        let M = proto?.WebMessageInfo ?? null; 
        if (m.key && typeof m.key === 'object') {
            m.id = m.key.id
            m.isBaileys = !!(m.id && typeof m.id === 'string' && m.id.startsWith('BAE5') && m.id.length === 16)
            m.chat = m.key.remoteJid
            m.fromMe = m.key.fromMe
            m.isGroup = !!(m.chat && m.chat.endsWith && m.chat.endsWith('@g.us'))
            m.sender = uwu.decodeJid(
                (m.fromMe && uwu.user && uwu.user.id) ||
                m.participant ||
                m.key.participant ||
                m.chat ||
                ''
            )
            if (m.isGroup) m.participant = uwu.decodeJid(m.key.participant) || ''
        }       
        if (m.message && typeof m.message === 'object') {
          
            let contentType = null
            try {
                contentType = getContentType(m.message)
            } catch (errContent) {               
                contentType = null                              
            }
            m.mtype = contentType || null
            if (!m.mtype) {                
                return m
            }            
            try {
                if (m.mtype === 'viewOnceMessage' && m.message[m.mtype]) {
                    const inner = m.message[m.mtype].message
                    m.msg = inner ? inner[getContentType(inner)] : {}
                } else {
                    m.msg = m.message[m.mtype] || {}
                }
            } catch (errMsg) {
                m.msg = {}
            }
            m.body =
                m.message.conversation ||
                m.msg.caption ||
                m.msg.text ||
                ((m.mtype === 'listResponseMessage') && m.msg.singleSelectReply?.selectedRowId) ||
                ((m.mtype === 'buttonsResponseMessage') && m.msg.selectedButtonId) ||
                ((m.mtype === 'viewOnceMessage') && m.msg.caption) ||
                m.text
            let quoted = (m.quoted = m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null)
            m.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
            if (m.quoted) {
                try {
                    let type = getContentType(quoted)
                    m.quoted = m.quoted[type] || m.quoted

                    if (['productMessage'].includes(type)) {
                        type = getContentType(m.quoted)
                        m.quoted = m.quoted[type] || m.quoted
                    }
                    if (typeof m.quoted === 'string') m.quoted = { text: m.quoted }
                    m.quoted.mtype = type
                    m.quoted.id = m.msg.contextInfo?.stanzaId
                    m.quoted.chat = m.msg.contextInfo?.remoteJid || m.chat
                    m.quoted.isBaileys = m.quoted.id ? (m.quoted.id.startsWith && m.quoted.id.startsWith('BAE5') && m.quoted.id.length === 16) : false
                    m.quoted.sender = uwu.decodeJid(m.msg.contextInfo?.participant)
                    m.quoted.fromMe = m.quoted.sender === uwu.decodeJid(uwu.user?.id)
                    m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.conversation || m.quoted.contentText || m.quoted.selectedDisplayText || m.quoted.title || ''
                    m.quoted.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
                    m.getQuotedObj = m.getQuotedMessage = async () => {
                        if (!m.quoted.id) return false
                        let q = await store.loadMessage(m.chat, m.quoted.id, uwu)
                        return exports.smsg ? exports.smsg(uwu, q, store) : q
                    }
                    if (M && M.fromObject) {
                        let vM = (m.quoted.fakeObj = M.fromObject({
                            key: {
                                remoteJid: m.quoted.chat,
                                fromMe: m.quoted.fromMe,
                                id: m.quoted.id,
                            },
                            message: quoted,
                            ...(m.isGroup ? { participant: m.quoted.sender } : {})
                        }))
                        m.quoted.delete = () => uwu.sendMessage(m.quoted.chat, { delete: vM.key })
                        m.quoted.copyNForward = (jid, forceForward = false, options = {}) => uwu.copyNForward(jid, vM, forceForward, options)
                    } else {                        
                        m.quoted.delete = () => { throw new Error('fakeObj not available') }
                        m.quoted.copyNForward = () => { throw new Error('fakeObj not available') }
                    }
                    m.quoted.download = () => uwu.downloadMediaMessage(m.quoted)
                } catch (errQuoted) {
                    console.warn('smsg: erro ao processar quoted:', errQuoted)
                }
            }
        } 
        if (m.msg && m.msg.url) m.download = () => uwu.downloadMediaMessage(m.msg)
        m.text =
            (m.msg && (m.msg.text || m.msg.caption)) ||
            m.message.conversation ||
            (m.msg && m.msg.contentText) ||
            (m.msg && m.msg.selectedDisplayText) ||
            (m.msg && m.msg.title) ||
            m.text || ''
        m.reply = (text, chatId = m.chat, options = {}) =>
            Buffer.isBuffer(text)
                ? uwu.sendMedia(chatId, text, 'file', '', m, { ...options })
                : uwu.sendText(chatId, text, m, { ...options })
        m.copy = () => {
            try {
                return exports.smsg(uwu, M.fromObject(M.toObject(m)), store)
            } catch (errCopy) {               
                return { ...m }
            }
        }
        m.copyNForward = (jid = m.chat, forceForward = false, options = {}) => uwu.copyNForward(jid, m, forceForward, options)
        return m
    } catch (err) {        
        try {
            console.error('smsg: exceção capturada:', err && err.stack ? err.stack : err)
            console.error('smsg: objeto de entrada (resumido):', {
                id: m && m.key && m.key.id,
                remoteJid: m && m.key && m.key.remoteJid,
                hasMessage: !!(m && m.message),
                mtype: m && m.mtype
            })
        } catch (e) {
            console.error('smsg: falha ao logar erro:', e)
        }        
        return m
    }
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.redBright(`Update= '${__filename}'`))
delete require.cache[file]
require(file)
})