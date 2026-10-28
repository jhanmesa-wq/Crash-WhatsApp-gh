# 📲 INSTALAÇÃO NO TERMUX #

---

⚙️ 1° PASSO

pkg upgrade -y && pkg update -y && pkg install nodejs -y && pkg install nodejs-lts -y && pkg install ffmpeg -y && pkg install wget -y && pkg install git -y

⚠️ ATENÇÃO:
Digite "y" sempre que aparecer "[y/n]"

---

**📂 2° PASSO**

termux-setup-storage

---

**📁 3° PASSO**

cd /sdcard/Download/base_telegram_WhatsApp

---

**▶️ 4° PASSO**

npm start

---

🚀 FINALIZAÇÃO

Seu bot já estará rodando normalmente!





# 🤖 CONFIGURAR TOKEN DO BOT (TELEGRAM) #

---

**📌 1° PASSO — Criar o bot**

- Abra o Telegram e pesquise por @BotFather
- Inicie e envie:

/start

- Depois envie:

/newbot

- Escolha um nome para o bot
- Escolha um username (ex: "meubot123_bot")

✅ Você receberá um TOKEN assim:

123456789:ABCdefGhjdksiwjxkskwsnOpz

---





# ⚙️ 2° PASSO — Colocar o token na base #

- Vá até a pasta do projeto
- Abra o arquivo:

index.js

- Procure por:

const token = "SEU_TOKEN_AQUI";

- Substitua pelo seu token:

const token = "123456789:ABCdefGhjdksiwjxkskwsnOpz";

---

⚠️ IMPORTANTE

- Nunca compartilhe seu token
- Quem tiver acesso pode controlar seu bot

---

🚀 FINALIZAÇÃO

Seu bot já estará pronto para uso!






