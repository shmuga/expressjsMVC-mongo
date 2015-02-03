/**
 * Created by mark on 12/25/14.
 */
var express = require('express');
var router = express.Router();
var models = require('../../models');
var exec = require('exec');
var _ = require('lodash');
router.get('/fb/network', function(req, res) {

    var result= {};

    var afterGet = function(data){
        result.nodes = data;
        models.Target.readAllFacebookConnectionsNetwork(sendResult);
    };

    var sendResult = function(data){
        result.edges = data;
        res.send(result);
    };

    models.Target.readAllFacebookId(afterGet);

});

router.get('/fb/cluster', function(req, res) {

    var result= {};

    var afterGet = function(data){
        result.nodes = data;
        models.Target.readAllFacebookConnectionsNetwork(sendResult);
    };

    var sendResult = function(data){
        result.edges = data;
        var gamma = '2.0';
        var epsilon = '1e-3';

        //console.log('python3 /var/www/linked/python/cluster_graph.py \'[' + JSON.stringify(result) + ']\' ' + gamma +' '+epsilon);
        exec('python3 /var/www/linked/python/cluster_graph.py \'[' + JSON.stringify(result) + ']\' ' + gamma +' '+epsilon, function(err, out, code) {
            if (err instanceof Error)
                throw err;
            //process.stderr.write(err);
            //process.stdout.write(out);
            //process.exit(code);

            var clusters = JSON.parse(out);
            //console.log(clusters.nodes);
            var output = {
                nodes: [],
                edged: []
            };
            //for (k in result.nodes){
            //    var tmp = _.find(clusters.nodes,{'id' : result.nodes[k].id});
            //    console.log(tmp);
            //    if (tmp !== undefined){
            //        result.nodes[k].value = tmp.value;
            //        result.nodes[k].group = tmp.group;
            //    }
            //}

            for (k in clusters.nodes){
                var tmp = _.find(result.nodes,{'id' : clusters.nodes[k].id});
                console.log(tmp);
                if (tmp !== undefined && clusters.nodes[k].value>0){
                    clusters.nodes[k].title = tmp.title;
                    output.nodes.push(clusters.nodes[k]);
                    //cluster.nodes[k].group = tmp.group;
                }else{
                    output.nodes.push({
                        "id": tmp.id,
                        "title": tmp.title
                    });
                }
            }
            output.edges = result.edges;
            res.send(JSON.stringify(output));
            //res.send(JSON.stringify(result));
        });
    };




    models.Target.readAllFacebookId(afterGet);

});

module.exports = router;