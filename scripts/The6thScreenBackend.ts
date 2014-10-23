/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../t6s-core/core-backend/libsdef/node.d.ts" />
/// <reference path="../t6s-core/core-backend/libsdef/express.d.ts" />
/// <reference path="../t6s-core/core-backend/libsdef/socket.io-0.9.10.d.ts" />

/// <reference path="../t6s-core/core-backend/scripts/Logger.ts" />
/// <reference path="../t6s-core/core-backend/scripts/LoggerLevel.ts" />

/// <reference path="./socketmanager/ClientConnectionManager.ts" />
/// <reference path="./socketmanager/SourcesServerConnectionManager.ts" />
/// <reference path="./socketmanager/CustomizerConnectionManager.ts" />
/// <reference path="./client/ClientManager.ts" />
/// <reference path="./sourcesserver/SourcesServerManager.ts" />

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
     * List of ConnectionManager for Clients.
     *
     * @property _clientConnectionManagers
     * @type Array<ClientConnectionManager>
     */
    private _clientConnectionManagers: Array<ClientConnectionManager>;

    /**
     * List of ConnectionManager for SourcesServers.
     *
     * @property _sourcesServerConnectionManagers
     * @type Array<SourcesServerConnectionManager>
     */
    private _sourcesServerConnectionManagers: Array<SourcesServerConnectionManager>;

    /**
     * List of ConnectionManager for Customizers.
     *
     * @property _customizerConnectionManagers
     * @type Array<CustomizerConnectionManager>
     */
    private _customizerConnectionManagers: Array<CustomizerConnectionManager>;

    /**
     * @constructor
     */
    constructor() {
        this._clientConnectionManagers = new Array<ClientConnectionManager>();
        this._sourcesServerConnectionManagers = new Array<SourcesServerConnectionManager>();
        this._customizerConnectionManagers = new Array<CustomizerConnectionManager>();
    }

    /**
     * Method to run the web socket server.
     *
     * @method run
     */
    run() {
        var self = this;
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
            var connectionManager : ClientConnectionManager = new ClientConnectionManager(socket.id);
            self._clientConnectionManagers[socket.id] = connectionManager;
            Logger.info("New The 6th Screen Client Connection : " + socket.id);

            var clientManager : ClientManager = new ClientManager(socket);
            connectionManager.addClientManager(clientManager);

            socket.on('disconnect', function(){
                delete(self._clientConnectionManagers[socket.id]);
                Logger.info("The 6th Screen Client disconnected : " + socket.id);
            });
        });

        var sourcesNamespace = io.of("/sources");

        sourcesNamespace.on('connection', function(socket){
            var connectionManager : SourcesServerConnectionManager = new SourcesServerConnectionManager(socket.id);
            self._sourcesServerConnectionManagers[socket.id] = connectionManager;
            Logger.info("New The 6th Screen Sources Server Connection : " + socket.id);

            var sourcesServerManager : SourcesServerManager = new SourcesServerManager(socket);
            connectionManager.addSourcesServerManager(sourcesServerManager);

            socket.on('disconnect', function(){
                delete(self._sourcesServerConnectionManagers[socket.id]);
                Logger.info("The 6th Screen Sources Server disconnected : " + socket.id);
            });
        });

        var customizerNamespace = io.of("/customizers");

        customizerNamespace.on('connection', function(socket){
            var connectionManager : CustomizerConnectionManager = new CustomizerConnectionManager(socket.id);
            self._customizerConnectionManagers[socket.id] = connectionManager;
            Logger.info("New The 6th Screen Customizer Connection : " + socket.id);

            socket.on('disconnect', function(){
                delete(self._customizerConnectionManagers[socket.id]);
                Logger.info("The 6th Screen Customizer disconnected : " + socket.id);
            });
        });

        httpServer.listen(listeningPort, function(){
            Logger.info("The 6th Screen's Backend listening on *:" + listeningPort);
        });
    }
}

var logLevel = LoggerLevel.Error;

if(process.argv.length > 2) {
    var param = process.argv[2];
    var keyVal = param.split("=");
    if(keyVal.length > 1) {
        if (keyVal[0] == "loglevel") {
            switch(keyVal[1]) {
                case "error" :
                    logLevel = LoggerLevel.Error;
                    break;
                case "warning" :
                    logLevel = LoggerLevel.Warning;
                    break;
                case "info" :
                    logLevel = LoggerLevel.Info;
                    break;
                case "debug" :
                    logLevel = LoggerLevel.Debug;
                    break;
                default :
                    logLevel = LoggerLevel.Error;
            }
        }
    }
}

Logger.setLevel(logLevel);

var backend = new The6thScreenBackend();
backend.run();