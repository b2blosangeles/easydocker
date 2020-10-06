(function() {
    var exec = require('child_process').exec;
    var obj = function(env, pkg) {
        var me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = new pkg.crowdProcess();
        this.action = (data, callback) => {
            switch(data.code) {
                case 'isAuthReady' :
                    callback({status:'success', isAuthReady : me.isAuthReady()});
                    break;
                case 'initPassword' :
                    me.initPassword(data.password, callback);
                    break;
                default:
                    callback({status:'failure', message : '404 wrong code of auth!' + data.code});
                    break;
            
            }
        };
        this.isAuthReady = () => {
            let fn = '/var/_localAppDATA/authData.json';
            let auth = {};
            try {
                auth = pkg.require(fn);
            } catch (e) {

            }
            return (auth.root) ? true : false;
        };
        this.initPassword = (str, callback) => {
            let fn = '/var/_localAppDATA/authData.json';
            let auth = {};
            try {
                auth = pkg.require(fn);
            } catch (e) {}
            
            auth['root'] = str;
            fs.writeFile(fn, JSON.stringify(auth), 
                (err) => {
                    callback({status:'success'});
                });
        };

        this.addLoginToken = (token, callback) => {

        };
        this.removeLoginToken = (token, callback) => {

        };
        this.cleanOvertime = (callback) => {

        };
    }
    module.exports = obj;
})()