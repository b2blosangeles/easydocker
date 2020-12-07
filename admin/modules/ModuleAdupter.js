const { send } = require('process');

(function() {
    var obj = function(p, env, pkg, req, res) {
        var me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = new pkg.crowdProcess();

        

        var code_dir = '/var/_localAppDATA';

        this.getCode = () => {
            var mp = p.match(/\_dockerAdupter\/ui\/([^\/]+)\/([^\/]+)\/([^\s]+)\.vue$/)
            if (!mp || mp.length !==4) {
                res.send('Error! uri format wrong.');
            } else {
                const fn = code_dir  + '/' + mp[1] + '/' + mp[2] + '/code/dockerSetting/adupter/ui/' + mp[3];
                fs.stat(fn, function(err, stat) {
                    if(err == null) {
                        res.sendFile(fn);
                    } else {
                        res.send(mp[3] + '.vue does not exist!');
                    }
                });
            }
        }

        this.postCode = () => {
            var mp = p.match(/\_dockerAdupter\/api\/([^\/]+)\/([^\/]+)\/([^\s]+)\.vue$/)
            if (!mp && mp.length !==3) {
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
