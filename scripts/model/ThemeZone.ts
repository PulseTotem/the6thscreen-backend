/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Model : ThemeZone
 *
 * @class ThemeZone
 * @extends ModelItf
 */
class ThemeZone extends ModelItf {

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
	 * DefaultTheme property.
	 *
	 * @property _defaultTheme
	 * @type boolean
	 */
	private _defaultTheme : boolean;

	/**
	 * Background property.
	 *
	 * @property _background
	 * @type string
	 */
	private _background : string;

	/**
	 * Font property.
	 *
	 * @property _font
	 * @type string
	 */
	private _font : string;

	/**
	 * Opacity property.
	 *
	 * @property _opacity
	 * @type string
	 */
	private _opacity : string;

	/**
	 * Border property.
	 *
	 * @property _border
	 * @type string
	 */
	private _border : string;

	/**
	 * Color property.
	 *
	 * @property _color
	 * @type string
	 */
	private _color : string;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @param name The name of the themeZone
	 * @param description A description of the themeZone
	 * @param host The host to reach the themeZone
	 * @param {boolean} oauth - To set if ThemeZone needs authentication or not
	 * @param {string} provider - The OAuthD provider's name
	 * @param id The DB id of the themeZone
	 * @param {string} createdAt - The ThemeZone's createdAt.
	 * @param {string} updatedAt - The ThemeZone's updatedAt.
	 */
	constructor(name : string = "", description : string = "", defaultTheme : boolean = false, background : string = "", font : string = "", color : string = "", opacity : string = "", border : string = "", id : number = null, complete : boolean = false, createdAt : string = null, updatedAt : string = null) {
		super(id, complete, createdAt, updatedAt);

		this.setName(name);
		this.setDescription(description);
		this.setDefaultTheme(defaultTheme);
		this.setBackground(background);
		this.setFont(font);
		this.setColor(color);
		this.setOpacity(opacity);
		this.setBorder(border);
	}

	/**
	 * Set the ThemeZone's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		this._name = name;
	}

	/**
	 * Set the ThemeZone's description.
	 *
	 * @method setDescription
	 */
	setDescription(description : string = "") {
		this._description = description;
	}

	/**
	 * Set the ThemeZone's defaultTheme.
	 *
	 * @method setDefaultTheme
	 */
	setDefaultTheme(defaultTheme : boolean) {
		this._defaultTheme = defaultTheme;
	}

	/**
	 * Set the ThemeZone's background.
	 *
	 * @method setBackground
	 */
	setBackground(background : string) {
		this._background = background;
	}

	/**
	 * Set the ThemeZone's font.
	 *
	 * @method setFont
	 */
	setFont(font : string) {
		this._font = font;
	}

	/**
	 * Set the ThemeZone's color.
	 *
	 * @method setColor
	 */
	setColor(color : string) {
		this._color = color;
	}

	/**
	 * Set the ThemeZone's opacity.
	 *
	 * @method setOpacity
	 */
	setOpacity(opacity : string) {
		this._opacity = opacity;
	}

	/**
	 * Set the ThemeZone's border.
	 *
	 * @method setBorder
	 */
	setBorder(border : string) {
		this._border = border;
	}

	/**
	 * Return the ThemeZone's name.
	 *
	 * @method name
	 */
	name() {
		return this._name;
	}

	/**
	 * Return the ThemeZone's description.
	 *
	 * @method description
	 */
	description() {
		return this._description;
	}

	/**
	 * Return the ThemeZone's defaultTheme.
	 *
	 * @method defaultTheme
	 */
	defaultTheme() {
		return this._defaultTheme;
	}

	/**
	 * Return the ThemeZone's background.
	 *
	 * @method background
	 */
	background() {
		return this._background;
	}

	/**
	 * Return the ThemeZone's font.
	 *
	 * @method font
	 */
	font() {
		return this._font;
	}

	/**
	 * Return the ThemeZone's color.
	 *
	 * @method color
	 */
	color() {
		return this._color;
	}

	/**
	 * Return the ThemeZone's opacity.
	 *
	 * @method opacity
	 */
	opacity() {
		return this._opacity;
	}

	/**
	 * Return the ThemeZone's border.
	 *
	 * @method border
	 */
	border() {
		return this._border;
	}


	//////////////////// Methods managing model. Connections to database. ///////////////////////////



	/**
	 * Return a ThemeZone instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"name": this.name(),
			"description": this.description(),
			"defaultTheme": this.defaultTheme(),
			"background": this.background(),
			"font": this.font(),
			"color": this.color(),
			"opacity": this.opacity(),
			"border": this.border(),
			"complete": this.isComplete(),
			"createdAt" : this.getCreatedAt(),
			"updatedAt" : this.getUpdatedAt()
		};
		return data;
	}

	/**
	 * Check if the object is complete or not.
	 *
	 * For a ThemeZone, it's always true :)
	 */
	checkCompleteness(successCallback : Function, failCallback : Function) : void {
		var self = this;

		var succces : Function = function () {
			self._complete = self._complete && (!!self.name());
			successCallback();
		};

		super.checkCompleteness(succces, failCallback);
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
		this.createObject(ThemeZone, this.toJSONObject(), successCallback, failCallback);
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
		ModelItf.readObject(ThemeZone, id, successCallback, failCallback, attemptNumber);
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
		return this.updateObject(ThemeZone, this.toJSONObject(), successCallback, failCallback, attemptNumber);
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
		return ModelItf.deleteObject(ThemeZone, this.getId(), successCallback, failCallback, attemptNumber);
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
		return this.allObjects(ThemeZone, successCallback, failCallback, attemptNumber);
	}

	/**
	 * Return a Source instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {Source} The model instance.
	 */
	static parseJSON(jsonString : string) : ThemeZone {
		return ThemeZone.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a ThemeZone instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {ThemeZone} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : ThemeZone {
		return new ThemeZone(jsonObject.name, jsonObject.description, jsonObject.defaultTheme, jsonObject.background, jsonObject.font, jsonObject.color, jsonObject.opacity, jsonObject.border, jsonObject.id, jsonObject.complete, jsonObject.createdAt, jsonObject.updatedAt);
	}

	/**
	 * Retrieve DataBase Table Name.
	 *
	 * @method getTableName
	 * @return {string} The DataBase Table Name corresponding to Model.
	 */
	static getTableName() : string {
		return "ThemeZones";
	}

}