
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
const multicastPort    = 1111;
const multicastAddress = "239.255.99.5";

//const uuid = require('uuid');
const { v4: uuidv4 } = require('uuid');

/*
 * New instances of map instrument and son
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
if(process.argv.length != 3){
    console.log('Invalid numbers of arguments');
    console.log('Usage: node app.js <instrument>');
    return;
}

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
        setInterval(this.update.bind(this), 5000);
    };
  }
  
  let instru = new Instru(uuidv4(), sound);
  instru.update();
  
