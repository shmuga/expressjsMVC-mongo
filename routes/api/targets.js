var express = require('express');
var router = express.Router();
var models = require('../../models');
var exec = require('exec');
var _ = require('lodash');


router.get('/get/', function(req, res) {

    var beforeFilter  = [];

    var afterGet = function(data){
        beforeFilter = data;
        models.Target.readAllFiltered(filter)
    };
    var filter = function(data){
        for (k in beforeFilter){
            for (x in data){
                if (beforeFilter[k].faid == data[x]['fb_account_id']){
                    beforeFilter[k].connections = data[x].connections;
                }
            }
        }
        res.send(beforeFilter);
    };

    models.Target.readAll(afterGet);

});

router.get('/anal/',function(req,res){

    result = [{
        messages: [
            {

            }
        ]
    }];

    var updateTimeline = function(k,data) {
        var text = data;
        result[0].messages = [data[k]];
        //console.log(k);
        //console.log(data[k]);
        console.log('python3 /var/www/linked/python/post_ton.py \'' +  JSON.stringify(result).replace(/\\"|'/g, '') + '\'');

        exec('python3 /var/www/linked/python/post_ton.py \'' +  JSON.stringify(result).replace(/\\"|'/g, '') + '\'', function(err, out, code) {
            console.log(out);
            var emotion = JSON.parse(out);
            //console.log(emotion);
            console.log(JSON.stringify(emotion));
            console.log("goto update");
            models.fbTimelines.updateEmotions(emotion,function(table){
                if (k>0){
                    //console.log(k);
                    updateTimeline(k-1,text);
                }else{
                    res.send('finish');
                }
            });
        });
    };

    models.Target.allPostsFromList(function(data){
        var k = data.length;
        //console.log(k);
        updateTimeline(k-1,data);

    });
});

router.post('/connections/secondlevel', function(req, res) {
    //console.log(req.body);
    var sendid = '';
    for (k in req.body.ids){
        if (req.body.ids[k] === true){
            sendid += k + ',';
        }
    }
    sendid = sendid.substring(0, sendid.length - 1);
    //console.log(sendid);

    models.Target.getSecondLevelConnections(sendid,function(data){
        var sid = '';
        var countdata = data;
        console.log(countdata);
        for (k in data){
            sid += data[k]['fb_account_id_connected'] + ',';
        }
        sid = sid.substring(0, sid.length-1);


        models.Target.getSecondLevelFull(sid,function(data){
            for (e in data){
                var tmp = _.find(countdata,{'fb_account_id_connected' : data[e]['faid']});
                if (tmp){
                    data[e].connections = tmp.count;
                }else{
                    data[e].connections = 0;
                }
            }
            //console.log(JSON.stringify(data));
            res.send(JSON.stringify(data));
        });
    });
    //var beforeFilter  = [];
    //
    //var afterGet = function(data){
    //    beforeFilter = data;
    //    models.Target.readAllFiltered(filter)
    //};
    //var filter = function(data){
    //    for (k in beforeFilter){
    //        for (x in data){
    //            if (beforeFilter[k].faid == data[x]['fb_account_id']){
    //                beforeFilter[k].connections = data[x].connections;
    //            }
    //        }
    //    }
    //    res.send(beforeFilter);
    //};
    //
    //models.Target.readAll(afterGet);

});



module.exports = router;
