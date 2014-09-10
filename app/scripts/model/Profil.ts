/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./Call.ts" />
/// <reference path="./Timeline.ts" />

/// <reference path="../core/Logger.ts" />
/// <reference path="../core/RestClient.ts" />
/// <reference path="../core/DatabaseConnection.ts" />

/**
 * Model : Profil
 *
 * @class Profil
 * @extends ModelItf
 */
class Profil extends ModelItf {

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
     * Calls property.
     *
     * @property _calls
     * @type Array<Call>
     */
    private _calls : Array<Call>;

    /**
     * Lazy loading for Calls property.
     *
     * @property _calls_loaded
     * @type boolean
     */
    private _calls_loaded : boolean;

    /**
     * Timelines property.
     *
     * @property _timelines
     * @type Array<Timeline>
     */
    private _timelines : Array<Timeline>;

    /**
     * Lazy loading for Timelines property.
     *
     * @property _timelines_loaded
     * @type boolean
     */
    private _timelines_loaded : boolean;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The Profil's name.
     * @param {string} description - The Profil's description.
     * @param {number} id - The Profil's ID.
     */
    constructor(name : string, description : string, id : number = null) {
        super(id);

        this.setName(name);

        this.setDescription(description);

        this._calls = new Array<Call>();
        this._calls_loaded = false;

        this._timelines = new Array<Timeline>();
        this._timelines_loaded = false;
    }

    /**
     * Return the Profil's name.
     *
     * @method name
     * @return {string} The Profil's name.
     */
    name() {
        return this._name;
    }

    /**
     * Set the Profil's name.
     *
     * @method setName
     */
    setName(name : string) {
        if(name == null || name == "") {
            Logger.error("A Profil needs to have a name.");
            // TODO : Throw an Exception ?
        }

        this._name = name;
    }

    /**
     * Return the Profil's description.
     *
     * @method description
     * @return {string} The Profil's description.
     */
    description() : string {
        return this._description;
    }

    /**
     * Set the Profil's description.
     *
     * @method setDescription
     */
    setDescription(description : string) {
        if(description == null || description == "") {
            Logger.error("A Profil needs to have a description.");
            // TODO : Throw an Exception ?
        }

        this._description = description;
    }

    /**
     * Return the Profil's calls.
     *
     * @method calls
     * @return {Array<Call>} The Profil's calls.
     */
    calls() : Array<Call> {
        if(! this._calls_loaded) {
            // TODO : Retrieve from database.
            this._calls_loaded = true;
        }
        return this._calls;
    }

    /**
     * Return the Profil's timelines.
     *
     * @method timelines
     * @return {Array<Timeline>} The Profil's timelines.
     */
    timelines() : Array<Timeline> {
        if(! this._timelines_loaded) {
            // TODO : Retrieve from database.
            this._timelines_loaded = true;
        }
        return this._timelines;
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

    /**
     * Create model in database.
     *
     * @method create
     * @return {boolean} Create status
     */
    create() : boolean {

        if(this.getId() != undefined) {
            return this.update();
        }

        var data = new Object();
        data["name"] = this.name();
        data["description"] = this.description();

        var result = RestClient.postSync(DatabaseConnection.getBaseURL() + "/" + Profil.getTableName(), data);

        if(result.success) {
            var response = result.data;
            if(response.status == "success") {
                if(Object.keys(response.data).length == 0) {
                    return false;
                } else {
                    this._id = response.data.id;
                    return true;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * Retrieve model description from database and create model instance.
     *
     * @method read
     * @static
     * @param {number} id - The model instance's id.
     * @return {Profil} The model instance.
     */
    static read(id : number) : Profil {
        var result = RestClient.getSync(DatabaseConnection.getBaseURL() + "/" + Profil.getTableName() + "/" + id.toString());

        if(result.success) {
            var response = result.data;
            if(response.status == "success") {
                if(Object.keys(response.data).length == 0) {
                    return null;
                } else {
                    return new Profil(response.data.name, response.data.description, response.data.id);
                }
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    /**
     * Update in database the model with current id.
     *
     * @method update
     * @return {boolean} Update status
     */
    update() : boolean {
        if(this.getId() == undefined) {
            return this.create();
        }

        var data = new Object();
        data["name"] = this.name();
        data["description"] = this.description();

        var result = RestClient.putSync(DatabaseConnection.getBaseURL() + "/" + Profil.getTableName() + "/" + this.getId().toString(), data);

        if(result.success) {
            var response = result.data;
            if(response.status == "success") {
                if(Object.keys(response.data).length == 0) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * Delete in database the model with current id.
     *
     * @method delete
     * @return {boolean} Delete status
     */
    delete() : boolean {
        if(this.getId() == undefined) {
            return false;
        }

        var result = RestClient.deleteSync(DatabaseConnection.getBaseURL() + "/" + Profil.getTableName() + "/" + this.getId().toString());

        if(result.success) {
            var response = result.data;
            if(response.status == "success") {
                if(Object.keys(response.data).length == 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * Retrieve all models from database and create corresponding model instances.
     *
     * @method all
     * @return {Array<Profil>} The model instances.
     */
    static all() : Array<Profil> {
        var allProfils : Array<Profil> = new Array<Profil>();

        var result = RestClient.getSync(DatabaseConnection.getBaseURL() + "/" + Profil.getTableName());

        if(result.success) {
            var response = result.data;
            if(response.status == "success") {
                if(Object.keys(response.data).length > 0) {
                    for(var i = 0; i < response.data.length; i++) {
                        var p = response.data[i];
                        allProfils.push(Profil.fromJSONObject(p));
                    }
                }
                return allProfils;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    /**
     * Return a ModelItf instance from a JSON string.
     *
     * @method parseJSON
     * @static
     * @param {string} json - The JSON string
     * @return {Profil} The model instance.
     */
    static parseJSON(jsonString : string) : Profil {
        return Profil.fromJSONObject(JSON.parse(jsonString));
    }

    /**
     * Return a ModelItf instance from a JSON Object.
     *
     * @method fromJSONObject
     * @static
     * @param {JSONObject} json - The JSON Object
     * @return {Profil} The model instance.
     */
    static fromJSONObject(jsonObject : any) : Profil {
        if(typeof(jsonObject.name) == "undefined" || typeof(jsonObject.description) == "undefined" || typeof(jsonObject.id) == "undefined") {
            return null;
        } else {
            return new Profil(jsonObject.name, jsonObject.description, jsonObject.id);
        }
    }

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "Profils";
    }
}