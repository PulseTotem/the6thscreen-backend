/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../scripts/model/Timeline.ts" />

var assert = require("assert");
var nock : any = require("nock");
var sinon : SinonStatic = require("sinon");

describe('Timeline', function() {
	describe('#constructor', function () {
		it('should throw an error if the name is undefined', function(){
			assert.throws(
				function() {
					new Timeline(undefined);
				},
				ModelException,
				"The exception has not been thrown."
			);
		});

		it('should throw an error if the name is null', function(){
			assert.throws(
				function() {
					new Timeline(null);
				},
				ModelException,
				"The exception has not been thrown."
			);
		});

		it('should throw an error if the name is empty', function(){
			assert.throws(
				function() {
					new Timeline("");
				},
				ModelException,
				"The exception has not been thrown."
			);
		});

		it('should store the name', function () {
			var name = "machin";
			var c = new Timeline(name, "");
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the description', function () {
			var desc = "machin";
			var c = new Timeline("toto", desc);
			assert.equal(c.description(), desc, "The description is not stored correctly.");
		});

		it('should store the ID', function () {
			var id = 52;
			var c = new Timeline("tata", "", id);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});
	});

	describe('#fromJSONobject', function () {
		it('should create the right object', function () {
			var json = {
				"id": 42,
				"name": "toto",
				"description": "blabla"
			};

			var profilRetrieve = Timeline.fromJSONObject(json);
			var profilExpected = new Timeline("toto", "blabla", 42);

			assert.deepEqual(profilRetrieve, profilExpected, "The retrieve timeline (" + profilRetrieve + ") does not match with the expected one (" + profilExpected + ")");
		});

		it('should throw an exception if the ID is undefined', function () {
			var json = {
				"name": "toto",
				"description": "blabla"
			};

			assert.throws(function () {
					Timeline.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the ID is null', function () {
			var json = {
				"name": "toto",
				"description": "blabla",
				"id": null
			};

			assert.throws(function () {
					Timeline.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the name is undefined', function () {
			var json = {
				"id": 52,
				"description": "blabla"
			};

			assert.throws(function () {
					Timeline.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the name is null', function () {
			var json = {
				"name": null,
				"description": "blabla",
				"id": 42
			};

			assert.throws(function () {
					Timeline.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the description is undefined', function () {
			var json = {
				"id": 52,
				"name": "blabla"
			};

			assert.throws(function () {
					Timeline.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});

		it('should throw an exception if the description is null', function () {
			var json = {
				"description": null,
				"name": "blabla",
				"id": 42
			};

			assert.throws(function () {
					Timeline.fromJSONObject(json);
				},
				ModelException, "The exception has not been thrown.");
		});
	});

	describe('#toJsonObject', function () {
		it('should create the expected JSON Object', function () {
			var c = new Timeline("toto", "blabla", 52);
			var expected = {
				"name": "toto",
				"description": "blabla",
				"id": 52
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object (" + JSON.stringify(json) + ") and the expected JSON (" + JSON.stringify(expected) + ") do not match.");
		})
	});

	describe('#addProfil', function() {
		it('should put the new Profil inside the array', function(done) {
			var c = new Timeline("toto", "blabla", 52);
			var pv = new Profil("mavaleur", "toto", 12);
			var spy = sinon.spy(pv, "desynchronize");

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Timeline.getTableName(), c.getId().toString(), Profil.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var profils = c.profils();

                assert.deepEqual(profils, [], "The profil is not an empty array: "+JSON.stringify(profils));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the profils");

                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .put(DatabaseConnection.associatedObjectEndpoint(Timeline.getTableName(), c.getId().toString(), Profil.getTableName(), pv.getId().toString()))
                    .reply(200, JSON.stringify(response2));

                var success2 = function() {
                    //assert.ok(retour, "The return of the addProfil is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the profil in database.");

                    profils = c.profils();
                    var expected = [pv];
                    assert.deepEqual(profils, expected, "The profils is not an array containing only the added profil: "+JSON.stringify(profils));
                    assert.ok(spy.calledOnce, "The desynchronize method was not profiled once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.addProfil(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };


			c.loadProfils(success, fail);
		});

		it('should not allow to add a null object', function(done) {
			nock.disableNetConnect();
			var c = new Timeline("toto", "blabla", 52);

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.addProfil(null, success, fail);
		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new Timeline("toto", "blabla", 52);

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.addProfil(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new Timeline("toto", "blabla", 52);
			var p = new Profil("bidule", "toto");

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.addProfil(p, success, fail);
		});

		it('should not allow to put an already existing object', function(done) {
			var c = new Timeline("toto", "blabla", 52);
			var pv = new Profil("toto", "titi", 13);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": [
					{
						"id":13,
						"name": "toto",
						"description": "titi"
					},
					{
						"id": 14,
						"name": "titi",
						"description": "blabla"
					}
				]
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Timeline.getTableName(), c.getId().toString(), Profil.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the profils");

                var success2 = function() {
                    done(new Error("Test failed."));
                };

                var fail2 = function(err) {
                    assert.throws(function() {
                            if(err) {
                                throw err;
                            }
                        },
                        ModelException, "The ModelException has not been thrown.");
                    done();
                };

                c.addProfil(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadProfils(success, fail);
		});

	});

	describe('#removeProfil', function() {
		it('should remove the Profil from the array', function(done) {
			var c = new Timeline("toto", "blabla", 52);
			var pv = new Profil("mavaleur","blabla", 12);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": [
					{
						"name": "mavaleur",
						"description": "blabla",
						"id": 12
					}
				]
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Timeline.getTableName(), c.getId().toString(), Profil.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                var profils = c.profils();

                assert.deepEqual(profils, [pv], "The profil array is not an array fill only with PV: "+JSON.stringify(profils));
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the profils");

                var spy = sinon.spy(pv, "desynchronize");
                var response2 : SequelizeRestfulResponse = {
                    "status": "success",
                    "data": {}
                };

                var restClientMock2 = nock(DatabaseConnection.getBaseURL())
                    .delete(DatabaseConnection.associatedObjectEndpoint(Timeline.getTableName(), c.getId().toString(), Profil.getTableName(), pv.getId().toString()))
                    .reply(200, JSON.stringify(response2));

                var success2 = function() {
                    //assert.ok(retour, "The return of the removeProfil is false.");
                    assert.ok(restClientMock2.isDone(), "The mock request has not been done to associate the profil in database.");

                    profils = c.profils();
                    assert.deepEqual(profils, [], "The profils is not an empty array: "+JSON.stringify(profils));
                    assert.ok(spy.calledOnce, "The desynchronize method was not profiled once.");

                    done();
                };

                var fail2 = function(err) {
                    done(err);
                };

                c.removeProfil(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

			c.loadProfils(success, fail);
		});

		it('should not allow to remove a null object', function(done) {
			nock.disableNetConnect();
			var c = new Timeline("toto", "blabla", 52);

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.removeProfil(null, success, fail);
		});

		it('should not allow to add an undefined object', function(done) {
			nock.disableNetConnect();
			var c = new Timeline("toto", "blabla", 52);

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.removeProfil(undefined, success, fail);
		});

		it('should not allow to add a object which is not yet created', function(done) {
			nock.disableNetConnect();
			var c = new Timeline("toto", "blabla", 52);
			var p = new Profil("bidule","blop");

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    ModelException, "The ModelException has not been thrown.");
                done();
            };

            c.removeProfil(p, success, fail);
		});

		it('should not allow to remove an object which is not linked', function(done) {
			var c = new Timeline("toto", "blabla", 52);
			var pv = new Profil("toto","budu",12);

			var response1 : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock1 = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(Timeline.getTableName(), c.getId().toString(), Profil.getTableName()))
				.reply(200, JSON.stringify(response1));

            var success = function() {
                assert.ok(restClientMock1.isDone(), "The mock request has not been done to get the profils");

                var success2 = function() {
                    done(new Error("Test failed."));
                };

                var fail2 = function(err) {
                    assert.throws(function() {
                            if(err) {
                                throw err;
                            }
                        },
                        ModelException, "The ModelException has not been thrown.");
                    done();
                };

                c.removeProfil(pv, success2, fail2);
            };

            var fail = function(err) {
                done(err);
            };

            c.loadProfils(success, fail);
		});

	});
});