const { send } = require('process');

(function() {
    var obj = function(p, env, pkg, req, res) {
        var me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = new pkg.crowdProcess(),
            code_dir = '/var/_localAppDATA';
        this.getCode = () => {
            var mp = p.match(/\_dockerAdupter\/(ui|api)\/([^\/]+)\/([^\/]+)\/([^\s]+)\.vue$/)
            if (!mp || mp.length !==5) {
                res.send('Error! uri format wrong.');
            } else {
                if (mp[1] === 'ui') {
                    const fn = code_dir  + '/' + mp[2] + '/' + mp[3] + '/code/dockerSetting/adupter/ui/' + mp[4];
                    fs.stat(fn, function(err, stat) {
                        if(err == null) {
                            res.sendFile(fn);
                        } else {
                            res.send(mp[4] + '.vue does not exist!');
                        }
                    });
                } else if (mp[1] === 'api') {
                    var MgetApi= pkg.require(env.root+ '/modules/moduleGetApi.js');
				
                    var mgetapi = new MgetApi(env, pkg);
                    mgetapi.sendIt(mp,
                        (data) => {
                            res.send(data);
                        }
                    );
                } else {
                    res.send('Error! uri format wrong.');
                }
            }
        }

        this.postCode = () => {
            var mp = p.match(/\_dockerAdupter\/api\/([^\/]+)\/([^\/]+)\/([^\s]+)\.vue$/)
            if (!mp || mp.length !==4) {
                res.send('Error! uri format wrong.');
            } else {
                const fn = code_dir  + '/' + mp[1] + '/' + mp[2] + '/code/dockerSetting/adupter/ui/' + mp[3];
                fs.stat(fn, function(err, stat) {
                    if(err == null) {
                        res.sendFile(fn);
                    } else {
                        res.send(fn + 'does not exist!');
                    }
                });
            }

        }

    }
    module.exports = obj;
})()
