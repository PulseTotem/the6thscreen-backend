/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../t6s-core/core-backend/scripts/server/Server.ts" />
/// <reference path="../t6s-core/core-backend/scripts/Logger.ts" />

/// <reference path="./namespacemanager/ClientsNamespaceManager.ts" />
/// <reference path="./namespacemanager/SourcesNamespaceManager.ts" />
/// <reference path="./namespacemanager/AdminsNamespaceManager.ts" />
/// <reference path="./namespacemanager/BackendAuthNamespaceManager.ts" />

/// <reference path="./routers/ContactFormRouter.ts" />

/// <reference path="./core/BackendConfig.ts" />
/// <reference path="./model/User.ts" />

var jwt : any = require('jsonwebtoken');
var socketioJwt : any = require('socketio-jwt');
var get_ip : any = require('ipware')().get_ip;

var moment : any = require("moment");

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

            var fail = function(error) {
                res.status(500).send({ 'error': JSON.stringify(error) });
            };

            var success = function(user : User) {

                var successCheck = function() {
                    var ip_info = get_ip(req);
                    // { clientIp: '127.0.0.1', clientIpRoutable: false }
                    var clientIp = ip_info.clientIp;

                    Logger.info("Login with following IP: "+clientIp);

                    var profile = {
                        username: user.username(),
                        ip: clientIp,
                        id: user.getId(),
						date: new Date()
                    };

                    // we are sending the profile in the token
                    var tokenString = jwt.sign(profile, BackendConfig.getJWTSecret());

                    var finalSuccess = function() {
                        res.json({token: tokenString});
                    };

                    var now = moment();
                    var tomorrow = moment().add(7, 'days');

                    var token : Token = new Token(tokenString, tomorrow.toDate());

                    var successCreate = function(tokenData) {
                        var successAddToken = function () {
                            user.setLastIp(clientIp);
                            user.setLastConnection(now.toDate());

                            user.update(finalSuccess, fail);
                        };

                        user.addToken(token.getId(), successAddToken, fail);
                    };

                    token.create(successCreate, fail);
                };

                var failCheckPassword = function (error) {
                    Logger.debug("Fail to check password for user: "+req.body.usernameOrEmail);
                    Logger.debug(error);

                    res.status(403).send({ 'error': "Error in login/password." });
                };

                user.checkPassword(req.body.password, successCheck, failCheckPassword);
            };

            var failFindUsername = function(error) {
                var failFindUser = function (error) {
                    Logger.debug("Fail to find user : "+req.body.usernameOrEmail);
                    Logger.debug(error);

                    res.status(404).send({ 'error': "This user does not exist." });
                };

                User.findOneByEmail(req.body.usernameOrEmail, success, failFindUser);
            };

            User.findOneByUsername(req.body.usernameOrEmail, success, failFindUsername);
        });

		this.app.post('/loginFromToken', function(req, res) {
			var successFindToken = function(token : Token) {
                var now = moment();

                if (now.isAfter(token.endDate())) {
                    Logger.info("Login by token: token has expired and will be deleted.");

                    var successDelete = function () {
                        Logger.debug("Token successfully deleted");
                    };

                    var failDelete = function (error) {
                        Logger.error("Error while deleting a token");
                        Logger.debug(error);
                    };

                    token.delete(successDelete, failDelete);
                    res.status(403).send({ 'error': 'The token has expired.' });
                } else {
                    var ip_info = get_ip(req);
                    // { clientIp: '127.0.0.1', clientIpRoutable: false }
                    var clientIp = ip_info.clientIp;

                    Logger.info("Login by token with IP: " + clientIp);

                    var failError = function (error) {
                        res.status(500).send({'error': JSON.stringify(error)});
                    };

                    var successLoadUser = function () {
                        var user = token.user();

                        var profile = {
                            username: user.username(),
                            ip: clientIp,
                            id: user.getId(),
                            date: new Date()
                        };

                        // we are sending the profile in the token
                        var tokenStr = jwt.sign(profile, BackendConfig.getJWTSecret());
                        var finalSuccess = function () {
                            res.json({token: tokenStr});
                        };

                        var successTokenUpdate = function() {
                            user.setLastIp(clientIp);
                            user.setLastConnection(new Date());

                            user.update(finalSuccess, fail);
                        };

                        var newEndDate = moment().add(7, 'days');
                        token.setEndDate(newEndDate);
                        token.setValue(tokenStr);
                        token.update(successTokenUpdate, fail);
                    };

                    token.loadUser(successLoadUser, failError);
                }
			};

			var fail = function(error) {
				res.status(404).send({ 'error': JSON.stringify(error) });
			};

			Token.findOneByValue(req.body.token, successFindToken, fail);
		});


        this.init();
    }

    /**
     * Method to init the Backend server.
     *
     * @method init
     */
    init() {
        var self = this;

        self.addNamespace("clients", ClientsNamespaceManager);
        self.addNamespace("sources", SourcesNamespaceManager);
        var adminNamespace : any = self.addNamespace("admins", AdminsNamespaceManager);

        adminNamespace.use(socketioJwt.authorize({
            secret: BackendConfig.getJWTSecret(),
            handshake: true
        }));

        adminNamespace.use(function(socket, next) {
            var handshakeData : any = socket.request;

            var success = function(token : Token) {
                console.log(socket.handshake.headers['x-forwarded-for']);

                var successLoadUser = function () {
                    var user = token.user();

                    if (user.isAdmin()) {
                        Logger.debug("Connection of user "+user.username()+" to admin. Access granted.");

                        socket.connectedUser = user;
                        next();
                    } else {
                        Logger.info("The following user: "+user.username()+" is trying to access to the admin. Access refused.");
                        next(new Error('You are not allowed to access to this page.'));
                    }
                };

                token.loadUser(successLoadUser, fail);
                //} else {
                //    next(new Error('Peer Ip Address is not same as last known Ip address (when retrieve token).'));
                //}
            };

            var fail = function(error) {
                next(error);
            };

            console.log("token : ");
            console.log(handshakeData._query.token);

            Token.findOneByValue(handshakeData._query.token, success, fail);
            // make sure the handshake data looks good as before
            // if error do this:
            // next(new Error('not authorized');
            // else just call next
        });

        var backendAuthNamespaceManager : any = self.addNamespace("backendAuth", BackendAuthNamespaceManager);

        backendAuthNamespaceManager.use(socketioJwt.authorize({
            secret: BackendConfig.getJWTSecret(),
            handshake: true
        }));

        backendAuthNamespaceManager.use(function(socket, next) {
            var handshakeData : any = socket.request;

            var success = function(token : Token) {
                console.log(socket.handshake.headers['x-forwarded-for']);

                var successLoadUser = function () {
                    var user = token.user();

                   Logger.debug("Connection of user "+user.username()+" to backend. Access granted.");

                    socket.connectedUser = user;
                    next();
                };

                token.loadUser(successLoadUser, fail);
                //} else {
                //    next(new Error('Peer Ip Address is not same as last known Ip address (when retrieve token).'));
                //}
            };

            var fail = function(error) {
                next(error);
            };

            console.log("token : ");
            console.log(handshakeData._query.token);

            Token.findOneByValue(handshakeData._query.token, success, fail);
            // make sure the handshake data looks good as before
            // if error do this:
            // next(new Error('not authorized');
            // else just call next
        });

        self.addAPIEndpoint("contact", ContactFormRouter);
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