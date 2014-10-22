/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="./RESTException.ts" />

class RequestException extends RESTException {
	constructor(message: string) {
		super(message);
	}
}