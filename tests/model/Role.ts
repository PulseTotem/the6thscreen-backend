/**
  * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />

/// <reference path="../../app/scripts/model/Role.ts" />

var assert = require("assert");
var nock : any = require("nock");

describe('Role', function() {
	describe('#constructor', function () {
		it('should store the name', function () {
			var name = "machin";
			var c = new Role(name);
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the ID', function () {
			var id = 52;
			var c = new Role("bidule", 52);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});
	});

	describe('#fromJSONobject', function () {
		it('should create the right object', function () {
			var json = {"id": 42,
				"name": "toto"
			};

			var callRetrieve = Role.fromJSONObject(json);
			var callExpected = new Role("toto", 42);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve call (" + callRetrieve + ") does not match with the expected one (" + callExpected + ")");
		});

		it('should throw an exception if the ID is undefined', function () {
			var json = {"name": "toto"
			};

			assert.throws(function () {
					Role.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the ID is null', function () {
			var json = {
				"name": "toto",
				"id": null
			};

			assert.throws(function () {
					Role.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the name is undefined', function () {
			var json = {"id": 52
			};

			assert.throws(function () {
					Role.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the name is null', function () {
			var json = {
				"name": null,
				"id": 42
			};

			assert.throws(function () {
					Role.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});
	});

	describe('#toJsonObject', function () {
		it('should create the expected JSON Object', function () {
			var c = new Role("toto", 52);
			var expected = {
				"name": "toto",
				"id": 52
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object (" + JSON.stringify(json) + ") and the expected JSON (" + JSON.stringify(expected) + ") do not match.");
		})
	});
});