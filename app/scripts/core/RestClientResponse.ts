/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../../libsdef/sequelize-restful.d.ts" />

/**
 * Represent a response of a request made using RestClient class.
 *
 * @class RestClientResponse
 */
class RestClientResponse {

	/**
	 * Determine whether the request was a success or not
	 *
	 * @property _success
	 * @type {boolean}
	 */
	private _success : boolean;

	/**
	 * Determine the response of the request.
	 * In case of error (success : false) the response contains the error informations.
	 *
	 * @property _response
	 * @type {any}
	 */
	private _response : any;

	// TODO : We need to have a specific type for the data.
	/**
	 * Contains the data of the request.
	 * It remains null in case of error.
	 *
	 * @property _data
	 * @type {any}
	 */
	private _data : SequelizeRestfulResponse;

	constructor(success : boolean, response : any, data : any = null) {
		this._success = success;
		this._response = response;
		this._data = data;
	}

	/**
	 * Return if the request was a success or not.
	 *
	 * @method success
	 * @returns {boolean}
	 */
	success() {
		return this._success;
	}

	/**
	 * Return the response of the request or the error informations.
	 *
	 * @method response
	 * @returns {any}
	 */
	response() {
		return this._response;
	}

	/**
	 * Return the data information.
	 *
	 * @method data
	 * @returns {any}
	 */
	data() {
		return this._data;
	}
}