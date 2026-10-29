const { proto, getContentType } = require('@whiskeysockets/baileys')
const chalk = require('chalk')
const fs = require('fs')
const Crypto = require('crypto')
const axios = require('axios')
const moment = require('moment-timezone')
const { sizeFormatter } = require('human-readable')
const util = require('util')
const Jimp = require('jimp')


// =============== FUNÇÕES BÁSICAS ===============

const unixTimestampSeconds = (date = new Date()) => Math.floor(date.getTime() / 1000)
exports.unixTimestampSeconds = unixTimestampSeconds

exports.generateMessageTag = (epoch) => {
    let tag = unixTimestampSeconds().toString()
    if (epoch) tag += '.--' + epoch
    return tag
}

exports.processTime = (timestamp, now) => {
	return moment.duration(now - moment(timestamp * 1000)).asSeconds()
}

exports.getRandom = (ext = '') => `${Math.floor(Math.random() * 10000)}${ext}`

exports.getBuffer = async (url, options = {}) => {
	try {
		const res = await axios({
			method: 'get',
			url,
			headers: { 'DNT': 1, 'Upgrade-Insecure-Request': 1 },
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (err) {
		return err
	}
}

exports.fetchJson = async (url, options = {}) => {
	try {
		const res = await axios({
			method: 'GET',
			url,
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/95.0.4638.69 Safari/537.36'
			},
			...options
		})
		return res.data
	} catch (err) {
		return err
	}
}

exports.formatp = sizeFormatter({
	std: 'JEDEC',
	decimalPlaces: 2,
	keepTrailingZeroes: false,
	render: (literal, symbol) => `${literal} ${symbol}B`
})

exports.runtime = function(seconds) {
	seconds = Number(seconds)
	const d = Math.floor(seconds / (3600 * 24))
	const h = Math.floor(seconds % (3600 * 24) / 3600)
	const m = Math.floor(seconds % 3600 / 60)
	const s = Math.floor(seconds % 60)
	return `${d ? `${d}d ` : ''}${h ? `${h}h ` : ''}${m ? `${m}m ` : ''}${s ? `${s}s` : ''}`
}

exports.clockString = (ms) => {
	const h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
	const m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
	const s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
	return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}

exports.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

exports.isUrl = (url) => /https?:\/\/[^\s]+/.test(url)

exports.getTime = (format, date) => {
	const locale = 'pt-BR'
	return date
		? moment(date).locale(locale).format(format)
		: moment.tz('America/Sao_Paulo').locale(locale).format(format)
}

exports.formatDate = (n, locale = 'pt-BR') => {
	const d = new Date(n)
	return d.toLocaleDateString(locale, {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric'
	})
}

exports.tanggal = (numer) => {
	const meses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]
	const dias = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado']
	const data = new Date(numer)
	const dia = data.getDate()
	const mes = data.getMonth()
	const diaSemana = dias[data.getDay()]
	const ano = data.getFullYear()
	return `${diaSemana}, ${dia} de ${meses[mes]} de ${ano}`
}

exports.jsonformat = (obj) => JSON.stringify(obj, null, 2)

exports.logic = (check, inp, out) => {
	if (inp.length !== out.length) throw new Error('Input e Output precisam ter o mesmo tamanho')
	for (let i in inp)
		if (util.isDeepStrictEqual(check, inp[i])) return out[i]
	return null
}

exports.generateProfilePicture = async (buffer) => {
	const jimp = await Jimp.read(buffer)
	const min = jimp.getWidth()
	const max = jimp.getHeight()
	const cropped = jimp.crop(0, 0, min, max)
	return {
		img: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),
		preview: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG)
	}
}

