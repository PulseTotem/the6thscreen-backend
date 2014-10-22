/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../scripts/model/Renderer.ts" />

var assert = require("assert");
var nock : any = require("nock");
var sinon : SinonStatic = require("sinon");

describe('Renderer', function() {
	describe('#constructor', function () {
		it('should throw an error if the name is undefined', function(){
			assert.throws(
				function() {
					new Renderer(undefined);
				},
				ModelException,
				"The exception has not been thrown."
			);
		});

		it('should throw an error if the name is null', function(){
			assert.throws(
				function() {
					new Renderer(null);
				},
				ModelException,
				"The exception has not been thrown."
			);
		});

		it('should throw an error if the name is empty', function(){
			assert.throws(
				function() {
					new Renderer("");
				},
				ModelException,
				"The exception has not been thrown."
			);
		});

		it('should store the name', function () {
			var name = "machin";
			var c = new Renderer(name, "");
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the description', function () {
			var desc = "machin";
			var c = new Renderer("titi", desc);
			assert.equal(c.description(), desc, "The description is not stored correctly.");
		});

		it('should store the ID', function () {
			var id = 52;
			var c = new Renderer("tutu", "", id);
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

			var callRetrieve = Renderer.fromJSONObject(json);
			var callExpected = new Renderer("toto", "blabla", 42);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve renderer (" + callRetrieve + ") does not match with the expected one (" + callExpected + ")");
		});

		it('should throw an exception if the ID is undefined', function () {
			var json = {
				"name": "toto",
				"description": "blabla"
			};

			assert.throws(function () {
					Renderer.fromJSONObject(json);
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
					Renderer.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the name is undefined', function () {
			var json = {
				"id": 52,
				"description": "blabla"
			};

			assert.throws(function () {
					Renderer.fromJSONObject(json);
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
					Renderer.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the description is undefined', function () {
			var json = {
				"id": 52,
				"name": "blabla"
			};

			assert.throws(function () {
					Renderer.fromJSONObject(json);
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
					Renderer.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});
	});

	describe('#toJsonObject', function () {
		it('should create the expected JSON Object', function () {
			var c = new Renderer("toto", "blabla", 52);
			var expected = {
				"name": "toto",
				"description": "blabla",
				"id": 52
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object (" + JSON.stringify(json) + ") and the expected JSON (" + JSON.stringify(expected) + ") do not match.");
		})
	});

	describe('#setInfoType', function () {
		it('should set the given infoType', function () {
			var c = new Renderer("toto", "machin", 52);
			var s = new InfoType("toto", 42);
			var spy = sinon.spy(s, "desynchronize");

			var reponse1:SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Renderer.getTableName(), c.getId().toString(), InfoType.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var infoType = c.infoType();
			assert.equal(infoType, null, "The infoType is not a null value: " + JSON.stringify(infoType));

			var reponse2:SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock2 = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.associatedObjectEndpoint(Renderer.getTableName(), c.getId().toString(), InfoType.getTableName(), s.getId().toString()))
				.reply(200, JSON.stringify(reponse2));

			var retour = c.setInfoType(s);
			assert.ok(retour, "The return of the setInfoType is false.");
			assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the infoType in database.");
			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the infoType");

			// normalement le lazy_loading est true : plus besoin de mock pour la requête
			infoType = c.infoType();
			assert.deepEqual(infoType, s, "The infoType() does not return the exact infoType we give: " + JSON.stringify(infoType));
			assert.ok(spy.calledOnce, "The desynchronize method was not called once.");
		});

		it('should not allow to add a null object', function () {
			nock.disableNetConnect();
			var c = new Renderer("toto", "machin", 52);

			assert.throws(function () {
					c.setInfoType(null);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add an undefined object', function () {
			nock.disableNetConnect();
			var c = new Renderer("toto", "machin", 52);

			assert.throws(function () {
					c.setInfoType(undefined);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to add a object which is not yet created', function () {
			nock.disableNetConnect();
			var c = new Renderer("toto", "machin", 52);
			var s = new InfoType("toto");

			assert.throws(function () {
					c.setInfoType(s);
				},
				ModelException,
				"The exception has not been thrown.");
		});

		it('should not allow to set a infoType if there is already one', function () {
			var c = new Renderer("toto", "machin", 52);
			var s = new InfoType("toto", 42);
			var s2 = new InfoType("tutu", 89);


			var reponse1:SequelizeRestfulResponse = {
				"status": "success",
				"data": s2.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Renderer.getTableName(), c.getId().toString(), InfoType.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var infoType = c.infoType();

			assert.ok(!!infoType, "The infoType has false value.");
			assert.throws(function () {
					c.setInfoType(s);
				},
				ModelException,
				"The exception has not been thrown.");
			assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the infoType");
		});

	});

	describe('#unsetInfoType', function () {
		it('should unset the InfoType', function () {
			var c = new Renderer("toto", "machin", 52);
			var s = new InfoType("toto", 42);

			var reponse1:SequelizeRestfulResponse = {
				"status": "success",
				"data": s.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Renderer.getTableName(), c.getId().toString(), InfoType.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var infoType = c.infoType();
			assert.deepEqual(infoType, s, "The infoType is not the expected value");
			var spy = sinon.spy(infoType, "desynchronize");

			var reponse2:SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock2 = nock(DatabaseConnection.getBaseURL())
				.delete(DatabaseConnection.associatedObjectEndpoint(Renderer.getTableName(), c.getId().toString(), InfoType.getTableName(), s.getId().toString()))
				.reply(200, JSON.stringify(reponse2));

			var retour = c.unsetInfoType();
			assert.ok(retour, "The return of the unsetInfoType is false.");
			assert.ok(restClientMock2.isDone(), "The mock request has not been done.");

			infoType = c.infoType();
			assert.deepEqual(infoType, null, "The infoType() does not return a null value after unsetting");
			assert.ok(spy.calledOnce, "The desynchronize method was not called once.");
		});

		it('should not allow to unset a profil if there is none', function () {
			var c = new Renderer("toto", "machin", 52);
			var s = new InfoType("toto", 42);

			var reponse1:SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Renderer.getTableName(), c.getId().toString(), InfoType.getTableName()))
				.reply(200, JSON.stringify(reponse1));

			var infoType = c.infoType();

			assert.equal(infoType, null, "The infoType has a value not null: " + JSON.stringify(infoType));
			assert.throws(function () {
					c.unsetInfoType();
				},
				ModelException,
				"The exception has not been thrown.");
			assert.ok(restClientMock1.isDone(), "The mock request has not been done");
		});

	});

});