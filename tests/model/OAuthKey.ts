/**
 * @author Christian Brel <christian@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../scripts/model/OAuthKey.ts" />

var assert = require("assert");
var nock : any = require("nock");
var sinon : SinonStatic = require("sinon");

describe('OAuthKey', function() {
    describe('#constructor', function () {
        it('should store the name', function () {
            var name = "machin";
            var c = new OAuthKey(name, "", "");
            assert.equal(c.name(), name, "The name is not stored correctly.");
        });

        it('should store the description', function () {
            var desc = "machin";
            var c = new OAuthKey("", desc, "");
            assert.equal(c.description(), desc, "The description is not stored correctly.");
        });

        it('should store the value', function () {
            var value = "valueTime";
            var c = new OAuthKey("", "", value);
            assert.equal(c.value(), value, "The value is not stored correctly.");
        });

        it('should store the ID', function () {
            var id = 52;
            var c = new OAuthKey("", "", "", id);
            assert.equal(c.getId(), id, "The ID is not stored.");
        });

        it('should store the complete value', function () {
            var c = new OAuthKey("test", "ba", "hey", 34, true);
            assert.equal(c.isComplete(), true, "The complete value is not stored.");
        });

        it('should assign a default false complete value', function () {
            var c = new OAuthKey("test", "ba", "hey", 34);
            assert.equal(c.isComplete(), false, "The complete value is not stored.");
        });
    });

    describe('#fromJSONobject', function () {
        it('should create the right object', function () {
            var json = {
                "id": 42,
                "name": "toto",
                "description": "blabla",
                "value": "heyhey",
                "complete": true
            };

            var callRetrieve = OAuthKey.fromJSONObject(json);
            var callExpected = new OAuthKey("toto", "blabla", "heyhey", 42, true);

            assert.deepEqual(callRetrieve, callExpected, "The retrieve OAuthKey (" + callRetrieve + ") does not match with the expected one (" + callExpected + ")");
        });

        it('should create the right object even if it is partial', function () {
            var json = {
                "id": 42,
                "name": "",
                "description": null,
                "value": null,
                "complete": false
            };

            var callRetrieve = OAuthKey.fromJSONObject(json);
            var callExpected = new OAuthKey("", null, null, 42);

            assert.deepEqual(callRetrieve, callExpected, "The retrieve OAuthKey (" + callRetrieve + ") does not match with the expected one (" + callExpected + ")");
        });
    });

    describe('#toJsonObject', function () {
        it('should create the expected JSON Object', function () {
            var c = new OAuthKey("toto", "blabla", "heyhey", 52, true);
            var expected = {
                "name": "toto",
                "description": "blabla",
                "value": "heyhey",
                "id": 52,
                "complete": true,
				"createdAt":null,
				"updatedAt":null
            };
            var json = c.toJSONObject();

            assert.deepEqual(json, expected, "The JSON object (" + JSON.stringify(json) + ") and the expected JSON (" + JSON.stringify(expected) + ") do not match.");
        })
    });

    describe('#checkCompleteness', function() {
        it('should consider the object as complete if it has an ID, a name and a complete Service', function(done) {
            var cpt = new OAuthKey("test","", "", 52);

            var response : any = {
                    "id":12,
                    "name": "service",
                    "description": "serviceDesc",
                    "host": "serviceHost",
					"oauth": true,
					"provider": "provider",
                    "complete": true
                };

            var restClientMock = nock(DatabaseConnection.getBaseURL())
                .get(DatabaseConnection.associationEndpoint(OAuthKey.getTableName(), cpt.getId().toString(), Service.getTableName()))
                .reply(200, JSON.stringify(response));

            var success = function() {
                assert.ok(restClientMock.isDone(), "The mock request has not been done to get the service");
                assert.equal(cpt.isComplete(), true, "The object should be considered as complete.");
                done();
            };

            var fail = function(err) {
                done(err);
            };

            cpt.checkCompleteness(success, fail);
        });

        it('should not consider the object as complete if it has an ID, a name and an Service which is not complete itself', function(done) {
            var cpt = new OAuthKey("test","", "", 52);

            var response : any = {
                    "id":12,
                    "name": "service",
                    "description": "serviceDesc",
                    "host": "serviceHost",
					"oauth": true,
					"provider": "provider",
                    "complete": false
                };

            var restClientMock = nock(DatabaseConnection.getBaseURL())
                .get(DatabaseConnection.associationEndpoint(OAuthKey.getTableName(), cpt.getId().toString(), Service.getTableName()))
                .reply(200, JSON.stringify(response));

            var success = function() {
                assert.ok(restClientMock.isDone(), "The mock request has not been done to get the type");
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

            var cpt = new OAuthKey("test","", "");

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

            var cpt = new OAuthKey("","", "", 52);

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

            var cpt = new OAuthKey(null,"", "", 52);

            var success = function() {
                assert.equal(cpt.isComplete(), false, "The object should not be considered as complete.");
                done();
            };

            var fail = function(err) {
                done(err);
            };

            cpt.checkCompleteness(success, fail);
        });

        it('should not consider the object as complete if it is empty', function(done) {
            nock.disableNetConnect();

            var cpt = new OAuthKey();

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

    describe('#linkService', function () {
        it('should call the right request', function (done) {
            var c = new OAuthKey("toto", "machin", "heyhey", 52);
            var s = new Service("service", "serviceDesc", "serviceHost", true, "provider", "logo", 42);
            var spy = sinon.spy(s, "desynchronize");

            var response1:any = [];

            var restClientMock1 = nock(DatabaseConnection.getBaseURL())
                .get(DatabaseConnection.associationEndpoint(OAuthKey.getTableName(), c.getId().toString(), Service.getTableName()))
                .reply(200, JSON.stringify(response1));

            var success = function() {
                var service = c.service();
                assert.equal(service, null, "The service is not a null value: " + JSON.stringify(service));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the service");

				var emptyResponse : any = {};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(OAuthKey.getTableName(), c.getId().toString(), Service.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));

                var success2 = function() {
                    //assert.ok(retour, "The return of the linkService is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the service in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.linkService(s.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadService(success, fail);
        });
    });

    describe('#unlinkService', function () {
        it('should call the right request', function (done) {
            var c = new OAuthKey("toto", "machin", "heyhey", 52);
            var s = new Service("service", "serviceDesc", "serviceHost", true, "provider", "logo", 42);

            var response1:any = s.toJSONObject();

            var restClientMock1 = nock(DatabaseConnection.getBaseURL())
                .get(DatabaseConnection.associationEndpoint(OAuthKey.getTableName(), c.getId().toString(), Service.getTableName()))
                .reply(200, JSON.stringify(response1));

            var success = function() {
                var service = c.service();
                assert.deepEqual(service, s, "The service is not the expected value");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the service");
                var spy = sinon.spy(service, "desynchronize");

				var emptyResponse : any = {};

				var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(OAuthKey.getTableName(), c.getId().toString(), Service.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));


                var success2 = function() {
                    //assert.ok(retour, "The return of the unlinkService is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.unlinkService(s.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadService(success, fail);
        });

    });

});