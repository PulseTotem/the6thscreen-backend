
/**
* @author Simon Urli <simon@the6thscreen.fr>
*/

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../scripts/core/BackendConfig.ts" />
/// <reference path="../../scripts/model/Client.ts" />
/// <reference path="../../scripts/model/Profil.ts" />
/// <reference path="../../scripts/model/SDI.ts" />

var assert = require("assert");
var nock = require("nock");
var sinon : SinonStatic = require("sinon");

describe('Client', function(){
	describe('#constructor', function() {
		it('should store the IP', function(){
			var IP = "machin";
			var c = new Client(IP);
			assert.equal(c.IP(), IP, "The IP is not stored correctly.");
		});

		it('should store the socketID', function(){
			var socketID = "toto";
			var c = new Client("", socketID);
			assert.equal(c.socketID(), socketID, "The socketID is not stored correctly.");
		});

		it('should store the ID', function() {
			var id = 52;
			var c = new Client("", "", 52);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});

		it('should store the complete value', function() {
			var c = new Client("", "", 52,true);
			assert.equal(c.isComplete(), true, "The complete value is not stored.");
		});

		it('should assign a default complete value to false', function() {
			var c = new Client();
			assert.equal(c.isComplete(), false, "The complete value is not stored.");
		});
	});

	describe('#checkCompleteness', function() {
		it('should specify the object is complete if a IP and an ID are given', function(done) {
			var i = new Client("::1", "", 324);
			var success = function () {
				assert.equal(i.isComplete(), true, "The Client is not considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if the IP is an empty string', function(done) {
			var i = new Client("", "", 324);
			var success = function () {
				assert.equal(i.isComplete(), false, "The Client is considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if the IP is null', function(done) {
			var i = new Client(null, "", 324);
			var success = function () {
				assert.equal(i.isComplete(), false, "The Client is considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if the id is null', function(done) {
			var i = new Client("test");
			var success = function () {
				assert.equal(i.isComplete(), false, "The Client is considered as complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			i.checkCompleteness(success, fail);
		});

		it('should not specify the object is complete if the object is empty', function(done) {
			var i = new Client();
			var success = function () {
				assert.equal(i.isComplete(), false, "The Client is considered as complete.");
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
				"ip": "toto",
				"socketId": "bub",
				"complete": true
			};

			var callRetrieve = Client.fromJSONObject(json);
			var callExpected = new Client("toto", "bub", 42,true);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve call ("+callRetrieve+") does not match with the expected one ("+callExpected+")");
		});

		it('should create the right object even if it is partial', function() {
			var json = {
				"id": 42,
				"ip": "",
				"socketId": "toto",
				"complete": false
			};

			var callRetrieve = Client.fromJSONObject(json);
			var callExpected = new Client("","toto", 42);

			assert.deepEqual(callRetrieve, callExpected, "The retrieve call ("+callRetrieve+") does not match with the expected one ("+callExpected+")");
		});
	});

	describe('#toJsonObject', function() {
		it('should create the expected JSON Object', function() {
			var date = new Date();
			var c = new Client("toto", "tutu", 52);
			var expected = {
				"ip": "toto",
				"socketId": "tutu",
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
			var c = new Client("toto","", 52);
			var s = new Profil("toto", "42", "machin", 42);

			var response1:any = [];

			var restClientMock1 = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(Client.getTableName(), c.getId().toString(), Profil.getTableName()))
				.reply(200, JSON.stringify(response1));

			var success = function() {
				var profil = c.profil();
				assert.equal(profil, null, "The Profil is not a null value: " + JSON.stringify(profil));
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the Profil");

				var emptyResponse : any = {};

				var restClientMock2 = nock(BackendConfig.getDBBaseURL())
					.put(BackendConfig.associatedObjectEndpoint(Client.getTableName(), c.getId().toString(), Profil.getTableName(), s.getId().toString()))
					.reply(200, JSON.stringify(emptyResponse));

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
			var c = new Client("toto","", 52);
			var s = new Profil("toto", "42", "machin", 42);

			var response1:any = s.toJSONObject();

			var restClientMock1 = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(Client.getTableName(), c.getId().toString(), Profil.getTableName()))
				.reply(200, JSON.stringify(response1));

			var success = function() {
				var profil = c.profil();
				assert.deepEqual(profil, s, "The Profil is not the expected value");
				assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the Profil");

				var emptyResponse : any = {};

				var restClientMock2 = nock(BackendConfig.getDBBaseURL())
					.delete(BackendConfig.associatedObjectEndpoint(Client.getTableName(), c.getId().toString(), Profil.getTableName(), s.getId().toString()))
					.reply(200, JSON.stringify(emptyResponse));


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
});