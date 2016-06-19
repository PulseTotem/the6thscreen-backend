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
        it('should consider the object as complete if it has an ID, a name, a value and a complete Provider', function(done) {
            var cpt = new OAuthKey("test","", "mon token d'oauth", 52);

            var response : any = {
                    "id":12,
                    "name": "provider",
                    "description": "providerDesc",
                    "complete": true
                };

            var restClientMock = nock(BackendConfig.getDBBaseURL())
                .get(BackendConfig.associationEndpoint(OAuthKey.getTableName(), cpt.getId().toString(), Provider.getTableName()))
                .reply(200, JSON.stringify(response));

            var success = function() {
                assert.ok(restClientMock.isDone(), "The mock request has not been done to get the provider");
                assert.equal(cpt.isComplete(), true, "The object should be considered as complete.");
                done();
            };

            var fail = function(err) {
                done(err);
            };

            cpt.checkCompleteness(success, fail);
        });

        it('should not consider the object as complete if it has an ID, a name and a Provider which is not complete itself', function(done) {
            var cpt = new OAuthKey("test","", "mon token", 52);

            var response : any = {
                    "id":12,
                    "name": "provider",
                    "description": "provider",
                    "complete": false
                };

            var restClientMock = nock(BackendConfig.getDBBaseURL())
                .get(BackendConfig.associationEndpoint(OAuthKey.getTableName(), cpt.getId().toString(), Provider.getTableName()))
                .reply(200, JSON.stringify(response));

            var success = function() {
                assert.ok(restClientMock.isDone(), "The mock request has not been done to get the provider");
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

            var cpt = new OAuthKey("test","", "mon token");

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

            var cpt = new OAuthKey("","", "mon token", 52);

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

            var cpt = new OAuthKey(null,"", "mon token", 52);

            var success = function() {
                assert.equal(cpt.isComplete(), false, "The object should not be considered as complete.");
                done();
            };

            var fail = function(err) {
                done(err);
            };

            cpt.checkCompleteness(success, fail);
        });

        it('should not consider the object as complete if it has an empty value', function(done) {
            nock.disableNetConnect();

            var cpt = new OAuthKey("toto","", "", 52);

            var success = function() {
                assert.equal(cpt.isComplete(), false, "The object should not be considered as complete.");
                done();
            };

            var fail = function(err) {
                done(err);
            };

            cpt.checkCompleteness(success, fail);
        });

        it('should not consider the object as complete if it has a null value', function(done) {
            nock.disableNetConnect();

            var cpt = new OAuthKey("toto","", null, 52);

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

    describe('#linkProvider', function () {
        it('should call the right request', function (done) {
            var c = new OAuthKey("toto", "machin", "heyhey", 52);
            var s = new Provider("provider", "providerDesc", "logo", 42);

            var response1:any = [];

            var restClientMock1 = nock(BackendConfig.getDBBaseURL())
                .get(BackendConfig.associationEndpoint(OAuthKey.getTableName(), c.getId().toString(), Provider.getTableName()))
                .reply(200, JSON.stringify(response1));

            var success = function() {
                var provider = c.provider();
                assert.equal(provider, null, "The provider is not a null value: " + JSON.stringify(provider));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the provider");

				var emptyResponse : any = {};

				var restClientMock2 = nock(BackendConfig.getDBBaseURL())
                    .put(BackendConfig.associatedObjectEndpoint(OAuthKey.getTableName(), c.getId().toString(), Provider.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));

                var success2 = function() {
                    //assert.ok(retour, "The return of the linkService is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the provider in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.linkProvider(s.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadProvider(success, fail);
        });
    });

    describe('#unlinkProvider', function () {
        it('should call the right request', function (done) {
            var c = new OAuthKey("toto", "machin", "heyhey", 52);
            var s = new Provider("provider", "providerDesc", "logo", 42);

            var response1:any = s.toJSONObject();

            var restClientMock1 = nock(BackendConfig.getDBBaseURL())
                .get(BackendConfig.associationEndpoint(OAuthKey.getTableName(), c.getId().toString(), Provider.getTableName()))
                .reply(200, JSON.stringify(response1));

            var success = function() {
                var provider = c.provider();
                assert.deepEqual(provider, s, "The provider is not the expected value");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the provider");

				var emptyResponse : any = {};

				var restClientMock2 = nock(BackendConfig.getDBBaseURL())
                    .delete(BackendConfig.associatedObjectEndpoint(OAuthKey.getTableName(), c.getId().toString(), Provider.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));


                var success2 = function() {
                    //assert.ok(retour, "The return of the unlinkService is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.unlinkProvider(s.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadProvider(success, fail);
        });

    });

    describe('#addTeam', function () {
        it('should call the right request', function (done) {
            var c = new OAuthKey("toto", "machin", "heyhey", 52);
            var s = new Team("team", 42);

            var response1:any = [];

            var restClientMock1 = nock(BackendConfig.getDBBaseURL())
                .get(BackendConfig.associationEndpoint(OAuthKey.getTableName(), c.getId().toString(), Team.getTableName()))
                .reply(200, JSON.stringify(response1));

            var success = function() {
                var teams = c.teams();
                assert.deepEqual(teams, [], "The teams is not a null value: " + JSON.stringify(teams));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the teams");

                var emptyResponse : any = {};

                var restClientMock2 = nock(BackendConfig.getDBBaseURL())
                    .put(BackendConfig.associatedObjectEndpoint(OAuthKey.getTableName(), c.getId().toString(), Team.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));

                var success2 = function() {
                    //assert.ok(retour, "The return of the linkService is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the team in database.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.addTeam(s.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadTeams(success, fail);
        });
    });

    describe('#removeTeam', function () {
        it('should call the right request', function (done) {
            var c = new OAuthKey("toto", "machin", "heyhey", 52);
            var s = new Team("provider", 42);

            var response1:any = [s.toJSONObject()];

            var restClientMock1 = nock(BackendConfig.getDBBaseURL())
                .get(BackendConfig.associationEndpoint(OAuthKey.getTableName(), c.getId().toString(), Team.getTableName()))
                .reply(200, JSON.stringify(response1));

            var success = function() {
                var teams = c.teams();
                assert.deepEqual(teams, [s], "The teams is not the expected value");
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the teams");

                var emptyResponse : any = {};

                var restClientMock2 = nock(BackendConfig.getDBBaseURL())
                    .delete(BackendConfig.associatedObjectEndpoint(OAuthKey.getTableName(), c.getId().toString(), Team.getTableName(), s.getId().toString()))
                    .reply(200, JSON.stringify(emptyResponse));


                var success2 = function() {
                    //assert.ok(retour, "The return of the unlinkService is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done.");
                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.removeTeam(s.getId(), success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadTeams(success, fail);
        });

    });

});