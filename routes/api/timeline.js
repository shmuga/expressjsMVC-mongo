var express = require('express');
var router = express.Router();
var models = require('../../models');
var exec = require('exec');



router.post('/emotions/company/text', function(req, res) {

    var result = [
        {
            data: [],
            label: 'positive',
            color: '#00CC66'
        },
        {
            data: [],
            label: 'negative',
            color: '#FF0000'
        }
    ];

    models.fbTimelines.getTextTimilineEmotions(function(data){
        for (e in data){
            result[0].data.push([data[e].date,data[e].positive]);
        }

        for (e in data){
            result[1].data.push([data[e].date,data[e].negative]);
        }
        res.send(JSON.stringify(result));
    });

});

router.post('/emotions/company/post', function(req, res) {

    var result = [
        {
            data: [],
            label: 'positive',
            color: '#00CC66'
        },
        {
            data: [],
            label: 'negative',
            color: '#FF6666'
        }
    ];

    models.fbTimelines.getPostTimilineEmotions(function(data){
        for (e in data){
            result[0].data.push([data[e].date,data[e].positive]);
        }

        for (e in data){
            result[1].data.push([data[e].date,data[e].negative]);
        }
        res.send(JSON.stringify(result));
    });

});

router.post('/count/company/', function(req, res) {

    var result = [
        {
            data: [],
            label: 'count',
            color: '#768294'
        }
    ];

    models.fbTimelines.getDynamicCont(function(data){
        for (e in data){
            result[0].data.push([data[e].date,data[e].count]);
        }

        res.send(JSON.stringify(result));
    });

});



module.exports = router;
