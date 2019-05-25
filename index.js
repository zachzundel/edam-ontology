const fs = require('fs')

let json = fs.readFileSync('edam.json')
let edam = JSON.parse(json)

module.exports = edam
