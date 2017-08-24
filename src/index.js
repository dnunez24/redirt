import verify from './verify'
import format from './format'
import {
  Transform
} from 'stream'

class Tester extends Transform {
  constructor(parser, options) {
    super(options)
    this.baseUrl = options.baseUrl
    this.parser = parser
  }

  _transform(chunk, encoding, callback) {
    this.parser.on('data', async assertion => {
      if (assertion) {
        const result = await verify(this.baseUrl, assertion)
        const formatted = format(result)
        this.emit('data', formatted)
      }
    })

    this.parser.on('error', err => this.emit('error', err))
    this.parser.write(chunk)
  }
}

export default (parser, options) => new Tester(parser, options)