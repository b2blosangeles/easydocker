const express = require('express');
const app = express();
var ECT = require('ect');
var bodyParser = require('body-parser');
var path = require('path');

const port = 10000;
var env = {
    root : __dirname,
    dataFolder : '/var/_localData',
    appFolder : '/var/_localApp'
}
var pkg = {
    require : function(fileName, isCache) {
        if (!isCache) {
            delete require.cache[fileName];
        }
        return require(fileName);
    },
    md5 : require('md5'),
    crowdProcess : require(__dirname + '/vendor/crowdProcess/crowdProcess.js'),
    tpl : ECT({ watch: true, cache: false, root: __dirname + '/views', ext : '.ect' })
}

    
app.engine('ect', pkg.tpl.render);

app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies   
  extended: true
})); 

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get(/(.+)$/i, (req, res) => {
    try {
        var APP = pkg.require(__dirname + '/modules/appRouter.js');
        var app = new APP(env, pkg, req, res);
        app.get();
    } catch (err) {
        res.send(err.toString());
    }

});

app.post(/(.+)$/i, (req, res) => {
    try {
        var APP = pkg.require(__dirname + '/modules/appRouter.js');
        var appPost = new APP(env, pkg, req, res);
        appPost.post();
    } catch (err) {
        res.send(err.toString());
    }

});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
