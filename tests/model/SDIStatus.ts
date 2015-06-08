
/**
* @author Simon Urli <simon@the6thscreen.fr>
*/

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../scripts/core/DatabaseConnection.ts" />
/// <reference path="../../scripts/model/SDIStatus.ts" />
/// <reference path="../../scripts/model/Profil.ts" />
/// <reference path="../../scripts/model/SDI.ts" />

var assert = require("assert");
var nock = require("nock");
var sinon : SinonStatic = require("sinon");

describe('SDIStatus', function(){
	describe('#constructor', function() {
		it('should store the IP', function(){
			var IP = "machin";
			var c = new SDIStatus(IP);
			assert.equal(c.IP(), IP, "The IP is not stored correctly.");
		});

		it('should store the name', function(){
			var name = "toto";
			var c = new SDIStatus("", name);
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the online status', function(){
			var online = true;
			var c = new SDIStatus("", "", online);
			assert.equal(c.online(), online, "The online property is not stored correctly.");
		});

		it('should store the last online property', function(){
			var lastOnline = new Date();
			var c = new SDIStatus("", "", false, lastOnline);
			assert.equal(c.lastOnline(), lastOnline, "The lastOnline property is not stored correctly.");
		});

		it('should store the ID', function() {
			var id = 52;
			var c = new SDIStatus("", "", false, new Date(), 52);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});

		it('should store the complete value', function() {
			var c = new SDIStatus("", "", false, new Date(), 52,true);
			assert.equal(c.isComplete(), true, "The complete value is not stored.");
		});

		it('should assign a default complete value to false', function() {
			var c = new SDIStatus();
			assert.equal(c.isComplete(), false, "The complete value is not stored.");
		});
	});

	describe('#checkCompleteness', function() {
		it('should specify the object is complete if a IP and an ID are given', function(done) {
			var i = new SDIStatus("vlab", "", false, new Date(), 324);
			var success = function () {
				assert.equal(i.isComplete(), true, "The SDIStatus is not considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if the IP is an empty string', function(done) {
			var i = new SDIStatus("", "", false, new Date(), 324);
			var success = function () {
				assert.equal(i.isComplete(), false, "The SDIStatus is considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if the IP is null', function(done) {
			var i = new SDIStatus(null, "", false, new Date(), 324);
			var success = function () {
				assert.equal(i.isComplete(), false, "The SDIStatus is considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if the id is null', function(done) {
			var i = new SDIStatus("test");
			var success = function () {
				assert.equal(i.isComplete(), false, "The SDIStatus is considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if the object is empty', function(done) {
			var i = new SDIStatus();
			var success = function () {
				assert.equal(i.isComplete(), false, "The SDIStatus is considered as complete.");
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
			var date = new Date();
			var json = {
				"id": 42,
				"IP": "toto",
				"name": "bub",
				"online": true,
				"lastOnline": date,
				"complete": true
			};

			var callRetrieve = SDIStatus.fromJSONObject(json);
			var callExpected = new SDIStatus("toto", "bub", true, date, 42,true);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve call ("+callRetrieve+") does not match with the expected one ("+callExpected+")");
		});

		it('should create the right object even if it is partial', function() {
			var json = {
				"id": 42,
				"IP": "",
				"name": "toto",
				"online": false,
				"lastOnline": null,
				"complete": false
			};

			var callRetrieve = SDIStatus.fromJSONObject(json);
			var callExpected = new SDIStatus("","toto", false, null, 42);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve call ("+callRetrieve+") does not match with the expected one ("+callExpected+")");
		});
	});

	describe('#toJsonObject', function() {
		it('should create the expected JSON Object', function() {
			var date = new Date();
			var c = new SDIStatus("toto", "tutu", true, date, 52);
			var expected = {
				"IP": "toto",
				"name": "tutu",
				"online": true,
				"lastOnline": date,
				"id": 52,
				"complete": false,
				"createdAt":null,
				"updatedAt":null
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object ("+JSON.stringify(json)+") and the expected JSON ("+JSON.stringify(expected)+") do not match.");
		})
	});

	describe('#linkProfil', function () {
		it('should call the right request', function (done) {
			var c = new SDIStatus("toto","", false, new Date(), 52);
			var s = new Profil("toto", "machin", 42);
			var spy = sinon.spy(s, "desynchronize");

			var response1:SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(SDIStatus.getTableName(), c.getId().toString(), Profil.getTableName()))
				.reply(200, JSON.stringify(response1));

			var success = function() {
				var profil = c.profil();
				assert.equal(profil, null, "The Profil is not a null value: " + JSON.stringify(profil));
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the Profil");

				var response2:SequelizeRestfulResponse = {
					"status": "success",
					"data": {}
				};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
					.put(DatabaseConnection.associatedObjectEndpoint(SDIStatus.getTableName(), c.getId().toString(), Profil.getTableName(), s.getId().toString()))
					.reply(200, JSON.stringify(response2));

				var success2 = function() {
					//assert.ok(retour, "The return of the linkProfil is false.");
					assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the Profil in database.");
					done();
				};

				var fail2 = function(err) {
					done(err);
				};

				c.linkProfil(s.getId(), success2, fail2);
			};

			var fail = function(err) {
				done(err);
			};

			c.loadProfil(success, fail);
		});
	});

	describe('#unlinkProfil', function () {
		it('should call the right request', function (done) {
			var c = new SDIStatus("toto","", false, new Date(), 52);
			var s = new Profil("toto","machin", 42);

			var response1:SequelizeRestfulResponse = {
				"status": "success",
				"data": s.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(SDIStatus.getTableName(), c.getId().toString(), Profil.getTableName()))
				.reply(200, JSON.stringify(response1));

			var success = function() {
				var profil = c.profil();
				assert.deepEqual(profil, s, "The Profil is not the expected value");
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the Profil");
				var spy = sinon.spy(profil, "desynchronize");

				var response2:SequelizeRestfulResponse = {
					"status": "success",
					"data": {}
				};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
					.delete(DatabaseConnection.associatedObjectEndpoint(SDIStatus.getTableName(), c.getId().toString(), Profil.getTableName(), s.getId().toString()))
					.reply(200, JSON.stringify(response2));


				var success2 = function() {
					//assert.ok(retour, "The return of the unlinkProfil is false.");
					assert.ok(restClientMock2.isDone(), "The mock request has not been done.");
					done();
				};

				var fail2 = function(err) {
					done(err);
				};

				c.unlinkProfil(s.getId(), success2, fail2);
			};

			var fail = function(err) {
				done(err);
			};

			c.loadProfil(success, fail);
		});

	});

	describe('#linkSDI', function () {
		it('should call the right request', function (done) {
			var c = new SDIStatus("toto","", false, new Date(), 52);
			var s = new SDI("toto", "machin", "", 42);
			var spy = sinon.spy(s, "desynchronize");

			var response1:SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(SDIStatus.getTableName(), c.getId().toString(), SDI.getTableName()))
				.reply(200, JSON.stringify(response1));

			var success = function() {
				var sdi = c.sdi();
				assert.equal(sdi, null, "The SDI is not a null value: " + JSON.stringify(sdi));
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the SDI");

				var response2:SequelizeRestfulResponse = {
					"status": "success",
					"data": {}
				};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
					.put(DatabaseConnection.associatedObjectEndpoint(SDIStatus.getTableName(), c.getId().toString(), SDI.getTableName(), s.getId().toString()))
					.reply(200, JSON.stringify(response2));

				var success2 = function() {
					//assert.ok(retour, "The return of the linkSDI is false.");
					assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the SDI in database.");
					done();
				};

				var fail2 = function(err) {
					done(err);
				};

				c.linkSDI(s.getId(), success2, fail2);
			};

			var fail = function(err) {
				done(err);
			};

			c.loadSDI(success, fail);
		});
	});

	describe('#unlinkSDI', function () {
		it('should call the right request', function (done) {
			var c = new SDIStatus("toto","", false, new Date(), 52);
			var s = new SDI("toto","machin", "", 42);

			var response1:SequelizeRestfulResponse = {
				"status": "success",
				"data": s.toJSONObject()
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(SDIStatus.getTableName(), c.getId().toString(), SDI.getTableName()))
				.reply(200, JSON.stringify(response1));

			var success = function() {
				var sdi = c.sdi();
				assert.deepEqual(sdi, s, "The SDI is not the expected value");
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the SDI");
				var spy = sinon.spy(sdi, "desynchronize");

				var response2:SequelizeRestfulResponse = {
					"status": "success",
					"data": {}
				};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
					.delete(DatabaseConnection.associatedObjectEndpoint(SDIStatus.getTableName(), c.getId().toString(), SDI.getTableName(), s.getId().toString()))
					.reply(200, JSON.stringify(response2));


				var success2 = function() {
					//assert.ok(retour, "The return of the unlinkSDI is false.");
					assert.ok(restClientMock2.isDone(), "The mock request has not been done.");
					done();
				};

				var fail2 = function(err) {
					done(err);
				};

				c.unlinkSDI(s.getId(), success2, fail2);
			};

			var fail = function(err) {
				done(err);
			};

			c.loadSDI(success, fail);
		});

	});
});