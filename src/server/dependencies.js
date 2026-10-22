var EventEmitter = require('events').EventEmitter,
    WebSocket = require('faye-websocket'),
    http = require('http'),
    express = require('express'),
    crypto = require('crypto'),
    usage;

function md5(value)
{
    return crypto.createHash('md5').update(String(value)).digest('hex');
}

try {
    usage = require('usage');
} catch (error) {
    usage = false;
}
