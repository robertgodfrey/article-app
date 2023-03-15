
const log = require('./logger.js');  // .js is optional

function sayHello(name) {
  return 'Hello ' + name;
}

log(sayHello('Rob'));

