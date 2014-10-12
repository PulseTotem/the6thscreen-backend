/**
 * @author Christian Brel <brel@i3s.unice.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../app/scripts/model/Call.ts" />

var assert = require("assert");
var nock = require("nock");
var sinon : SinonStatic = require("sinon");

describe('Call', function(){
	describe('#constructor', function() {
		it('should store the name', function(){
			var name = "machin";
			var c = new Call(name);
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the ID', function() {
			var id = 52;
			var c = new Call("bidule",52);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});
	});

	describe('#fromJSONobject', function() {
		it('should create the right object', function() {
			var json = {"id": 42,
				"name": "toto"
			};

			var callRetrieve = Call.fromJSONObject(json);
			var callExpected = new Call("toto",42);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve call ("+callRetrieve+") does not match with the expected one ("+callExpected+")");
		});

		it('should throw an exception if the ID is undefined', function() {
			var json = {"name": "toto"
			};

			assert.throws(function() {
				Call.fromJSONObject(json);
			},
			ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the ID is null', function() {
			var json = {
				"name": "toto",
				"id": null
			};

			assert.throws(function() {
					Call.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the name is undefined', function() {
			var json = {"id": 52
			};

			assert.throws(function() {
					Call.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the name is null', function() {
			var json = {
				"name": null,
				"id": 42
			};

			assert.throws(function() {
					Call.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});
	});

	describe('#toJsonObject', function() {
		var c = new Call("toto", 52);
		var expected = {
			"name": "toto",
			"id": 52
		};
		var json = c.toJSONObject();

		assert.deepEqual(json, expected, "The JSON object ("+JSON.stringify(json)+") and the expected JSON ("+JSON.stringify(expected)+") do not match.");
	});

	describe('#addParamValue', function() {
		it('should put the new ParamValue inside the array', function() {
			var c = new Call("toto", 52);
			var pv = new ParamValue("mavaleur",12);
			var spy = sinon.spy(pv, "desynchronize");

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Call.getTableName(), c.getId().toString(), ParamValue.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var paramValues = c.paramValues();

			assert.deepEqual(paramValues, [], "The paramValue is not an empty array: "+JSON.stringify(paramValues));
			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the paramValues");

			var reponse2 : SequelizeRestfulResponse = {
			 "status": "success",
			 "data": {}
			 };

			 var restClientMock2 = nock(DatabaseConnection.getBaseURL())
			 .put(DatabaseConnection.associatedObjectEndpoint(Call.getTableName(), c.getId().toString(), ParamValue.getTableName(), pv.getId().toString()))
			 .reply(200, JSON.stringify(reponse2));

			 var retour = c.addParamValue(pv);
			 assert.ok(retour, "The return of the addParamValue is false.");
			 assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the paramValue in database.");

			 paramValues = c.paramValues();
			 var expected = [pv];
			 assert.deepEqual(paramValues, expected, "The paramValues is not an array containing only the added paramValue: "+JSON.stringify(paramValues));
			assert.ok(spy.calledOnce, "The desynchronize method was not called once.");
		});

		it('should not allow to add a null object', function() {
			nock.disableNetConnect();
			var c = new Call("toto", 52);

			assert.throws(function() {
				c.addParamValue(null);
			},
			ModelException,
			"The exception has not been thrown.");
		});

		it('should not allow to add an undefined object', function() {
			nock.disableNetConnect();
			var c = new Call("toto", 52);

			assert.throws(function() {
					c.addParamValue(undefined);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add a object which is not yet created', function() {
			nock.disableNetConnect();
			var c = new Call("toto", 52);
			var p = new ParamValue("bidule");

			assert.throws(function() {
					c.addParamValue(p);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to put an already existing object', function() {
			var c = new Call("toto", 52);
			var pv = new ParamValue("toto",13);

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": [
					{
						"id":13,
						"value": "toto"
					},
					{
						"id": 14,
						"value": "titi"
					}
				]
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Call.getTableName(), c.getId().toString(), ParamValue.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var paramValues = c.paramValues();

			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the paramValues");

			assert.throws(function() {
				c.addParamValue(pv);
			},
			ModelException,
			"The exception has not been thrown.");
		});

	});

	describe('#removeParamValue', function() {
		it('should remove the ParamValue from the array', function() {
			var c = new Call("toto", 52);
			var pv = new ParamValue("mavaleur",12);

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": [
					{
						"value": "mavaleur",
						"id": 12
					}
				]
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Call.getTableName(), c.getId().toString(), ParamValue.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var paramValues = c.paramValues();

			assert.deepEqual(paramValues, [pv], "The paramValue array is not an array fill only with PV: "+JSON.stringify(paramValues));
			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the paramValues");

			var spy = sinon.spy(pv, "desynchronize");
			var reponse2 : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock2 = nock(DatabaseConnection.getBaseURL())
				.delete(DatabaseConnection.associatedObjectEndpoint(Call.getTableName(), c.getId().toString(), ParamValue.getTableName(), pv.getId().toString()))
				.reply(200, JSON.stringify(reponse2));

			var retour = c.removeParamValue(pv);
			assert.ok(retour, "The return of the removeParamValue is false.");
			assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the paramValue in database.");

			paramValues = c.paramValues();
			assert.deepEqual(paramValues, [], "The paramValues is not an empty array: "+JSON.stringify(paramValues));
			assert.ok(spy.calledOnce, "The desynchronize method was not called once.");
		});

		it('should not allow to remove a null object', function() {
			nock.disableNetConnect();
			var c = new Call("toto", 52);

			assert.throws(function() {
					c.removeParamValue(null);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add an undefined object', function() {
			nock.disableNetConnect();
			var c = new Call("toto", 52);

			assert.throws(function() {
					c.removeParamValue(undefined);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add a object which is not yet created', function() {
			nock.disableNetConnect();
			var c = new Call("toto", 52);
			var p = new ParamValue("bidule");

			assert.throws(function() {
					c.removeParamValue(p);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to remove an object which is not linked', function() {
			var c = new Call("toto", 52);
			var pv = new ParamValue("toto",12);

			var reponse1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Call.getTableName(), c.getId().toString(), ParamValue.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var paramValues = c.paramValues();

			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the paramValues");

			assert.throws(function() {
					c.removeParamValue(pv);
				},
				ModelException,
				"The exception has not been thrown.");
		});

	})
});