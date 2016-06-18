/**
 * @author Simon Urli <simon@pulsetotem.fr>
 */

/// <reference path="./ModelItf.ts" />

/**
 * Represent a token for User authentication
 */
class Token extends ModelItf {

    /**
     * Value of the token
     *
     * @property _value
     * @type string
     * @private
     */
    private _value : string;

    /**
     * End of the validity of the token
     *
     * @property _endDate
     * @type Date
     * @private
     */
    private _endDate : Date;

    /**
     * Constructor of a token
     * @param value
     * @param id
     * @param complete
     * @param createdAt
     * @param updatedAt
     */
    constructor(value : string = "", endDate : Date = null, id : number = null, complete : boolean = false, createdAt : string = null, updatedAt : string = null) {
        super(id, complete, createdAt, updatedAt);

        this.setValue(value);
        this.setEndDate(endDate);
    }

    /**
     * Return the value of the token
     *
     * @method value
     * @returns {string}
     */
    value() {
        return this._value;
    }

    /**
     * Set the value of the token
     *
     * @method setValue
     * @param value
     */
    setValue(value : string) {
        this._value = value;
    }

    /**
     * Return the end validity date of the token
     *
     * @method endDate
     * @returns {Date}
     */
    endDate() {
        return this._endDate;
    }

    /**
     * Set the end validity date of the token
     *
     * @method setEndDate
     * @param endDate
     */
    setEndDate(endDate : Date) {
        this._endDate = endDate;
    }

    /**
     * Check completeness of a Token.
     * The completeness is determined by the presence of a value and enDate.
     */
    checkCompleteness(successCallback : Function, failCallback : Function) : void {
        var self = this;

        var success : Function = function () {
            self._complete = (self._complete && !!self.value() && !!self.endDate());
            successCallback();
        };

        super.checkCompleteness(success, failCallback);
    }

    /**
     * Return a Token instance as a JSON Object
     *
     * @method toJSONObject
     * @returns {Object} a JSON Object representing the instance
     */
    toJSONObject() : Object {
        var data = {
            "id": this.getId(),
            "value": this.value(),
            "endDate": this.endDate(),
            "complete": this.isComplete(),
            "createdAt" : this.getCreatedAt(),
            "updatedAt" : this.getUpdatedAt()
        };
        return data;
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
        this.createObject(Token, this.toJSONObject(), successCallback, failCallback);
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
        ModelItf.readObject(Token, id, successCallback, failCallback, attemptNumber);
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
        return this.updateObject(Token, this.toJSONObject(), successCallback, failCallback, attemptNumber);
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
        return ModelItf.deleteObject(Token, this.getId(), successCallback, failCallback, attemptNumber);
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
        return this.allObjects(Token, successCallback, failCallback, attemptNumber);
    }

    /**
     * Return a token instance from a JSON string.
     *
     * @method parseJSON
     * @static
     * @param {string} json - The JSON string
     * @return {Token} The model instance.
     */
    static parseJSON(jsonString : string) : Token {
        return Token.fromJSONObject(JSON.parse(jsonString));
    }

    /**
     * Return a Token instance from a JSON Object.
     *
     * @method fromJSONObject
     * @static
     * @param {JSONObject} json - The JSON Object
     * @return {Token} The model instance.
     */
    static fromJSONObject(jsonObject : any) : Token {
        return new Token(jsonObject.value, jsonObject.endDate, jsonObject.id, jsonObject.complete, jsonObject.createdAt, jsonObject.updatedAt);
    }

    /**
     * Retrieve DataBase Table Name.
     *
     * @method getTableName
     * @return {string} The DataBase Table Name corresponding to Model.
     */
    static getTableName() : string {
        return "Tokens";
    }

}