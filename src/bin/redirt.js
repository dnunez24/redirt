#!/usr/bin/env node

import csv from 'csv-parse'
import fs from 'fs'
import program from 'commander'
import redirt from '../index'
import {
  version
} from '../../package.json'

const run = (baseUrl, path) => {
  const file = fs.createReadStream(path)
  const parser = csv({
    skip_empty_lines: true,
  })
  const options = {
    baseUrl
  }
  const tester = redirt(parser, options)
  file.pipe(tester).pipe(process.stdout)
}

program.arguments('<base-url> <path>')
  .action(run)
  .usage('<base-url> <path>')
  .version(version)
  .parse(process.argv)