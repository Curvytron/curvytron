var server = new Server({ port: 9000 })

new Inspector(server, 'stats');

module.exports = server;
