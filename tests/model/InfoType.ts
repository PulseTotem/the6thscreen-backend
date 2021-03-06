
/**
* @author Simon Urli <simon@the6thscreen.fr>
*/

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />

/// <reference path="../../scripts/core/BackendConfig.ts" />
/// <reference path="../../scripts/model/InfoType.ts" />

var assert = require("assert");
var nock = require("nock");

describe('InfoType', function(){
	describe('#constructor', function() {
		it('should store the name', function(){
			var name = "machin";
			var c = new InfoType(name);
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the ID', function() {
			var id = 52;
			var c = new InfoType("",52);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});

		it('should store the complete value', function() {
			var c = new InfoType("",52,true);
			assert.equal(c.isComplete(), true, "The complete value is not stored.");
		});

		it('should assign a default complete value to false', function() {
			var c = new InfoType();
			assert.equal(c.isComplete(), false, "The complete value is not stored.");
		});
	});

	describe('#checkCompleteness', function() {
		it('should specify the object is complete if a name and an ID are given', function(done) {
			var i = new InfoType("vlab",324);
			var success = function () {
				assert.equal(i.isComplete(), true, "The infoType is not considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if the name is an empty string', function(done) {
			var i = new InfoType("",324);
			var success = function () {
				assert.equal(i.isComplete(), false, "The infoType is considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if the name is null', function(done) {
			var i = new InfoType(null,324);
			var success = function () {
				assert.equal(i.isComplete(), false, "The infoType is considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if the id is null', function(done) {
			var i = new InfoType("test");
			var success = function () {
				assert.equal(i.isComplete(), false, "The infoType is considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if the object is empty', function(done) {
			var i = new InfoType();
			var success = function () {
				assert.equal(i.isComplete(), false, "The infoType is considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});
	});

	describe('#fromJSONobject', function() {
		it('should create the right object', function() {
			var json = {
				"id": 42,
				"name": "toto",
				"complete": true
			};

			var callRetrieve = InfoType.fromJSONObject(json);
			var callExpected = new InfoType("toto",42,true);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve call ("+callRetrieve+") does not match with the expected one ("+callExpected+")");
		});

		it('should create the right object even if it is partial', function() {
			var json = {
				"id": 42,
				"name": "",
				"complete": false
			};

			var callRetrieve = InfoType.fromJSONObject(json);
			var callExpected = new InfoType("",42);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve call ("+callRetrieve+") does not match with the expected one ("+callExpected+")");
		});
	});

	describe('#toJsonObject', function() {
		it('should create the expected JSON Object', function() {
			var c = new InfoType("toto", 52);
			var expected = {
				"name": "toto",
				"id": 52,
				"complete": false,
				"createdAt":null,
				"updatedAt":null
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object ("+JSON.stringify(json)+") and the expected JSON ("+JSON.stringify(expected)+") do not match.");
		})
	});
});