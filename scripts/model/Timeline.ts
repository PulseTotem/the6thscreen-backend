/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Profil.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Model : Timeline
 *
 * @class Timeline
 * @extends ModelItf
 */
class Timeline extends ModelItf {

    /**
     * Name property.
     *
     * @property _name
     * @type string
     */
    private _name : string;

    /**
     * Description property.
     *
     * @property _description
     * @type string
     */
    private _description : string;

    /**
     * Profils property.
     *
     * @property _profils
     * @type Array<Profil>
     */
    private _profils : Array<Profil>;

    /**
     * Lazy loading for Profils property.
     *
     * @property _profils_loaded
     * @type boolean
     */
    private _profils_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The Timeline's name.
     * @param {string} description - The Timeline's description.
     * @param {number} id - The Timeline's ID.
     */
    constructor(name : string, description : string = "", id : number = null) {
        super(id);

        this.setName(name);
	    this.setDescription(description);

        this._profils = new Array<Profil>();
        this._profils_loaded = false;
    }

	/**
	 * Set the Timeline's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		if(!name) {
			throw new ModelException("The name is mandatory for a Timeline");
		}

		this._name = name;
	}

	/**
	 * Set the Timeline's description.
	 *
	 * @method setDescription
	 */
	setDescription(description : string) {
		this._description = description;
	}

    /**
     * Return the Timeline's name.
     *
     * @method name
     */
    name() {
        return this._name;
    }

    /**
     * Return the Timeline's description.
     *
     * @method description
     */
    description() {
        return this._description;
    }

    /**
     * Return the Timeline's profils.
     *
     * @method profils
     */
    profils() {
        return this._profils;
    }

    /**
     * Load the Timeline's profils.
     *
     * @method loadProfils
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    loadProfils(successCallback : Function = null, failCallback : Function = null) {
        if(! this._profils_loaded) {
            var self = this;
            var success : Function = function(profils) {
                self._profils = profils;
                self._profils_loaded = true;
                if(successCallback != null) {
                    successCallback();
                }
            };

            var fail : Function = function(error) {
                if(failCallback != null) {
                    failCallback(error);
                }
            };

            this.getAssociatedObjects(Timeline, Profil, success, fail);
        } else {
            if(successCallback != null) {
                successCallback();
            }
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
    loadAssociations(successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var success : Function = function(models) {
            if(self._profils_loaded) {
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

        this.loadProfils(success, fail);
    }

	/**
	 * Set the object as desynchronized given the different lazy properties.
     *
     * @method desynchronize
	 */
	desynchronize() : void {
		this._profils_loaded = false;
	}

	/**
	 * Return a Timeline instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"name": this.name(),
			"description": this.description()
		};
		return data;
	}

    /**
     * Return a Timeline instance as a JSON Object including associated object.
     * However the method should not be recursive due to cycle in the model.
     *
     * @method toCompleteJSONObject
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    toCompleteJSONObject(successCallback : Function = null, failCallback : Function = null) {
        var self = this;

        var success : Function = function() {
            var data = self.toJSONObject();
            data["profils"] = self.serializeArray(self.profils());

            successCallback(data);
        };

        var fail : Function = function(error) {
            failCallback(error);
        };

        this.loadAssociations(success, fail);
    }

	/**
	 * Add a new Profil to the Timeline and associate it in the database.
	 * A Profil can only be added once.
	 *
     * @method addProfil
	 * @param {Profil} p The Profil to add inside the Timeline. It cannot be a null value.
	 * @returns {boolean} Returns true if the association is realized in database.
	 */
	addProfil(p : Profil) : boolean {
		if (!p || !p.getId()) {
			throw new ModelException("The Profil must be an existing object to be associated.");
		}

		if (ModelItf.isObjectInsideArray(this.profils(), p)) {
			throw new ModelException("You cannot add twice a Profil for a Timeline.");
		}

		if (this.associateObject(Timeline, Profil, p.getId())) {
			p.desynchronize();
			this.profils().push(p);
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Remove a Profil from the Timeline: the association is removed both in the object and in database.
	 * The Profil can only be removed if it exists first in the list of associated Profils, else an exception is thrown.
	 *
     * @method removeProfil
	 * @param {Profil} p The Profil to remove from that Timeline
	 * @returns {boolean} Returns true if the association is deleted in database.
	 */
	removeProfil(p : Profil) : boolean {
		if (!p || !p.getId()) {
			throw new ModelException("The Profil must be an existing object to be removed.");
		}

		if (!ModelItf.isObjectInsideArray(this.profils(), p)) {
			throw new ModelException("The Profil you try to remove is not yet associated.");
		}

		if (this.deleteObjectAssociation(Timeline, Profil, p.getId())) {
			p.desynchronize();
			return ModelItf.removeObjectFromArray(this.profils(), p);
		} else {
			return false;
		}
	}

	/**
     * Create model in database.
     *
     * @method create
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    create(successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
        this.createObject(Timeline, this.toJSONObject(), successCallback, failCallback);
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
    static read(id : number, successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
        ModelItf.readObject(Timeline, id, successCallback, failCallback, attemptNumber);
    }

    /**
     * Update in database the model with current id.
     *
     * @method update
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    update(successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
        return this.updateObject(Timeline, this.toJSONObject(), successCallback, failCallback, attemptNumber);
    }

    /**
     * Delete in database the model with current id.
     *
     * @method delete
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    delete(successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
        return this.deleteObject(Timeline, successCallback, failCallback, attemptNumber);
    }

    /**
     * Retrieve all models from database and create corresponding model instances.
     *
     * @method all
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     * @param {number} attemptNumber - The attempt number.
     */
    static all(successCallback : Function = null, failCallback : Function = null, attemptNumber : number = 0) {
        return this.allObjects(Timeline, successCallback, failCallback, attemptNumber);
    }

	/**
	 * Return a Timeline instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {Timeline} The model instance.
	 */
	static parseJSON(jsonString : string) : Timeline {
		return Timeline.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a Timeline instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {Timeline} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : Timeline {
		if(!jsonObject.id) {
			throw new ModelException("A Timeline object should have an ID.");
		}
		if(!jsonObject.name) {
			throw new ModelException("A Timeline object should have a name.");
		}
		if(!jsonObject.description) {
			throw new ModelException("A Timeline object should have a description.");
		}
		return new Timeline(jsonObject.name, jsonObject.description, jsonObject.id);
	}

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "Timelines";
    }
}