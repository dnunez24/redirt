import report from './report'
import request from './request'
import url from 'url'

const extractAssertion = (assertion) => ({
  originalPath: assertion[0],
  expectedPath: assertion[1],
  expectedCode: assertion[2],
})

export default async (host, assertion) => {
  const {
    originalPath,
    expectedPath,
    expectedCode,
  } = extractAssertion(assertion)
  const protocol = 'http://'
  const originalUrl = protocol + host + originalPath
  const { actualCode, actualPath } = await request(originalUrl)
  
  report({
    originalPath,
    expectedPath,
    actualPath,
    expectedCode,
    actualCode,
  })
}
