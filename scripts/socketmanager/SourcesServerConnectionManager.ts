/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/libsdef/socket.io-0.9.10.d.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />
/// <reference path="../sourcesserver/SourcesServerManager.ts" />

/**
 * Stocks SourcesServer for a specific socket.
 *
 * @class SourcesServerConnectionManager
 */
class SourcesServerConnectionManager {

    /**
     * Socket's id.
     *
     * @property _socketId
     * @private
     * @type string
     */
    private _socketId: string;

    /**
     * SourcesServerManager list.
     *
     * @property _sourcesServerManagers
     * @private
     * @type Array<SourcesServerManager>
     */
    private _sourcesServerManagers: Array<SourcesServerManager>;

    /**
     * @constructor
     */
    constructor(socketId : string) {
        this._socketId = socketId;
        this._sourcesServerManagers = new Array<SourcesServerManager>();
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
     * Adds a SourcesServerManager attached to socket.
     *
     * @method addSourcesServerManager
     * @param {SourcesServerManager} sourcesServerManager - The SourcesServerManager to add.
     */
    addSourcesServerManager(sourcesServerManager : SourcesServerManager) {
        this._sourcesServerManagers.push(sourcesServerManager);
    }
}