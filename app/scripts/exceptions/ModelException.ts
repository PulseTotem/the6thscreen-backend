/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

class ModelException implements Error {
	name:string;
	message:string;

	constructor(message: string) {
		this.message = message;
	}
}