(function() {
    var exec = require('child_process').exec;
    var obj = function(env, pkg) {
        var me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = new pkg.crowdProcess(),
            fn = '/var/_localAppDATA/authData.json';

        this.action = (data, callback) => {
            switch(data.code) {
                case 'isAuthReady' :
                    callback({status:'success', isAuthReady : me.isAuthReady()});
                    break;

                case 'initPassword' :
                    me.initPassword(data.password, callback);
                    break;

                case 'signin' :
                    me.signin(data.password, callback);
                    break;

                case 'isTokenLogin' :
                    me.isTokenLogin(data.token, callback);
                    break;               

                default:
                    callback({status:'failure', message : '404 wrong code of auth!' + data.code});
                    break;
            
            }
        };
        this.isAuthReady = () => {
            let auth = {};
            try {
                auth = pkg.require(fn);
            } catch (e) {

            }
            return (auth.root) ? true : false;
        };
        this.initPassword = (str, callback) => {
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

        this.signin = (password, callback) => {
            let auth = {};
            try {
                auth = pkg.require(fn);
            } catch (e) {}
            if (auth['root'] === password) {
                let token = 'TK_' + new Date().getTime();
                if (!auth.tokens) auth.tokens = {};
 
                for (var o in auth.tokens) {
                    if (new Date().getTime() - auth.tokens[o] > 60000) {
                    //   delete auth.tokens[o];
                    }
                }
                auth.tokens[token] = new Date().getTime();
                fs.writeFile(fn, JSON.stringify(auth), 
                (err) => {
                    callback({status: 'success', token : token});
                });
                
            } else {
                callback({status: 'failure', message : 'Wrong password ' + password + '!'});
            }
        };

        this.isTokenLogin = (token, callback) => {
            let auth = {};
            try {
                auth = pkg.require(fn);
            } catch (e) {}
            if (auth['root']) {
                for (var o in auth.tokens) {
                    if (new Date().getTime() - auth.tokens[o] > 60000) {
                       delete auth.tokens[o];
                    }
                }
                if (auth.tokens[token]) {
                    auth.tokens[token] = new Date().getTime();
                    fs.writeFile(fn, JSON.stringify(auth), 
                    (err) => {
                        callback({status: 'success', token : token});
                    });
                }
            } else {
                callback({status: 'failure', message : 'Wrong token ' + token + '!'});
            }
        };

        this.removeLoginToken = (token, callback) => {

        };
        this.cleanOvertime = (callback) => {

        };
    }
    module.exports = obj;
})()