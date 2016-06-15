/**
 * @author Simon Urli <simon@pulsetotem.fr>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./User.ts" />
/// <reference path="./SDI.ts" />
/// <reference path="./OAuthKey.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * @class Team Represents a team of users. All team has access to the sames SDIs.
 */
class Team extends ModelItf {

    /**
     * @property _name : Name of the team
     * @private
     */
    private _name : string;

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
     * @property _sdis: All SDI available for the team
     * @private
     */
    private _sdis : Array<SDI>;

    /**
     * @property _sdis_loaded : Determine if the list of SDIs has been loaded
     * @private
     */
    private _sdis_loaded : boolean;

    /**
     * @property _oauthkeys: All oauthkeys managed by the team
     * @private
     */
    private _oauthkeys : Array<OAuthKey>;

    /**
     * @property _oauthkeys_loaded: lazy loading for oauthkeys
     * @private
     */
    private _oauthkeys_loaded : boolean;

    /**
     * Constructor of a team. Only the name is mandatory.
     * @param name
     * @param id
     * @param complete
     * @param createdAt
     * @param updatedAt
     */
    constructor(name : string = "", id : number = null, complete : boolean = false, createdAt : string = null, updatedAt : string = null) {
        super(id, complete, createdAt, updatedAt);

        this.setName(name);

        this._owner = null;
        this._owner_loaded = false;

        this._users = new Array<User>();
        this._users_loaded = false;

        this._sdis = new Array<SDI>();
        this._sdis_loaded = false;

        this._oauthkeys = new Array<OAuthKey>();
        this._oauthkeys_loaded = false;
    }

    /**
     * @method setName set the name of the team
     * @param name
     */
    setName(name : string) {
        this._name = name;
    }

    /**
     * Get the name of the team
     * @returns {String}
     */
    name() : string {
        return this._name;
    }

    /**
     * Get the owner of the team
     * @returns {User}
     */
    owner() : User {
        return this._owner;
    }

    /**
     * Load the owner
     * @param successCallback
     * @param failCallback
     */
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

