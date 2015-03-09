
/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />

/// <reference path="../../scripts/core/DatabaseConnection.ts" />
/// <reference path="../../scripts/model/Service.ts" />

var assert = require("assert");
var nock = require("nock");

describe('Service', function(){
	describe('#constructor', function() {
		it('should store the name', function(){
			var name = "machin";
			var c = new Service(name, "desc", "host", 42);
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the description', function(){
			var description = "machin";
			var c = new Service("name", description, "host", 42);
			assert.equal(c.description(), description, "The description is not stored correctly.");
		});

		it('should store the host', function(){
			var host = "machin";
			var c = new Service("name", "desc", host, 42);
			assert.equal(c.host(), host, "The host is not stored correctly.");
		});

		it('should store the ID', function() {
			var id = 52;
			var c = new Service("name", "desc", "host", id);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});
	});

	describe('#fromJSONobject', function() {
		it('should create the right object', function() {
			var json = {
				"id": 42,
				"name": "toto",
				"description": "tata",
				"host": "localhost"
			};

			var callRetrieve = Service.fromJSONObject(json);
			var callExpected = new Service("toto","tata","localhost",42);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve call ("+callRetrieve+") does not match with the expected one ("+callExpected+")");
		});

		it('should throw an exception if the ID is undefined', function() {
			var json = {
				"name": "toto",
				"description":"blup",
				"host": "tac"
			};

			assert.throws(function() {
					InfoType.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the ID is null', function() {
			var json = {
				"name": "toto",
				"description":"blup",
				"host": "tac",
				"id": null
			};

			assert.throws(function() {
					InfoType.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});
	});

	describe('#toJsonObject', function() {
		it('should create the expected JSON Object', function() {
			var c = new Service("toto", "blabla", "blob", 52);
			var expected = {
				"name": "toto",
				"description": "blabla",
				"host": "blob",
				"id": 52
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object ("+JSON.stringify(json)+") and the expected JSON ("+JSON.stringify(expected)+") do not match.");
		})
	});
});
