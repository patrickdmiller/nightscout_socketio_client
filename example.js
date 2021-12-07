const ns = require('./lib/index');
const logger = require('node-color-log');

ns.logger.setLevel('info'); //instance of node-color-log

ns.init({
  secret: 'access_token',
  host: 'you_ns_host',
});

ns.on('connect', () => {});

ns.on('dataUpdate', data => {
  logger.info('dataUpdate:received');
  logger.info(ns.cache);
});

ns.on('alarm', data => {
  logger.warn('alarm:received');
  logger.warn(data);
});

ns.on('urgent_alarm', data => {
  logger.error('urgent_alarm:received');
  logger.error(data);
});

ns.on('clear_alarm', (data)=>{
  logger.info('clear_alarm:received');
  logger.info(data);
})

//at any time read the cache of data received!
setTimeout( ()=>{console.log(ns.cache)}, 1000);