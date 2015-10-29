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

		this.router.use(function(req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			res.header("Access-Control-Allow-Methods", "POST");
			next();
		});

		// Route to check and send email to our contact email address

		/* Routes to take a picture */
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
		Logger.debug("ContactFormRouter - checkAndSendEmail");

		Logger.debug(req.body);

		var contact = req.body.contact;

		Logger.debug(contact);

		var transporter = nodemailer.createTransport({
			service: 'Gmail',
			auth: {
				user: ContactConfig.getAuthLogin(), // Your email id
				pass: ContactConfig.getAuthPassword() // Your password
			}
		});

		var text = 'From : ' + contact.firstName + ' ' + contact.lastName + '(' + contact.email + ')\n';
		text += 'Function : ' + contact.function + ' -- Company : ' + contact.company + '\n\n';
		text += 'Message : \n----------\n\n';
		text += contact.message;

		var mailOptions = {
			from: contact.email, // sender address
			to: ContactConfig.getContactEmail(), // list of receivers
			subject: '[Contact Form] From : ' + contact.firstName + ' ' + contact.lastName, // Subject line
			text: text //, // plaintext body
			// html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
		};

		transporter.sendMail(mailOptions, function(error, info){
			if(error){
				Logger.error(error);
				res.json({yo: 'error'});
			}else{
				Logger.info('Message sent: ' + info.response);
				res.json({yo: info.response});
			};
		});
	}
}