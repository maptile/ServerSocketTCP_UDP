const net = require('net');

const {
    log
} = require('../../util/loggerTool');

function run(options){
    const server = net.createServer();

    // emits when any error occurs
    server.on('error', (error) => {
        log('tcp_server', 'error', error);
        server.close();
    });

    const sockets = [];
    server.on('connection', sock => {
        log('tcp_server', 'info', `Connected at ${sock.remoteAddress}:${sock.remotePort}`);

        sockets.push(sock);

        sock.on('data', data => {
            log('tcp_server', 'info', data.toString() + ` | Received ${sock.bytesRead} bytes from ${sock.remoteAddress}:${sock.remotePort}`);

            const timestp = new Date();
            const response = {
                description: options.data,
                serverPort: options.port,
                timestamp: timestp.toJSON(),
                received: {
                    message: data.toString(),
                    fromIP: sock.remoteAddress,
                    fromPort: sock.remotePort
                }
            };
            const dataBuffer = Buffer.from(JSON.stringify(response));

            // Write the data back to all the connected, the client will receive it as data from the server
            sockets.forEach((sock, index, array) => {
                sock.write(dataBuffer);
            });
        });

        // Add a 'close' event handler to this instance of socket
        sock.on('close', (data) => {
            const index = sockets.findIndex( o => {
                return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
            });

            if (index !== -1) {
                sockets.splice(index, 1);
            }
            log('tcp_server', 'info', `Socket closed with ${sock.remoteAddress}:${sock.remotePort}`);
        });
    });

    server.listen(options.port, options.host, () => {
        const address = server.address();
        const port = address.port;
        const family = address.family;
        const ipaddr = address.address;

        log('tcp_server', 'info', `Server is listening at ${ipaddr}:${port} with ${family}`);
    });
}

module.exports = {
    run
};
