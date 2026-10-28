

// Use e modifique como quiser 🤝
// Só mantenha os créditos 😉

process.on('uncaughtException', (err) => {
  console.log("⚠️ uncaughtException:", err.message);
});

process.on("unhandledRejection", (reason) => {
  console.log("⚠️ unhandledRejection:", reason);
});

const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const { readdir } = require('fs').promises;
const PAIR_FOLDER = "./gutoxtaz/lib/pairing/";
// ================================
// FUNÇÃO GLOBAL DE ESPERA
// ================================
function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

// ================================
// DELETAR PASTAS DE SESSÃO
// ================================
async function deleteFolderRecursive(folderPath) {
  if (!fs.existsSync(folderPath)) return;

  try {
    for (const file of fs.readdirSync(folderPath)) {
      const cur = path.join(folderPath, file);

      if (fs.lstatSync(cur).isDirectory()) {
        await deleteFolderRecursive(cur);
      } else {
        fs.unlinkSync(cur);
      }
    }
    fs.rmdirSync(folderPath);
    console.log(`🗑️ Sessão removida: ${folderPath}`);
  } catch (err) {
    console.error("Erro ao deletar pasta:", err);
  }
}

// ===================================================================
// APAGA SESSÕES AUTOMÁTICAS NO WhatsApp (SEU BLOCO)
// ===================================================================

global.handleConnectionUpdate = async function (uwu, update) {
  const { connection, lastDisconnect } = update;
  const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;

  if (connection === 'connecting') {
    console.log('Conectando...');
  }







if (connection === 'open') {
  console.log('USUÁRIO CONECTADO COM SUCESSO ✔️');

  const pairingPath = "./gutoxtaz/lib/pairing/";
  const statusFile = pairingPath + "status.json";

  try {
    if (!fs.existsSync(pairingPath)) {
      fs.mkdirSync(pairingPath, { recursive: true });
    }

    const statusData = {
      connected: true,
      connected_at: new Date().toISOString()
    };

 
    fs.writeFileSync(statusFile, JSON.stringify(statusData, null, 2));

    console.log("📁 status.json criado/atualizado com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao criar status.json:", err);
  }

 await sleep(2000);

  fs.readdir('./gutoxtaz/lib/pairing/', { withFileTypes: true }, async (err, dirents) => {
    if (err) return console.error(err);

    for (const dirent of dirents) {
      if (!dirent.isDirectory()) continue;

      const dirPath = `./gutoxtaz/lib/pairing/${dirent.name}`;

      try {
        const files = await readdir(dirPath);

        if (files.length === 0) {
          console.log(`Sessão vazia encontrada (${dirent.name}) — apagando...`);
          await deleteFolderRecursive(dirPath);
          continue;
        }

        console.log(`Verificando sessão: ${dirent.name}`);

        try {
          const startpairing = require('./zaindex.js');
          await startpairing(dirent.name);
        } catch (e) {
          console.log(`Sessão inválida (${dirent.name}) — removendo...`);
          await deleteFolderRecursive(dirPath);
          continue;
        }

        await sleep(2000);

      } catch (err) {
        console.error(`Erro ao processar ${dirent.name}:`, err);
        await deleteFolderRecursive(dirPath);
        }
      }
    });
  }
};


async function carregarTodasSessoes() {
  console.log("🔍 Carregando sessões existentes...");

  fs.readdir(PAIR_FOLDER, { withFileTypes: true }, async (err, dirents) => {
    if (err) return console.error(err);

    for (const dirent of dirents) {
      if (!dirent.isDirectory()) continue;

      const dirPath = `${PAIR_FOLDER}${dirent.name}`;

      try {
        const files = await readdir(dirPath);

        if (files.length === 0) {
          console.log(`Sessão vazia encontrada (${dirent.name}) — apagando...`);
          await deleteFolderRecursive(dirPath);
          continue;
        }

        try {
          const startpairing = require('./zaindex.js');
          await startpairing(dirent.name);

        } catch (e) {
          console.log(`❌ Sessão inválida (${dirent.name}) — removendo...`);
          await deleteFolderRecursive(dirPath);
          continue;
        }

        await sleep(1500);

      } catch (err) {
        console.error(`Erro ao processar ${dirent.name}:`, err);
        await deleteFolderRecursive(dirPath);
      }
    }
  });
}


carregarTodasSessoes();
// =========================
// BOT TELEGRAM
// =========================
const token = "SEU_TOKEN_AQUI";


const bot = new TelegramBot(token, { polling: true });

console.log("🤖 Telegram Bot Online!");

bot.on('message', (msg) => {
  console.log(`📩 Mensagem recebida de ${msg.chat.id}:`, msg.text);
});

// =========================
// Importar Comandos
// =========================
const comandos = require("./telegram_bot.js");
comandos(bot);


let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(`Update ${__filename}`);
  delete require.cache[file];
  require(file);
});
