const net = require('net');

function run(options){
    const client = new net.Socket();

    client.connect(options.port, options.host, () => {
        const address = client.address();
        console.log(`Connected to ${options.host}:${options.port} from ${address.address}:${address.port}`);
        client.write(options.data);
    });

    client.on('data', data => {
        console.log('Received: ' + data);
        client.destroy();
    });

    client.on('close', () => {
        console.log('Connection closed');
    });
}

module.exports = {
    run
};
