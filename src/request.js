import url from 'url'

export default originalUrl => {
  const options = url.parse(originalUrl)
  const client = options.protocol.match('https')
    ? require('https')
    : require('http')
  options.method = 'HEAD'
      
  return new Promise((resolve, reject) => {
    const request = client.request(options, response => {
      const actualCode = response.statusCode
      const actualPath = url.parse(
        response.headers.location || response.req.path
      ).path
      
      resolve({ actualCode, actualPath })
    })
    
    request.on('error', error => reject(error))
    request.end()
  })
}
