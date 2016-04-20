/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="../../libsdef/mocha.d.ts" />
/// <reference path="../../libsdef/nock.d.ts" />
/// <reference path="../../libsdef/sinon.d.ts" />

/// <reference path="../../scripts/model/RendererTheme.ts" />

var assert = require("assert");
var nock : any = require("nock");
var sinon : SinonStatic = require("sinon");

describe('RendererTheme', function() {
	describe('#constructor', function () {
		it('should store the name', function () {
			var name = "machin";
			var c = new RendererTheme(name);
			assert.equal(c.name(), name, "The name is not stored correctly.");
		});

		it('should store the ID', function () {
			var id = 52;
			var c = new RendererTheme("", id);
			assert.equal(c.getId(), id, "The ID is not stored.");
		});

		it('should store the complete attribute', function () {
			var c = new RendererTheme("", 12, true);
			assert.equal(c.isComplete(), true, "The complete attribute is not stored.");
		});
	});

	describe('#checkCompleteness()', function() {
		it('should return false if the object is empty', function(done) {
			var b =  new RendererTheme();
			var success = function () {
				assert.equal(b.isComplete(), false, "The rendererTheme should not be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);

		});

		it('should return true if the object has a name and an Id', function(done) {
			var b = new RendererTheme('toto', 12);
			var success = function () {
				assert.equal(b.isComplete(), true, "The rendererTheme should be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});

		it('should return false if the object has an empty name and an Id', function(done) {
			var b = new RendererTheme('', 12);
			var success = function () {
				assert.equal(b.isComplete(), false, "The rendererTheme should not be complete.");
				done();
			};

			var fail = function (error) {
				done(error);
			};
			b.checkCompleteness(success, fail);
		});
	});

	describe('#fromJSONobject', function () {
		it('should create the right object', function () {
			var json = {
				"id": 42,
				"name": "toto",
				"complete":true
			};

			var retrieve = RendererTheme.fromJSONObject(json);
			var expected = new RendererTheme("toto", 42, true);

			assert.deepEqual(retrieve, expected, "The retrieve rendererTheme (" + retrieve + ") does not match with the expected one (" + expected + ")");
		});

		it('should create the right object even if it is not complete', function () {
			var json = {
				"id": 42,
				"name": "toto",
				"complete":false
			};

			var retrieve = RendererTheme.fromJSONObject(json);
			var expected = new RendererTheme("toto", 42);

			assert.deepEqual(retrieve, expected, "The retrieve rendererTheme (" + retrieve + ") does not match with the expected one (" + expected + ")");
		});
	});

	describe('#toJsonObject', function () {
		it('should create the expected JSON Object', function () {
			var c = new RendererTheme("toto", 52);
			var expected = {
				"name": "toto",
				"id": 52,
				"complete": false,
				"createdAt":null,
				"updatedAt":null
			};
			var json = c.toJSONObject();

			assert.deepEqual(json, expected, "The JSON object (" + JSON.stringify(json) + ") and the expected JSON (" + JSON.stringify(expected) + ") do not match.");
		})
	});

	describe('#updateAttribute', function () {
		it('should update the name when asking', function (done) {
			var model = new RendererTheme("", 12);
			var modelUpdated = new RendererTheme("tata", 12, true);

			var responseRead : any = model.toJSONObject();

			var restClientMockRead = nock(BackendConfig.getDBBaseURL())
				.get(BackendConfig.objectEndpoint(RendererTheme.getTableName(), model.getId().toString()))
				.reply(200, JSON.stringify(responseRead));

			var newInfo = {
				'id' : model.getId(),
				'method': 'setName',
				'value': modelUpdated.name()
			};

			var responseUpdate : any = modelUpdated.toJSONObject();

			var restClientMockUpdate = nock(BackendConfig.getDBBaseURL())
				.put(BackendConfig.objectEndpoint(RendererTheme.getTableName(), model.getId().toString()), modelUpdated.toJSONObject())
				.reply(200, JSON.stringify(responseUpdate));

			var success : Function = function () {
				assert.ok(restClientMockRead.isDone(), "The object is not read.");
				assert.ok(restClientMockUpdate.isDone(), "The request update has not been done.");
				done();
			};

			var fail : Function = function (error) {
				done(error);
			};

			ModelItf.updateAttribute(RendererTheme, newInfo, success, fail);
		});
	});
});