/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />

/// <reference path="../../scripts/model/User.ts" />

var assert = require("assert");
var nock : any = require("nock");

describe('User', function() {
	describe('#constructor', function () {
		it('should throw an error if the username is undefined', function(){
			assert.throws(
				function() {
					new User(undefined);
				},
				ModelException,
				"The exception has not been thrown."
			);
		});

		it('should throw an error if the username is null', function(){
			assert.throws(
				function() {
					new User(null);
				},
				ModelException,
				"The exception has not been thrown."
			);
		});

		it('should throw an error if the username is empty', function(){
			assert.throws(
				function() {
					new User("");
				},
				ModelException,
				"The exception has not been thrown."
			);
		});

		it('should store the username', function () {
			var username = "machin";
			var c = new User(username);
			assert.equal(c.username(), username, "The username is not stored correctly.");
		});

		it('should store the ID', function () {
			var id = 52;
			var c = new User("bidule", 52);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});
	});

	describe('#fromJSONobject', function () {
		it('should create the right object', function () {
			var json = {"id": 42,
				"username": "toto"
			};

			var userRetrieve = User.fromJSONObject(json);
			var userExpected = new User("toto", 42);

			assert.deepEqual(userRetrieve, userExpected, "The retrieve user (" + userRetrieve + ") does not match with the expected one (" + userExpected + ")");
		});

		it('should throw an exception if the ID is undefined', function () {
			var json = {"username": "toto"
			};

			assert.throws(function () {
					User.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the ID is null', function () {
			var json = {
				"username": "toto",
				"id": null
			};

			assert.throws(function () {
					User.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the username is undefined', function () {
			var json = {"id": 52
			};

			assert.throws(function () {
					User.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the username is null', function () {
			var json = {
				"username": null,
				"id": 42
			};

			assert.throws(function () {
					User.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});
	});

	describe('#toJsonObject', function () {
		it('should create the expected JSON Object', function () {
			var c = new User("toto", 52);
			var expected = {
				"username": "toto",
				"id": 52
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object (" + JSON.stringify(json) + ") and the expected JSON (" + JSON.stringify(expected) + ") do not match.");
		})
	});

	describe('#addRole', function() {
		it('should put the new Role inside the array', function() {
			var c = new User("toto", 52);
			var pv = new Role("mavaleur",12);
			var spy = sinon.spy(pv, "desynchronize");

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(User.getTableName(), c.getId().toString(), Role.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var roles = c.roles();

			assert.deepEqual(roles, [], "The role is not an empty array: "+JSON.stringify(roles));
			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the roles");

			var reponse2 : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock2 = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.associatedObjectEndpoint(User.getTableName(), c.getId().toString(), Role.getTableName(), pv.getId().toString()))
				.reply(200, JSON.stringify(reponse2));

			var retour = c.addRole(pv);
			assert.ok(retour, "The return of the addRole is false.");
			assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the role in database.");

			roles = c.roles();
			var expected = [pv];
			assert.deepEqual(roles, expected, "The roles is not an array containing only the added role: "+JSON.stringify(roles));
			assert.ok(spy.calledOnce, "The desynchronize method was not usered once.");
		});

		it('should not allow to add a null object', function() {
			nock.disableNetConnect();
			var c = new User("toto", 52);

			assert.throws(function() {
					c.addRole(null);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add an undefined object', function() {
			nock.disableNetConnect();
			var c = new User("toto", 52);

			assert.throws(function() {
					c.addRole(undefined);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add a object which is not yet created', function() {
			nock.disableNetConnect();
			var c = new User("toto", 52);
			var p = new Role("bidule");

			assert.throws(function() {
					c.addRole(p);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to put an already existing object', function() {
			var c = new User("toto", 52);
			var pv = new Role("toto",13);

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": [
					{
						"id":13,
						"name": "toto"
					},
					{
						"id": 14,
						"name": "titi"
					}
				]
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(User.getTableName(), c.getId().toString(), Role.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var roles = c.roles();

			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the roles");

			assert.throws(function() {
					c.addRole(pv);
				},
				ModelException,
				"The exception has not been thrown.");
		});

	});

	describe('#removeRole', function() {
		it('should remove the Role from the array', function() {
			var c = new User("toto", 52);
			var pv = new Role("mavaleur",12);

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": [
					{
						"name": "mavaleur",
						"id": 12
					}
				]
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(User.getTableName(), c.getId().toString(), Role.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var roles = c.roles();

			assert.deepEqual(roles, [pv], "The role array is not an array fill only with PV: "+JSON.stringify(roles));
			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the roles");

			var spy = sinon.spy(pv, "desynchronize");
			var reponse2 : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock2 = nock(DatabaseConnection.getBaseURL())
				.delete(DatabaseConnection.associatedObjectEndpoint(User.getTableName(), c.getId().toString(), Role.getTableName(), pv.getId().toString()))
				.reply(200, JSON.stringify(reponse2));

			var retour = c.removeRole(pv);
			assert.ok(retour, "The return of the removeRole is false.");
			assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the role in database.");

			roles = c.roles();
			assert.deepEqual(roles, [], "The roles is not an empty array: "+JSON.stringify(roles));
			assert.ok(spy.calledOnce, "The desynchronize method was not usered once.");
		});

		it('should not allow to remove a null object', function() {
			nock.disableNetConnect();
			var c = new User("toto", 52);

			assert.throws(function() {
					c.removeRole(null);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add an undefined object', function() {
			nock.disableNetConnect();
			var c = new User("toto", 52);

			assert.throws(function() {
					c.removeRole(undefined);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add a object which is not yet created', function() {
			nock.disableNetConnect();
			var c = new User("toto", 52);
			var p = new Role("bidule");

			assert.throws(function() {
					c.removeRole(p);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to remove an object which is not linked', function() {
			var c = new User("toto", 52);
			var pv = new Role("toto",12);

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(User.getTableName(), c.getId().toString(), Role.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var roles = c.roles();

			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the roles");

			assert.throws(function() {
					c.removeRole(pv);
				},
				ModelException,
				"The exception has not been thrown.");
		});

	});

	describe('#addSDI', function() {
		it('should put the new SDI inside the array', function() {
			var c = new User("toto", 52);
			var pv = new SDI("mavaleur", "bidule", "host", 12);
			var spy = sinon.spy(pv, "desynchronize");

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(User.getTableName(), c.getId().toString(), SDI.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var sdis = c.sdis();

			assert.deepEqual(sdis, [], "The role is not an empty array: "+JSON.stringify(sdis));
			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the sdis");

			var reponse2 : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock2 = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.associatedObjectEndpoint(User.getTableName(), c.getId().toString(), SDI.getTableName(), pv.getId().toString()))
				.reply(200, JSON.stringify(reponse2));

			var retour = c.addSDI(pv);
			assert.ok(retour, "The return of the addSDI is false.");
			assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the role in database.");

			sdis = c.sdis();
			var expected = [pv];
			assert.deepEqual(sdis, expected, "The sdis is not an array containing only the added role: "+JSON.stringify(sdis));
			assert.ok(spy.calledOnce, "The desynchronize method was not usered once.");
		});

		it('should not allow to add a null object', function() {
			nock.disableNetConnect();
			var c = new User("toto", 52);

			assert.throws(function() {
					c.addSDI(null);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add an undefined object', function() {
			nock.disableNetConnect();
			var c = new User("toto", 52);

			assert.throws(function() {
					c.addSDI(undefined);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add a object which is not yet created', function() {
			nock.disableNetConnect();
			var c = new User("toto", 52);
			var p = new SDI("bidule", "machin", "otot");

			assert.throws(function() {
					c.addSDI(p);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to put an already existing object', function() {
			var c = new User("toto", 52);
			var pv = new SDI("toto", "machin", "host", 13);

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": [
					{
						"id":13,
						"name": "toto",
						"description": "machin",
						"allowedHost": "host"
					},
					{
						"id": 14,
						"name": "titi",
						"description": "blop",
						"allowedHost": "tata"
					}
				]
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(User.getTableName(), c.getId().toString(), SDI.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var sdis = c.sdis();

			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the sdis");

			assert.throws(function() {
					c.addSDI(pv);
				},
				ModelException,
				"The exception has not been thrown.");
		});

	});

	describe('#removeSDI', function() {
		it('should remove the SDI from the array', function() {
			var c = new User("toto", 52);
			var pv = new SDI("mavaleur", "blup", "truc", 12);

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": [
					{
						"name": "mavaleur",
						"description": "blup",
						"allowedHost": "truc",
						"id": 12
					}
				]
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(User.getTableName(), c.getId().toString(), SDI.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var sdis = c.sdis();

			assert.deepEqual(sdis, [pv], "The role array is not an array fill only with PV: "+JSON.stringify(sdis));
			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the sdis");

			var spy = sinon.spy(pv, "desynchronize");
			var reponse2 : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock2 = nock(DatabaseConnection.getBaseURL())
				.delete(DatabaseConnection.associatedObjectEndpoint(User.getTableName(), c.getId().toString(), SDI.getTableName(), pv.getId().toString()))
				.reply(200, JSON.stringify(reponse2));

			var retour = c.removeSDI(pv);
			assert.ok(retour, "The return of the removeSDI is false.");
			assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the role in database.");

			sdis = c.sdis();
			assert.deepEqual(sdis, [], "The sdis is not an empty array: "+JSON.stringify(sdis));
			assert.ok(spy.calledOnce, "The desynchronize method was not usered once.");
		});

		it('should not allow to remove a null object', function() {
			nock.disableNetConnect();
			var c = new User("toto", 52);

			assert.throws(function() {
					c.removeSDI(null);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add an undefined object', function() {
			nock.disableNetConnect();
			var c = new User("toto", 52);

			assert.throws(function() {
					c.removeSDI(undefined);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add a object which is not yet created', function() {
			nock.disableNetConnect();
			var c = new User("toto", 52);
			var p = new SDI("bidule","truc","tata");

			assert.throws(function() {
					c.removeSDI(p);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to remove an object which is not linked', function() {
			var c = new User("toto", 52);
			var pv = new SDI("toto", "bidule", "blabla",12);

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(User.getTableName(), c.getId().toString(), SDI.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var sdis = c.sdis();

			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the sdis");

			assert.throws(function() {
					c.removeSDI(pv);
				},
				ModelException,
				"The exception has not been thrown.");
		});

	});
});