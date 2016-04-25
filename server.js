const http = require('http');
const url = require('url');
const mysql = require('mysql');
var Client = require('node-torrent');
var events = require('events');
var qs = require('querystring');

process.on('uncaughtException', function(err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
  console.error(err.stack);
});

const hostname = '127.0.0.1';
const port = 8080;

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'nodetest',
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

decode = function (data) {
    data = JSON.parse(decodeURI(data));
    return data;
}



var server = http.createServer((request, response) => {
        if (request.method == 'POST') {
            console.log('post')
            var _data = '';

            request.on('data', function (data) {

                _data += data;
                _data = decode(_data);

                if (validateApiKey(_data.key)) {
                    call(_data.command, _data, response);
                } else {
                    callBackError(response, 'invalid key', 401);
                }
            });
        } else if (request.method == 'GET') {
            callBackError(response, 'invalid method. Use POST', 400);
        }
}).listen(port, hostname, () => {

    connection.connect();
    console.log(`Server running at http://${hostname}:${port}/`);

});

validateApiKey = function (key) {
    if (key == 'TEST') {
        return true;
    } else {
        return false;
    }
}

call = function (req, data, response) {
    var data = typeof data !== 'undefined' ? data : '';
    var _query = '';
    switch (req) {

    case 'start-download':
            //TODO: store download url into database
            
            
            //start download url
            var client = new Client({logLevel: 'DEBUG'});
            var torrent = client.addTorrent(data.magnet);
            torrent.on('complete', function() {
                console.log('complete!');
                torrent.files.forEach(function(file) {
                    var newPath = '/new/path/' + file.path;
                    fs.rename(file.path, newPath);
                    file.path = newPath;
                });
            });
            callBack('true',response);
        break;
    case 'get-downloads':
        //Get list of current action
        break;
    default:
        callBackError(response, 'invalid command', 400);
        return;
    }
}

callBack = function (data, response) {
    response.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });
    response.end(data);
}

callBackError = function (response, err, errcode) {
    log(response, err, errcode);
    var errcode = typeof errcode !== 'undefined' ? errcode : 404;
    response.writeHead(errcode, {
        'Content-Type': 'text/plain'
    });
    response.end(''+err);
}

log = function (response, err, errcode) {
    console.log('error:' + errcode);
    console.log(err);
    console.log('-----------------------');
}

