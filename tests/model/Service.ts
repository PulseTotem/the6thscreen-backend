
/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />

/// <reference path="../../scripts/core/BackendConfig.ts" />
/// <reference path="../../scripts/model/Service.ts" />

var assert = require("assert");
var nock = require("nock");

describe('Service', function(){
	describe('#constructor', function() {
		it('should store the name', function(){
			var name = "machin";
			var c = new Service(name);
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the description', function(){
			var description = "machin";
			var c = new Service("", description);
			assert.equal(c.description(), description, "The description is not stored correctly.");
		});

		it('should store the host', function(){
			var host = "machin";
			var c = new Service("", "", host);
			assert.equal(c.host(), host, "The host is not stored correctly.");
		});

		it('should store the oauth', function(){
			var oauth = true;
			var c = new Service("", "", "", oauth);
			assert.equal(c.oauth(), oauth, "The oauth is not stored correctly.");
		});

		it('should store the provider', function(){
			var provider = "machin";
			var c = new Service("", "", "", true, provider);
			assert.equal(c.provider(), provider, "The provider is not stored correctly.");
		});

		it('should store the logo', function(){
			var logo = "blurf";
			var c = new Service("", "", "", true, "", logo);
			assert.equal(c.logo(), logo, "The logo is not stored correctly.");
		});

		it('should store the ID', function() {
			var id = 52;
			var c = new Service("", "", "", true, "", "", id);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});

		it('should store the complete value', function() {
			var c = new Service("", "", "", true, "", "", 12, true);
			assert.equal(c.isComplete(), true, "The complete attribute is not stored.");
		});

		it('should assign a default value to the complete attribute', function() {
			var c = new Service("", "", "", true, "", "", 12, false);
			assert.equal(c.isComplete(), false, "The complete attribute is not stored.");
		});
	});

	describe('#checkCompleteness', function() {
		it('should specify the object is complete if a name, an host and an ID are given in case of not oauth', function(done) {
			var i = new Service("name", "", "localhost", false, "", "", 324);
			var success = function () {
				assert.equal(i.isComplete(), true, "The Service is not considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should specify the object is complete if a name, an host, a provider and an ID are given in case of oauth', function(done) {
			var i = new Service("name", "", "localhost", true, "provider", "", 324);
			var success = function () {
				assert.equal(i.isComplete(), true, "The Service is not considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if the name is an empty string', function(done) {
			var i = new Service("", "", "localhost", true, "provider", "", 324);
			var success = function () {
				assert.equal(i.isComplete(), false, "The service is considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if the name is null', function(done) {
			var i = new Service(null, "", "localhost", true, "provider", "", 324);
			var success = function () {
				assert.equal(i.isComplete(), false, "The service is considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if the id is null', function(done) {
			var i = new Service("name", "", "localhost", true, "provider", "", null);
			var success = function () {
				assert.equal(i.isComplete(), false, "The service is considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if the object is empty', function(done) {
			var i = new Service();
			var success = function () {
				assert.equal(i.isComplete(), false, "The service is considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if the host is an empty string', function(done) {
			var i = new Service("test", "", "", true, "provider", "", 324);
			var success = function () {
				assert.equal(i.isComplete(), false, "The service is considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if the host is null', function(done) {
			var i = new Service("test", "", null, true, "provider", "", 324);
			var success = function () {
				assert.equal(i.isComplete(), false, "The service is considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if the provider is an empty string in case of oauth', function(done) {
			var i = new Service("test", "", "localhost", true, "", "", 324);
			var success = function () {
				assert.equal(i.isComplete(), false, "The service is considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if the provider is null in case of oauth', function(done) {
			var i = new Service("test", "", "localhost", true, null, "", 324);
			var success = function () {
				assert.equal(i.isComplete(), false, "The service is considered as complete.");
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
				"description": "tata",
				"host": "localhost",
				"oauth": true,
				"provider": "provider",
				"logo": "blarf",
				"complete": true
			};

			var callRetrieve = Service.fromJSONObject(json);
			var callExpected = new Service("toto","tata","localhost", true, "provider", "blarf", 42,true);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve call ("+callRetrieve+") does not match with the expected one ("+callExpected+")");
		});

		it('should create the right object even if it is partial', function() {
			var json = {
				"id": 42,
				"name": "toto",
				"description": "",
				"host": null,
				"oauth": true,
				"provider": "provider",
				"logo": "blup",
				"complete": false
			};

			var callRetrieve = Service.fromJSONObject(json);
			var callExpected = new Service("toto","",null, true, "provider", "blup", 42);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve call ("+callRetrieve+") does not match with the expected one ("+callExpected+")");
		});
	});

	describe('#toJsonObject', function() {
		it('should create the expected JSON Object', function() {
			var c = new Service("toto", "blabla", "blob", true,"provider", "tidum", 52);
			var expected = {
				"name": "toto",
				"description": "blabla",
				"host": "blob",
				"oauth": true,
				"provider": "provider",
				"logo": "tidum",
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
