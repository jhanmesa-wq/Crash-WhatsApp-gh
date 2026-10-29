// YouTube: @gutoxtazv9
// WhatsApp: +55 51 8992-6591
// Telegram: t.me/gutox9

// Use e modifique como quiser 🤝
// Só mantenha os créditos 😉

const fs = require("fs");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chalk = require("chalk");

// =============================
// CANAIS OBRIGATÓRIOS PARA ENTRAR
// =============================
const canaisObrigatorios = [
  -1004378775177, // CANAL
];

// AQUI ID DONO DO BOT
const donoId =  8271623149; // ID DO DONO

// Importar eventos do zaindex
const { events } = require("./zaindex.js");

// SISTEMA DE ESTADO PARA EVITAR BUG
const aguardandoNumero = {}; 
const ultimaMsg = {}; // <--- ARMAZENA O ID DA MENSAGEM ANTIGA DO BOT

// =============================
// SISTEMA DE BROADCAST
// =============================
const usuariosFile = "./usuarios.json";
let usuarios = fs.existsSync(usuariosFile)
  ? JSON.parse(fs.readFileSync(usuariosFile))
  : [];

function salvarUsuarios() {
  fs.writeFileSync(usuariosFile, JSON.stringify(usuarios, null, 2));
}
// =============================

module.exports = (bot) => {
  // =============================
  // COMANDOS DO BOT
  // =============================
  bot.setMyCommands([
    { command: "/start", description: "base do Guto" },
  ]);

  // Função para checar se o usuário está em todos os canais
  async function checarCanais(userId) {
    for (const canal of canaisObrigatorios) {
      try {
        const membro = await bot.getChatMember(canal, userId);
        if (membro.status === "left" || membro.status === "kicked") {
          return false;
        }
      } catch {
        return false;
      }
    }
    return true;
  }
  // ======================================
  // verificação
  // ======================================
bot.on("message", async (msg) => {
  // 1. IGNORAR GRUPOS E CANAIS LOGO NO INÍCIO
  if (msg.chat.type !== "private") return;
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text || "";
  const command = text.split(" ")[0]?.toLowerCase();
  if (!usuarios.includes(chatId)) {
    usuarios.push(chatId);
    salvarUsuarios();
  }


  

    // =============================
    // COMANDO CONECTAR AO BOT
    // =============================
       if (aguardandoNumero[userId]) {
  const numero = text.replace(/[^0-9]/g, "");

  if (numero.length < 10 || numero.length > 16) {

    delete aguardandoNumero[userId];
    
    if (ultimaMsg[chatId]) await bot.deleteMessage(chatId, ultimaMsg[chatId]).catch(() => {});
   
    const m = await bot.sendMessage(chatId, "❌ <b>Número inválido!</b>\nTente vincular novamente pelo botão abaixo.", { 
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "🔙 Tentar Novamente", callback_data: "conectar_whatsapp" }]]
      }
    });

    ultimaMsg[chatId] = m.message_id;
    return; 
  }
 
  delete aguardandoNumero[userId];

  const jid = numero + "@s.whatsapp.net";
  const startpairing = require("./zaindex.js");

  try {
    await startpairing(jid);
  } catch (e) {
    console.error(e);
  }

  await sleep(1500);

  const cu = JSON.parse(fs.readFileSync("./gutoxtaz/lib/pairing/pairing.json"));

  if (ultimaMsg[chatId]) await bot.deleteMessage(chatId, ultimaMsg[chatId]).catch(() => {});
  
  const mParear = await bot.sendMessage(chatId, `
<blockquote>
🔐 <b>Seu Código de Pareamento:</b>

${cu.code}

📌 Como conectar:
• O WhatsApp deve mostrar a notificação de pareamento.
• Toque e insira exatamente o código acima.

⚠ Caso não apareça:
• WhatsApp → Dispositivos Conectados → Conectar
</blockquote>
    `, { parse_mode: "HTML" });
  ultimaMsg[chatId] = mParear.message_id;

  const jidAtual = jid;
 
  events.on("connected", async (jid_event) => {
  
    if (jid_event !== jidAtual) return;

    if (ultimaMsg[chatId]) await bot.deleteMessage(chatId, ultimaMsg[chatId]).catch(() => {});
        
    const mConect = await bot.sendMessage(chatId, `
<blockquote>
✅ <b>SESSÃO CONECTADA!</b>

O número <b>${numero}</b> agora está ativo no sistema. 🚀
</blockquote>

<b>Como utilizar:</b>
Abra o seu <b>WhatsApp</b> (o número que você acabou de conectar) e digite o comando abaixo no seu próprio chat ou em um grupo:

📌 <code>.menu</code>

<i>Aproveite todas as funções do bot!</i>
    `, { 
      parse_mode: "HTML",
      disable_web_page_preview: false 
    });
    
    ultimaMsg[chatId] = mConect.message_id;
  });

  events.on("disconnected", (jid_event) => {
    const jidFormatado = jid_event.includes("@s.whatsapp.net")
      ? jid_event
      : jid_event + "@s.whatsapp.net";

    if (jidFormatado !== jidAtual) return;
  });
  
  return;
}
        
