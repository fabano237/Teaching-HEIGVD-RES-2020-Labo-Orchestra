
/*
 * Import Sockets UDP Datagram
 */
const dgram = require('dgram');
/*
 * New instances of dgram.Socket 
 */
const socket = dgram.createSocket('udp4');
var _ = require('lodash');

/**
 *  for TCP network 
 */
var net = require('net');
/**
 *  for load date 
 */
var moment = require('moment');
/*
 * Generate a v4 UUID (random) 
 */
const multicastPort    = 1111;
const tcpPort          = 2205;
const multicastAddress = "239.255.99.5";
const tcpAddress       = "0.0.0.0";

const uuid = require('uuid');
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
 * New instance of musician
 */
var musician = new Map();
/*
 * verification of user input 
 */
if(process.argv.length != 2){
    console.log('Invalid numbers of arguments');
    console.log('Usage: node app.js <>');
    return;
}  

/*
 * Tells the kernel to join a source-specific multicast
 * channel at the given sourceAddress and groupAddress 
 */
socket.bind(multicastPort, () => {
  console.log('listen on port: %j',socket.address());
  socket.addMembership(multicastAddress);
  });

socket.on('message', (msg,rinfo) => {

    var newSound = JSON.parse(msg);
    // let instru = new Instru(rinfo.uuid, rinfo.sound);
    var instrument = {
                      'uuid': newSound.uuid,
                      'instrument': (_.invert(instruments))[newSound.sound],
                      'activeSince': moment().toISOString()
                     };

    musician.set(instrument.uuid, instrument);
                    
    console.log("Ad has arrived: '" + msg + "'. Source address: " + 
                rinfo.address + ", source port: " + rinfo.port);
});

var server = net.createServer((soc) => {
    var arraymus = new Array();

    for(var [key, value] of musician.entries()){
      if(moment().diff(value.activeSince, 'seconds') > 5){
        musician.delete(key);
      }else{
        arraymus.push(value);
      }
    }

    soc.end(JSON.stringify(arraymus));
});

server.listen(tcpPort, tcpAddress);