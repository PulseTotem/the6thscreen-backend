/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../scripts/model/ReceivePolicy.ts" />

var assert = require("assert");
var nock : any = require("nock");

describe('ReceivePolicy', function() {
	describe('#constructor', function () {
		it('should store the name', function () {
			var name = "machin";
			var c = new ReceivePolicy(name);
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the ID', function () {
			var id = 52;
			var c = new ReceivePolicy("", 52);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});

		it('should store the complete value', function() {
			var c = new ReceivePolicy("", 52, true);
			assert.equal(c.isComplete(), true, "The complete attribute is not stored.");
		});

		it('should assign a default value to the complete attribute', function() {
			var c = new ReceivePolicy("", 52, false);
			assert.equal(c.isComplete(), false, "The complete attribute is not stored.");
		});
	});

	describe('#checkCompleteness', function() {
		it('should specify the object is complete if a name and an ID are given', function() {
			var i = new ReceivePolicy("bla", 52);
			i.checkCompleteness();
			assert.equal(i.isComplete(), true, "The infoType is not considered as complete.");
		});

		it('should not specify the object is complete if the name is an empty string', function() {
			var i = new ReceivePolicy("", 52);
			i.checkCompleteness();
			assert.equal(i.isComplete(), false, "The infoType is considered as complete.");
		});

		it('should not specify the object is complete if the name is null', function() {
			var i = new ReceivePolicy(null, 52);
			i.checkCompleteness();
			assert.equal(i.isComplete(), false, "The infoType is considered as complete.");
		});

		it('should not specify the object is complete if the id is null', function() {
			var i = new ReceivePolicy("bla", null);
			i.checkCompleteness();
			assert.equal(i.isComplete(), false, "The infoType is considered as complete.");
		});

		it('should not specify the object is complete if the object is empty', function() {
			var i = new ReceivePolicy();
			i.checkCompleteness();
			assert.equal(i.isComplete(), false, "The infoType is considered as complete.");
		});
	});


	describe('#fromJSONobject', function () {
		it('should create the right object', function () {
			var json = {
				"id": 42,
				"name": "toto",
				"complete": true
			};

			var receivePolicyRetrieve = ReceivePolicy.fromJSONObject(json);
			var receivePolicyExpected = new ReceivePolicy("toto", 42, true);

			assert.deepEqual(receivePolicyRetrieve, receivePolicyExpected, "The retrieve receivePolicy (" + receivePolicyRetrieve + ") does not match with the expected one (" + receivePolicyExpected + ")");
		});

		it('should create the right object even if it is partial', function () {
			var json = {
				"id": 42,
				"name": "",
				"complete": false
			};

			var receivePolicyRetrieve = ReceivePolicy.fromJSONObject(json);
			var receivePolicyExpected = new ReceivePolicy("", 42);

			assert.deepEqual(receivePolicyRetrieve, receivePolicyExpected, "The retrieve receivePolicy (" + receivePolicyRetrieve + ") does not match with the expected one (" + receivePolicyExpected + ")");
		});

		it('should throw an exception if the ID is undefined', function () {
			var json = {
				"name": "toto",
				"complete": false
			};

			assert.throws(function () {
					ReceivePolicy.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the ID is null', function () {
			var json = {
				"name": "toto",
				"id": null,
				"complete": false
			};

			assert.throws(function () {
					ReceivePolicy.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the complete is undefined', function () {
			var json = {
				"name": "toto",
				"id": 12
			};

			assert.throws(function () {
					ReceivePolicy.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the complete is null', function () {
			var json = {
				"name": "toto",
				"id": 12,
				"complete": null
			};

			assert.throws(function () {
					ReceivePolicy.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

	});

	describe('#toJsonObject', function () {
		it('should create the expected JSON Object', function () {
			var c = new ReceivePolicy("toto", 52);
			var expected = {
				"name": "toto",
				"id": 52,
				"complete": false
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object (" + JSON.stringify(json) + ") and the expected JSON (" + JSON.stringify(expected) + ") do not match.");
		})
	});
});