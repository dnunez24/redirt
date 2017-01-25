var fs = require('fs');
var http = require('http');
var url = require('url');
var csv = require('csv');
var colors = require('colors/safe');
var assert = require('assert');

var inputFile = fs.createReadStream(process.argv[2]);
var csvParser = csv.parse({ skip_empty_lines: true });

csvParser.on('readable', function() {
  redirect = csvParser.read();

  if (redirect) {
    testRedirect(redirect);
  }
});

csvParser.on('error', function(err) {
  console.error(err.message);
});

function testRedirect(redirect) {
  var protocol = 'http://';
  var domain = process.argv[3];
  var oldPath = redirect[0];
  var newPath = redirect[1];
  var oldUrl = protocol + domain + oldPath;
  var newUrl = protocol + domain + newPath;
  var urlParts = url.parse(oldUrl);

  var httpOptions = {
    method: 'HEAD',
  };
  var options = Object.assign({}, httpOptions, urlParts);
  var httpRequest = http.request(options);
  httpRequest.end();

  httpRequest.on('response', function(response) {
    var responseLocation = response.headers.location;
    var responsePath = '';

    if (response.headers.location) {
      var responseUrlParsed = url.parse(responseLocation.toString());
      responsePath = [
        responseUrlParsed.path,
        responseUrlParsed.query,
        responseUrlParsed.hash
      ].join('');
    }

    console.log(statusColor(response.statusCode) + ' ' + oldPath);
    if (!response.statusCode.toString().match(/^[45].*/)) {
      console.log('\tEXPECTED: ' + newPath);
      console.log('\tACTUAL: ' + matchColor(newPath, responsePath));
    }
    response.read();
  });

  httpRequest.on('error', function(err) {
    console.error(err.message);
  });
}

function statusColor(code) {
  var codeStr = code.toString();
  return codeStr.match(/^[45].*/) ? colors.red(code) : colors.green(code);
}

function matchColor(expected, actual) {
  return expected === actual ? colors.green(actual) : colors.yellow(actual);
}

inputFile.pipe(csvParser);