exports.bytesToSize = (bytes, decimals = 2) => {
	if (bytes === 0) return '0 Bytes'
	const k = 1024
	const dm = decimals < 0 ? 0 : decimals
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

exports.getSizeMedia = async (path) => {
	if (/^https?:\/\//.test(path)) {
		const res = await axios.head(path)
		const length = parseInt(res.headers['content-length'])
		return exports.bytesToSize(length, 3)
	}
	if (Buffer.isBuffer(path)) {
		const length = Buffer.byteLength(path)
		return exports.bytesToSize(length, 3)
	}
	throw new Error('Tipo de mídia não suportado')
}

exports.parseMention = (text = '') =>
	[...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')

exports.getGroupAdmins = (participants) =>
	participants.filter(p => p.admin).map(p => p.id)

exports.removeEmojis = (str) => str.replace(/([\u2700-\u27bf]|[\ud83c\udde6-\uddff]{2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|[\ud83c\udd70-\udd9a]|[\ud83c\udde6-\uddff]|[\u2600-\u26FF]|[\u2190-\u21ff])/g, '')


// =============== FUNÇÃO PRINCIPAL: smsg() ===============

exports.smsg = (uwu, m, store) => {
	if (!m) return m
	const M = proto.WebMessageInfo
	m = M.fromObject(m)

	if (m.key) {
		m.id = m.key.id
		m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16
		m.chat = m.key.remoteJid
		m.fromMe = m.key.fromMe
		m.isGroup = m.chat.endsWith('@g.us')
		m.sender = uwu.decodeJid(
			(m.fromMe && uwu.user.id) || m.participant || m.key.participant || m.chat || ''
		)
		if (m.isGroup) m.participant = uwu.decodeJid(m.key.participant) || ''
	}

	if (m.message) {
		m.mtype = Object.keys(m.message)[0]
		m.msg = m.message[m.mtype]

		try {
			m.body =
				m.message.conversation ||
				m.msg.caption ||
				m.msg.text ||
				(m.mtype === 'listResponseMessage' && m.msg.singleSelectReply?.selectedRowId) ||
				(m.mtype === 'buttonsResponseMessage' && m.msg.selectedButtonId) ||
				(m.mtype === 'viewOnceMessage' && m.msg.caption) ||
				(m.mtype === 'extendedTextMessage' && m.msg.text) ||
				''
		} catch {
			m.body = ''
		}

		let quoted = (m.quoted = m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null)
		m.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []

		if (m.quoted) {
			let type = Object.keys(quoted)[0]
			m.quoted = m.quoted[type]
			if (['productMessage'].includes(type)) {
				type = getContentType(m.quoted)
				m.quoted = m.quoted[type]
			}
			if (typeof m.quoted === 'string') m.quoted = { text: m.quoted }

			m.quoted.mtype = type
			m.quoted.id = m.msg.contextInfo.stanzaId
			m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat
			m.quoted.sender = uwu.decodeJid(m.msg.contextInfo.participant)
			m.quoted.text =
				m.quoted.text ||
				m.quoted.caption ||
				m.quoted.conversation ||
				m.quoted.contentText ||
				m.quoted.selectedDisplayText ||
				m.quoted.title ||
				''

			m.getQuotedObj = async () => {
				if (!m.quoted.id) return false
				let q = await store.loadMessage(m.chat, m.quoted.id, uwu)
				return exports.smsg(uwu, q, store)
			}

			let vM = (m.quoted.fakeObj = M.fromObject({
				key: {
					remoteJid: m.quoted.chat,
					fromMe: m.quoted.sender === uwu.user.jid,
					id: m.quoted.id
				},
				message: quoted,
				...(m.isGroup ? { participant: m.quoted.sender } : {})
			}))

			m.quoted.delete = () => uwu.sendMessage(m.quoted.chat, { delete: vM.key })
			m.quoted.copyNForward = (jid, forceForward = false, options = {}) =>
				uwu.copyNForward(jid, vM, forceForward, options)
			m.quoted.download = () => uwu.downloadMediaMessage(m.quoted)
		}
	}

	if (m.msg?.url) m.download = () => uwu.downloadMediaMessage(m.msg)
	m.text =
		m.msg?.text ||
		m.msg?.caption ||
		m.message?.conversation ||
		m.msg?.contentText ||
		m.msg?.selectedDisplayText ||
		m.msg?.title ||
		''

	m.reply = (text, chatId = m.chat, options = {}) =>
		Buffer.isBuffer(text)
			? uwu.sendMedia(chatId, text, 'file', '', m, { ...options })
			: uwu.sendText(chatId, text, m, { ...options })

	m.copy = () => exports.smsg(uwu, M.fromObject(M.toObject(m)))
	m.copyNForward = (jid = m.chat, forceForward = false, options = {}) =>
		uwu.copyNForward(jid, m, forceForward, options)

	return m
}


// =============== AUTO RELOAD ===============

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.greenBright(`[ ATUALIZADO ] ${__filename}`))
	delete require.cache[file]
	require(file)
})