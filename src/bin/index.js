#!/usr/bin/env node

import program from 'commander'
import {
  version
} from '../../package.json'
import redirt from '../index'

program.arguments('<host> <file>')
  .action((host, file) => {
    redirt(host, file)
  })
  .usage('<host> <file>')
  .version(version)
  .parse(process.argv)