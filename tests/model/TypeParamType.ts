/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../scripts/model/TypeParamType.ts" />

var assert = require("assert");
var nock : any = require("nock");

describe('TypeParamType', function() {
	describe('#constructor', function () {
		it('should store the name', function () {
			var name = "machin";
			var c = new TypeParamType(name);
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the ID', function () {
			var id = 52;
			var c = new TypeParamType("", id);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});

		it('should store the complete value', function () {
			var c = new TypeParamType("", 52, true);
			assert.equal(c.isComplete(), true, "The complete value is not stored.");
		});

		it('should a default false value to complete', function () {
			var c = new TypeParamType();
			assert.equal(c.isComplete(), false, "The complete value is not stored.");
		});
	});

	describe('#checkCompleteness', function() {
		it('should specify the object is complete if a name and an ID are given', function() {
			var i = new TypeParamType("toto", 52);
			i.checkCompleteness();
			assert.equal(i.isComplete(), true, "The TypeParamType is not considered as complete.");
		});

		it('should not specify the object is complete if the name is an empty string', function() {
			var i = new TypeParamType("", 52);
			i.checkCompleteness();
			assert.equal(i.isComplete(), false, "The TypeParamType is considered as complete.");
		});

		it('should not specify the object is complete if the name is null', function() {
			var i = new TypeParamType(null, 52);
			i.checkCompleteness();
			assert.equal(i.isComplete(), false, "The TypeParamType is considered as complete.");
		});

		it('should not specify the object is complete if the id is null', function() {
			var i = new TypeParamType("toto", null);
			i.checkCompleteness();
			assert.equal(i.isComplete(), false, "The TypeParamType is considered as complete.");
		});

		it('should not specify the object is complete if the object is empty', function() {
			var i = new TypeParamType();
			i.checkCompleteness();
			assert.equal(i.isComplete(), false, "The TypeParamType is considered as complete.");
		});
	});

	describe('#fromJSONobject', function () {
		it('should create the right object', function () {
			var json = {
				"id": 42,
				"name": "toto",
				"complete": true
			};

			var typeParamTypeRetrieve = TypeParamType.fromJSONObject(json);
			var typeParamTypeExpected = new TypeParamType("toto", 42, true);

			assert.deepEqual(typeParamTypeRetrieve, typeParamTypeExpected, "The retrieve typeParamType (" + typeParamTypeRetrieve + ") does not match with the expected one (" + typeParamTypeExpected + ")");
		});

		it('should create the right object even if it is partial', function () {
			var json = {
				"id": 42,
				"name": "",
				"complete": false
			};

			var typeParamTypeRetrieve = TypeParamType.fromJSONObject(json);
			var typeParamTypeExpected = new TypeParamType("", 42);

			assert.deepEqual(typeParamTypeRetrieve, typeParamTypeExpected, "The retrieve typeParamType (" + typeParamTypeRetrieve + ") does not match with the expected one (" + typeParamTypeExpected + ")");
		});

		it('should throw an exception if the ID is undefined', function () {
			var json = {
				"name": "toto",
				"complete": false
			};

			assert.throws(function () {
					TypeParamType.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the ID is null', function () {
			var json = {
				"name": "toto",
				"complete": false,
				"id": null
			};

			assert.throws(function () {
					TypeParamType.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the complete is undefined', function () {
			var json = {
				"name": "toto",
				"id": 12
			};

			assert.throws(function () {
					TypeParamType.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the complete is null', function () {
			var json = {
				"name": "toto",
				"id": 24,
				"complete": null
			};

			assert.throws(function () {
					TypeParamType.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});
	});

	describe('#toJsonObject', function () {
		it('should create the expected JSON Object', function () {
			var c = new TypeParamType("toto", 52,true);
			var expected = {
				"name": "toto",
				"id": 52,
				"complete": true
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object (" + JSON.stringify(json) + ") and the expected JSON (" + JSON.stringify(expected) + ") do not match.");
		})
	});
});