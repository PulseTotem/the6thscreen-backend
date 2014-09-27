/**
 @author Simon Urli <simon@the6thscreen.fr>
 */
/// <reference path="../core/Logger.ts" />


/**
 * A Percentage can only have a value between 0 and 100.
 *
 * @class Percentage
 */
class Percentage {

	private _value : number;

	constructor(value : number) {
		if (value == null || value > 100 || value < 0) {
			Logger.error("The given value must be strictly in the range [0, 100].");
			// TODO : Throw exception !
			value = 0;
		}

		this._value = value;
	}

	value() : number {
		return this._value;
	}
}