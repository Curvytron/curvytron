var config,
    packageInfo = require('../package.json');

try {
    config = require('../config.json');
} catch (error) {
    config = {
        port: 8080,
        inspector: { enabled: false }
    };
}

var server = new Server({ port: config.port });

if (config.inspector.enabled) {
    try {
      new Inspector(server, config.inspector);
    } catch (error) {
        console.error('Inspector error:', error);
    }
}

module.exports = server;
