/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../t6s-core/core-backend/scripts/server/Server.ts" />
/// <reference path="../t6s-core/core-backend/scripts/Logger.ts" />

/// <reference path="./namespacemanager/ClientsNamespaceManager.ts" />
/// <reference path="./namespacemanager/SourcesNamespaceManager.ts" />
/// <reference path="./namespacemanager/AdminsNamespaceManager.ts" />

/// <reference path="./core/BackendConfig.ts" />
/// <reference path="./model/User.ts" />

var jwt : any = require('jsonwebtoken');
var socketioJwt : any = require('socketio-jwt');
var get_ip : any = require('ipware')().get_ip;

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

            var success = function(user) {

                var successCheck = function() {
                    var ip_info = get_ip(req);
                    // { clientIp: '127.0.0.1', clientIpRoutable: false }
                    var clientIp = ip_info.clientIp;

					console.log(clientIp);

                    var profile = {
                        username: user.username(),
                        ip: clientIp,
                        id: user.getId(),
						date: new Date()
                    };

                    // we are sending the profile in the token
                    var token = jwt.sign(profile, BackendConfig.getJWTSecret());

                    var successUpdate = function() {
                        res.json({token: token});
                    };

                    var failUpdate = function(error) {
                        res.status(500).send({ 'error': JSON.stringify(error) });
                    };

                    user.setLastIp(clientIp);
                    user.setToken(token);

                    user.update(successUpdate, failUpdate);
                };

                var failCheck = function(error) {
                    res.status(500).send({ 'error': JSON.stringify(error) });
                };

                user.checkPassword(req.body.password, successCheck, failCheck);
            };

            var fail = function(error) {
                var fail2 = function(error) {
                    res.status(500).send({ 'error': JSON.stringify(error) });
                }

                User.findOneByEmail(req.body.usernameOrEmail, success, fail2);
            };

            User.findOneByUsername(req.body.usernameOrEmail, success, fail);
        });

		this.app.post('/loginFromToken', function(req, res) {
			var success = function(user) {

				/* TODO: ADDED UpdatedAt and CreatedAt in all models.
				var now : any = new Date();
				var lastUserUpdated : any = new Date(user.getUpdatedAt());
				var diffDate = now - lastUserUpdated;

				if( !req.body.tmp || ( diffDate <= 1000*60*60*2 ) ) {*/
					var ip_info = get_ip(req);
					// { clientIp: '127.0.0.1', clientIpRoutable: false }
					var clientIp = ip_info.clientIp;

					var profile = {
						username: user.username(),
						ip: clientIp,
						id: user.getId(),
						date: new Date()
					};

					// we are sending the profile in the token
					var token = jwt.sign(profile, BackendConfig.getJWTSecret());

					var successUpdate = function () {
						res.json({token: token});
					};

					var failUpdate = function (error) {
						res.status(500).send({'error': JSON.stringify(error)});
					};

					user.setLastIp(clientIp);
					user.setToken(token);

					user.update(successUpdate, failUpdate);
				/* TODO: ADDED UpdatedAt and CreatedAt in all models.

				} else {
					res.status(401).send({'error': 'Session expired.'});
				}*/
			};

			var fail = function(error) {
				res.status(404).send({ 'error': JSON.stringify(error) });
			}

			User.findOneByToken(req.body.token, success, fail);
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

		//console.log("BYPASS CHECKING JWT Token !!!!!!!!! // TODO // TO FIX");
        adminNamespace.use(socketioJwt.authorize({
            secret: BackendConfig.getJWTSecret(),
            handshake: true
        }));

        adminNamespace.use(function(socket, next) {
            var handshakeData : any = socket.request;

            var success = function(user) {
				console.log("check : ");
				console.log(handshakeData.client._peername.address);
				console.log("BYPASS CHECKING IP ADDRESS !!!!!!!!! // TODO // TO FIX");
				//if(user.lastIp() == handshakeData.client._peername.address) {
                    next();
                //} else {
                //    next(new Error('Peer Ip Address is not same as last known Ip address (when retrieve token).'));
                //}
            };

            var fail = function(error) {
                next(error);
            };

			console.log("token : ");
			console.log(handshakeData._query.token);

            User.findOneByToken(handshakeData._query.token, success, fail);
            // make sure the handshake data looks good as before
            // if error do this:
            // next(new Error('not authorized');
            // else just call next
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
var _The6thScreenBackendListeningPort : number = process.env.PORT || 4000;

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