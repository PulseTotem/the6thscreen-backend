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
				model.createObject("ModelItf", model.toJSONObject());
			},
			Error);
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

			ModelItf.readObject(modelName, id);
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
	})
});