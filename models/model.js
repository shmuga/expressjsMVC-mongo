"use strict";
var Model = function(pg,name,table){
    this.q = pg;
    this.name = name;
    this.table = table;
};

Model.prototype.query = function(callback) {
    var that = this;
    this.q.connect("mongodb://localhost:27017/test", function(err, database) {
        if(err) throw err;
        that.db = database;
        callback(database.collection(that.table));
    });
};
Model.prototype.getName = function(){return this.name};


module.exports = Model;