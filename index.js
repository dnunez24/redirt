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
      responsePath = url.parse(responseLocation.toString()).path;
    }

    console.log(statusColor(response.statusCode) + ' ' + oldPath + ' => ' + responsePath);
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

inputFile.pipe(csvParser);
