// Example adapted from https://gist.github.com/sid24rane/6e6698e93360f2694e310dd347a2e2eb
// https://gist.github.com/sid24rane

const udp = require('dgram');

function run(options){
    // creating a client socket
    const client = udp.createSocket('udp4');

    // buffer msg
    const data = Buffer.from(options.data);

    client.on('message', (msg, info) => {
        console.log('Data received from server : ' + msg.toString());
        console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);
    });

    // sending msg
    client.send(data, options.port, options.host, error => {
        if (error) {
            console.log(error);
            client.close();
        } else {
            console.log('Data sent to server');
        }
    });

    const data1 = Buffer.from(options.data + '-another1');
    const data2 = Buffer.from(options.data + '-another2');

    // sending multiple msg
    client.send([data1, data2], options.port, options.host, error => {
        if(error){
            console.log(error);
            client.close();
        }else{
            console.log('Data sent to server');
        }
    });

    setTimeout( () => {
        client.close();
    }, options.timeout);
}

module.exports = {
    run
};
