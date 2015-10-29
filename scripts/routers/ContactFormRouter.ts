/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/scripts/server/RouterItf.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/// <reference path="../core/ContactConfig.ts" />

var nodemailer : any = require('nodemailer');

/**
 * ContactFormRouter class.
 *
 * @class ContactFormRouter
 * @extends RouterItf
 */
class ContactFormRouter extends RouterItf {

	/**
	 * Constructor.
	 */
	constructor() {
		super();
	}

	/**
	 * Method called during Router creation.
	 *
	 * @method buildRouter
	 */
	buildRouter() {
		var self = this;

		/*this.router.use(function(req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			res.header("Access-Control-Allow-Methods", "OPTIONS, POST");
			next();
		});*/

		// Route to check and send email to our contact email address

		this.router.get('/', function(req : any, res : any) { self.pouet(req, res); });

		/* Routes to take a picture */
		this.router.post('/send', function(req : any, res : any) { self.checkAndSendEmail(req, res); });
	}

	pouet(req : any, res : any) {
		Logger.debug("ContactFormRouter - pouet");

		res.send("pouet pouet");
	}

	/**
	 * Check information and send email to contact email address
	 *
	 * @method checkAndSendEmail
	 * @param {Express.Request} req - Request object.
	 * @param {Express.Response} res - Response object.
	 */
	checkAndSendEmail(req : any, res : any) {
		var firstName = req.body.firstName;
		var lastName = req.body.lastName;
		var email = req.body.email;
		var function_company = req.body.function;
		var company = req.body.company;
		var message = req.body.message;

		if(typeof(firstName) == "undefined" ||
			typeof(lastName) == "undefined" ||
			typeof(email) == "undefined" ||
			typeof(message) == "undefined"
		) {
			res.status(500).send("Missing 'first name, last name, email or message.");
		} else {

			if(typeof(function_company) != "undefined" || function_company == "") {
				function_company = "Unknown";
			}

			if(typeof(company) != "undefined" || company == "") {
				company = "Unknown";
			}

			var transporter = nodemailer.createTransport({
				service: 'Gmail',
				auth: {
					user: ContactConfig.getAuthLogin(), // Your email id
					pass: ContactConfig.getAuthPassword() // Your password
				}
			});

			var text = 'From : ' + firstName + ' ' + lastName + '(' + email + ')\n';
			text += 'Function : ' + function_company + ' -- Company : ' + company + '\n\n';
			text += 'Message : \n----------\n\n';
			text += message;

			var mailOptions = {
				from: email, // sender address
				to: ContactConfig.getContactEmail(), // list of receivers
				subject: '[Contact Form] From : ' + firstName + ' ' + lastName, // Subject line
				text: text //, // plaintext body
				// html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
			};

			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					Logger.error(error);
					res.status(500).send(error);
				} else {
					Logger.info('Message sent: ' + info.response);
					res.send(info.response);
				}
			});
		}
	}
}