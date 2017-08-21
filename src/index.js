import csv from 'csv'
import fs from 'fs'
import test from './test'

export default (host, path) => {
  const inputFile = fs.createReadStream(path)
  const csvParser = csv.parse({
    skip_empty_lines: true
  })

  csvParser.on('readable', () => {
    const redirect = csvParser.read()

    if (redirect) {
      test(host, redirect)
    }
  })

  csvParser.on('error', err => console.error(err.message))
  inputFile.pipe(csvParser)
}