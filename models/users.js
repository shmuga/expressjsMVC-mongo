"use strict";
var Model = require('./model');

var m = function(pg){
    this.q = pg;
    this.name = "User";
    this.table = "users";
};
m.prototype = Object.create(Model.prototype);


m.prototype.findAll = function(callback) {
    var that = this;
    this.query(function(db){
        db.find({}).toArray(function(err,docs){
            that.db.close();
            callback(docs);
        });
    });
};

module.exports = m;
