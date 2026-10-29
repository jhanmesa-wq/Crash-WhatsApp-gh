global.owner = ["+55 51 8992-6591"]
global.ownername = "ᴳᵘᵗᵒ 👁️‍🗨️"
global.location = "Brasil, Bahia, Candelária"
global.botname = 'Guto     V7      <✓>' 
global.link ='https://www.youtube.com/@gutoxtazv9'
global.prefa = [,'!',] 
global.limitawal = {
    premium: "Infinity",
    free: 20
}
let fs = require('fs')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)
})