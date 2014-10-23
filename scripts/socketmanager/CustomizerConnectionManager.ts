/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/libsdef/socket.io-0.9.10.d.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Stocks TODO ???? for a specific socket.
 *
 * @class CustomizerConnectionManager
 */
class CustomizerConnectionManager {

    /**
     * Socket's id.
     *
     * @property _socketId
     * @private
     * @type string
     */
    private _socketId: string;

    /**
     * @constructor
     */
    constructor(socketId : string) {
        this._socketId = socketId;
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
}