# 141x-game-authorizer
This is a Cardano message signing app based on the [cardano-serialzation-lib](https://github.com/Emurgo/cardano-serialization-lib)
by Emurgo. This is the repository of [https://authorizer.141x.io](https://authorizer.141x.io) and is one of the gaming
utiliies for Cardano of the [https://info.141x.io](https://info.141x.io) platform.

This app is built with [cra](https://reactjs.org/docs/create-a-new-react-app.html) and extended with [craco](https://github.com/gsoft-inc/craco)
in order make use of the cardano-serialization wasm library.

````text
+-----------+           1.sends input                 +---------------------------+
|game client+---------------------------------------->|                           |
+-----------+                                         |141x-game-authorizer-server|
                                                      |                           |
                                                      |       +-------------------+
                                                      |       |  4.verifies       |
+--------------------+     2.asks for signature       |       |   and updated     |
|141x-game-authorizer|<-------------------------------+       |   game state      |
+----------------+---+                                +-------+-----+-------------+
                 |                                                  |
                 +--------------------------------------------------+
                               3.provides signature
````
1
## Getting started
1. ``git clone git@github.com:ggcaponetto/141x-game-authorizer.git``
1. ``npm i && npm start``
## Testing
1. ``npm i && npm mocha``