            this.getUniquelyAssociatedObject(Team, User, success, fail, 0, "Owners");
        } else {
            successCallback();
        }
    }

    /**
     * Get the users who belongs to the team
     * @returns {Array<User>}
     */
    users() : Array<User> {
        return this._users;
    }

    /**
     * Load the users
     * @param successCallback
     * @param failCallback
     */
    loadUsers(successCallback : Function, failCallback : Function) {
        if (!this._users_loaded) {
            var self = this;
            var success = function (users) {
                self._users = users;
                self._users_loaded = true;
                successCallback();
            };

            var fail = function (error) {
                failCallback(error);
            };

            this.getAssociatedObjects(Team, User, success, fail);
        } else {
            successCallback();
        }
    }

    /**
     * Get the SDIs available for the team
     * @returns {Array<SDI>}
     */
    sdis() : Array<SDI> {
        return this._sdis;
    }

    /**
     * Load the SDIs
     * @param successCallback
     * @param failCallback
     */
    loadSDIS(successCallback : Function, failCallback : Function) {
        if (!this._sdis_loaded) {
            var self = this;
            var success = function (sdis) {
                self._sdis = sdis;
                self._sdis_loaded = true;
                successCallback();
            };

            var fail = function (error) {
                failCallback(error);
            };

            this.getAssociatedObjects(Team, SDI, success, fail);
        } else {
            successCallback();
        }
    }

    /**
     * Get the OAuthKeys available for this team
     *
     * @returns {Array<OAuthKey>}
     */
    oauthkeys() : Array<OAuthKey> {
        return this._oauthkeys;
    }

    /**
     * Load the oauthkeys
     *
     * @param successCallback
     * @param failCallback
     */
    loadOAuthKeys(successCallback : Function, failCallback : Function) {
        if (!this._oauthkeys_loaded) {
            var self = this;
            var success = function (oauthkeys) {
                self._oauthkeys = oauthkeys;
                self._oauthkeys_loaded = true;
                successCallback();
            };

            var fail = function (error) {
                failCallback(error);
            };

            this.getAssociatedObjects(Team, OAuthKey, success, fail);
        } else {
            successCallback();
        }
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

    /**
     * Load all the lazy loading properties of the object.
     * Useful when you want to get a complete object.
     *
     * @method loadAssociations
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadAssociations(successCallback : Function, failCallback : Function) {
        var self = this;

        var success : Function = function(models) {
            if(self._owner_loaded && self._users_loaded && self._sdis_loaded && self._oauthkeys_loaded) {
                if (successCallback != null) {
                    successCallback();
                } // else //Nothing to do ?
            }
        };

        var fail : Function = function(error) {
            if(failCallback != null) {
                failCallback(error);
            } else {
                Logger.error(JSON.stringify(error));
            }
        };
        this.loadOwner(success, fail);
        this.loadUsers(success, fail);
        this.loadSDIS(success, fail);
        this.loadOAuthKeys(success, fail);
    }

    /**
     * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
     */
    desynchronize() : void {
        this._sdis_loaded = false;
        this._owner_loaded = false;
        this._users_loaded = false;
        this._oauthkeys_loaded = false;
    }

    /**
     * Check completeness of a Team.
     * The completeness is determined by the presence of a name.
     */
    checkCompleteness(successCallback : Function, failCallback : Function) : void {
        var self = this;

        var success : Function = function () {
            self._complete = (self._complete && !!self.name());
            successCallback();
        };

        super.checkCompleteness(success, failCallback);
    }

    /**
     * Return a Team instance as a JSON Object
     *
     * @method toJSONObject
     * @returns {Object} a JSON Object representing the instance
     */
    toJSONObject() : Object {
        var data = {
            "id": this.getId(),
            "name": this.name(),
            "complete": this.isComplete(),
            "createdAt" : this.getCreatedAt(),
            "updatedAt" : this.getUpdatedAt()
        };
        return data;
    }

    /**
     * Return a Team instance as a JSON Object including associated object.
     * However the method should not be recursive due to cycle in the model.
     *
     * @method toCompleteJSONObject
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    toCompleteJSONObject(successCallback : Function, failCallback : Function, onlyId : boolean = false) {
        var self = this;

        var success : Function = function() {
            var data = self.toJSONObject();

            if (onlyId) {
                data["owner"] = (self.owner() !== null) ? self.owner().getId() : null;
            } else {
                data["owner"] = (self.owner() !== null) ? self.owner().toJSONObject() : null;
            }
            data["users"] = self.serializeArray(self.users(), onlyId);
            data["sdis"] = self.serializeArray(self.sdis(), onlyId);
            data["oauthkeys"] = self.serializeArray(self.oauthkeys(), onlyId);

            successCallback(data);
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.loadAssociations(success, fail);
    }

    /**
     * Determine if the current team is a default team of the owner
     *
     * @param successCallback
     * @param failCallback
     */
    isDefaultTeam(successCallback : Function, failCallback : Function) {
        var self = this;

        var fail = function (error) {
            failCallback(error);
        };

        var successLoadOwner = function () {
            if (self.owner() != null) {
                var successDefaultTeam = function () {
                    var result = (self.getId() == self.owner().defaultTeam().getId());
                    successCallback(result);
                };

                self.owner().loadDefaultTeam(successDefaultTeam, fail);
            } else {
                Logger.error("Owner is null for team "+self.name());
                successCallback(false);
            }

        };

        this.loadOwner(successLoadOwner, fail);
    }

    /**
     * Return data of the team with information about wheter it is or not a default team
     * @param successCallback
     * @param failCallback
     * @param onlyId
     */
    toCompleteJSONObjectWithDefaultTeam(successCallback : Function, failCallback : Function, onlyId : boolean = false) {
        var self = this;

        var successComplete = function (data) {
            var successIsDefault = function (isDefault) {
                data["isDefaultTeam"] = isDefault;

                successCallback(data);
            };

            self.isDefaultTeam(successIsDefault, failCallback);
        };


        this.toCompleteJSONObject(successComplete, failCallback, onlyId);
    }

    /**
     * Set the Owner of the Team.
     *
     * @method linkOwner
     * @param {number} ownerId The User id of the owner to link with the team.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    linkOwner(ownerId : number, successCallback : Function, failCallback : Function) {
        this.associateObject(Team, User, ownerId, successCallback, failCallback, 0, "Owners");
    }

    /**
     * Unset the current Owner from the Team.
     *
     * @method unlinkOwner
     *  @param {number} ownerId The User id of the owner to unlink with the team.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    unlinkOwner(ownerId : number, successCallback : Function, failCallback : Function) {
        this.deleteObjectAssociation(Team, User, ownerId, successCallback, failCallback, 0, "Owners");
    }

    /**
     * Add a new User to the Team and associate it in the database.
     * A User can only be added once.
     *
     * @method addUser
     * @param {number} userID The id of the User to add inside the Team. It cannot be a null value.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    addUser(userID : number, successCallback : Function, failCallback : Function) {
        this.associateObject(Team, User, userID, successCallback, failCallback);
    }

    /**
     * Remove a User from the Team: the association is removed both in the object and in database.
     * The User can only be removed if it exists first in the list of associated Users, else an exception is thrown.
     *
     * @method removeUser
     * @param {number} userID The id of the User to remove from that Team
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    removeUser(userID : number, successCallback : Function, failCallback : Function) {
        this.deleteObjectAssociation(Team, User, userID, successCallback, failCallback);
    }

    /**
     * Add a new SDI to the Team and associate it in the database.
     * A User can only be added once.
     *
     * @method addSDI
     * @param {number} sdiID The id of the SDI to add inside the Team. It cannot be a null value.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    addSDI(sdiID : number, successCallback : Function, failCallback : Function) {
        this.associateObject(Team, SDI, sdiID, successCallback, failCallback);
    }

    /**
     * Remove a SDI from the Team: the association is removed both in the object and in database.
     * The User can only be removed if it exists first in the list of associated Users, else an exception is thrown.
     *
     * @method removeSDI
     * @param {number} sdiID The id of the SDI to remove from that Team
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    removeSDI(sdiID : number, successCallback : Function, failCallback : Function) {
        this.deleteObjectAssociation(Team, SDI, sdiID, successCallback, failCallback);
    }

    /**
     * Add a new OAuthKey to the Team and associate it in the database.
     *
     * @method addOAuthKey
     * @param {number} oAuthKeyId The id of the OAuthKey to add inside the Team. It cannot be a null value.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    addOAuthKey(oAuthKeyId : number, successCallback : Function, failCallback : Function) {
        this.associateObject(Team, OAuthKey, oAuthKeyId, successCallback, failCallback);
    }

    /**
     * Remove a OAuthKey from the Team: the association is removed both in the object and in database.
     * The User can only be removed if it exists first in the list of associated Users, else an exception is thrown.
     *
     * @method removeOAuthKey
     * @param {number} oAuthKeyId The id of the OAuthKey to remove from that Team
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    removeOAuthKey(oAuthKeyId : number, successCallback : Function, failCallback : Function) {
        this.deleteObjectAssociation(Team, OAuthKey, oAuthKeyId, successCallback, failCallback);
    }

    /**
     * Create model in database.
     *
     * @method create
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    create(successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
        this.createObject(Team, this.toJSONObject(), successCallback, failCallback);
    }

    /**
     * Retrieve model description from database and create model instance.
     *
     * @method read
     * @static
     * @param {number} id - The model instance's id.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    static read(id : number, successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
        ModelItf.readObject(Team, id, successCallback, failCallback, attemptNumber);
    }

    /**
     * Update in database the model with current id.
     *
     * @method update
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    update(successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
        return this.updateObject(Team, this.toJSONObject(), successCallback, failCallback, attemptNumber);
    }

    /**
     * Delete in database the model with current id.
     *
     * @method delete
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    delete(successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
        return ModelItf.deleteObject(Team, this.getId(), successCallback, failCallback, attemptNumber);
    }

    /**
     * Retrieve all models from database and create corresponding model instances.
     *
     * @method all
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    static all(successCallback : Function, failCallback : Function, attemptNumber : number = 0) {
        return this.allObjects(Team, successCallback, failCallback, attemptNumber);
    }

    /**
     * Return a Team instance from a JSON string.
     *
     * @method parseJSON
     * @static
     * @param {string} json - The JSON string
     * @return {SDI} The model instance.
     */
    static parseJSON(jsonString : string) : Team {
        return Team.fromJSONObject(JSON.parse(jsonString));
    }

    /**
     * Return a Team instance from a JSON Object.
     *
     * @method fromJSONObject
     * @static
     * @param {JSONObject} json - The JSON Object
     * @return {SDI} The model instance.
     */
    static fromJSONObject(jsonObject : any) : Team {
        return new Team(jsonObject.name, jsonObject.id, jsonObject.complete, jsonObject.createdAt, jsonObject.updatedAt);
    }

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "Teams";
    }
}