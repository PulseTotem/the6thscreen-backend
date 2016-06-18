/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../scripts/model/Token.ts" />

var assert = require("assert");
var nock : any = require("nock");

describe('Token', function() {
	describe('#constructor', function() {

		it('should store the value', function(){
			var value = "machin";
			var c = new Token(value, null);
			assert.equal(c.value(), value, "The value is not stored correctly.");
		});

		it('should store the endDate', function(){
			var endDate = new Date();
			var c = new Token("",endDate);
			assert.equal(c.endDate(), endDate, "The endDate is not stored correctly.");
		});

		it('should store the ID', function() {
			var id = 52;
			var c = new Token("titi",null,id);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});
	});

	describe('#fromJSONobject', function() {
		it('should create the right object', function() {
			var date = new Date();
			var json = {
				"id": 42,
				"value": "toto",
				"endDate": date,
				"complete": true
			};

			var callRetrieve = Token.fromJSONObject(json);
			var callExpected = new Token("toto",date,42,true);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve callType ("+callRetrieve+") does not match with the expected one ("+callExpected+")");
		});

		it('should create the right object even if it is partial', function() {
			var json = {
				"id": 42,
				"value": "toto",
				"endDate": null,
				"complete": false
			};

			var callRetrieve = Token.fromJSONObject(json);
			var callExpected = new Token("toto",null,42);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve Policy ("+JSON.stringify(callRetrieve)+") does not match with the expected one ("+JSON.stringify(callExpected)+")");
		});
	});

	describe('#toJsonObject', function() {
		it('should create the expected JSON Object', function() {
			var date = new Date();
			var c = new Token("toto",date, 52);
			var expected = {
				"value": "toto",
				"endDate": date,
				"id": 52,
				"complete": false,
				"createdAt":null,
				"updatedAt":null
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object ("+JSON.stringify(json)+") and the expected JSON ("+JSON.stringify(expected)+") do not match.");
		})
	});

	describe('#checkCompleteness()', function() {
		it('should return false if the object is empty', function (done) {
			var b = new Token();
			var success = function () {
				assert.equal(b.isComplete(), false, "The Token should not be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});

		it('should return true if the object contains a value, a endDate and an id', function (done) {
			var b = new Token("toto", new Date(), 42);
			var success = function () {
				assert.equal(b.isComplete(), true, "The Token should be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});

		it('should return false if the object contains an empty value, a endDate and an id', function (done) {
			var b = new Token("", new Date(), 42);
			var success = function () {
				assert.equal(b.isComplete(), false, "The Token should not be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});

		it('should return false if the object contains a null value, a endDate and an id', function (done) {
			var b = new Token(null, new Date(), 42);
			var success = function () {
				assert.equal(b.isComplete(), false, "The Token should not be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});

		it('should return false if the object contains a value, a null endDate and an id', function (done) {
			var b = new Token("bla", null, 42);
			var success = function () {
				assert.equal(b.isComplete(), false, "The Token should not be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});

		it('should return false if the object contains a value, a endDate but no id', function (done) {
			var b = new Token("bla", new Date());
			var success = function () {
				assert.equal(b.isComplete(), false, "The Token should not be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});
	});
});