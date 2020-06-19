
/*
 * Import Sockets UDP Datagram
 */
const dgram = require('dgram');
/*
 * New instances of dgram.Socket 
 */
const server = dgram.createSocket('udp4');
/*
 * Generate a v4 UUID (random) 
 */
const multicastPort    = 8080;
const multicastAddress = "239.255.22.5";

const uuid = require('uuid');
const { v4: uuidv4 } = require('uuid');

/*
 * New instances of dgram.Socket 
 */
const instruments = new Map([
                            ["piano", "ti-ta-ti"],
                            ["trumpet",  "pouet"],
                            ["flute",    "trulu"],
                            ["violin", "gzi-gzi"],
                            ["drum", "boum-boum"]
                            ]);
/*
 * verification of user input 
 */
if(process.argv.length != 2){
    console.log('Invalid numbers of arguments');
    console.log('Usage: node app.js <>');
    return;
}

server.on('message', (msg, rinfo) => {

    rinfo = JSON.parse(rinfo);
	console.log("Ad has arrived: '" + msg + "'. Source address: " + rinfo.address + ", source port: " + rinfo.port);
  });
  

/*
 * Tells the kernel to join a source-specific multicast
 * channel at the given sourceAddress and groupAddress 
 */
server.bind(multicastPort, () => {
    server.addMembership(multicastAddress);
  });

/**
 * Load the name of instrument input by user
 */
var instrument = process.argv[2];
/**
 * Load the name of instrument input by user
 */
var sound = instruments.get(instrument);

/**
 * Check if instrument input is in Map
 */
if(sound == null){
    console.log('Invalid instrument');
    return;
}

class Instru {

    constructor(uuid, sound) {
      this.uuid = uuid;
      this.sound  = sound;
    }
  
    update() {
        var  payload = JSON.stringify(this);
        var  message = new Buffer(payload);
        server.send(message, 0, message.length, multicastPort, multicastAddress, (err, bytes) => {

            //console.log(`server error:\n${err.stack}`);
            console.log("Sending ad: " + payload + " via port " + server.address().port);
            
        });
        setInterval(this.update.bind(this), 1000);
    };
   // this.update.bind(this),1000
  }
  
  let instru = new Instru(uuidv4(), sound);
  instru.update();
  




  server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
  });
  
  server.on('message', (msg, rinfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  });
  
  server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
  });
  
  server.bind(41234);