var EventEmitter = require('events').EventEmitter,
    WebSocket = require('faye-websocket'),
    http = require('http'),
    express = require('express'),
    fs = require('fs'),
    path = require('path'),
    usage,
    influx;

try {
    usage = require('usage');
} catch (error) {
    usage = false;
}

try {
    influx = require('influx');
} catch (error) {
    influx = false;
}
