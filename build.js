const csv = require('csv-parser')
const fs = require('fs')
const http = require('http')

const EDAM_URL = 'http://edamontology.org/EDAM.csv'
const IN_SUBSET = 'http://www.geneontology.org/formats/oboInOwl#inSubset'
const EDAM_FORMAT  = 'http://purl.obolibrary.org/obo/edam#formats'

let results = []

function writeMapping() {
  let mapping = {}

  for (let result of results) {
    let uri = result['Class ID']
    let name = result['Preferred Label']

    mapping[uri] = name
  }

  let json = JSON.stringify(mapping, null, 2)
  fs.writeFileSync('edam.json', json)
}

http.get(EDAM_URL, resp => {
  let data = '';

  resp.pipe(csv())
  .on('data', result => {
    if (result[IN_SUBSET].indexOf(EDAM_FORMAT) >= 0) {
      results.push(result)
    }
  })
  .on('end', () => writeMapping())
}).on("error", err => {
  console.error("Error: " + err.message)
})
