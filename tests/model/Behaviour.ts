/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../scripts/model/Behaviour.ts" />

var assert = require("assert");
var nock : any = require("nock");
var sinon : SinonStatic = require("sinon");

describe('Behaviour', function() {
	describe('#constructor', function () {
		it('should store the name', function () {
			var name = "machin";
			var c = new Behaviour(name, "");
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the description', function () {
			var desc = "machin";
			var c = new Behaviour("", desc);
			assert.equal(c.description(), desc, "The description is not stored correctly.");
		});

		it('should store the ID', function () {
			var id = 52;
			var c = new Behaviour("", "", id);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});

		it('should store the complete attribute', function () {
			var c = new Behaviour("", "", 12, true);
			assert.equal(c.isComplete(), true, "The complete attribute is not stored.");
		});
	});

	describe('#checkCompleteness()', function() {
		it('should return false if the object is empty', function(done) {
			var b =  new Behaviour();
			var success = function () {
				assert.equal(b.isComplete(), false, "The behaviour should not be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);

		});

		it('should return true if the object has a name and an ID but no description', function(done) {
			var b = new Behaviour('toto', null, 12);
			var success = function () {
				assert.equal(b.isComplete(), true, "The behaviour should be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});

		it('should return false if the object has an empty name and an ID but no description', function(done) {
			var b = new Behaviour('', null, 12);
			var success = function () {
				assert.equal(b.isComplete(), false, "The behaviour should not be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});
	});

	describe('#fromJSONobject', function () {
		it('should create the right object', function () {
			var json = {
				"id": 42,
				"name": "toto",
				"description": "blabla",
				"complete":true
			};

			var callRetrieve = Behaviour.fromJSONObject(json);
			var callExpected = new Behaviour("toto", "blabla", 42,true);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve renderer (" + callRetrieve + ") does not match with the expected one (" + callExpected + ")");
		});

		it('should create the right object even if it is not complete', function () {
			var json = {
				"id": 42,
				"name": "toto",
				"description": null,
				"complete":false
			};

			var callRetrieve = Behaviour.fromJSONObject(json);
			var callExpected = new Behaviour("toto", null, 42);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve renderer (" + callRetrieve + ") does not match with the expected one (" + callExpected + ")");
		});
	});

	describe('#toJsonObject', function () {
		it('should create the expected JSON Object', function () {
			var c = new Behaviour("toto", "blabla", 52);
			var expected = {
				"name": "toto",
				"description": "blabla",
				"id": 52,
				"complete": false,
				"createdAt":null,
				"updatedAt":null
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object (" + JSON.stringify(json) + ") and the expected JSON (" + JSON.stringify(expected) + ") do not match.");
		})
	});

	describe('#updateAttribute', function () {
		it('should update the name when asking', function (done) {
			var model = new Behaviour("", "", 12);
			var modelUpdated = new Behaviour("tata", "", 12, true);

			var responseRead : SequelizeRestfulResponse = {
				"status": "success",
				"data": model.toJSONObject()
			};

			var restClientMockRead = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.objectEndpoint(Behaviour.getTableName(), model.getId().toString()))
				.reply(200, JSON.stringify(responseRead));

			var newInfo = {
				'id' : model.getId(),
				'method': 'setName',
				'value': modelUpdated.name()
			};

			var responseUpdate : SequelizeRestfulResponse = {
				"status": "success",
				"data": modelUpdated.toJSONObject()
			};

			var restClientMockUpdate = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.objectEndpoint(Behaviour.getTableName(), model.getId().toString()), modelUpdated.toJSONObject())
				.reply(200, JSON.stringify(responseUpdate));

			var success : Function = function () {
				assert.ok(restClientMockRead.isDone(), "The object is not read.");
				assert.ok(restClientMockUpdate.isDone(), "The request update has not been done.");
				done();
			};

			var fail : Function = function (error) {
				done(error);
			};

			ModelItf.updateAttribute(Behaviour, newInfo, success, fail);
		});
	});
});