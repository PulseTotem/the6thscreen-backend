/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="./ModelItf.ts" />
/// <reference path="./ThemeZone.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/**
 * Model : ThemeSDI
 *
 * @class ThemeSDI
 * @extends ModelItf
 */
class ThemeSDI extends ModelItf {

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
	 * BackgroundImageURL property.
	 *
	 * @property _backgroundImageURL
	 * @type string
	 */
	private _backgroundImageURL : string;

	/**
	 * BackgroundVideoURL property.
	 *
	 * @property _backgroundVideoURL
	 * @type string
	 */
	private _backgroundVideoURL : string;

	/**
	 * BackgroundColor property.
	 *
	 * @property _backgroundColor
	 * @type string
	 */
	private _backgroundColor : string;

	/**
	 * Font property.
	 *
	 * @property _font
	 * @type string
	 */
	private _font : string;

	/**
	 * Color property.
	 *
	 * @property _color
	 * @type string
	 */
	private _color : string;

	/**
	 * Opacity property.
	 *
	 * @property _opacity
	 * @type string
	 */
	private _opacity : string;

	/**
	 * ThemeZone property.
	 *
	 * @property _themeZone
	 * @type ThemeZone
	 */
	private _themeZone : ThemeZone;

	/**
	 * Lazy loading for ThemeZone property
	 *
	 * @property _themeZone_loaded
	 * @type boolean
	 */
	private _themeZone_loaded : boolean;


	/**
	 * Constructor
	 *
	 * @constructor
	 * @param name The name of the themeSDI
	 * @param description A description of the themeSDI
	 * @param {boolean} defaultTheme - The ThemeSDI's defaultTheme status
	 * @param {string} backgroundImageURL - The ThemeSDI's backgroundImageURL
	 * @param {string} backgroundColor - The ThemeSDI's backgroundColor
	 * @param {string} font - The ThemeSDI's font
	 * @param {string} color - The ThemeSDI's color
	 * @param {string} opacity - The ThemeSDI's opacity
	 * @param id The DB id of the themeSDI
	 * @param {string} createdAt - The ThemeSDI's createdAt.
	 * @param {string} updatedAt - The ThemeSDI's updatedAt.
	 */
	constructor(name : string = "", description : string = "", defaultTheme : boolean = false, backgroundImageURL : string = "", backgroundVideoURL : string = "", backgroundColor : string = "", font : string = "", color : string = "", opacity : string = "", id : number = null, complete : boolean = false, createdAt : string = null, updatedAt : string = null) {
		super(id, complete, createdAt, updatedAt);

		this.setName(name);
		this.setDescription(description);
		this.setDefaultTheme(defaultTheme);
		this.setBackgroundImageURL(backgroundImageURL);
		this.setBackgroundVideoURL(backgroundVideoURL);
		this.setBackgroundColor(backgroundColor);
		this.setFont(font);
		this.setColor(color);
		this.setOpacity(opacity);

		this._themeZone = null;
		this._themeZone_loaded = false;
	}

	/**
	 * Set the ThemeSDI's name.
	 *
	 * @method setName
	 */
	setName(name : string) {
		this._name = name;
	}

	/**
	 * Set the ThemeSDI's description.
	 *
	 * @method setDescription
	 */
	setDescription(description : string = "") {
		this._description = description;
	}

	/**
	 * Set the ThemeSDI's defaultTheme.
	 *
	 * @method setDefaultTheme
	 */
	setDefaultTheme(defaultTheme : boolean) {
		this._defaultTheme = defaultTheme;
	}

	/**
	 * Set the ThemeSDI's backgroundImageURL.
	 *
	 * @method setBackgroundImageURL
	 * @param {string} backgroundImageURL - The ThemeSDI's backgroundImageURL to set
	 */
	setBackgroundImageURL(backgroundImageURL : string) {
		this._backgroundImageURL = backgroundImageURL;
	}

	/**
	 * Set the ThemeSDI's backgroundVideoURL.
	 *
	 * @method setBackgroundVideoURL
	 * @param {string} backgroundVideoURL - The ThemeSDI's backgroundVideoURL to set
	 */
	setBackgroundVideoURL(backgroundVideoURL : string) {
		this._backgroundVideoURL = backgroundVideoURL;
	}

