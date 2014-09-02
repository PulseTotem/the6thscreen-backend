/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../libsdef/node.d.ts" />
/// <reference path="../../libsdef/express.d.ts" />
/// <reference path="../../libsdef/socket.io-0.9.10.d.ts" />

/// <reference path="./core/Logger.ts" />

/// <reference path="./client/ClientManager.ts" />

var http = require("http");
var express = require("express");
var sio = require("socket.io");

/**
 * Represents The 6th Screen's Backend.
 *
 * @class The6thScreenBackend
 */
class The6thScreenBackend {

    /**
     * Method to run the web socket server.
     *
     * @method run
     */
    run() {
        var listeningPort = process.env.PORT || 4000;

        var app = express();
        var httpServer = http.createServer(app);
        var io = sio.listen(httpServer);

        app.get('/', function(req, res){
            res.send('<h1>Are you lost ? * <--- You are here !</h1>');
        });

        //TODO : io.origins("allowedHosts"); // see : http://socket.io/docs/server-api/#server#origins(v:string):server

        var clientNamespace = io.of("/clients");

        clientNamespace.on('connection', function(socket){
            Logger.info("New The 6th Screen Client Connection");

            new ClientManager(socket);

            socket.on('disconnect', function(){
                Logger.info("The 6th Screen Client disconnected.");
            });
        });

        var sourcesNamespace = io.of("/sources");

        sourcesNamespace.on('connection', function(socket){
            Logger.info("New The 6th Screen Sources Server Connection");

            socket.on('disconnect', function(){
                Logger.info("The 6th Screen Sources Server disconnected.");
            });
        });

        var customizerNamespace = io.of("/customizers");

        customizerNamespace.on('connection', function(socket){
            Logger.info("New The 6th Screen Customizer Connection");

            socket.on('disconnect', function(){
                Logger.info("The 6th Screen Customizer disconnected.");
            });
        });

        httpServer.listen(listeningPort, function(){
            Logger.info("The 6th Screen's Backend listening on *:" + listeningPort);
        });
    }
}

var backend = new The6thScreenBackend();
backend.run();