## What is it? ##
I didn't find an official API to connect to [Nightscout](https://github.com/nightscout/cgm-remote-monitor) over a websocket (which I wanted so I didn't have to poll the API for real-time info) so I use this convenience function. 

I only implemented the socket events I needed and typed them for ts.

### note 
A quick note on the `secret` param. You create this at your https://your_nightscout_instance/admin > 'add new subject', to create an `access token`. 

This will be passed to the front-end as the key named `secret` on authentication. There is also a token key that the front end uses, but I've found passing the `access_token` to this key doesn't work. Never the less, passing as secret works. 
