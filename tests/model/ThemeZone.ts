
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

		it('should store the backgroundImageURL', function(){
			var backgroundImageURL = "http://example.com/background.png";
			var c = new ThemeSDI("", "", false, backgroundImageURL);
			assert.equal(c.backgroundImageURL(), backgroundImageURL, "The backgroundImageURL is not stored correctly.");
		});

		it('should store the backgroundColor', function(){
			var backgroundColor = "red";
			var c = new ThemeSDI("", "", false, "", backgroundColor);
			assert.equal(c.backgroundColor(), backgroundColor, "The backgroundColor is not stored correctly.");
		});

		it('should store the font', function(){
			var font = "arial";
			var c = new ThemeZone("", "", false, "", "", font);
			assert.equal(c.font(), font, "The font is not stored correctly.");
		});

		it('should store the color', function(){
			var color = "red";
			var c = new ThemeZone("", "", false, "", "", "", color);
			assert.equal(c.color(), color, "The color is not stored correctly.");
		});

		it('should store the opacity', function(){
			var opacity = "10%";
			var c = new ThemeZone("", "", false, "", "","", "", opacity);
			assert.equal(c.opacity(), opacity, "The opacity is not stored correctly.");
		});

		it('should store the border', function(){
			var border = "1px";
			var c = new ThemeZone("", "", false, "", "", "", "", "", border);
			assert.equal(c.border(), border, "The border is not stored correctly.");
		});


		it('should store the ID', function() {
			var id = 52;
			var c = new ThemeZone("", "", false, "", "", "", "", "","", id);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});

		it('should store the complete value', function() {
			var c = new ThemeZone("", "", false, "", "", "", "", "", "", 12, true);
			assert.equal(c.isComplete(), true, "The complete attribute is not stored.");
		});

		it('should assign a default value to the complete attribute', function() {
			var c = new ThemeZone("", "", false, "", "", "", "", "", "", 12, false);
			assert.equal(c.isComplete(), false, "The complete attribute is not stored.");
		});
	});

	describe('#checkCompleteness', function() {
		it('should specify the object is complete if it has a name and an ID', function(done) {
			var c = new ThemeZone("toto", "", false, "", "", "", "", "", "",12);
			var success = function () {
				assert.equal(c.isComplete(), true, "The ThemeZone is not considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			c.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if it has no ID', function(done) {
			var c = new ThemeZone("toto", "", false, "", "", "", "", "");
			var success = function () {
				assert.equal(c.isComplete(), false, "The ThemeZone is not considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			c.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if it has an empty name and an ID', function(done) {
			var c = new ThemeZone("", "", false, "", "", "", "", "","",12);
			var success = function () {
				assert.equal(c.isComplete(), false, "The ThemeZone is not considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			c.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if it has a null name and an ID', function(done) {
			var c = new ThemeZone(null, "", false, "", "", "", "", "","",12);
			var success = function () {
				assert.equal(c.isComplete(), false, "The ThemeZone is not considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			c.checkCompleteness(success, fail);
		});
	});

	describe('#fromJSONobject', function() {
		it('should create the right object', function() {
			var json = {
				"id": 42,
				"name": "toto",
				"description": "tata",
				"defaultTheme": true,
				"backgroundImageURL": "http://example.com/background.png",
				"backgroundColor": "red",
				"font": "arial",
				"color": "black",
				"opacity": "24%",
				"border": "1px",
				"complete": true
			};

			var callRetrieve = ThemeZone.fromJSONObject(json);
			var callExpected = new ThemeZone("toto", "tata", true, "http://example.com/background.png", "red", "arial", "black", "24%", "1px", 42, true);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve themeZone ("+callRetrieve+") does not match with the expected one ("+callExpected+")");
		});

		it('should create the right object even if it is partial', function() {
			var json = {
				"id": 42,
				"name": "toto",
				"description": "tata",
				"defaultTheme": false,
				"backgroundImageURL": "http://example.com/background.png",
				"backgroundColor": "red",
				"font": "arial",
				"color": "black",
				"opacity": "24%",
				"border": "",
				"complete": false
			};

			var callRetrieve = ThemeZone.fromJSONObject(json);
			var callExpected = new ThemeZone("toto", "tata", false, "http://example.com/background.png", "red", "arial", "black", "24%", "", 42);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve themeZone ("+callRetrieve+") does not match with the expected one ("+callExpected+")");
		});
	});

	describe('#toJsonObject', function() {
		it('should create the expected JSON Object', function() {
			var c = new ThemeZone("toto", "truc", true, "http://example.com/background.png", "black", "arial", "black", "89%", "14px", 52, true);
			var expected = {
				"id": 52,
				"name": "toto",
				"description": "truc",
				"defaultTheme": true,
				"backgroundImageURL": "http://example.com/background.png",
				"backgroundColor": "black",
				"font": "arial",
				"color": "black",
				"opacity": "89%",
				"border": "14px",
				"complete": true,
				"createdAt":null,
				"updatedAt":null
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object ("+JSON.stringify(json)+") and the expected JSON ("+JSON.stringify(expected)+") do not match.");
		})
	});

	describe("#clone", function() {
		it('should create the same object with a different ID', function (done) {
			var toClone = new ThemeZone("toto", "truc", true, "http://example.com/background.png", "black", "arial", "black", "89%", "14px", 52, true);
			var toCloneJSON : any = toClone.toJSONObject();
			toCloneJSON.id = null;
			var expected = new ThemeZone("toto", "truc", true, "http://example.com/background.png", "black", "arial", "black", "89%", "14px", 98, true);

			var response : SequelizeRestfulResponse = {
				"status": "success",
				"data": expected.toJSONObject()
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.post(DatabaseConnection.modelEndpoint(ThemeZone.getTableName()), toCloneJSON)
				.reply(200, JSON.stringify(response));

			var success = function(obtainedData : any) {
				//assert.ok(retour, "The creation did not return true");
				assert.ok(restClientMock.isDone(), "The mock request has not been done.");
				assert.equal(obtainedData.id, expected.getId(), "The ID is not recorded in the object : "+obtainedData.id);
				assert.notEqual(toClone.getId(), obtainedData.id, "The ID of original object and created one are different.");
				done();
			};

			var fail = function(err) {
				done(err);
			};

			toClone.clone(success, fail)
		})
	})
});
