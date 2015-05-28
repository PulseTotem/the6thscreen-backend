
/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />

/// <reference path="../../scripts/core/DatabaseConnection.ts" />
/// <reference path="../../scripts/model/ThemeSDI.ts" />
/// <reference path="../../scripts/model/ThemeZone.ts" />

var assert = require("assert");
var nock = require("nock");

describe('ThemeSDI', function(){
	describe('#constructor', function() {
		it('should store the name', function(){
			var name = "machin";
			var c = new ThemeSDI(name);
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the description', function(){
			var description = "machin";
			var c = new ThemeSDI("", description);
			assert.equal(c.description(), description, "The description is not stored correctly.");
		});

		it('should store the defaultTheme value', function(){
			var defaultTheme = true;
			var c = new ThemeSDI("", "", defaultTheme);
			assert.equal(c.defaultTheme(), defaultTheme, "The defaultTheme is not stored correctly.");
		});

		it('should store the background', function(){
			var background = "red";
			var c = new ThemeSDI("", "", false, background);
			assert.equal(c.background(), background, "The background is not stored correctly.");
		});

		it('should store the font', function(){
			var font = "arial";
			var c = new ThemeSDI("", "", false, "", font);
			assert.equal(c.font(), font, "The font is not stored correctly.");
		});

		it('should store the color', function(){
			var color = "black";
			var c = new ThemeSDI("", "", false, "", "", color);
			assert.equal(c.color(), color, "The color is not stored correctly.");
		});

		it('should store the opacity', function(){
			var opacity = "10%";
			var c = new ThemeSDI("", "", false, "", "", "", opacity);
			assert.equal(c.opacity(), opacity, "The opacity is not stored correctly.");
		});


		it('should store the ID', function() {
			var id = 52;
			var c = new ThemeSDI("", "", false, "", "", "", "", id);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});

		it('should store the complete value', function() {
			var c = new ThemeSDI("", "", false, "", "", "", "", 12, true);
			assert.equal(c.isComplete(), true, "The complete attribute is not stored.");
		});

		it('should assign a default value to the complete attribute', function() {
			var c = new ThemeSDI("", "", false, "", "", "", "", 12, false);
			assert.equal(c.isComplete(), false, "The complete attribute is not stored.");
		});
	});

	describe('#checkCompleteness', function() {
		it('should consider the object as complete if it has an ID, a name and a complete ThemeZone', function(done) {
			var cpt = new ThemeSDI("Toto", "", false, "", "", "", "", 12);

			var response : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id":12,
					"name": "ThemeZone",
					"complete": true
				}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ThemeSDI.getTableName(), cpt.getId().toString(), ThemeZone.getTableName()))
				.reply(200, JSON.stringify(response));

			var success = function() {
				assert.ok(restClientMock.isDone(), "The mock request has not been done to get the ThemeZone");
				assert.equal(cpt.isComplete(), true, "The object should be considered as complete.");
				done();
			};

			var fail = function(err) {
				done(err);
			};

			cpt.checkCompleteness(success, fail);
		});

		it('should not consider the object as complete if it has an ID, a name and a ThemeZone which is not complete', function(done) {
			var cpt = new ThemeSDI("Toto", "", false, "", "", "", "", 12);

			var response : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id":12,
					"name": "ThemeZone",
					"complete": false
				}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ThemeSDI.getTableName(), cpt.getId().toString(), ThemeZone.getTableName()))
				.reply(200, JSON.stringify(response));

			var success = function() {
				assert.ok(restClientMock.isDone(), "The mock request has not been done to get the ThemeZone");
				assert.equal(cpt.isComplete(), false, "The object should not be considered as complete.");
				done();
			};

			var fail = function(err) {
				done(err);
			};

			cpt.checkCompleteness(success, fail);
		});

		it('should not consider the object as complete if it has no linked ThemeZone', function(done) {
			var cpt = new ThemeSDI("Toto", "", false, "", "", "", "", 43);

			var response : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ThemeSDI.getTableName(), cpt.getId().toString(), ThemeZone.getTableName()))
				.reply(200, JSON.stringify(response));

			var success = function() {
				assert.ok(restClientMock.isDone(), "The mock request has not been done to get the ThemeZone");
				assert.equal(cpt.isComplete(), false, "The object should not be considered as complete.");
				done();
			};

			var fail = function(err) {
				done(err);
			};

			cpt.checkCompleteness(success, fail);
		});

		it('should not consider the object as complete if it has no id', function(done) {
			nock.disableNetConnect();

			var cpt = new ThemeSDI("Toto", "", false, "", "", "", "");

			var success = function() {
				assert.equal(cpt.isComplete(), false, "The object should not be considered as complete.");
				done();
			};

			var fail = function(err) {
				done(err);
			};

			cpt.checkCompleteness(success, fail);
		});

		it('should not consider the object as complete if it has an empty name', function(done) {
			nock.disableNetConnect();

			var cpt = new ThemeSDI("", "", false, "", "", "", "", 12);

			var success = function() {
				assert.equal(cpt.isComplete(), false, "The object should not be considered as complete.");
				done();
			};

			var fail = function(err) {
				done(err);
			};

			cpt.checkCompleteness(success, fail);
		});

		it('should not consider the object as complete if it has a null name', function(done) {
			nock.disableNetConnect();

			var cpt = new ThemeSDI(null, "", false, "", "", "","", 12);

			var success = function() {
				assert.equal(cpt.isComplete(), false, "The object should not be considered as complete.");
				done();
			};

			var fail = function(err) {
				done(err);
			};

			cpt.checkCompleteness(success, fail);
		});

	});

	describe('#fromJSONobject', function() {
		it('should create the right object', function() {
			var json = {
				"id": 42,
				"name": "toto",
				"description": "tata",
				"defaultTheme": true,
				"background": "red",
				"font": "arial",
				"color": "black",
				"opacity": "24%",
				"complete": true
			};

			var callRetrieve = ThemeSDI.fromJSONObject(json);
			var callExpected = new ThemeSDI("toto", "tata", true, "red", "arial", "black", "24%", 42, true);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve themeSDI ("+callRetrieve+") does not match with the expected one ("+callExpected+")");
		});

		it('should create the right object even if it is partial', function() {
			var json = {
				"id": 42,
				"name": "toto",
				"description": "tata",
				"defaultTheme": false,
				"background": "red",
				"font": "arial",
				"color": "black",
				"opacity": "24%",
				"complete": false
			};

			var callRetrieve = ThemeSDI.fromJSONObject(json);
			var callExpected = new ThemeSDI("toto", "tata", false, "red", "arial","black", "24%", 42);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve themeSDI ("+callRetrieve+") does not match with the expected one ("+callExpected+")");
		});
	});

	describe('#toJsonObject', function() {
		it('should create the expected JSON Object', function() {
			var c = new ThemeSDI("toto", "truc", true, "black", "arial","red", "89%", 52, true);
			var expected = {
				"id": 52,
				"name": "toto",
				"description": "truc",
				"defaultTheme": true,
				"background": "black",
				"font": "arial",
				"color": "red",
				"opacity": "89%",
				"complete": true,
				"createdAt":null,
				"updatedAt":null
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object ("+JSON.stringify(json)+") and the expected JSON ("+JSON.stringify(expected)+") do not match.");
		})
	});

	describe('#linkThemeZone', function () {
		it('should call the right request', function (done) {
			var c = new ThemeSDI("toto", "truc", true, "black", "arial","black", "89%", 52);
			var s = new ThemeZone("toto", "truc", true, "black", "arial","black", "89%", "14px", 52);

			var response1:SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ThemeSDI.getTableName(), c.getId().toString(), ThemeZone.getTableName()))
				.reply(200, JSON.stringify(response1));

			var success = function () {
				var themeZone = c.themeZone();
				assert.equal(themeZone, null, "The themeZone is not a null value: " + JSON.stringify(themeZone));
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the service");

				var response2:SequelizeRestfulResponse = {
					"status": "success",
					"data": {}
				};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
					.put(DatabaseConnection.associatedObjectEndpoint(ThemeSDI.getTableName(), c.getId().toString(), ThemeZone.getTableName(), s.getId().toString()))
					.reply(200, JSON.stringify(response2));

				var success2 = function () {
					//assert.ok(retour, "The return of the setInfoType is false.");
					assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the service in database.");
					done();
				};

				var fail2 = function (err) {
					done(err);
				};

				c.linkThemeZone(s.getId(), success2, fail2);
			};

			var fail = function (err) {
				done(err);
			};

			c.loadThemeZone(success, fail);
		});

	});

	describe('#unlinkThemeZone', function () {
		it('should call the right request', function (done) {
			var c = new ThemeSDI("toto", "truc", true, "black", "arial","black", "89%", 52);
			var s = new ThemeZone("toto", "truc", true, "black", "arial","black", "89%", "14px", 52);

			var response1:SequelizeRestfulResponse = {
				"status": "success",
				"data": s.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ThemeSDI.getTableName(), c.getId().toString(), ThemeZone.getTableName()))
				.reply(200, JSON.stringify(response1));

			var success = function() {
				var themeZone = c.themeZone();
				assert.deepEqual(themeZone, s, "The themeZone is not the expected value");
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the service");
				var spy = sinon.spy(themeZone, "desynchronize");

				var response2:SequelizeRestfulResponse = {
					"status": "success",
					"data": {}
				};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
					.delete(DatabaseConnection.associatedObjectEndpoint(ThemeSDI.getTableName(), c.getId().toString(), ThemeZone.getTableName(), s.getId().toString()))
					.reply(200, JSON.stringify(response2));


				var success2 = function() {
					//assert.ok(retour, "The return of the unsetInfoType is false.");
					assert.ok(restClientMock2.isDone(), "The mock request has not been done.");
					done();
				};

				var fail2 = function(err) {
					done(err);
				};

				c.unlinkThemeZone(s.getId(), success2, fail2);
			};

			var fail = function(err) {
				done(err);
			};

			c.loadThemeZone(success, fail);
		});
	});
});
