## What is it? ##
I didn't find an official API to connect to [Nightscout](https://github.com/nightscout/cgm-remote-monitor) over a websocket (which I wanted so I didn't have to poll the API for real-time info) so I use this convenience library. 

I only implemented the socket events I needed and typed them for ts. We use Loop, so there may be differences in how things are logged. For example, the way we use Loop logs both a "carb correction" treatment as well as a "correction bolus" treatment; one for the food and one for the insulin.

## How to use it ##
```npm i --save "https://github.com/patrickdmiller/nightscout_socketio_client"```
see example.ts for an example. copy .env_example to .env in your project root. 


## note 
A quick note on the `secret` param. You create this at your https://your_nightscout_instance/admin > 'add new subject', to create an `access token`. 

This will be passed to the front-end as the key named `secret` on authentication. There is also a token key that the front end uses, but I've found passing the `access_token` to this key doesn't work. Never the less, passing as secret works. 
