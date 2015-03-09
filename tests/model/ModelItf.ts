/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />

/// <reference path="../../scripts/core/DatabaseConnection.ts" />
/// <reference path="../../scripts/model/ModelItf.ts" />

var assert = require("assert");
var nock : any = require("nock");

describe('ModelItf', function() {
	describe('#constructor(id)', function() {
		it('should store the given id', function() {
			var id = 12;
			var model = new ModelItf(id);

			assert.equal(model.getId(), id, "The id is correctly stored.");
		});


		it('should not authorize to create an object with an undefined ID', function() {
			assert.throws(function() {
					new ModelItf(undefined);
				},
				ModelException, "The exception has not been thrown.");
		});
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

			var response : SequelizeRestfulResponse = {
				"status": "success",
				"data": model.toJSONObject()
			};
			response.data['id'] = 42;

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.post(DatabaseConnection.modelEndpoint(ModelItf.getTableName()), model.toJSONObject())
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

			var restClientMock = nock(DatabaseConnection.getBaseURL())
			 .post(DatabaseConnection.modelEndpoint(ModelItf.getTableName()), model.toJSONObject())
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
                    ResponseException, "The ResponseException has not been thrown");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            model.createObject(modelName, jsonParam, success, fail);

		});

		it('should throw an error if the request failed on the server', function(done) {
			var model = new ModelItf(null);

			var modelName = ModelItf;
			var jsonParam = model.toJSONObject();

			var response : SequelizeRestfulResponse = {
				"status": "error",
				"data": {}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.post(DatabaseConnection.modelEndpoint(ModelItf.getTableName()), model.toJSONObject())
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
                    ResponseException, "The ResponseException has not been thrown");
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

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.post(DatabaseConnection.modelEndpoint(ModelItf.getTableName()), model.toJSONObject())
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

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.post(DatabaseConnection.modelEndpoint(ModelItf.getTableName()), model.toJSONObject())
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

			var response : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"bidule": "blabla",
					"machin": 'truc'
				}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.post(DatabaseConnection.modelEndpoint(ModelItf.getTableName()), model.toJSONObject())
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

			var response : SequelizeRestfulResponse = {
				"status": "success",
				"data": model.toJSONObject()
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.objectEndpoint(ModelItf.getTableName(),id.toString()))
				.reply(200, JSON.stringify(response));

            var success = function(model2) {
                assert.deepEqual(model2, model, "The two models are not the same.");
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

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.objectEndpoint(ModelItf.getTableName(),id.toString()))
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
                    ResponseException, "The ResponseException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            ModelItf.readObject(ModelItf, id, success, fail);
		});

		it('should throw an error if the request failed on the server', function(done) {
			var id = 42;
			var response : SequelizeRestfulResponse = {
				"status": "error",
				"data": {}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.objectEndpoint(ModelItf.getTableName(),id.toString()))
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
                    ResponseException, "The ResponseException has not been thrown.");
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

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.objectEndpoint(ModelItf.getTableName(), id.toString()))
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

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.objectEndpoint(ModelItf.getTableName(), id.toString()))
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

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.objectEndpoint(ModelItf.getTableName(), id.toString()))
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
		it('should throw an error if the object has an id ' + ModelItf.NULLID, function(done) {
			var model = new ModelItf(ModelItf.NULLID);

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

			var response : SequelizeRestfulResponse = {
				"status": "success",
				"data": model.toJSONObject()
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.objectEndpoint(ModelItf.getTableName(), id.toString()), model.toJSONObject())
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

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.objectEndpoint(ModelItf.getTableName(), id.toString()), model.toJSONObject())
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
                    ResponseException, "The ResponseException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            model.updateObject(modelName, jsonParam, success, fail);
		});

		it('should throw an error if the request failed on the server', function(done) {
			var id = 42;
			var model = new ModelItf(id);

			var modelName = ModelItf;
			var jsonParam = model.toJSONObject();

			var response : SequelizeRestfulResponse = {
				"status": "error",
				"data": {}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.objectEndpoint(ModelItf.getTableName(), id.toString()), model.toJSONObject())
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
                    ResponseException, "The ResponseException has not been thrown.");
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

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.objectEndpoint(ModelItf.getTableName(),id.toString()), model.toJSONObject())
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

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.objectEndpoint(ModelItf.getTableName(),id.toString()), model.toJSONObject())
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

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.objectEndpoint(ModelItf.getTableName(),id.toString()), model.toJSONObject())
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
		it('should throw an error if the object has an id '+ModelItf.NULLID, function(done) {
			var model = new ModelItf(ModelItf.NULLID);

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

            model.deleteObject(ModelItf, success, fail);
		});

		it('should build a proper request to delete the object and set ID to null', function(done) {
			var id = 42;
			var model = new ModelItf(id);

			var modelName = ModelItf;

			var response : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.delete(DatabaseConnection.objectEndpoint(ModelItf.getTableName(), id.toString()))
				.reply(200, JSON.stringify(response));

            var success = function() {
                //assert.ok(retour, "The delete did not return true");
                assert.equal(model.getId(), null, "The object ID is not null.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            var fail = function(err) {
                done(err);
            };

            model.deleteObject(modelName, success, fail);
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

            model.deleteObject(toto, success, fail);
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

            model.deleteObject(modelName, success, fail);
		});

		it('should throw an error if the request failed', function(done) {
			var id = 42;
			var model = new ModelItf(id);

			var modelName = ModelItf;

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.delete(DatabaseConnection.objectEndpoint(ModelItf.getTableName(), id.toString()))
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
                    ResponseException, "The ResponseException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            model.deleteObject(modelName, success, fail);
		});

		it('should throw an error if the request failed on the server', function(done) {
			var id = 42;
			var model = new ModelItf(id);

			var modelName = ModelItf;

			var response : SequelizeRestfulResponse = {
				"status": "error",
				"data": {}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.delete(DatabaseConnection.objectEndpoint(ModelItf.getTableName(), id.toString()))
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
                    ResponseException, "The ResponseException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            model.deleteObject(modelName, success, fail);
		});
	});

	describe('#allObjects()', function() {
		it('should built a proper request to read all objects and return the proper array of objects', function(done) {
			var ids = [42, 12, 8, 63];
			var models = [];
			var data = [];

			for (var id in ids) {
				models.push(new ModelItf(id));
				data.push({"id": id});
			}

			var modelName = ModelItf;

			var reponse : SequelizeRestfulResponse = {
				"status": "success",
				"count": 4,
				"data": data
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.modelEndpoint(ModelItf.getTableName()))
				.reply(200, JSON.stringify(reponse));

            var success = function(allmodels) {
                assert.deepEqual(allmodels, models, "The array of models is not the same.");
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
			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.modelEndpoint(ModelItf.getTableName()))
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
                    ResponseException, "The ResponseException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            ModelItf.allObjects(ModelItf, success, fail);
		});

		it('should throw an error if the request failed on the server', function(done) {
			var response : SequelizeRestfulResponse = {
				"status": "error",
				"data": {}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.modelEndpoint(ModelItf.getTableName()))
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
                    ResponseException, "The ResponseException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            ModelItf.allObjects(ModelItf, success, fail);
		});

		it('should throw an error if the request succeed but the data field is missing on the response', function(done) {
			var response = {
				"status": "success"
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.modelEndpoint(ModelItf.getTableName()))
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

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.modelEndpoint(ModelItf.getTableName()))
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

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.modelEndpoint(ModelItf.getTableName()))
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
		it('should throw an error if the object has an id '+ ModelItf.NULLID, function(done) {

            var model = new ModelItf(ModelItf.NULLID);

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

			var reponse : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.associatedObjectEndpoint(ModelItf.getTableName(), id.toString(), ModelItf.getTableName(), id2.toString()))
				.reply(200, JSON.stringify(reponse));

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

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.associatedObjectEndpoint(ModelItf.getTableName(), id.toString(), ModelItf.getTableName(), id2.toString()))
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
                    ResponseException, "The ResponseException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            model.associateObject(ModelItf, ModelItf, id2, success, fail);
		});

		it('should throw an error if the request failed on the server', function(done) {
			var id = 42;
			var id2 = 24;
			var model = new ModelItf(id);

			var response : SequelizeRestfulResponse = {
				"status": "error",
				"data": {}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.associatedObjectEndpoint(ModelItf.getTableName(), id.toString(), ModelItf.getTableName(), id2.toString()))
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
                    ResponseException, "The ResponseException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            model.associateObject(ModelItf, ModelItf, id2, success, fail);
		});
	});

	describe('#deleteObjectAssociation()', function() {
		it('should throw an error if the object has an id '+ModelItf.NULLID, function(done) {
			var model = new ModelItf(ModelItf.NULLID);

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

			var reponse : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.delete(DatabaseConnection.associatedObjectEndpoint(ModelItf.getTableName(), id.toString(), ModelItf.getTableName(), id2.toString()))
				.reply(200, JSON.stringify(reponse));

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

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.delete(DatabaseConnection.associatedObjectEndpoint(ModelItf.getTableName(), id.toString(), ModelItf.getTableName(), id2.toString()))
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
                    ResponseException, "The ResponseException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            model.deleteObjectAssociation(ModelItf, ModelItf, id2, success, fail);
		});

		it('should throw an error if the request failed on the server', function(done) {
			var id = 42;
			var id2 = 24;
			var model = new ModelItf(id);

			var response : SequelizeRestfulResponse = {
				"status": "error",
				"data": {}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.delete(DatabaseConnection.associatedObjectEndpoint(ModelItf.getTableName(), id.toString(), ModelItf.getTableName(), id2.toString()))
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
                    ResponseException, "The ResponseException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            model.deleteObjectAssociation(ModelItf, ModelItf, id2, success, fail);
		});
	});

	describe('#getAssociatedObjects()', function() {
		it('should throw an error if the object has an id '+ModelItf.NULLID, function(done) {
			var model = new ModelItf(ModelItf.NULLID);

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

			var reponse : SequelizeRestfulResponse = {
				"status": "success",
				"data": data
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
				.reply(200, JSON.stringify(reponse));

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

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
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
                    ResponseException, "The ResponseException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            model.getAssociatedObjects(ModelItf, ModelItf, success, fail);

		});

		it('should throw an error if the request failed on the server', function(done) {
			var originID = 12;
			var model = new ModelItf(originID);

			var response : SequelizeRestfulResponse = {
				"status": "error",
				"data": {}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
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
                    ResponseException, "The ResponseException has not been thrown.");
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

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
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

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
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

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
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
		it('should throw an error if the object has an id '+ModelItf.NULLID, function(done) {
			var model = new ModelItf(ModelItf.NULLID);

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

			var reponse : SequelizeRestfulResponse = {
				"status": "success",
				"data": {
					"id": targetID
				}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
				.reply(200, JSON.stringify(reponse));

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

			var reponse : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
				.reply(200, JSON.stringify(reponse));

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

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
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
                    ResponseException, "The ResponseException has not been thrown.");
                assert.ok(restClientMock.isDone(), "The mock request has not been done.");
                done();
            };

            model.getUniquelyAssociatedObject(ModelItf, ModelItf, success, fail);

		});

		it('should throw an error if the request failed on the server', function(done) {
			var originID = 12;
			var model = new ModelItf(originID);

			var response : SequelizeRestfulResponse = {
				"status": "error",
				"data": {}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
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
                    ResponseException, "The ResponseException has not been thrown.");
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

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
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

			var response = {
				"status": "success",
				"data": {
					"toto": "bidule"
				}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
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
	})
});