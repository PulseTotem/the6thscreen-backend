/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />

/// <reference path="../../scripts/core/BackendConfig.ts" />
/// <reference path="../../scripts/model/ModelItf.ts" />

var assert = require("assert");
var nock : any = require("nock");

describe('ModelItf', function() {
    beforeEach(function() {
        nock.cleanAll();
    });

	describe('#constructor(id)', function() {
		it('should store the given id', function() {
			var id = 12;
			var model = new ModelItf(id);

			assert.equal(model.getId(), id, "The id is not correctly stored.");
		});

		it('should give a null id if an undefined argument is given', function() {
			var model = new ModelItf(undefined);
			assert.equal(model.getId(), null, "The id is not null");
		});

		it('should store the given complete attribute', function() {
			var model = new ModelItf(12,true);

			assert.equal(model.isComplete(), true, "The boolean complete is not correctly stored.");
		});

		it('should assign a false value if complete is not given ', function() {
			var model = new ModelItf();
			assert.equal(model.isComplete(), false, "The complete is not false");
		});
	});

	describe('#checkCompleteness()', function() {
		it('should compute true if an id is given', function(done) {
			var model = new ModelItf(24);
			var success = function () {
				assert.equal(model.isComplete(), true, "The object is not considered as complete but it should be.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			model.checkCompleteness(success, fail);
		});

		it('should return false if an id is not given', function(done) {
			var model = new ModelItf();
			var success = function () {
				assert.equal(model.isComplete(), false, "The object is considered as complete but it should not be.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			model.checkCompleteness(success, fail);
		})
	});

	describe('#createObject()', function() {
		it('should throw an error if the object already has an id', function(done) {
			var model = new ModelItf(42);

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

            model.createObject(ModelItf, model.toJSONObject(), success, fail);

		});

		it('should build a proper request to create the object and store the id', function(done) {
			var model = new ModelItf(null);
			var id = 42;

			var modelName = ModelItf;
			var jsonParam = model.toJSONObject();

			var response : any = model.toJSONObject();
			response['id'] = 42;

			var realParams : any = model.toJSONObject();
			delete(realParams["id"]);
			delete(realParams["createdAt"]);
			delete(realParams["updatedAt"]);

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.post(BackendConfig.modelEndpoint(ModelItf.getTableName()), realParams)
				.reply(200, JSON.stringify(response));

            var success = function() {
                //assert.ok(retour, "The creation did not return true");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                assert.equal(model.getId(), id, "The ID is not recorded in the object.");
                done();
            };

            var fail = function(err) {
                done(err);
            };

			model.createObject(modelName, jsonParam, success, fail);
		});

		it('should throw an error if no modelclass is given', function(done) {
			var model = new ModelItf(null);
			var toto;

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

            model.createObject(toto, model.toJSONObject(), success, fail);
		});

		it('should throw an error if no data is given', function(done) {
			var model = new ModelItf(null);
			var toto;

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

            model.createObject(ModelItf, toto, success, fail);
		});

		it('should throw an error if the connection failed', function(done) {
			var model = new ModelItf(null);

			var modelName = ModelItf;
			var jsonParam = model.toJSONObject();

			nock.disableNetConnect();

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    RequestException, "The RequestException has not been thrown");
                done();
            };

            model.createObject(modelName, jsonParam, success, fail);
		});

		it('should throw an error if the request failed', function(done) {
			var model = new ModelItf(null);

			var modelName = ModelItf;
			var jsonParam = model.toJSONObject();

			var realParams : any = model.toJSONObject();
			delete(realParams["id"]);
			delete(realParams["createdAt"]);
			delete(realParams["updatedAt"]);

			var restClientMock = nock(BackendConfig.getDBBaseURL())
			 .post(BackendConfig.modelEndpoint(ModelItf.getTableName()), realParams)
			 .reply(500, JSON.stringify('Server error'));


            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    RequestException, "The RequestException has not been thrown");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            model.createObject(modelName, jsonParam, success, fail);

		});

		it('should throw an error if the request succeed but the data field is missing on the response', function(done) {
			var model = new ModelItf(null);

			var modelName = ModelItf;
			var jsonParam = model.toJSONObject();

			var response = {
				"status": "success"
			};

			var realParams : any = model.toJSONObject();
			delete(realParams["id"]);
			delete(realParams["createdAt"]);
			delete(realParams["updatedAt"]);

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.post(BackendConfig.modelEndpoint(ModelItf.getTableName()), realParams)
				.reply(200, JSON.stringify(response));

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    DataException, "The DataException has not been thrown");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            model.createObject(modelName, jsonParam, success, fail);
		});

		it('should throw an error if the request succeed but the data field is empty', function(done) {
			var model = new ModelItf(null);

			var modelName = ModelItf;
			var jsonParam = model.toJSONObject();

			var response = {
				"status": "success",
				"data": {}
			};

			var realParams : any = model.toJSONObject();
			delete(realParams["id"]);
			delete(realParams["createdAt"]);
			delete(realParams["updatedAt"]);

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.post(BackendConfig.modelEndpoint(ModelItf.getTableName()), realParams)
				.reply(200, JSON.stringify(response));

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    DataException, "The DataException has not been thrown");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            model.createObject(modelName, jsonParam, success, fail);
		});

		it('should throw an error if the request succeed but the data response does not contain an id', function(done) {
			var model = new ModelItf(null);

			var modelName = ModelItf;
			var jsonParam = model.toJSONObject();

			var response : any = {
				"status": "success",
				"data": {
					"bidule": "blabla",
					"machin": 'truc'
				}
			};

			var realParams : any = model.toJSONObject();
			delete(realParams["id"]);
			delete(realParams["createdAt"]);
			delete(realParams["updatedAt"]);

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.post(BackendConfig.modelEndpoint(ModelItf.getTableName()), realParams)
				.reply(200, JSON.stringify(response));

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    DataException, "The DataException has not been thrown");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            model.createObject(modelName, jsonParam, success, fail);
		})
	});

	describe('#readObject()', function() {
		it('should build a proper request to read the object', function(done) {
			var id = 42;
			var model = new ModelItf(id);

			var modelName = ModelItf;

			var response : any = {"id": 42, "complete": false}

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.objectEndpoint(ModelItf.getTableName(),id.toString()))
				.reply(200, JSON.stringify(response));

            var success = function(model2) {
                assert.deepEqual(model2, model, "The two models are not the same");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            var fail = function(err) {
                done(err);
            };

            ModelItf.readObject(modelName, id, success, fail);

		});

		it('should throw an error if the modelClass is not given', function(done) {
			var modelClass;

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

            ModelItf.readObject(modelClass, 42, success, fail);
		});

		it('should throw an error if the id is not given', function(done) {
			var id;

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

            ModelItf.readObject(ModelItf, id, success, fail);
		});

		it('should throw an error if the connection failed', function(done) {

			nock.disableNetConnect();

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    RequestException, "The RequestException has not been thrown.");
                done();
            };

            ModelItf.readObject(ModelItf, 42, success, fail);
		});

		it('should throw an error if the request failed', function(done) {
			var id = 42;

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.objectEndpoint(ModelItf.getTableName(),id.toString()))
				.reply(500, JSON.stringify('Server error'));

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    RequestException, "The RequestException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            ModelItf.readObject(ModelItf, id, success, fail);
		});

		it('should throw an error if the request succeed but the data field is missing on the response', function(done) {
			var id = 42;
			var response = {
				"status": "success"
			};

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.objectEndpoint(ModelItf.getTableName(), id.toString()))
				.reply(200, JSON.stringify(response));

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    DataException, "The DataException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            ModelItf.readObject(ModelItf, id, success, fail);
		});

		it('should throw an error if the request succeed but the data field is empty', function(done) {
			var id = 42;
			var response = {
				"status": "success",
				"data": {}
			};

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.objectEndpoint(ModelItf.getTableName(), id.toString()))
				.reply(200, JSON.stringify(response));

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    DataException, "The DataException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            ModelItf.readObject(ModelItf, id, success, fail);
		});

		it('should throw an error if the request succeed but the data response does not contain an id', function(done) {
			var id = 42;
			var response = {
				"status": "success",
				"data": {
					"truc": "machin",
					"bidule": "toto"
				}
			};

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.objectEndpoint(ModelItf.getTableName(), id.toString()))
				.reply(200, JSON.stringify(response));

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    DataException, "The DataException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            ModelItf.readObject(ModelItf, id, success, fail);
		})
	});

	describe('#updateObject()', function() {
		it('should throw an error if the object has an id ' + null, function(done) {
			var model = new ModelItf(null);

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

            model.updateObject(ModelItf, model.toJSONObject(), success, fail);
		});

		it('should build a proper request to update the object', function(done) {
			var id = 42;
			var model = new ModelItf(id);

			var modelName = ModelItf;
			var jsonParam = model.toJSONObject();

			var response : any = model.toJSONObject();

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.put(BackendConfig.objectEndpoint(ModelItf.getTableName(), id.toString()), model.toJSONObject())
				.reply(200, JSON.stringify(response));

            var success = function() {
                //assert.ok(retour, "The update did not return true");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            var fail = function(err) {
                done(err);
            };

            model.updateObject(modelName, jsonParam, success, fail);
		});

		it('should throw an error if no modelclass is given', function(done) {
			var model = new ModelItf(42);
			var toto;

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

            model.updateObject(toto, model.toJSONObject(), success, fail);
		});

		it('should throw an error if no data is given', function(done) {
			var model = new ModelItf(42);
			var toto;

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

            model.updateObject(ModelItf, toto, success, fail);
		});

		it('should throw an error if the connection failed', function(done) {
			var model = new ModelItf(42);

			var modelName = ModelItf;
			var jsonParam = model.toJSONObject();

			nock.disableNetConnect();

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    RequestException, "The RequestException has not been thrown.");
                done();
            };

            model.updateObject(modelName, jsonParam, success, fail);
		});

		it('should throw an error if the request failed', function(done) {
			var id = 42;
			var model = new ModelItf(id);

			var modelName = ModelItf;
			var jsonParam = model.toJSONObject();

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.put(BackendConfig.objectEndpoint(ModelItf.getTableName(), id.toString()), model.toJSONObject())
				.reply(500, JSON.stringify('Server error'));

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    RequestException, "The RequestException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            model.updateObject(modelName, jsonParam, success, fail);
		});

		it('should throw an error if the request succeed but the data field is missing on the response', function(done) {
			var id = 42;
			var model = new ModelItf(id);

			var modelName = ModelItf;
			var jsonParam = model.toJSONObject();

			var response = {
				"status": "success"
			};

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.put(BackendConfig.objectEndpoint(ModelItf.getTableName(),id.toString()), model.toJSONObject())
				.reply(200, JSON.stringify(response));

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    DataException, "The DataException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            model.updateObject(modelName, jsonParam, success, fail);
		});

		it('should throw an error if the request succeed but the data field is empty', function(done) {
			var id = 42;
			var model = new ModelItf(id);

			var modelName = ModelItf;
			var jsonParam = model.toJSONObject();

			var response = {
				"status": "success",
				"data": {}
			};

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.put(BackendConfig.objectEndpoint(ModelItf.getTableName(),id.toString()), model.toJSONObject())
				.reply(200, JSON.stringify(response));

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    DataException, "The DataException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            model.updateObject(modelName, jsonParam, success, fail);
		});

		it('should throw an error if the request succeed but the data response does not contain an id', function(done) {
			var id = 42;
			var model = new ModelItf(id);

			var modelName = ModelItf;
			var jsonParam = model.toJSONObject();

			var response = {
				"status": "success",
				"data": {
					"toto": "titi"
				}
			};

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.put(BackendConfig.objectEndpoint(ModelItf.getTableName(),id.toString()), model.toJSONObject())
				.reply(200, JSON.stringify(response));


            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    DataException, "The DataException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            model.updateObject(modelName, jsonParam, success, fail);
		})
	});

	describe('#deleteObject()', function() {
		it('should throw an error if the object has an id '+null, function(done) {
			var model = new ModelItf(null);

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

            ModelItf.deleteObject(ModelItf, null, success, fail);
		});

		it('should build a proper request to delete the object and set ID to null', function(done) {
			var id = 42;
			var model = new ModelItf(id);

			var modelName = ModelItf;

			var response : any = {
				"status": "success",
				"data": {}
			};

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.delete(BackendConfig.objectEndpoint(ModelItf.getTableName(), id.toString()))
				.reply(200, JSON.stringify(response));

            var success = function() {
                //assert.ok(retour, "The delete did not return true");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            var fail = function(err) {
                done(err);
            };

            ModelItf.deleteObject(modelName, id, success, fail);
		});

		it('should throw an error if no modelclass is given', function(done) {
			var model = new ModelItf(42);
			var toto;

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

            ModelItf.deleteObject(toto, 24, success, fail);
		});

		it('should throw an error if the connection failed', function(done) {
			var model = new ModelItf(42);

			var modelName = ModelItf;

			nock.disableNetConnect();

			var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    RequestException, "The RequestException has not been thrown.");
                done();
            };

			ModelItf.deleteObject(modelName, 42, success, fail);
		});

		it('should throw an error if the request failed', function(done) {
			var id = 42;
			var model = new ModelItf(id);

			var modelName = ModelItf;

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.delete(BackendConfig.objectEndpoint(ModelItf.getTableName(), id.toString()))
				.reply(500, JSON.stringify('Server error'));

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    RequestException, "The RequestException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

			ModelItf.deleteObject(modelName, id, success, fail);
		});
	});

	describe('#allObjects()', function() {
		it('should built a proper request to read all objects and return the proper array of objects', function(done) {
			var ids = [42, 12, 8, 63];
			var models = [];
			var data = [];

			for (var id in ids) {
				models.push(new ModelItf(id));
				data.push({"id": id, "complete": false});
			}

			var modelName = ModelItf;

			var response : any = data;

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.modelEndpoint(ModelItf.getTableName()))
				.reply(200, JSON.stringify(response));

            var success = function(allmodels) {
                assert.deepEqual(allmodels, models, "The array of models is not the same : "+JSON.stringify(allmodels)+ " and "+JSON.stringify(models));
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            var fail = function(err) {
                done(err);
            };

            ModelItf.allObjects(modelName, success, fail);
		});

		it('should throw an error if the modelClass is not given', function(done) {
			var modelClass;

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

            ModelItf.allObjects(modelClass, success, fail);
		});

		it('should throw an error if the connection failed', function(done) {

			nock.disableNetConnect();

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    RequestException, "The RequestException has not been thrown.");
                done();
            };

            ModelItf.allObjects(ModelItf, success, fail);
		});

		it('should throw an error if the request failed', function(done) {
			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.modelEndpoint(ModelItf.getTableName()))
				.reply(500, JSON.stringify('Server error'));

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    RequestException, "The RequestException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            ModelItf.allObjects(ModelItf, success, fail);
		});

		it('should throw an error if the request succeed but the data field is missing on the response', function(done) {
			var response = {
				"status": "success"
			};

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.modelEndpoint(ModelItf.getTableName()))
				.reply(200, JSON.stringify(response));

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    DataException, "The DataException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            ModelItf.allObjects(ModelItf, success, fail);
		});

		it('should throw an error if the request succeed but the data field is not an array', function(done) {
			var id = 42;
			var response = {
				"status": "success",
				"data": {
					"toto": "bidule"
				}
			};

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.modelEndpoint(ModelItf.getTableName()))
				.reply(200, JSON.stringify(response));

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    DataException, "The DataException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            ModelItf.allObjects(ModelItf, success, fail);
		});

		it('should throw an error if the request succeed but one data response does not contain an id', function(done) {
			var response = {
				"status": "success",
				"data": [
					{
						"bidule": "truc",
						"id": 12
					},
					{
						"toto": "titi"
					}
				]
			};

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.modelEndpoint(ModelItf.getTableName()))
				.reply(200, JSON.stringify(response));

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    DataException, "The DataException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            ModelItf.allObjects(ModelItf, success, fail);
		});
	});

	describe('#associateObject()', function() {
		it('should throw an error if the object has an id '+ null, function(done) {

            var model = new ModelItf(null);

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

            model.associateObject(ModelItf, ModelItf, 42, success, fail);
		});

		it('should throw an error if the modelclass1 is not given', function(done) {
			var model = new ModelItf(42);
			var toto;

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

            model.associateObject(toto, ModelItf, 42, success, fail);
		});

		it('should throw an error if the modelclass2 is not given', function(done) {
			var model = new ModelItf(42);
			var toto;

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

            model.associateObject(ModelItf, toto, 42, success, fail);
		});

		it('should throw an error if the second ID is not given', function(done) {
			var model = new ModelItf(42);
			var toto;

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

            model.associateObject(ModelItf, ModelItf, toto, success, fail);
		});

		it('should build a proper request to associate the objects and return true', function(done) {
			var id = 42;
			var id2 = 24;
			var model = new ModelItf(id);

			var emptyResponse : any = {};


			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.put(BackendConfig.associatedObjectEndpoint(ModelItf.getTableName(), id.toString(), ModelItf.getTableName(), id2.toString()))
				.reply(200, JSON.stringify(emptyResponse));

            var success = function() {
                //assert.ok(retour, "The association did not return true");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            var fail = function(err) {
                done(err);
            };

            model.associateObject(ModelItf, ModelItf, id2, success, fail);
		});

		it('should throw an error if the connection failed', function(done) {
			var model = new ModelItf(42);

			nock.disableNetConnect();

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    RequestException, "The RequestException has not been thrown.");
                done();
            };

            model.associateObject(ModelItf, ModelItf, 23, success, fail);
		});

		it('should throw an error if the request failed', function(done) {
			var id = 42;
			var id2 = 24;
			var model = new ModelItf(id);

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.put(BackendConfig.associatedObjectEndpoint(ModelItf.getTableName(), id.toString(), ModelItf.getTableName(), id2.toString()))
				.reply(500, JSON.stringify('Server error'));

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    RequestException, "The RequestException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            model.associateObject(ModelItf, ModelItf, id2, success, fail);
		});
	});

	describe('#deleteObjectAssociation()', function() {
		it('should throw an error if the object has an id '+null, function(done) {
			var model = new ModelItf(null);

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

            model.deleteObjectAssociation(ModelItf, ModelItf, 42, success, fail);
		});

		it('should throw an error if the modelclass1 is not given', function(done) {
			var model = new ModelItf(42);
			var toto;

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

            model.deleteObjectAssociation(toto, ModelItf, 42, success, fail);
		});

		it('should throw an error if the modelclass2 is not given', function(done) {
			var model = new ModelItf(42);
			var toto;

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

            model.deleteObjectAssociation(ModelItf, toto, 42, success, fail);
		});

		it('should throw an error if the second ID is not given', function(done) {
			var model = new ModelItf(42);
			var toto;

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

            model.deleteObjectAssociation(ModelItf, ModelItf, toto, success, fail);
		});

		it('should build a proper request to associate the objects and return true', function(done) {
			var id = 42;
			var id2 = 24;
			var model = new ModelItf(id);

			var emptyResponse : any = {};


			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.delete(BackendConfig.associatedObjectEndpoint(ModelItf.getTableName(), id.toString(), ModelItf.getTableName(), id2.toString()))
				.reply(200, JSON.stringify(emptyResponse));

            var success = function() {
                //assert.ok(retour, "The association did not return true");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            var fail = function(err) {
                done(err);
            };

            model.deleteObjectAssociation(ModelItf, ModelItf, id2, success, fail);
		});

		it('should throw an error if the connection failed', function(done) {
			var model = new ModelItf(42);

			var modelName = ModelItf;

			nock.disableNetConnect();

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    RequestException, "The RequestException has not been thrown.");
                done();
            };

            model.deleteObjectAssociation(ModelItf, ModelItf, 23, success, fail);
		});

		it('should throw an error if the request failed', function(done) {
			var id = 42;
			var id2 = 24;
			var model = new ModelItf(id);

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.delete(BackendConfig.associatedObjectEndpoint(ModelItf.getTableName(), id.toString(), ModelItf.getTableName(), id2.toString()))
				.reply(500, JSON.stringify('Server error'));

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    RequestException, "The RequestException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            model.deleteObjectAssociation(ModelItf, ModelItf, id2, success, fail);
		});
	});

	describe('#getAssociatedObjects()', function() {
		it('should throw an error if the object has an id '+null, function(done) {
			var model = new ModelItf(null);

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

            model.getAssociatedObjects(ModelItf, ModelItf, success, fail);
		});

		it('should throw an error if the modelclass1 is not given', function(done) {
			var model = new ModelItf(42);
			var toto;

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

            model.getAssociatedObjects(toto, ModelItf, success, fail);
		});

		it('should throw an error if the modelclass2 is not given', function(done) {
			var model = new ModelItf(42);
			var toto;

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

            model.getAssociatedObjects(ModelItf, toto, success, fail);
		});

		it('should build a proper request to read all associated objects and return the proper array of objects', function(done) {
			var originID = 1;
			var ids = [42, 12, 8, 63];
			var models = [];
			var data = [];

			var model = new ModelItf(originID);

			for (var id in ids) {
				models.push(new ModelItf(id));
				data.push({"id": id});
			}

			var response : any = data;

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
				.reply(200, JSON.stringify(response));

            var success = function(allmodels) {
                assert.deepEqual(allmodels, models, "The array of models is not the same.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            var fail = function(err) {
                done(err);
            };

            model.getAssociatedObjects(ModelItf, ModelItf, success, fail);

		});

		it('should throw an error if the connection failed', function(done) {
			var model = new ModelItf(12);

			nock.disableNetConnect();

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    RequestException, "The RequestException has not been thrown.");
                done();
            };

            model.getAssociatedObjects(ModelItf, ModelItf, success, fail);
		});

		it('should throw an error if the request failed', function(done) {
			var originID = 12;
			var model = new ModelItf(originID);

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
				.reply(500, JSON.stringify('Server error'));

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    RequestException, "The RequestException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            model.getAssociatedObjects(ModelItf, ModelItf, success, fail);

		});

		it('should throw an error if the request succeed but the data field is missing on the response', function(done) {
			var originID = 12;
			var model = new ModelItf(originID);

			var response = {
				"status": "success"
			};

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
				.reply(200, JSON.stringify(response));

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    DataException, "The DataException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            model.getAssociatedObjects(ModelItf, ModelItf, success, fail);
		});

		it('should throw an error if the request succeed but the data field is not an array', function(done) {
			var originID = 12;
			var model = new ModelItf(originID);

			var response = {
				"status": "success",
				"data": {
					"toto": "bidule"
				}
			};

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
				.reply(200, JSON.stringify(response));

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    DataException, "The DataException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            model.getAssociatedObjects(ModelItf, ModelItf, success, fail);
		});

		it('should throw an error if the request succeed but one data response does not contain an id', function(done) {
			var originID = 12;
			var model = new ModelItf(originID);

			var response = {
				"status": "success",
				"data": [
					{
						"bidule": "truc",
						"id": 12
					},
					{
						"toto": "titi"
					}
				]
			};

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
				.reply(200, JSON.stringify(response));

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    DataException, "The DataException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            model.getAssociatedObjects(ModelItf, ModelItf, success, fail);
		})
	});

	describe('#getUniquelyAssociatedObject()', function() {
		it('should throw an error if the object has an id '+null, function(done) {
			var model = new ModelItf(null);

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

            model.getUniquelyAssociatedObject(ModelItf, ModelItf, success, fail);
		});

		it('should throw an error if the modelclass1 is not given', function(done) {
			var model = new ModelItf(42);
			var toto;

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

            model.getUniquelyAssociatedObject(toto, ModelItf, success, fail);
		});

		it('should throw an error if the modelclass2 is not given', function(done) {
			var model = new ModelItf(42);
			var toto;

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

            model.getUniquelyAssociatedObject(ModelItf, toto, success, fail);
		});

		it('should build a proper request to read a uniquely associated objects and return the proper array containing a unique object', function(done) {
			var originID = 1;
			var targetID = 42;

			var model = new ModelItf(originID);

			var response : any = {
					"id": targetID
				};

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
				.reply(200, JSON.stringify(response));

            var expected = new ModelItf(targetID);

            var success = function(result) {
                assert.deepEqual(result, expected, "The result ("+JSON.stringify(result)+" is not the expected one: "+JSON.stringify(expected));
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            var fail = function(err) {
                done(err);
            };

            model.getUniquelyAssociatedObject(ModelItf, ModelItf, success, fail);
		});

		it('should build a proper request to read a uniquely associated objects and return null if there is no associated objects', function(done) {
			var originID = 1;

			var model = new ModelItf(originID);

			var emptyResponse : any = {};

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
				.reply(200, JSON.stringify(emptyResponse));

            var success = function(result) {
                assert.deepEqual(result, null, "The retrieve of associated objects doesn't return null.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            var fail = function(err) {
                done(err);
            };

            model.getUniquelyAssociatedObject(ModelItf, ModelItf, success, fail);

		});

		it('should throw an error if the connection failed', function(done) {
			var model = new ModelItf(12);

			nock.disableNetConnect();

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    RequestException, "The RequestException has not been thrown.");
                done();
            };

            model.getUniquelyAssociatedObject(ModelItf, ModelItf, success, fail);
		});

		it('should throw an error if the request failed', function(done) {
			var originID = 12;
			var model = new ModelItf(originID);

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
				.reply(500, JSON.stringify('Server error'));

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    RequestException, "The RequestException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            model.getUniquelyAssociatedObject(ModelItf, ModelItf, success, fail);

		});

		it('should throw an error if the request succeed but the data field is missing on the response', function(done) {
			var originID = 12;
			var model = new ModelItf(originID);

			var response = {
				"status": "success"
			};

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
				.reply(200, JSON.stringify(response));

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    DataException, "The DataException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            model.getUniquelyAssociatedObject(ModelItf, ModelItf, success, fail);
		});

		it('should throw an error if the request succeed but the data does not contain an id', function(done) {
			var originID = 12;
			var model = new ModelItf(originID);

			var response : any = {
					"toto": "bidule"
				};

			var restClientMock = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
				.reply(200, JSON.stringify(response));

            var success = function() {
                done(new Error("Test failed."));
            };

            var fail = function(err) {
                assert.throws(function() {
                        if(err) {
                            throw err;
                        }
                    },
                    DataException, "The DataException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            model.getUniquelyAssociatedObject(ModelItf, ModelItf, success, fail);
		});


	});

	describe('#isObjectInsideArray', function() {
		it('should return true if the item is in the array', function() {
			var model = new ModelItf(2);
			var array = [
				new ModelItf(1),
				model,
				new ModelItf(3)
			];

			assert.ok(ModelItf.isObjectInsideArray(array, model), "The item is not found in the array");
		});

		it('should get the index if an identical item is in the array', function() {
			var model = new ModelItf(2);
			var array = [
				new ModelItf(1),
				new ModelItf(2),
				new ModelItf(3)
			];

			assert.ok(ModelItf.isObjectInsideArray(array, model), "The item is not found in the array");
		})
	});

	describe('#removeObjectFromArray', function() {
		it('should return true and remove the item', function() {
			var model1 = new ModelItf(1);
			var model2 = new ModelItf(2);
			var model3 = new ModelItf(3);

			var array = [
				model1,
				model2,
				model3
			];

			var expected = [
				model1,
				model3
			];

			var retour = ModelItf.removeObjectFromArray(array, model2);

			assert.ok(retour, "The item has not been found in the array");
			assert.deepEqual(array, expected, "The array has not been modified correcty: "+JSON.stringify(array));

		});

		it('should return true and remove an identical item', function() {
			var model1 = new ModelItf(1);
			var model2 = new ModelItf(2);
			var model3 = new ModelItf(3);

			var array = [
				model1,
				model2,
				model3
			];

			var expected = [
				model1,
				model3
			];

			var retour = ModelItf.removeObjectFromArray(array, new ModelItf(2));

			assert.ok(retour, "The item has not been found in the array");
			assert.deepEqual(array, expected, "The array has not been modified correcty: "+JSON.stringify(array));

		});

		it('should return false and keep the array as it is if the item is not found', function() {
			var model1 = new ModelItf(1);
			var model2 = new ModelItf(2);
			var model3 = new ModelItf(3);

			var array = [
				model1,
				model2,
				model3
			];

			var expected = [
				model1,
				model2,
				model3
			];

			var retour = ModelItf.removeObjectFromArray(array, new ModelItf(4));

			assert.ok(!retour, "The item has been found in the array");
			assert.deepEqual(array, expected, "The array has not been modified correcty: "+JSON.stringify(array));

		});
	});

	describe('#updateAttribute', function () {
		it('should launch an exception if the modelClass is undefined.', function (done) {
			var success = function() {
				done(new Error("Test failed."));
			};

			var fail = function(err) {
				assert.throws(function() {
						if(err) {
							throw err;
						}
					},
					ModelException, "The DataException has not been thrown.");
				done();
			};

			ModelItf.updateAttribute(undefined,null, success, fail);
		});

		it('should launch an exception if the modelClass is null.', function (done) {
			var success = function() {
				done(new Error("Test failed."));
			};

			var fail = function(err) {
				assert.throws(function() {
						if(err) {
							throw err;
						}
					},
					ModelException, "The DataException has not been thrown.");
				done();
			};

			ModelItf.updateAttribute(null, null, success, fail);
		});

		it('should launch an exception if the JSON information is null', function (done) {
			var success = function() {
				done(new Error("Test failed."));
			};

			var fail = function(err) {
				assert.throws(function() {
						if(err) {
							throw err;
						}
					},
					ModelException, "The DataException has not been thrown.");
				done();
			};

			ModelItf.updateAttribute(ModelItf, null, success, fail);
		});

		it('should launch an exception if the information is not a JSON', function (done) {
			var success = function() {
				done(new Error("Test failed."));
			};

			var fail = function(err) {
				assert.throws(function() {
						if(err) {
							throw err;
						}
					},
					ModelException, "The DataException has not been thrown.");
				done();
			};

			ModelItf.updateAttribute(ModelItf, "", success, fail);
		});

		it('should launch an exception if the information does not contain an ID', function (done) {
			var success = function() {
				done(new Error("Test failed."));
			};

			var info = {
				"toto": "tata"
			};

			var fail = function(err) {
				assert.throws(function() {
						if(err) {
							throw err;
						}
					},
					ModelException, "The DataException has not been thrown.");
				done();
			};

			ModelItf.updateAttribute(ModelItf, info, success, fail);
		});

		it('should launch an exception if the information does contain a null id', function (done) {
			var success = function() {
				done(new Error("Test failed."));
			};

			var info = {
				"id": null
			};

			var fail = function(err) {
				assert.throws(function() {
						if(err) {
							throw err;
						}
					},
					ModelException, "The DataException has not been thrown.");
				done();
			};

			ModelItf.updateAttribute(ModelItf, info, success, fail);
		});

		it('should launch an exception if the information does not contain a method', function (done) {
			var success = function() {
				done(new Error("Test failed."));
			};

			var info = {
				"id": 3
			};

			var fail = function(err) {
				assert.throws(function() {
						if(err) {
							throw err;
						}
					},
					ModelException, "The DataException has not been thrown.");
				done();
			};

			ModelItf.updateAttribute(ModelItf, info, success, fail);
		});

		it('should launch an exception if the information does contain a null method', function (done) {
			var success = function() {
				done(new Error("Test failed."));
			};

			var info = {
				"id": 3,
				"method": null
			};

			var fail = function(err) {
				assert.throws(function() {
						if(err) {
							throw err;
						}
					},
					ModelException, "The DataException has not been thrown.");
				done();
			};

			ModelItf.updateAttribute(ModelItf, info, success, fail);
		});

		it('should launch an exception if the information method does not have a proper name', function (done) {
			var success = function() {
				done(new Error("Test failed."));
			};

			var info = {
				"id": 3,
				"method": "deleteSet"
			};

			var fail = function(err) {
				assert.throws(function() {
						if(err) {
							throw err;
						}
					},
					ModelException, "The DataException has not been thrown.");
				done();
			};

			ModelItf.updateAttribute(ModelItf, info, success, fail);
		});
	});

    describe('#cloneObject', function () {
        it('should launch an exception if the modelClass is undefined.', function (done) {
            var model : ModelItf = new ModelItf(12);
            var success = function () {
                done(new Error("Test failed."));
            };

            var fail = function (err) {
                assert.throws(function () {
                        if (err) {
                            throw err;
                        }
                    },
                    ModelException, "The DataException has not been thrown.");
                done();
            };

            model.cloneObject(undefined, success, fail);
        });

        it('should launch an exception if the modelClass is null.', function (done) {
            var model : ModelItf = new ModelItf(12);
            var success = function () {
                done(new Error("Test failed."));
            };

            var fail = function (err) {
                assert.throws(function () {
                        if (err) {
                            throw err;
                        }
                    },
                    ModelException, "The DataException has not been thrown.");
                done();
            };

            model.cloneObject(null, success, fail);
        });

        it('should launch an exception if the object is not complete', function (done) {
            var model : ModelItf = new ModelItf(12);
            var success = function () {
                done(new Error("Test failed."));
            };

            var fail = function (err) {
                assert.throws(function () {
                        if (err) {
                            throw err;
                        }
                    },
                    ModelException, "The DataException has not been thrown.");
                done();
            };

            model.cloneObject(ModelItf, success, fail);
        });

        it('should create an object with a different id.', function (done) {

            var emptyModel = new ModelItf();
            var model = new ModelItf(12, true);
            var id = 42;

            var response : any = model.toJSONObject();
            response['id'] = id;

			var realParams : any = emptyModel.toJSONObject();
			delete(realParams["id"]);
			delete(realParams["createdAt"]);
			delete(realParams["updatedAt"]);

            var restClientMock = nock(BackendConfig.getDBBaseURL())
                .post(BackendConfig.modelEndpoint(ModelItf.getTableName()), realParams)
                .reply(200, JSON.stringify(response));

            var success = function(obtainedData : any) {
                //assert.ok(retour, "The creation did not return true");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                assert.equal(obtainedData._id, id, "The ID is not recorded in the object : "+JSON.stringify(obtainedData));
                assert.notEqual(model.getId(), obtainedData.id, "The ID of original object and created one are different.");
                done();
            };

            var fail = function(err) {
                done(err);
            };

            model.cloneObject(ModelItf, success, fail);
        });
    });
});