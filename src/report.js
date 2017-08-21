import chalk from 'chalk'

const diff = (expected, actual) => (
  expected === actual 
    ? actual
    : chalk.yellow(actual)
)

const isPassing = ({
  expectedPath,
  actualPath,
  expectedCode,
  actualCode,
}) => expectedPath === actualPath && expectedCode === actualCode

const passFailIndicator= (pass) => (
  pass
    ? chalk.bgGreen(' PASS ')
    : chalk.bgRed(' FAIL ')
)

export default ({
  originalPath,
  expectedPath,
  actualPath,
  expectedCode,
  actualCode,
}) => {
  const pass = isPassing({ expectedPath, actualPath, expectedCode, actualCode })
  const passFail = passFailIndicator(pass)
  const assert = `${passFail} ${expectedCode}\t${originalPath}\t${expectedPath}`
  console.log(assert)
  
  if (!pass) {
    const formattedPath = diff(expectedPath, actualPath)
    const formattedCode = diff(expectedCode, actualCode)
    const actual = `       ${formattedCode}\t${originalPath}\t${formattedPath}`
    console.log(actual)
  }
}