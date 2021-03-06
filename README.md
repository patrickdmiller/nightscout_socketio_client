## What is it? ##
I didn't find an official API to connect to [Nightscout](https://github.com/nightscout/cgm-remote-monitor) over a websocket (which I wanted so I didn't have to poll the API for real-time info) so I wrote this workaround library. 

This library connects to a [Nightscout](https://github.com/nightscout/cgm-remote-monitor) server over socket.io (which is used for the NS web interface) to receive real-time information without having to poll it just like the real front-end does. 

I've only implemented the functionality I've needed so consider it a partial implementation, but you will get data updates, alarms, and alarm clear events.

## How to use it? ##
See example.js in the repo, but high level the lib is an event emitter for nightscout events. 

```
const ns = require('./lib/index.js');

ns.init({
  secret: 'access_token', //access_token created in ns admin
  host: 'your_ns_server'
})

//to get data updates
ns.on('dataUpdate, data =>{
  ...
})

//handle alarms
ns.on('alarm', data =>{})
ns.on('urgent_alarm', data =>{})

//clear alarm handler
ns.on('clear_alarm', data=>{})

//announcements
ns.on('announcement', data=>{})

//change log level of node-color-log (which the lib uses)
ns.logger.setLevel('info')

```

A quick note on the `secret` param. You create this at your https://your_nightscout_instance/admin > 'add new subject', to create an `access token`. 

This will be passed to the front-end as the key named `secret` on authentication. There is also a token key that the front end uses, but I've found passing the `access_token` to this key doesn't work. Never the less, passing as secret works. 
