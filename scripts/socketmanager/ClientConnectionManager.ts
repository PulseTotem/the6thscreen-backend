/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/libsdef/socket.io-0.9.10.d.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />
/// <reference path="../client/ClientManager.ts" />

/**
 * Stocks ClientManager for a specific socket.
 *
 * @class ClientConnectionManager
 */
class ClientConnectionManager {

    /**
     * Socket's id.
     *
     * @property _socketId
     * @private
     * @type string
     */
    private _socketId: string;

    /**
     * ClientManager list.
     *
     * @property _clientManagers
     * @private
     * @type Array<ClientManager>
     */
    private _clientManagers: Array<ClientManager>;

    /**
     * @constructor
     */
    constructor(socketId : string) {
        this._socketId = socketId;
        this._clientManagers = new Array<ClientManager>();
    }

    /**
     * Returns Socket's id.
     *
     * @method getSocketId
     * @returns {string} The socket's id.
     */
    getSocketId() : string {
        return this._socketId;
    }

    /**
     * Adds a ClientManager attached to socket.
     *
     * @method addClientManager
     * @param {ClientManager} clientManager - The ClientManager to add.
     */
    addClientManager(clientManager : ClientManager) {
        this._clientManagers.push(clientManager);
    }
}