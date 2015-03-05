/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../t6s-core/core-backend/scripts/server/Server.ts" />
/// <reference path="../t6s-core/core-backend/scripts/Logger.ts" />

/// <reference path="./namespacemanager/ClientsNamespaceManager.ts" />
/// <reference path="./namespacemanager/SourcesNamespaceManager.ts" />
/// <reference path="./namespacemanager/AdminsNamespaceManager.ts" />

/// <reference path="./core/BackendConfig.ts" />

var jwt : any = require('jsonwebtoken');
var socketioJwt : any = require('socketio-jwt');

/**
 * Represents The 6th Screen's Backend.
 *
 * @class The6thScreenBackend
 * @extends Server
 */
class The6thScreenBackend extends Server {

    /**
     * Constructor.
     *
     * @param {number} listeningPort - Server's listening port..
     * @param {Array<string>} arguments - Server's command line arguments.
     */
    constructor(listeningPort : number, arguments : Array<string>) {
        super(listeningPort, arguments);

        this.app.post('/login', function (req, res) {

            Logger.debug(req.body.usernameOrEmail);
            Logger.debug(req.body.password);

            // TODO: validate the actual user user
            var profile = {
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@doe.com',
                id: 123
            };

            // we are sending the profile in the token
            var token = jwt.sign(profile, BackendConfig.getJWTSecret());

            res.json({token: token});
        });


        this.init();
    }

    /**
     * Method to init the RSSFeedReader server.
     *
     * @method init
     */
    init() {
        var self = this;

        this.addNamespace("clients", ClientsNamespaceManager);
        this.addNamespace("sources", SourcesNamespaceManager);
        var adminNamespace : any = this.addNamespace("admins", AdminsNamespaceManager);

        adminNamespace.use(socketioJwt.authorize({
            secret: BackendConfig.getJWTSecret(),
            handshake: true
        }));

        adminNamespace.use(function(socket, next) {
            var handshakeData = socket.request;
            Logger.debug("JWT validate");
            Logger.debug(handshakeData);
            // make sure the handshake data looks good as before
            // if error do this:
            // next(new Error('not authorized');
            // else just call next
            next();
        });
    }
}

/**
 * Server's The6thScreenBackend listening port.
 *
 * @property _The6thScreenBackendListeningPort
 * @type number
 * @private
 */
var _The6thScreenBackendListeningPort : number = process.env.PORT_BACKEND || 4000;

/**
 * Server's The6thScreenBackend command line arguments.
 *
 * @property _The6thScreenBackendArguments
 * @type Array<string>
 * @private
 */
var _The6thScreenBackendArguments : Array<string> = process.argv;

var serverInstance = new The6thScreenBackend(_The6thScreenBackendListeningPort, _The6thScreenBackendArguments);
serverInstance.run();