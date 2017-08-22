import csv from 'csv'
import fs from 'fs'
import check from './check'

export default (host, path) => {
  const file = fs.createReadStream(path)
  const parser = csv.parse({
    skip_empty_lines: true,
  })

  parser.on('readable', () => {
    const redirect = parser.read()

    if (assertion) {
      check(host, assertion)
    }
  })

  parser.on('error', err => console.error(err.message))
  file.pipe(parser)
}