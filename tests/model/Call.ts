/**
 * @author Christian Brel <brel@i3s.unice.fr, ch.brel@gmail.com>
 */

/// <reference path="../../libsdef/mocha.d.ts" />

/// <reference path="../../app/scripts/model/Call.ts" />

var assert = require("assert");

describe('Call', function(){
    it('should have right name', function(){
        var c = new Call("A name!");
        assert.equal(c.name(), "A name!");
    });
});