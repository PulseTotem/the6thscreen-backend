/**
 @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />


/**
 * A Percentage can only have a value between 0 and 100.
 *
 * @class Percentage
 */
class Percentage {

    /**
     * Percentage value.
     *
     * @property _value
     * @type number
     */
	private _value : number;

    /**
     * Constructor.
     *
     * @constructor
     * @param {number} value - The percentage value.
     */
	constructor(value : number) {
		if (value == null || value > 100 || value < 0) {
			Logger.error("The given value must be strictly in the range [0, 100].");
			value = 0;
            throw new ModelException("Percentage : The given value must be strictly in the range [0, 100].");
		}

		this._value = value;
	}

    /**
     * Set the percentage value.
     *
     * @method value
     */
	value() : number {
		return this._value;
	}
}