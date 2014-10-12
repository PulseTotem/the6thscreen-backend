/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../app/scripts/model/Profil.ts" />

var assert = require("assert");
var nock : any = require("nock");
var sinon : SinonStatic = require("sinon");

describe('Profil', function() {
	describe('#constructor', function () {
		it('should store the name', function () {
			var name = "machin";
			var c = new Profil(name, "");
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the description', function () {
			var desc = "machin";
			var c = new Profil("", desc);
			assert.equal(c.description(), desc, "The description is not stored correctly.");
		});

		it('should store the ID', function () {
			var id = 52;
			var c = new Profil("", "", id);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});
	});

	describe('#fromJSONobject', function () {
		it('should create the right object', function () {
			var json = {
				"id": 42,
				"name": "toto",
				"description": "blabla"
			};

			var callRetrieve = Profil.fromJSONObject(json);
			var callExpected = new Profil("toto", "blabla", 42);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve profil (" + callRetrieve + ") does not match with the expected one (" + callExpected + ")");
		});

		it('should throw an exception if the ID is undefined', function () {
			var json = {
				"name": "toto",
				"description": "blabla"
			};

			assert.throws(function () {
					Profil.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the ID is null', function () {
			var json = {
				"name": "toto",
				"description": "blabla",
				"id": null
			};

			assert.throws(function () {
					Profil.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the name is undefined', function () {
			var json = {
				"id": 52,
				"description": "blabla"
			};

			assert.throws(function () {
					Profil.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the name is null', function () {
			var json = {
				"name": null,
				"description": "blabla",
				"id": 42
			};

			assert.throws(function () {
					Profil.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the description is undefined', function () {
			var json = {
				"id": 52,
				"name": "blabla"
			};

			assert.throws(function () {
					Profil.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the description is null', function () {
			var json = {
				"description": null,
				"name": "blabla",
				"id": 42
			};

			assert.throws(function () {
					Profil.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});
	});

	describe('#toJsonObject', function () {
		it('should create the expected JSON Object', function () {
			var c = new Profil("toto", "blabla", 52);
			var expected = {
				"name": "toto",
				"description": "blabla",
				"id": 52
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object (" + JSON.stringify(json) + ") and the expected JSON (" + JSON.stringify(expected) + ") do not match.");
		})
	});

	describe('#addCall', function() {
		it('should put the new Call inside the array', function() {
			var c = new Profil("toto", "blabla", 52);
			var pv = new Call("mavaleur",12);
			var spy = sinon.spy(pv, "desynchronize");

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Profil.getTableName(), c.getId().toString(), Call.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var calls = c.calls();

			assert.deepEqual(calls, [], "The call is not an empty array: "+JSON.stringify(calls));
			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the calls");

			var reponse2 : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock2 = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.associatedObjectEndpoint(Profil.getTableName(), c.getId().toString(), Call.getTableName(), pv.getId().toString()))
				.reply(200, JSON.stringify(reponse2));

			var retour = c.addCall(pv);
			assert.ok(retour, "The return of the addCall is false.");
			assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the call in database.");

			calls = c.calls();
			var expected = [pv];
			assert.deepEqual(calls, expected, "The calls is not an array containing only the added call: "+JSON.stringify(calls));
			assert.ok(spy.calledOnce, "The desynchronize method was not called once.");
		});

		it('should not allow to add a null object', function() {
			nock.disableNetConnect();
			var c = new Profil("toto", "blabla", 52);

			assert.throws(function() {
					c.addCall(null);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add an undefined object', function() {
			nock.disableNetConnect();
			var c = new Profil("toto", "blabla", 52);

			assert.throws(function() {
					c.addCall(undefined);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add a object which is not yet created', function() {
			nock.disableNetConnect();
			var c = new Profil("toto", "blabla", 52);
			var p = new Call("bidule");

			assert.throws(function() {
					c.addCall(p);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to put an already existing object', function() {
			var c = new Profil("toto", "blabla", 52);
			var pv = new Call("toto",13);

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
				.get(DatabaseConnection.associationEndpoint(Profil.getTableName(), c.getId().toString(), Call.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var calls = c.calls();

			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the calls");

			assert.throws(function() {
					c.addCall(pv);
				},
				ModelException,
				"The exception has not been thrown.");
		});

	});

	describe('#removeCall', function() {
		it('should remove the Call from the array', function() {
			var c = new Profil("toto", "blabla", 52);
			var pv = new Call("mavaleur",12);

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
				.get(DatabaseConnection.associationEndpoint(Profil.getTableName(), c.getId().toString(), Call.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var calls = c.calls();

			assert.deepEqual(calls, [pv], "The call array is not an array fill only with PV: "+JSON.stringify(calls));
			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the calls");

			var spy = sinon.spy(pv, "desynchronize");
			var reponse2 : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock2 = nock(DatabaseConnection.getBaseURL())
				.delete(DatabaseConnection.associatedObjectEndpoint(Profil.getTableName(), c.getId().toString(), Call.getTableName(), pv.getId().toString()))
				.reply(200, JSON.stringify(reponse2));

			var retour = c.removeCall(pv);
			assert.ok(retour, "The return of the removeCall is false.");
			assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the call in database.");

			calls = c.calls();
			assert.deepEqual(calls, [], "The calls is not an empty array: "+JSON.stringify(calls));
			assert.ok(spy.calledOnce, "The desynchronize method was not called once.");
		});

		it('should not allow to remove a null object', function() {
			nock.disableNetConnect();
			var c = new Profil("toto", "blabla", 52);

			assert.throws(function() {
					c.removeCall(null);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add an undefined object', function() {
			nock.disableNetConnect();
			var c = new Profil("toto", "blabla", 52);

			assert.throws(function() {
					c.removeCall(undefined);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add a object which is not yet created', function() {
			nock.disableNetConnect();
			var c = new Profil("toto", "blabla", 52);
			var p = new Call("bidule");

			assert.throws(function() {
					c.removeCall(p);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to remove an object which is not linked', function() {
			var c = new Profil("toto", "blabla", 52);
			var pv = new Call("toto",12);

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Profil.getTableName(), c.getId().toString(), Call.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var calls = c.calls();

			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the calls");

			assert.throws(function() {
					c.removeCall(pv);
				},
				ModelException,
				"The exception has not been thrown.");
		});

	});
});