
/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />

/// <reference path="../../scripts/core/DatabaseConnection.ts" />
/// <reference path="../../scripts/model/ThemeZone.ts" />

var assert = require("assert");
var nock = require("nock");

describe('ThemeZone', function(){
	describe('#constructor', function() {
		it('should store the name', function(){
			var name = "machin";
			var c = new ThemeZone(name);
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the description', function(){
			var description = "machin";
			var c = new ThemeZone("", description);
			assert.equal(c.description(), description, "The description is not stored correctly.");
		});

		it('should store the defaultTheme value', function(){
			var defaultTheme = true;
			var c = new ThemeZone("", "", defaultTheme);
			assert.equal(c.defaultTheme(), defaultTheme, "The defaultTheme is not stored correctly.");
		});

		it('should store the background', function(){
			var background = "red";
			var c = new ThemeZone("", "", false, background);
			assert.equal(c.background(), background, "The background is not stored correctly.");
		});

		it('should store the font', function(){
			var font = "arial";
			var c = new ThemeZone("", "", false, "", font);
			assert.equal(c.font(), font, "The font is not stored correctly.");
		});

		it('should store the opacity', function(){
			var opacity = "10%";
			var c = new ThemeZone("", "", false, "", "", opacity);
			assert.equal(c.opacity(), opacity, "The opacity is not stored correctly.");
		});

		it('should store the border', function(){
			var border = "1px";
			var c = new ThemeZone("", "", false, "", "", "", border);
			assert.equal(c.border(), border, "The border is not stored correctly.");
		});


		it('should store the ID', function() {
			var id = 52;
			var c = new ThemeZone("", "", false, "", "", "", "", id);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});

		it('should store the complete value', function() {
			var c = new ThemeZone("", "", false, "", "", "", "", 12, true);
			assert.equal(c.isComplete(), true, "The complete attribute is not stored.");
		});

		it('should assign a default value to the complete attribute', function() {
			var c = new ThemeZone("", "", false, "", "", "", "", 12, false);
			assert.equal(c.isComplete(), false, "The complete attribute is not stored.");
		});
	});

	describe('#checkCompleteness', function() {
		it('should specify the object is complete even if it is completely empty', function(done) {
			var c = new ThemeZone("", "", false, "", "", "", "");
			var success = function () {
				assert.equal(i.isComplete(), true, "The ThemeZone is not considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should specify the object is complete if a name, an host, a provider and an ID are given in case of oauth', function(done) {
			var i = new ThemeZone("name", "", "localhost", true, "provider", "", 324);
			var success = function () {
				assert.equal(i.isComplete(), true, "The ThemeZone is not considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if the name is an empty string', function(done) {
			var i = new ThemeZone("", "", "localhost", true, "provider", "", 324);
			var success = function () {
				assert.equal(i.isComplete(), false, "The themeZone is considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if the name is null', function(done) {
			var i = new ThemeZone(null, "", "localhost", true, "provider", "", 324);
			var success = function () {
				assert.equal(i.isComplete(), false, "The themeZone is considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if the id is null', function(done) {
			var i = new ThemeZone("name", "", "localhost", true, "provider", "", null);
			var success = function () {
				assert.equal(i.isComplete(), false, "The themeZone is considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if the object is empty', function(done) {
			var i = new ThemeZone();
			var success = function () {
				assert.equal(i.isComplete(), false, "The themeZone is considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if the host is an empty string', function(done) {
			var i = new ThemeZone("test", "", "", true, "provider", "", 324);
			var success = function () {
				assert.equal(i.isComplete(), false, "The themeZone is considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if the host is null', function(done) {
			var i = new ThemeZone("test", "", null, true, "provider", "", 324);
			var success = function () {
				assert.equal(i.isComplete(), false, "The themeZone is considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if the provider is an empty string in case of oauth', function(done) {
			var i = new ThemeZone("test", "", "localhost", true, "", "", 324);
			var success = function () {
				assert.equal(i.isComplete(), false, "The themeZone is considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if the provider is null in case of oauth', function(done) {
			var i = new ThemeZone("test", "", "localhost", true, null, "", 324);
			var success = function () {
				assert.equal(i.isComplete(), false, "The themeZone is considered as complete.");
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

			var callRetrieve = ThemeZone.fromJSONObject(json);
			var callExpected = new ThemeZone("toto","tata","localhost", true, "provider", "blarf", 42,true);

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

			var callRetrieve = ThemeZone.fromJSONObject(json);
			var callExpected = new ThemeZone("toto","",null, true, "provider", "blup", 42);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve call ("+callRetrieve+") does not match with the expected one ("+callExpected+")");
		});
	});

	describe('#toJsonObject', function() {
		it('should create the expected JSON Object', function() {
			var c = new ThemeZone("toto", "blabla", "blob", true,"provider", "tidum", 52);
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
