const getopts = require('getopts');

const options = getopts(process.argv.slice(2), {
    alias: {
        host: 'h',
        port: 'p',
        data: 'd',
        timeout: 't'
    },
    default: {
        host: '0.0.0.0',
        port: '50000',
        data: 'Hello',
        timeout: 3000
    }
});

function printUsage(){
    console.log(`Usage:
node index.js PROTOCOL MODE [OPTIONS]

Protocols:
  udp - use udp protocol to transfer data
  tcp - use tcp protocol to transfer data

Modes:
  server - run as server
  client - run as client

Options:
  -h, --host string       In server mode: host to bind
                          In client mode: host to connect

  -p, --port number       In server mode: port to bind
                          In client mode: port to connect

  -d, --data string       In Server mode: data to reponse to client
                          In Client mode: data to send

  -t, --timeout number    Client connection timeout in milliseconds. Defaults to 1000

Example:
  node index.js udp server -h 127.0.0.1 -p 19800
  node index.js udp client -h 127.0.0.1 -p 19800 -d 'hello there' -t 3000`);
}

function run(){
    const [protocol, mode] = options._;

    if(protocol == 'udp' && mode == 'server'){
        require('./lib/udp/server').run(options);
    } else if(protocol == 'udp' && mode == 'client'){
        require('./lib/udp/client').run(options);
    } else if(protocol == 'tcp' && mode == 'server'){
        require('./lib/tcp/server').run(options);
    } else if(protocol == 'tcp' && mode == 'client'){
        require('./lib/tcp/client').run(options);
    } else {
        printUsage();
        process.exit(0);
    }
}

run();
