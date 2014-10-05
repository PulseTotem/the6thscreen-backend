/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />

/// <reference path="../../app/scripts/core/DatabaseConnection.ts" />
/// <reference path="../../app/scripts/model/ModelItf.ts" />

var assert = require("assert");
var nock = require("nock");

describe('ModelItf', function() {
	describe('#constructor(id)', function() {
		it('should store the given id', function() {
			var id = 12;
			var model = new ModelItf(id);

			assert.equal(model.getId(), id, "The id is correctly stored.");
		})
	});

	describe('#createObject()', function() {
		it('should throw an error if the object already has an id', function() {
			var model = new ModelItf(42);

			assert.throws(function() {
				model.createObject(ModelItf, model.toJSONObject());
			},
			ModelException);
		});

		it('should built a proper request to create the object and store the id', function() {
			var model = new ModelItf(null);
			var id = 42;

			var modelName = ModelItf;
			var jsonParam = model.toJSONObject();

			var reponse : SequelizeRestfulResponse = {
				"status": "success",
				"data": model.toJSONObject()
			};
			reponse.data['id'] = 42;

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.post(DatabaseConnection.modelEndpoint(ModelItf.getTableName()), model.toJSONObject())
				.reply(200, JSON.stringify(reponse));

			var retour = model.createObject(modelName, jsonParam);
			assert.ok(retour, "The creation did not return true");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
			assert.equal(model.getId(), id, "The ID is not recorded in the object.");
		});

		it('should throw an error if no modelclass is given', function() {
			var model = new ModelItf(null);
			var toto;

			assert.throws(function() {
				model.createObject(toto, model.toJSONObject());
			}, ModelException, "The ModelException has not been thrown");
		});

		it('should throw an error if no data is given', function() {
			var model = new ModelItf(null);
			var toto;

			assert.throws(function() {
				model.createObject(ModelItf, toto);
			}, ModelException, "The ModelException has not been thrown");
		});

		it('should throw an error if the connection failed', function() {
			var model = new ModelItf(null);

			var modelName = ModelItf;
			var jsonParam = model.toJSONObject();

			nock.disableNetConnect();

			assert.throws(function() {
				model.createObject(modelName, jsonParam);
			}, RequestException, "The RequestException has not been thrown");
		});

		it('should throw an error if the request failed', function() {
			var model = new ModelItf(null);

			var modelName = ModelItf;
			var jsonParam = model.toJSONObject();

			var restClientMock = nock(DatabaseConnection.getBaseURL())
			 .post(DatabaseConnection.modelEndpoint(ModelItf.getTableName()), model.toJSONObject())
			 .reply(500, JSON.stringify('Server error'));

			assert.throws(function() {
				model.createObject(modelName, jsonParam);
			}, RequestException, "The RequestException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the request failed on the server', function() {
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

			assert.throws(function() {
				model.createObject(modelName, jsonParam);
			}, ResponseException, "The ResponseException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the request succeed but the data field is missing on the response', function() {
			var model = new ModelItf(null);

			var modelName = ModelItf;
			var jsonParam = model.toJSONObject();

			var response = {
				"status": "success"
			};

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.post(DatabaseConnection.modelEndpoint(ModelItf.getTableName()), model.toJSONObject())
				.reply(200, JSON.stringify(response));

			assert.throws(function() {
				model.createObject(modelName, jsonParam);
			}, DataException, "The DataException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the request succeed but the data field is empty', function() {
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

			assert.throws(function() {
				model.createObject(modelName, jsonParam);
			}, DataException, "The DataException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should throw an error if the request succeed but the data response does not contain an id', function() {
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

			assert.throws(function() {
				model.createObject(modelName, jsonParam);
			}, DataException, "The DataException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		})
	});

	describe('#readObject()', function() {
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
		it('should throw an error if the object has an id null', function() {
			var model = new ModelItf(null);

			assert.throws(function() {
					model.updateObject(ModelItf, model.toJSONObject());
				},
				ModelException);
		});

		it('should throw an error if the object has an id undefined', function() {
			var model = new ModelItf(undefined);

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
		it('should throw an error if the object has an id null', function() {
			var model = new ModelItf(null);

			assert.throws(function() {
					model.deleteObject(ModelItf);
				},
				ModelException);
		});

		it('should throw an error if the object has an id undefined', function() {
			var model = new ModelItf(undefined);

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
		it('should throw an error if the object has an id null', function() {
			var model = new ModelItf(null);

			assert.throws(function() {
					model.associateObject(ModelItf, ModelItf, 42);
				},
				ModelException);
		});

		it('should throw an error if the object has an id undefined', function() {
			var model = new ModelItf(undefined);

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
		it('should throw an error if the object has an id null', function() {
			var model = new ModelItf(null);

			assert.throws(function() {
					model.deleteObjectAssociation(ModelItf, ModelItf, 42);
				},
				ModelException);
		});

		it('should throw an error if the object has an id undefined', function() {
			var model = new ModelItf(undefined);

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
		it('should throw an error if the object has an id null', function() {
			var model = new ModelItf(null);
			var result = [];

			assert.throws(function() {
					model.getAssociatedObjects(ModelItf, ModelItf, result);
				},
				ModelException);
		});

		it('should throw an error if the object has an id undefined', function() {
			var model = new ModelItf(undefined);
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
			var result = model.getAssociatedObjects(ModelItf, ModelItf, allmodels);
			assert.ok(result, "The retrieve of associated objects did not return true.");
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
		it('should throw an error if the object has an id null', function() {
			var model = new ModelItf(null);
			var result = [];

			assert.throws(function() {
					model.getUniquelyAssociatedObject(ModelItf, ModelItf, result);
				},
				ModelException);
		});

		it('should throw an error if the object has an id undefined', function() {
			var model = new ModelItf(undefined);
			var result = [];

			assert.throws(function() {
					model.getUniquelyAssociatedObject(ModelItf, ModelItf, result);
				},
				ModelException);
		});

		it('should throw an error if the modelclass1 is not given', function() {
			var model = new ModelItf(42);
			var result = [];
			var toto;

			assert.throws(function() {
				model.getUniquelyAssociatedObject(toto, ModelItf, result);
			}, ModelException, "The ModelException has not been thrown");
		});

		it('should throw an error if the modelclass2 is not given', function() {
			var model = new ModelItf(42);
			var result = [];
			var toto;

			assert.throws(function() {
				model.getUniquelyAssociatedObject(ModelItf, toto, result);
			}, ModelException, "The ModelException has not been thrown");
		});

		it('should throw an error if the result parameter is not given', function() {
			var model = new ModelItf(42);
			var toto;

			assert.throws(function() {
				model.getUniquelyAssociatedObject(ModelItf, ModelItf, toto);
			}, ModelException, "The ModelException has not been thrown");
		});

		it('should throw an error if the result parameter is not an array', function() {
			var model = new ModelItf(42);
			var result = null;

			assert.throws(function() {
				model.getUniquelyAssociatedObject(ModelItf, ModelItf, result);
			}, ModelException, "The ModelException has not been thrown");
		});

		it('should built a proper request to read a uniquely associated objects and return the proper array containing a unique object', function() {
			var originID = 1;
			var targetID = 42;

			var model = new ModelItf(originID);

			var finalResult = [new ModelItf(targetID)];

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

			var allmodels = [];
			var result = model.getUniquelyAssociatedObject(ModelItf, ModelItf, allmodels);
			assert.ok(result, "The retrieve of associated objects did not return true.");
			assert.deepEqual(allmodels, finalResult, "The array of models is not the same.");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});

		it('should built a proper request to read a uniquely associated objects and return an empty array if there is no associated objects', function() {
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

			var result = model.getUniquelyAssociatedObject(ModelItf, ModelItf, []);
			assert.ok(result, "The retrieve of associated objects did not return true.");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});


		it('should throw an error if the connection failed', function() {
			var model = new ModelItf(12);

			nock.disableNetConnect();

			assert.throws(function() {
				model.getUniquelyAssociatedObject(ModelItf, ModelItf, []);
			}, RequestException, "The RequestException has not been thrown");
		});

		it('should throw an error if the request failed', function() {
			var originID = 12;
			var model = new ModelItf(originID);

			var restClientMock = nock(DatabaseConnection.getBaseURL())
				.get(DatabaseConnection.associationEndpoint(ModelItf.getTableName(), originID.toString(), ModelItf.getTableName()))
				.reply(500, JSON.stringify('Server error'));

			assert.throws(function() {
				model.getUniquelyAssociatedObject(ModelItf, ModelItf, []);
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
				model.getUniquelyAssociatedObject(ModelItf, ModelItf, []);
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
				model.getUniquelyAssociatedObject(ModelItf, ModelItf, []);
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
				model.getUniquelyAssociatedObject(ModelItf, ModelItf, []);
			}, DataException, "The DataException has not been thrown");
			assert.ok(restClientMock.isDone(), "The mock request has not been done.");
		});


	});
});