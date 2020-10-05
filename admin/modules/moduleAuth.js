(function() {
    var exec = require('child_process').exec;
    var obj = function(env, pkg, req, res) {
        var me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = new pkg.crowdProcess();
        this.action = () => {
            res.send('action');
        };
        this.isAuthReady = () => {
            let fn = '/var/_localAppDATA/authData.json';
            let auth = {};
            try {
                auth = require(fn);
            } catch (e) {

            }
            return true;
            return (auth.root) ? true : false;
        };
        this.initAuth = (path, branch, callback) => {

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