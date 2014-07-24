var EventEmitter = require('events').EventEmitter,
    http = require('http'),
    fs = require('fs'),
    path = require('path'),
    express = require('express'),
    WebSocket = require('faye-websocket');