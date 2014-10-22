/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

class RESTException implements Error {
	name:string;
	message:string;

	constructor(message: string) {
		this.message = message;
	}
}
