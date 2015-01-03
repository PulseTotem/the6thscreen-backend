/**
 * @author Simon Urli <simon@the6thscreen.fr>
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./RESTException.ts" />

class ResponseException extends RESTException {
	constructor(message: string) {
		super("ResponseException", message);
	}
}