	/**
	 * Set the ThemeSDI's backgroundColor.
	 *
	 * @method setBackgroundColor
	 * @param {string} backgroundColor - The ThemeSDI's backgroundColor to set
	 */
	setBackgroundColor(backgroundColor : string) {
		this._backgroundColor = backgroundColor;
	}

	/**
	 * Set the ThemeSDI's font.
	 *
	 * @method setFont
	 */
	setFont(font : string) {
		this._font = font;
	}

	/**
	 * Set the ThemeSDI's color.
	 *
	 * @method setColor
	 */
	setColor(color : string) {
		this._color = color;
	}

	/**
	 * Set the ThemeSDI's opacity.
	 *
	 * @method setOpacity
	 */
	setOpacity(opacity : string) {
		this._opacity = opacity;
	}

	/**
	 * Return the ThemeSDI's name.
	 *
	 * @method name
	 */
	name() {
		return this._name;
	}

	/**
	 * Return the ThemeSDI's description.
	 *
	 * @method description
	 */
	description() {
		return this._description;
	}

	/**
	 * Return the ThemeSDI's defaultTheme.
	 *
	 * @method defaultTheme
	 */
	defaultTheme() {
		return this._defaultTheme;
	}

	/**
	 * Return the ThemeSDI's backgroundImageURL.
	 *
	 * @method backgroundImageURL
	 */
	backgroundImageURL() {
		return this._backgroundImageURL;
	}

	/**
	 * Return the ThemeSDI's backgroundVideoURL.
	 *
	 * @method backgroundVideoURL
	 */
	backgroundVideoURL() {
		return this._backgroundVideoURL;
	}

	/**
	 * Return the ThemeSDI's backgroundColor.
	 *
	 * @method backgroundColor
	 */
	backgroundColor() {
		return this._backgroundColor;
	}

	/**
	 * Return the ThemeSDI's font.
	 *
	 * @method font
	 */
	font() {
		return this._font;
	}

	/**
	 * Return the ThemeSDI's color.
	 *
	 * @method color
	 */
	color() {
		return this._color;
	}

	/**
	 * Return the ThemeSDI's opacity.
	 *
	 * @method opacity
	 */
	opacity() {
		return this._opacity;
	}

	/**
	 * Return the ThemeSDI's themeZone
	 * @method themeZone
	 * @returns {ThemeZone}
	 */
	themeZone() {
		return this._themeZone;
	}

	/**
	 * Load the ThemeSDI's themeZone.
	 *
	 * @method loadThemeZone
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	loadThemeZone(successCallback : Function, failCallback : Function) {
		if(! this._themeZone_loaded) {
			var self = this;
			var success : Function = function(themeZone) {
				if(!!themeZone) {
					self._themeZone = themeZone;
				}
				self._themeZone_loaded = true;
				if(successCallback != null) {
					successCallback();
				}
			};

			var fail : Function = function(error) {
				if(failCallback != null) {
					failCallback(error);
				}
			};

			this.getUniquelyAssociatedObject(ThemeSDI, ThemeZone, success, fail);
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
	loadAssociations(successCallback : Function, failCallback : Function) {
		var self = this;

		var success : Function = function(models) {
			if (successCallback != null) {
				successCallback();
			} // else //Nothing to do ?
		};

		var fail : Function = function(error) {
			if(failCallback != null) {
				failCallback(error);
			} else {
				Logger.error(JSON.stringify(error));
			}
		};

		this.loadThemeZone(success, fail);
	}

	/**
	 * Return a ThemeSDI instance as a JSON Object
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
			"backgroundImageURL": this.backgroundImageURL(),
			"backgroundVideoURL": this.backgroundVideoURL(),
			"backgroundColor": this.backgroundColor(),
			"font": this.font(),
			"color": this.color(),
			"opacity": this.opacity(),
			"complete": this.isComplete(),
			"createdAt" : this.getCreatedAt(),
			"updatedAt" : this.getUpdatedAt()
		};
		return data;
	}

	/**
	 * Check if the object is complete or not.
	 *
	 * For a ThemeSDI, it's always true :)
	 */
	checkCompleteness(successCallback : Function, failCallback : Function) : void {
		var self = this;

		var succces : Function = function () {
			if (self.isComplete() && !!self.name()) {
				var successLoadAsso : Function = function () {
					self._complete = (self.themeZone() != null && self.themeZone().isComplete());

					successCallback();
				};
				self.loadAssociations(successLoadAsso, failCallback);
			} else {
				self._complete = false;
				successCallback();
			}
		};

		super.checkCompleteness(succces, failCallback);
	}

