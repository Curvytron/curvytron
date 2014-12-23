var server = new Server({ port: 8080 });

try {
    new Inspector(server);
} catch (error) {
    console.error('Inspector error:', error);
}

module.exports = server;
