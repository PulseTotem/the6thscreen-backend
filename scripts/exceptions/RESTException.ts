/**
 * @author Simon Urli <simon@the6thscreen.fr>
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

class RESTException implements Error {
	name:string;
	message:string;

	constructor(name: string, message: string) {
        this.name = name;
		this.message = message;
	}
}
