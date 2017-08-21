import url from 'url'

export default originalUrl => {
  return new Promise((resolve, reject) => {
    const options = url.parse(originalUrl)
    const client = options.protocol === 'https:'
      ? require('https')
      : require('http')
      
    // use HEAD method
    options.method = client.METHODS[7]
      
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
