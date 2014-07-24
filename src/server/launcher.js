var server = new Server({ port: 8080 });

new Inspector(server, 'stats');

module.exports = server;