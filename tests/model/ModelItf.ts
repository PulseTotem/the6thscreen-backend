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

	/*describe('#readObject()', function() {
		it('should built a proper request to read the object', function() {
			var id = 42;
			var model = new ModelItf(id);

			var modelName = ModelItf;
			var jsonParam = model.toJSONObject();

			var reponse : SequelizeRestfulResponse = {
				"status": "success",
				"data": model.toJSONObject()
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.objectEndpoint(ModelItf.getTableName(),id.toString()))
				.reply(200, JSON.stringify(reponse));

			var model2 = ModelItf.readObject(modelName, id);
			assert.deepEqual(model2, model, "The two models are not the same.");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the modelClass is not given', function() {
			var modelClass;

			assert.throws(function() {
				ModelItf.readObject(modelClass, 42);
			},
			ModelException, "The ModelException has not been thrown.");
		});

		it('should throw an error if the id is not given', function() {
			var id;

			assert.throws(function() {
					ModelItf.readObject(ModelItf, id);
				},
				ModelException, "The ModelException has not been thrown.");
		});

		it('should throw an error if the connection failed', function() {

			nock.disableNetConnect();

			assert.throws(function() {
				ModelItf.readObject(ModelItf, 42);
			}, RequestException, "The RequestException has not been thrown");
		});

		it('should throw an error if the request failed', function() {
			var id = 42;

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.objectEndpoint(ModelItf.getTableName(),id.toString()))
				.reply(500, JSON.stringify('Server error'));

			assert.throws(function() {
				ModelItf.readObject(ModelItf, id);
			}, RequestException, "The RequestException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the request failed on the server', function() {
			var id = 42;
			var response : SequelizeRestfulResponse = {
				"status": "error",
				"data": {}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.objectEndpoint(ModelItf.getTableName(),id.toString()))
				.reply(200, JSON.stringify(response));

			assert.throws(function() {
				ModelItf.readObject(ModelItf, id);
			}, ResponseException, "The ResponseException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the request succeed but the data field is missing on the response', function() {
			var id = 42;
			var response = {
				"status": "success"
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.objectEndpoint(ModelItf.getTableName(), id.toString()))
				.reply(200, JSON.stringify(response));

			assert.throws(function() {
				ModelItf.readObject(ModelItf, id);
			}, DataException, "The DataException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the request succeed but the data field is empty', function() {
			var id = 42;
			var response = {
				"status": "success",
				"data": {}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.objectEndpoint(ModelItf.getTableName(), id.toString()))
				.reply(200, JSON.stringify(response));

			assert.throws(function() {
				ModelItf.readObject(ModelItf, id);
			}, DataException, "The DataException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the request succeed but the data response does not contain an id', function() {
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

			assert.throws(function() {
				ModelItf.readObject(ModelItf, id);
			}, DataException, "The DataException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		})
	});

	describe('#updateObject()', function() {
		it('should throw an error if the object has an id '+ModelItf.NULLID, function() {
			var model = new ModelItf(ModelItf.NULLID);

			assert.throws(function() {
					model.updateObject(ModelItf, model.toJSONObject());
				},
				ModelException);
		});

		it('should built a proper request to update the object', function() {
			var id = 42;
			var model = new ModelItf(id);

			var modelName = ModelItf;
			var jsonParam = model.toJSONObject();

			var reponse : SequelizeRestfulResponse = {
				"status": "success",
				"data": model.toJSONObject()
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.objectEndpoint(ModelItf.getTableName(), id.toString()), model.toJSONObject())
				.reply(200, JSON.stringify(reponse));

			var retour = model.updateObject(modelName, jsonParam);
			assert.ok(retour, "The update did not return true");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if no modelclass is given', function() {
			var model = new ModelItf(42);
			var toto;

			assert.throws(function() {
				model.updateObject(toto, model.toJSONObject());
			}, ModelException, "The ModelException has not been thrown");
		});

		it('should throw an error if no data is given', function() {
			var model = new ModelItf(42);
			var toto;

			assert.throws(function() {
				model.updateObject(ModelItf, toto);
			}, ModelException, "The ModelException has not been thrown");
		});

		it('should throw an error if the connection failed', function() {
			var model = new ModelItf(42);

			var modelName = ModelItf;
			var jsonParam = model.toJSONObject();

			nock.disableNetConnect();

			assert.throws(function() {
				model.updateObject(modelName, jsonParam);
			}, RequestException, "The RequestException has not been thrown");
		});

		it('should throw an error if the request failed', function() {
			var id = 42;
			var model = new ModelItf(id);

			var modelName = ModelItf;
			var jsonParam = model.toJSONObject();

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.objectEndpoint(ModelItf.getTableName(), id.toString()), model.toJSONObject())
				.reply(500, JSON.stringify('Server error'));

			assert.throws(function() {
				model.updateObject(modelName, jsonParam);
			}, RequestException, "The RequestException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the request failed on the server', function() {
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

			assert.throws(function() {
				model.updateObject(modelName, jsonParam);
			}, ResponseException, "The ResponseException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the request succeed but the data field is missing on the response', function() {
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

			assert.throws(function() {
				model.updateObject(modelName, jsonParam);
			}, DataException, "The DataException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the request succeed but the data field is empty', function() {
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

			assert.throws(function() {
				model.updateObject(modelName, jsonParam);
			}, DataException, "The DataException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the request succeed but the data response does not contain an id', function() {
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

			assert.throws(function() {
				model.updateObject(modelName, jsonParam);
			}, DataException, "The DataException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		})
	});

	describe('#deleteObject()', function() {
		it('should throw an error if the object has an id '+ModelItf.NULLID, function() {
			var model = new ModelItf(ModelItf.NULLID);

			assert.throws(function() {
					model.deleteObject(ModelItf);
				},
				ModelException);
		});

		it('should built a proper request to delete the object and set ID to null', function() {
			var id = 42;
			var model = new ModelItf(id);

			var modelName = ModelItf;

			var reponse : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.delete(DatabaseConnection.objectEndpoint(ModelItf.getTableName(), id.toString()))
				.reply(200, JSON.stringify(reponse));

			var retour = model.deleteObject(modelName);
			assert.ok(retour, "The delete did not return true");
			assert.equal(model.getId(), null, "The object ID is not null.");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if no modelclass is given', function() {
			var model = new ModelItf(42);
			var toto;

			assert.throws(function() {
				model.deleteObject(toto);
			}, ModelException, "The ModelException has not been thrown");
		});

		it('should throw an error if the connection failed', function() {
			var model = new ModelItf(42);

			var modelName = ModelItf;

			nock.disableNetConnect();

			assert.throws(function() {
				model.deleteObject(modelName);
			}, RequestException, "The RequestException has not been thrown");
		});

		it('should throw an error if the request failed', function() {
			var id = 42;
			var model = new ModelItf(id);

			var modelName = ModelItf;

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.delete(DatabaseConnection.objectEndpoint(ModelItf.getTableName(), id.toString()))
				.reply(500, JSON.stringify('Server error'));

			assert.throws(function() {
				model.deleteObject(modelName);
			}, RequestException, "The RequestException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the request failed on the server', function() {
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

			assert.throws(function() {
				model.deleteObject(modelName);
			}, ResponseException, "The ResponseException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});
	});

	describe('#allObjects()', function() {
		it('should built a proper request to read all objects and return the proper array of objects', function() {
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
				"data": data
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.modelEndpoint(ModelItf.getTableName()))
				.reply(200, JSON.stringify(reponse));

			var allmodels = ModelItf.allObjects(modelName);
			assert.deepEqual(allmodels, models, "The array of models is not the same.");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the modelClass is not given', function() {
			var modelClass;

			assert.throws(function() {
					ModelItf.allObjects(modelClass);
				},
				ModelException, "The ModelException has not been thrown.");
		});

		it('should throw an error if the connection failed', function() {

			nock.disableNetConnect();

			assert.throws(function() {
				ModelItf.allObjects(ModelItf);
			}, RequestException, "The RequestException has not been thrown");
		});

		it('should throw an error if the request failed', function() {
			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.modelEndpoint(ModelItf.getTableName()))
				.reply(500, JSON.stringify('Server error'));

			assert.throws(function() {
				ModelItf.allObjects(ModelItf);
			}, RequestException, "The RequestException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the request failed on the server', function() {
			var response : SequelizeRestfulResponse = {
				"status": "error",
				"data": {}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.modelEndpoint(ModelItf.getTableName()))
				.reply(200, JSON.stringify(response));

			assert.throws(function() {
				ModelItf.allObjects(ModelItf);
			}, ResponseException, "The ResponseException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the request succeed but the data field is missing on the response', function() {
			var response = {
				"status": "success"
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.modelEndpoint(ModelItf.getTableName()))
				.reply(200, JSON.stringify(response));

			assert.throws(function() {
				ModelItf.allObjects(ModelItf);
			}, DataException, "The DataException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the request succeed but the data field is not an array', function() {
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

			assert.throws(function() {
				ModelItf.allObjects(ModelItf);
			}, DataException, "The DataException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the request succeed but one data response does not contain an id', function() {
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

			assert.throws(function() {
				ModelItf.allObjects(ModelItf);
			}, DataException, "The DataException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		})
	});

	describe('#associateObject()', function() {
		it('should throw an error if the object has an id '+ModelItf.NULLID, function() {
			var model = new ModelItf(ModelItf.NULLID);

			assert.throws(function() {
					model.associateObject(ModelItf, ModelItf, 42);
				},
				ModelException);
		});

		it('should throw an error if the modelclass1 is not given', function() {
			var model = new ModelItf(42);
			var toto;

			assert.throws(function() {
				model.associateObject(toto, ModelItf, 42);
			}, ModelException, "The ModelException has not been thrown");
		});

		it('should throw an error if the modelclass2 is not given', function() {
			var model = new ModelItf(42);
			var toto;

			assert.throws(function() {
				model.associateObject(ModelItf, toto, 42);
			}, ModelException, "The ModelException has not been thrown");
		});

		it('should throw an error if the second ID is not given', function() {
			var model = new ModelItf(42);
			var toto;

			assert.throws(function() {
				model.associateObject(ModelItf, ModelItf, toto);
			}, ModelException, "The ModelException has not been thrown");
		});

		it('should built a proper request to associate the objects and return true', function() {
			var id = 42;
			var id2 = 24;
			var model = new ModelItf(id);

			var modelName = ModelItf;

			var reponse : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.associatedObjectEndpoint(ModelItf.getTableName(), id.toString(), ModelItf.getTableName(), id2.toString()))
				.reply(200, JSON.stringify(reponse));

			var retour = model.associateObject(ModelItf, ModelItf, id2);
			assert.ok(retour, "The association did not return true");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the connection failed', function() {
			var model = new ModelItf(42);

			var modelName = ModelItf;

			nock.disableNetConnect();

			assert.throws(function() {
				model.associateObject(ModelItf, ModelItf, 23);
			}, RequestException, "The RequestException has not been thrown");
		});

		it('should throw an error if the request failed', function() {
			var id = 42;
			var id2 = 24;
			var model = new ModelItf(id);

			var modelName = ModelItf;

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.associatedObjectEndpoint(ModelItf.getTableName(), id.toString(), ModelItf.getTableName(), id2.toString()))
				.reply(500, JSON.stringify('Server error'));

			assert.throws(function() {
				model.associateObject(ModelItf, ModelItf, id2);
			}, RequestException, "The RequestException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the request failed on the server', function() {
			var id = 42;
			var id2 = 24;
			var model = new ModelItf(id);

			var modelName = ModelItf;

			var response : SequelizeRestfulResponse = {
				"status": "error",
				"data": {}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.put(DatabaseConnection.associatedObjectEndpoint(ModelItf.getTableName(), id.toString(), ModelItf.getTableName(), id2.toString()))
				.reply(200, JSON.stringify(response));

			assert.throws(function() {
				model.associateObject(ModelItf, ModelItf, id2);
			}, ResponseException, "The ResponseException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});
	});

	describe('#deleteObjectAssociation()', function() {
		it('should throw an error if the object has an id '+ModelItf.NULLID, function() {
			var model = new ModelItf(ModelItf.NULLID);

			assert.throws(function() {
					model.deleteObjectAssociation(ModelItf, ModelItf, 42);
				},
				ModelException);
		});

		it('should throw an error if the modelclass1 is not given', function() {
			var model = new ModelItf(42);
			var toto;

			assert.throws(function() {
				model.deleteObjectAssociation(toto, ModelItf, 42);
			}, ModelException, "The ModelException has not been thrown");
		});

		it('should throw an error if the modelclass2 is not given', function() {
			var model = new ModelItf(42);
			var toto;

			assert.throws(function() {
				model.deleteObjectAssociation(ModelItf, toto, 42);
			}, ModelException, "The ModelException has not been thrown");
		});

		it('should throw an error if the second ID is not given', function() {
			var model = new ModelItf(42);
			var toto;

			assert.throws(function() {
				model.deleteObjectAssociation(ModelItf, ModelItf, toto);
			}, ModelException, "The ModelException has not been thrown");
		});

		it('should built a proper request to associate the objects and return true', function() {
			var id = 42;
			var id2 = 24;
			var model = new ModelItf(id);

			var modelName = ModelItf;

			var reponse : SequelizeRestfulResponse = {
				"status": "success",
				"data": {}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.delete(DatabaseConnection.associatedObjectEndpoint(ModelItf.getTableName(), id.toString(), ModelItf.getTableName(), id2.toString()))
				.reply(200, JSON.stringify(reponse));

			var retour = model.deleteObjectAssociation(ModelItf, ModelItf, id2);
			assert.ok(retour, "The association did not return true");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the connection failed', function() {
			var model = new ModelItf(42);

			var modelName = ModelItf;

			nock.disableNetConnect();

			assert.throws(function() {
				model.deleteObjectAssociation(ModelItf, ModelItf, 23);
			}, RequestException, "The RequestException has not been thrown");
		});

		it('should throw an error if the request failed', function() {
			var id = 42;
			var id2 = 24;
			var model = new ModelItf(id);

			var modelName = ModelItf;

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.delete(DatabaseConnection.associatedObjectEndpoint(ModelItf.getTableName(), id.toString(), ModelItf.getTableName(), id2.toString()))
				.reply(500, JSON.stringify('Server error'));

			assert.throws(function() {
				model.deleteObjectAssociation(ModelItf, ModelItf, id2);
			}, RequestException, "The RequestException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the request failed on the server', function() {
			var id = 42;
			var id2 = 24;
			var model = new ModelItf(id);

			var modelName = ModelItf;

			var response : SequelizeRestfulResponse = {
				"status": "error",
				"data": {}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.delete(DatabaseConnection.associatedObjectEndpoint(ModelItf.getTableName(), id.toString(), ModelItf.getTableName(), id2.toString()))
				.reply(200, JSON.stringify(response));

			assert.throws(function() {
				model.deleteObjectAssociation(ModelItf, ModelItf, id2);
			}, ResponseException, "The ResponseException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});
	});

	describe('#getAssociatedObjects()', function() {
		it('should throw an error if the object has an id '+ModelItf.NULLID, function() {
			var model = new ModelItf(ModelItf.NULLID);
			var result = [];

			assert.throws(function() {
					model.getAssociatedObjects(ModelItf, ModelItf, result);
				},
				ModelException);
		});

		it('should throw an error if the modelclass1 is not given', function() {
			var model = new ModelItf(42);
			var result = [];
			var toto;

			assert.throws(function() {
				model.getAssociatedObjects(toto, ModelItf, result);
			}, ModelException, "The ModelException has not been thrown");
		});

		it('should throw an error if the modelclass2 is not given', function() {
			var model = new ModelItf(42);
			var result = [];
			var toto;

			assert.throws(function() {
				model.getAssociatedObjects(ModelItf, toto, result);
			}, ModelException, "The ModelException has not been thrown");
		});

		it('should throw an error if the result parameter is not given', function() {
			var model = new ModelItf(42);
			var toto;

			assert.throws(function() {
				model.getAssociatedObjects(ModelItf, ModelItf, toto);
			}, ModelException, "The ModelException has not been thrown");
		});

		it('should throw an error if the result parameter is not an array', function() {
			var model = new ModelItf(42);
			var result = null;

			assert.throws(function() {
				model.getAssociatedObjects(ModelItf, ModelItf, result);
			}, ModelException, "The ModelException has not been thrown");
		});

		it('should built a proper request to read all associated objects and return the proper array of objects', function() {
			var originID = 1;
			var ids = [42, 12, 8, 63];
			var models = [];
			var data = [];

			var model = new ModelItf(originID);

			for (var id in ids) {
				models.push(new ModelItf(id));
				data.push({"id": id});
			}

			var modelName = ModelItf;

			var reponse : SequelizeRestfulResponse = {
				"status": "success",
				"data": data
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
				.reply(200, JSON.stringify(reponse));

			var allmodels = [];
			model.getAssociatedObjects(ModelItf, ModelItf, allmodels);
			assert.deepEqual(allmodels, models, "The array of models is not the same.");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});


		it('should throw an error if the connection failed', function() {
			var model = new ModelItf(12);

			nock.disableNetConnect();

			assert.throws(function() {
				model.getAssociatedObjects(ModelItf, ModelItf, []);
			}, RequestException, "The RequestException has not been thrown");
		});

		it('should throw an error if the request failed', function() {
			var originID = 12;
			var model = new ModelItf(originID);

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
				.reply(500, JSON.stringify('Server error'));

			assert.throws(function() {
				model.getAssociatedObjects(ModelItf, ModelItf, []);
			}, RequestException, "The RequestException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the request failed on the server', function() {
			var originID = 12;
			var model = new ModelItf(originID);

			var response : SequelizeRestfulResponse = {
				"status": "error",
				"data": {}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
				.reply(200, JSON.stringify(response));

			assert.throws(function() {
				model.getAssociatedObjects(ModelItf, ModelItf, []);
			}, ResponseException, "The ResponseException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the request succeed but the data field is missing on the response', function() {
			var originID = 12;
			var model = new ModelItf(originID);

			var response = {
				"status": "success"
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
				.reply(200, JSON.stringify(response));

			assert.throws(function() {
				model.getAssociatedObjects(ModelItf, ModelItf, []);
			}, DataException, "The DataException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the request succeed but the data field is not an array', function() {
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

			assert.throws(function() {
				model.getAssociatedObjects(ModelItf, ModelItf, []);
			}, DataException, "The DataException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the request succeed but one data response does not contain an id', function() {
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

			assert.throws(function() {
				model.getAssociatedObjects(ModelItf, ModelItf, []);
			}, DataException, "The DataException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		})
	});

	describe('#getUniquelyAssociatedObject()', function() {
		it('should throw an error if the object has an id '+ModelItf.NULLID, function() {
			var model = new ModelItf(ModelItf.NULLID);

			assert.throws(function() {
					model.getUniquelyAssociatedObject(ModelItf, ModelItf);
				},
				ModelException);
		});

		it('should throw an error if the modelclass1 is not given', function() {
			var model = new ModelItf(42);
			var toto;

			assert.throws(function() {
				model.getUniquelyAssociatedObject(toto, ModelItf);
			}, ModelException, "The ModelException has not been thrown");
		});

		it('should throw an error if the modelclass2 is not given', function() {
			var model = new ModelItf(42);
			var toto;

			assert.throws(function() {
				model.getUniquelyAssociatedObject(ModelItf, toto);
			}, ModelException, "The ModelException has not been thrown");
		});

		it('should built a proper request to read a uniquely associated objects and return the proper array containing a unique object', function() {
			var originID = 1;
			var targetID = 42;

			var model = new ModelItf(originID);

			var modelName = ModelItf;

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
			var result = model.getUniquelyAssociatedObject(ModelItf, ModelItf);

			assert.deepEqual(result, expected, "The result ("+JSON.stringify(result)+" is not the expected one: "+JSON.stringify(expected));
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should built a proper request to read a uniquely associated objects and return false if there is no associated objects', function() {
			var originID = 1;

			var model = new ModelItf(originID);

			var modelName = ModelItf;

			var reponse : SequelizeRestfulResponse = {
				"status": "success",
				"data": []
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
				.reply(200, JSON.stringify(reponse));

			var result = model.getUniquelyAssociatedObject(ModelItf, ModelItf);
			assert.ok(!result, "The retrieve of associated objects returns true.");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});


		it('should throw an error if the connection failed', function() {
			var model = new ModelItf(12);

			nock.disableNetConnect();

			assert.throws(function() {
				model.getUniquelyAssociatedObject(ModelItf, ModelItf);
			}, RequestException, "The RequestException has not been thrown");
		});

		it('should throw an error if the request failed', function() {
			var originID = 12;
			var model = new ModelItf(originID);

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
				.reply(500, JSON.stringify('Server error'));

			assert.throws(function() {
				model.getUniquelyAssociatedObject(ModelItf, ModelItf);
			}, RequestException, "The RequestException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the request failed on the server', function() {
			var originID = 12;
			var model = new ModelItf(originID);

			var response : SequelizeRestfulResponse = {
				"status": "error",
				"data": {}
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
				.reply(200, JSON.stringify(response));

			assert.throws(function() {
				model.getUniquelyAssociatedObject(ModelItf, ModelItf);
			}, ResponseException, "The ResponseException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the request succeed but the data field is missing on the response', function() {
			var originID = 12;
			var model = new ModelItf(originID);

			var response = {
				"status": "success"
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
				.reply(200, JSON.stringify(response));

			assert.throws(function() {
				model.getUniquelyAssociatedObject(ModelItf, ModelItf);
			}, DataException, "The DataException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the request succeed but the data does not contain an id', function() {
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

			assert.throws(function() {
				model.getUniquelyAssociatedObject(ModelItf, ModelItf);
			}, DataException, "The DataException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
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
	})*/
});