/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../core/Logger.ts" />
/// <reference path="../core/RestClient.ts" />
/// <reference path="../core/DatabaseConnection.ts" />

/**
 * Model Interface
 *
 * @class ModelItf
 */
class ModelItf {

    /**
     * ID property.
     *
     * @property _id
     * @type number
     */
    _id : number;

    /**
     * Constructor.
     *
     * @param {number} id - The model ID.
     */
    constructor(id : number) {
        this._id = id;
    }

    /**
     * Returns ID of model.
     *
     * @method getId
     * @return {number} The model's ID.
     */
    getId() : number {
        return this._id;
    }

    /**
     * Create model object in database.
     *
     * @method createObject
     * @param {ModelItf Class} modelClass - The model to create.
     * @param {Object} data - The data necessary to create object.
     * @return {boolean} Create status
     */
    createObject(modelClass : any, data : any) : boolean {
        if(this.getId() != undefined) {
            return this.update();
        }

        var result = RestClient.postSync(DatabaseConnection.getBaseURL() + "/" + modelClass.getTableName(), data);

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
     * @method readObject
     * @static
     * @param {ModelItf Class} modelClass - The model to retrieve.
     * @param {number} id - The model instance's id.
     */
    static readObject(modelClass : any, id : number) {
        var result = RestClient.getSync(DatabaseConnection.getBaseURL() + "/" + modelClass.getTableName() + "/" + id.toString());

        if(result.success) {
            var response = result.data;
            if(response.status == "success") {
                if(Object.keys(response.data).length == 0) {
                    return null;
                } else {
                    return modelClass.fromJSONObject(response.data);
                }
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    /**
     * Update model object in database.
     *
     * @method updateObject
     * @param {ModelItf Class} modelClass - The model to update.
     * @param {Object} data - The data necessary to update object.
     * @return {boolean} Update status
     */
     updateObject(modelClass : any, data : any) : boolean {
        if(this.getId() == undefined) {
            return this.create();
        }

        var result = RestClient.putSync(DatabaseConnection.getBaseURL() + "/" + modelClass.getTableName() + "/" + this.getId().toString(), data);

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
     * Delete model object in database.
     *
     * @method deleteObject
     * @param {ModelItf Class} modelClass - The model to delete.
     * @return {boolean} Delete status
     */
    deleteObject(modelClass : any) : boolean {
        if(this.getId() == undefined) {
            return false;
        }

        var result = RestClient.deleteSync(DatabaseConnection.getBaseURL() + "/" + modelClass.getTableName() + "/" + this.getId().toString());

        if(result.success) {
            var response = result.data;
            if(response.status == "success") {
                if(Object.keys(response.data).length == 0) {
                    this._id = undefined;
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
     * Retrieve all model objects in database.
     *
     * @method allObjects
     * @static
     * @param {ModelItf Class} modelClass - The model to retrieve all instances.
     * @return {Array<ModelItf>} The model instances.
     */
    static allObjects(modelClass : any) {
        var allModelItfs : any = new Array();

        var result = RestClient.getSync(DatabaseConnection.getBaseURL() + "/" + modelClass.getTableName());

        if(result.success) {
            var response = result.data;
            if(response.status == "success") {
                if(Object.keys(response.data).length > 0) {
                    for(var i = 0; i < response.data.length; i++) {
                        var obj = response.data[i];
                        allModelItfs.push(modelClass.fromJSONObject(obj));
                    }
                }
                return allModelItfs;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    //////////////////// Methods managing model. Connections to database. ///////////////////////////

    /**
     * Create model in database.
     *
     * @method create
     * @return {boolean} Create status
     */
    create() : boolean {
        Logger.error("ModelItf - create : Method need to be implemented.");
        return false;
    }

    /**
     * Retrieve model description from database and create model instance.
     *
     * @method read
     * @static
     * @param {number} id - The model instance's id.
     * @return {ModelItf} The model instance.
     */
    static read(id : number) : ModelItf {
        Logger.error("ModelItf - read : Method need to be implemented.");
        return null;
    }

    /**
     * Update in database the model with current id.
     *
     * @method update
     * @return {boolean} Update status
     */
    update() : boolean {
        Logger.error("ModelItf - update : Method need to be implemented.");
        return false;
    }

    /**
     * Delete in database the model with current id.
     *
     * @method delete
     * @return {boolean} Delete status
     */
    delete() : boolean {
        Logger.error("ModelItf - delete : Method need to be implemented.");
        return false;
    }

    /**
     * Retrieve all models from database and create corresponding model instances.
     *
     * @method all
     * @return {Array<ModelItf>} The model instances.
     */
    static all() : Array<ModelItf> {
        Logger.error("ModelItf - all : Method need to be implemented.");
        return null;
    }

    /**
     * Return a ModelItf instance from a JSON string.
     *
     * @method parseJSON
     * @static
     * @param {string} json - The JSON string
     * @return {ModelItf} The model instance.
     */
    static parseJSON(jsonString : string) : ModelItf {
        Logger.error("ModelItf - parseJSON : Method need to be implemented. It will look like : 'return \"ModelItf\".fromJSONObject(JSON.parse(jsonString));'");
        return null;
    }

    /**
     * Return a ModelItf instance from a JSON Object.
     *
     * @method fromJSONObject
     * @static
     * @param {JSONObject} json - The JSON Object
     * @return {ModelItf} The model instance.
     */
    static fromJSONObject(jsonObject : any) : ModelItf {
        Logger.error("ModelItf - fromJSONObject : Method need to be implemented.");
        return null;
    }

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        Logger.error("ModelItf - getTableName : Method need to be implemented.");
        return "";
    }
}