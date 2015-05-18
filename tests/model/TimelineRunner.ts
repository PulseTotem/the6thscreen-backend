/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../scripts/model/TimelineRunner.ts" />

var assert = require("assert");
var nock : any = require("nock");

describe('TimelineRunner', function() {
	describe('#constructor', function() {

		it('should store the name', function(){
			var name = "machin";
			var c = new TimelineRunner(name,"");
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the description', function(){
			var desc = "machin";
			var c = new TimelineRunner("",desc);
			assert.equal(c.description(), desc, "The description is not stored correctly.");
		});

		it('should store the ID', function() {
			var id = 52;
			var c = new TimelineRunner("titi","",id);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});
	});

	describe('#fromJSONobject', function() {
		it('should create the right object', function() {
			var json = {
				"id": 42,
				"name": "toto",
				"description": "blabla",
				"complete": true
			};

			var callRetrieve = TimelineRunner.fromJSONObject(json);
			var callExpected = new TimelineRunner("toto","blabla",42,true);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve callType ("+callRetrieve+") does not match with the expected one ("+callExpected+")");
		});

		it('should create the right object even if it is partial', function() {
			var json = {
				"id": 42,
				"name": "",
				"description": "",
				"complete": false
			};

			var callRetrieve = TimelineRunner.fromJSONObject(json);
			var callExpected = new TimelineRunner("","",42);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve TimelineRunner ("+JSON.stringify(callRetrieve)+") does not match with the expected one ("+JSON.stringify(callExpected)+")");
		});
	});

	describe('#toJsonObject', function() {
		it('should create the expected JSON Object', function() {
			var c = new TimelineRunner("toto","blabla", 52);
			var expected = {
				"name": "toto",
				"description": "blabla",
				"id": 52,
				"complete": false
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object ("+JSON.stringify(json)+") and the expected JSON ("+JSON.stringify(expected)+") do not match.");
		})
	});
});