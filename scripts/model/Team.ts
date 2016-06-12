/**
 * @author Simon Urli <simon@pulsetotem.fr>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./User.ts" />
/// <reference path="./SDI.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * @class Team Represents a team of users. All team has access to the sames SDIs.
 */
class Team extends ModelItf {

    /**
     * @property _name : Name of the team
     * @private
     */
    private _name : String;

    /**
     * @property _owner : User owner of the team
     * @private
     */
    private _owner : User;

    /**
     * @property _owner_loaded : Determine if owner property has been loaded.
     * @private
     */
    private _owner_loaded : boolean;

    /**
     * @property _users : All users of the team
     * @private
     */
    private _users : Array<User>;

    /**
     * @property _users_loaded : Determine if the list of team users has been loaded
     * @private
     */
    private _users_loaded : boolean;

    /**
     * @property _sdis : All SDI owned by the team
     * @private
     */
    private _sdis : Array<SDI>;

    /**
     * @property _sdis_loaded : Determine if the list of SDIs has been loaded
     * @private
     */
    private _sdis_loaded : boolean;

    constructor(name : string, id : number = null, complete : boolean = false, createdAt : string = null, updatedAt : string = null) {
        super(id, complete, createdAt, updatedAt);

        this.setName(name);

        this._owner = null;
        this._owner_loaded = false;

        this._users = new Array<User>();
        this._users_loaded = false;

        this._sdis = new Array<SDI>();
        this._sdis_loaded = false;
    }

    setName(name : string) {
        this._name = name;
    }

    name() : string {
        return this._name;
    }

    owner() : User {
        return this._owner;
    }

    loadOwner(successCallback : Function, failCallback : Function) {
        if (!this._owner_loaded) {
            var self = this;
            var success = function (owner) {
                self._owner = owner;
                self._owner_loaded = true;
                successCallback();
            };

            var fail = function (error) {
                failCallback(error);
            };

            this.getUniquelyAssociatedObject("")
        } else {
            successCallback();
        }
    }
}