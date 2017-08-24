import request from './request'
import url from 'url'

const extractAssertion = (assertion) => ({
  originalPath: assertion[0],
  expectedPath: assertion[1],
  expectedCode: assertion[2],
})

export default async (baseUrl, assertion) => {
  const {
    originalPath,
    expectedPath,
    expectedCode,
  } = extractAssertion(assertion)
  // TODO: clean trailing and leading slashes
  const originalUrl = baseUrl + originalPath
  const { actualCode, actualPath } = await request(originalUrl)
  
  return {
    originalPath,
    expectedPath,
    actualPath,
    expectedCode,
    actualCode,
  }
}
