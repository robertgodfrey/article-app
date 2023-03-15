
const EventEmitter = require('events');

const fs = require('fs');
const os = require('os');
const path = require('path');
const log = require('./logger.js');  // .js is optional

const emitter = new EventEmitter();


function sayHello(name) {
  return 'Hello ' + name;
}

log(sayHello('Rob'));

log(path.parse(__filename));

log(`Total memory: ${os.totalmem()}`);
log(`Free memory:  ${os.freemem()}`);

fs.readdir('./', function(err, files) {
  if (err) {
    console.log('Error', err);
  } else {
    console.log('Result', files);
  }
});