	/**
	 * Return a ThemeSDI instance as a JSON Object including associated object.
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
				data["themeZone"] = (self.themeZone() !== null) ? self.themeZone().getId() : null;
			} else {
				data["themeZone"] = (self.themeZone() !== null) ? self.themeZone().toJSONObject() : null;
			}

			successCallback(data);
		};

		var fail : Function = function(error) {
			failCallback(error);
		};

		this.loadAssociations(success, fail);
	}

	/**
	 * Set the ThemeZone of the ThemeZone.
	 *
	 * @method linkThemeZone
	 * @param {ThemeZone} it The ThemeZone to associate with the ThemeSDI.
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	linkThemeZone(themeZoneID : number, successCallback : Function, failCallback : Function) {
		this.associateObject(ThemeSDI, ThemeZone, themeZoneID, successCallback, failCallback);
	}

	/**
	 * Unset the current ThemeZone from the ThemeSDI.
	 *
	 * @method unlinkThemeZone
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	unlinkThemeZone(themeZoneID : number, successCallback : Function, failCallback : Function) {
		this.deleteObjectAssociation(ThemeSDI, ThemeZone, themeZoneID, successCallback, failCallback);
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
		this.createObject(ThemeSDI, this.toJSONObject(), successCallback, failCallback);
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
		ModelItf.readObject(ThemeSDI, id, successCallback, failCallback, attemptNumber);
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
		return this.updateObject(ThemeSDI, this.toJSONObject(), successCallback, failCallback, attemptNumber);
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
		return ModelItf.deleteObject(ThemeSDI, this.getId(), successCallback, failCallback, attemptNumber);
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
		return this.allObjects(ThemeSDI, successCallback, failCallback, attemptNumber);
	}

	/**
	 * Return a Source instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {Source} The model instance.
	 */
	static parseJSON(jsonString : string) : ThemeSDI {
		return ThemeSDI.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a ThemeSDI instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {ThemeSDI} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : ThemeSDI {
		return new ThemeSDI(jsonObject.name, jsonObject.description, jsonObject.defaultTheme, jsonObject.backgroundImageURL, jsonObject.backgroundVideoURL, jsonObject.backgroundColor, jsonObject.font, jsonObject.color, jsonObject.opacity, jsonObject.id, jsonObject.complete, jsonObject.createdAt, jsonObject.updatedAt);
	}

	/**
	 * Clone the object
	 *
	 * @method clone
	 * @param {Function} successCallback - The callback function when success
	 * @param {Function} failCallback - The callback function when fail
	 */
	clone(successCallback : Function, failCallback : Function) {

		var self = this;

		var successCloneThemeSDI : Function = function (themeSDI : any) {

			var newThemeSDI : ThemeSDI = ThemeSDI.parseJSON(themeSDI);

			var finalSuccess = function () {
				successCallback(newThemeSDI.toJSONObject());
			};

			var successLoad : Function = function () {

				var themeZone : ThemeZone = self.themeZone();

				if (themeZone == null) {
					finalSuccess();
				} else {

					var successCloneTZ : Function = function (tzData : any) {
						var newThemeZone : ThemeZone = ThemeZone.parseJSON(tzData);

						newThemeSDI.linkThemeZone(newThemeZone.getId(), finalSuccess, failCallback);
					};

					themeZone.clone(successCloneTZ, failCallback);
				}
			};
			self.loadAssociations(successLoad, failCallback);
		};


		this.cloneObject(ThemeSDI, successCloneThemeSDI, failCallback);
	}

	/**
	 * Retrieve DataBase Table Name.
	 *
	 * @method getTableName
	 * @return {string} The DataBase Table Name corresponding to Model.
	 */
	static getTableName() : string {
		return "ThemeSDIs";
	}

}