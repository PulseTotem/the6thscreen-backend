/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/scripts/server/RouterItf.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/RestClient.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/RestClientResponse.ts" />
/// <reference path="../exceptions/RequestException.ts" />

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

		// Route to check and send email to our contact email address
		this.router.post('/send', function(req : any, res : any) { self.checkAndSendEmail(req, res); });
	}

	/**
	 * Check information and send email to contact email address
	 *
	 * @method checkAndSendEmail
	 * @param {Express.Request} req - Request object.
	 * @param {Express.Response} res - Response object.
	 */
	checkAndSendEmail(req : any, res : any) {
		var self = this;

		var recaptcha = req.body.recaptcha;

		if(typeof(recaptcha) == "undefined") {
			res.status(500).send("Missing recaptcha param.");
			return;
		}

		var dataReq = "?secret=" + BackendConfig.getContactInfoRecaptchaPrivateKey() + "&response=" + recaptcha;
		var urlCheckRecaptcha = "https://www.google.com/recaptcha/api/siteverify" + dataReq;

		var data = {
			"headers": {
				"Content-Type": "application/json"
			}
		};

		var success : Function = function(result) {
			var response = result.data();

			if(response.success) {
				self._sendEmail(req, res);
			} else {
				res.status(500).send("Error during check recaptcha : " + JSON.stringify(response["error-codes"]));
			}
		};

		var fail : Function = function(result) {
			res.status(500).send("The request failed when trying to check recaptcha:"+urlCheckRecaptcha+" and datas : "+JSON.stringify(data)+".\nCode : "+result.statusCode()+"\nMessage : "+ result.response());
		};

		RestClient.post(urlCheckRecaptcha, data, success, fail);
	}

	/**
	 * Send email to contact email address
	 *
	 * @method _sendEmail
	 * @private
	 * @param {Express.Request} req - Request object.
	 * @param {Express.Response} res - Response object.
	 */
	private _sendEmail(req : any, res : any) {
		var firstName = req.body.firstName;
		var lastName = req.body.lastName;
		var email = req.body.email;
		var function_company = req.body.function_company;
		var company = req.body.company;
		var message = req.body.message;

		if(typeof(firstName) == "undefined" ||
			typeof(lastName) == "undefined" ||
			typeof(email) == "undefined" ||
			typeof(message) == "undefined"
		) {
			res.status(500).send("Missing first name, last name, email or message.");
			return;
		} else {

			if(typeof(function_company) == "undefined" || function_company == "") {
				function_company = "Unknown";
			}

			if(typeof(company) == "undefined" || company == "") {
				company = "Unknown";
			}

			var transporter = nodemailer.createTransport({
				service: 'Gmail',
				auth: {
					user: BackendConfig.getContactInfoAuthLogin(), // Your email id
					pass: BackendConfig.getContactInfoAuthPassword() // Your password
				}
			});

			var text = 'From : ' + firstName + ' ' + lastName + '(' + email + ')\n';
			text += 'Function : ' + function_company + ' -- Company : ' + company + '\n\n';
			text += 'Message : \n----------\n\n';
			text += message;

			var mailOptions = {
				from: email, // sender address
				to: BackendConfig.getContactInfoContactEmail(), // list of receivers
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