// =============================
// COMANDO 
// =============================
    

    
    
    
    if (command === "/start") {
      const membro = await checarCanais(userId);

      if (!membro) {
        if (ultimaMsg[chatId]) await bot.deleteMessage(chatId, ultimaMsg[chatId]).catch(() => {});
        const mStartNo = await bot.sendMessage(chatId, `
<blockquote>
🚨 • Atenção! Você ainda não é membro do nosso canal no Telegram.
Para continuar, entre usando o botão abaixo.
Após entrar, digite <b>/start</b> novamente.
</blockquote>
<blockquote>
🚨 • Attention! You are not yet a member of our Telegram channel.
To proceed, join using the button below.
After joining, type <b>/start</b> again.
</blockquote>
`, {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [{ text: "ℹ️ ENTRAR NO CANAL ℹ️", url: "https://t.me/fhhffnn" }], //coloca o link do seu grupo ou o canal aqui
              [{ text: "🔄 ATUALIZAR 🔄", callback_data: "atualizar" }],
            ],
          },
        });
        ultimaMsg[chatId] = mStartNo.message_id;
        return;
      }

      if (ultimaMsg[chatId]) await bot.deleteMessage(chatId, ultimaMsg[chatId]).catch(() => {});
      const mStartOk = await bot.sendMessage(chatId, `
<blockquote>
🚀 <b>BASE GRATUITA LIBERADA!</b>Essa base foi disponibilizada gratuitamente para que qualquer pessoa possa criar e usar seu próprio bot de sessões WhatsApp 🔥

🛠️ <b>COMO CONFIGURAR:</b>

📌 <b>Definir dono do bot:</b>
Procure por:
<code>const donoId = 5917927899;</code>
E troque pelo seu ID do Telegram.

📌 <b>Definir canais obrigatórios:</b>
Procure por:
<code>const canaisObrigatorios = [ -1002546433275 ];</code>
E substitua pelos IDs dos seus próprios canais.

💡 Para adicionar mais canais, basta colocar assim:
<code>const canaisObrigatorios = [ -100xxxxxxx, -100yyyyyyy ];</code>

🔘 <b>Sobre o botão do bot:</b>
O botão abaixo serve para <b>conectar o bot ao WhatsApp</b>.
Após a conexão, a sessão será salva automaticamente na <b>pasta "pairing"</b>.

📂 <b>Onde editar os comandos:</b>
Os comandos do bot (cases) ficam no arquivo:
<code>WhatsApp.js</code>

É lá que você pode editar, adicionar ou remover funções do bot.

⚠️ <b>Importante:</b> se não configurar corretamente, o bot pode não funcionar como esperado.

📦 <b>Créditos:</b> base desenvolvida por <b>Guto</b> ✔️
Se for usar ou compartilhar, mantenha os créditos.

🔥 Agora é só editar, rodar e usar seu próprio bot sem limitações!

Bom uso 🚀

</blockquote>

<blockquote>
🚀 <b>FREE BASE RELEASED!</b>This base is available for anyone to create their own WhatsApp bot 🔥

🛠️ <b>HOW TO CONFIGURE:</b>

📌 <b>Set bot owner:</b>
Find:
<code>const donoId = 5917927899;</code>
Replace with your Telegram ID.

📌 <b>Set required channels:</b>
Find:
<code>const canaisObrigatorios = [ -1002546433275 ];</code>
Replace with your own channel IDs.

💡 To add more channels:
<code>const canaisObrigatorios = [ -100xxxxxxx, -100yyyyyyy ];</code>

🔘 <b>About the button:</b>
The button is used to <b>connect the bot to WhatsApp</b>.
After connection, the session will be saved in the <b>"pairing"</b> folder.

📂 <b>Where to edit commands:</b>
Bot commands (cases) are located in:
<code>WhatsApp.js</code>

You can edit or add new features there.

⚠️ <b>Important:</b> wrong configuration may break the bot.

📦 <b>Credits:</b> developed by <b>Guto</b> ✔️
Keep the credits if you share.

🔥 Edit, run and enjoy your own bot!

Good luck 🚀

</blockquote>
`, {
        parse_mode: "HTML",
        disable_web_page_preview: false,
                              
        reply_markup: {
          inline_keyboard: [
    [{ text: "🔌 𝘾𝙊𝙉𝙀𝘾𝙏𝘼𝙍 𝘼𝙊 𝘽𝙊𝙏 🔌", callback_data: "conectar_whatsapp" }],
          ],
        },
      });
      ultimaMsg[chatId] = mStartOk.message_id;
      return;
    }
    
    // =============================
    // /perfil
    // =============================
    if (command === "/perfil") {
      if (!msg.from) return bot.sendMessage(chatId, "❌ Não foi possível acessar seu perfil.");

      const firstName = msg.from.first_name || "";
      const lastName = msg.from.last_name || "";
      const username = msg.from.username ? "@" + msg.from.username : "";
      const userId = msg.from.id;

      let profilePhotos;
      try {
        profilePhotos = await bot.getUserProfilePhotos(userId, { limit: 1 });
      } catch {
        profilePhotos = null;
      }

      const photoId = profilePhotos?.photos?.[0]?.[0]?.file_id;

      if (ultimaMsg[chatId]) await bot.deleteMessage(chatId, ultimaMsg[chatId]).catch(() => {});

      let mPerfil;
      if (photoId) {
        mPerfil = await bot.sendPhoto(chatId, photoId, {
          caption: `👤 Nome: ${firstName} ${lastName}\n🔹 Username: ${username}\n🆔 ID: ${userId}`,
        });
      } else {
        mPerfil = await bot.sendMessage(
          chatId,
          `👤 Nome: ${firstName} ${lastName}\n🔹 Username: ${username}\n🆔 ID: ${userId}`
        );
      }
      ultimaMsg[chatId] = mPerfil.message_id;
      return;
    }

    // =============================
    // COMANDO /BROADCAST (REPOSTA)
    // =============================
    if (command === "/broadcast") {
      if (msg.from.id !== donoId) {
        if (ultimaMsg[chatId]) await bot.deleteMessage(chatId, ultimaMsg[chatId]).catch(() => {});
        const mErro = await bot.sendMessage(chatId, "❌ Apenas o administrador pode usar este comando.");
        ultimaMsg[chatId] = mErro.message_id;
        return;
      }

      if (!msg.reply_to_message) {
        if (ultimaMsg[chatId]) await bot.deleteMessage(chatId, ultimaMsg[chatId]).catch(() => {});
        const mAviso = await bot.sendMessage(chatId, "⚠️ Responda a mensagem que deseja enviar a todos os usuários.");
        ultimaMsg[chatId] = mAviso.message_id;
        return;
      }

      const m = msg.reply_to_message;
      let enviados = 0;

      for (const id of usuarios) {
        try {
          if (m.text) {
            await bot.sendMessage(id, m.text, { parse_mode: "HTML" });
          } else if (m.photo && m.photo.length) {
            await bot.sendPhoto(id, m.photo[m.photo.length - 1].file_id, { caption: m.caption || "", parse_mode: "HTML" });
          } else if (m.video) {
            await bot.sendVideo(id, m.video.file_id, { caption: m.caption || "", parse_mode: "HTML" });
          } else if (m.document) {
            await bot.sendDocument(id, m.document.file_id, { caption: m.caption || "", parse_mode: "HTML" });
          } else {
            await bot.forwardMessage(id, msg.chat.id, m.message_id);
          }
          enviados++;
          await sleep(200); 
        } catch (err) {
          console.log("Erro ao enviar para:", id, err.message);
        }
      }

      if (ultimaMsg[chatId]) await bot.deleteMessage(chatId, ultimaMsg[chatId]).catch(() => {});
      const mSucesso = await bot.sendMessage(
        chatId,
        `✅ Aviso enviado para <b>${enviados}</b> usuários.`,
        { parse_mode: "HTML" }
      );
      ultimaMsg[chatId] = mSucesso.message_id;
      return;
    }
  }); 

  // ============================================
  // CALLBACK BUTTONS
  // ============================================
  bot.on("callback_query", async (query) => {
    // IGNORAR GRUPOS E CANAIS
    if (query.message.chat.type !== "private") return;

    const chatId = query.message.chat.id;
    const userId = query.from.id;

    if (query.data === "atualizar") {
      const membro = await checarCanais(userId);

      if (!membro) {
        return bot.answerCallbackQuery(query.id, {
          text: "❌ Você ainda não entrou no canal!",
          show_alert: true,
        });
      }

      if (ultimaMsg[chatId]) await bot.deleteMessage(chatId, ultimaMsg[chatId]).catch(() => {});
      const mAtu = await bot.sendMessage(chatId, `
<blockquote>
🚀 <b>BASE GRATUITA LIBERADA!</b>Essa base foi disponibilizada gratuitamente para que qualquer pessoa possa criar e usar seu próprio bot de sessões WhatsApp 🔥

🛠️ <b>COMO CONFIGURAR:</b>

📌 <b>Definir dono do bot:</b>
Procure por:
<code>const donoId = 5917927899;</code>
E troque pelo seu ID do Telegram.

📌 <b>Definir canais obrigatórios:</b>
Procure por:
<code>const canaisObrigatorios = [ -1002546433275 ];</code>
E substitua pelos IDs dos seus próprios canais.

💡 Para adicionar mais canais, basta colocar assim:
<code>const canaisObrigatorios = [ -100xxxxxxx, -100yyyyyyy ];</code>

🔘 <b>Sobre o botão do bot:</b>
O botão abaixo serve para <b>conectar o bot ao WhatsApp</b>.
Após a conexão, a sessão será salva automaticamente na <b>pasta "pairing"</b>.

📂 <b>Onde editar os comandos:</b>
Os comandos do bot (cases) ficam no arquivo:
<code>WhatsApp.js</code>

É lá que você pode editar, adicionar ou remover funções do bot.

⚠️ <b>Importante:</b> se não configurar corretamente, o bot pode não funcionar como esperado.

📦 <b>Créditos:</b> base desenvolvida por <b>Guto</b> ✔️
Se for usar ou compartilhar, mantenha os créditos.

🔥 Agora é só editar, rodar e usar seu próprio bot sem limitações!

Bom uso 🚀

</blockquote>

<blockquote>
🚀 <b>FREE BASE RELEASED!</b>This base is available for anyone to create their own WhatsApp bot 🔥

🛠️ <b>HOW TO CONFIGURE:</b>

📌 <b>Set bot owner:</b>
Find:
<code>const donoId = 5917927899;</code>
Replace with your Telegram ID.

📌 <b>Set required channels:</b>
Find:
<code>const canaisObrigatorios = [ -1002546433275 ];</code>
Replace with your own channel IDs.

💡 To add more channels:
<code>const canaisObrigatorios = [ -100xxxxxxx, -100yyyyyyy ];</code>

🔘 <b>About the button:</b>
The button is used to <b>connect the bot to WhatsApp</b>.
After connection, the session will be saved in the <b>"pairing"</b> folder.

📂 <b>Where to edit commands:</b>
Bot commands (cases) are located in:
<code>WhatsApp.js</code>

You can edit or add new features there.

⚠️ <b>Important:</b> wrong configuration may break the bot.

📦 <b>Credits:</b> developed by <b>Guto</b> ✔️
Keep the credits if you share.

🔥 Edit, run and enjoy your own bot!

Good luck 🚀

</blockquote>`, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔌 𝘾𝙊𝙉𝙀𝘾𝙏𝘼𝙍 𝘼𝙊 𝘽𝙊𝙏 🔌", callback_data: "conectar_whatsapp" }],
          ],
        },
      });
      ultimaMsg[chatId] = mAtu.message_id;
    }



    //BOTÃO DE CONECTAR
    if (query.data === "conectar_whatsapp") {
      aguardandoNumero[userId] = true;

      if (ultimaMsg[chatId]) await bot.deleteMessage(chatId, ultimaMsg[chatId]).catch(() => {});
      const mConex = await bot.sendMessage(chatId, `
<blockquote>
<b>📱 Envie o número do WhatsApp que deseja conectar:</b>

Exemplo:
• +55 99 9999-9999

📦 Base desenvolvida por <b>Guto</b> ✔️
</blockquote>`, { parse_mode: "HTML" });
      ultimaMsg[chatId] = mConex.message_id;
    }
  });
};


// =============================
// AUTO RELOAD
// =============================
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(`Update ${__filename}`);
  delete require.cache[file];
  require(file);
});
