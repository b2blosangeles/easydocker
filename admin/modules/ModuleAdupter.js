const { send } = require('process');

(function() {
    var obj = function(p, env, pkg, req, res) {
        var me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = new pkg.crowdProcess();

        var mp = p.match(/\_dockerAdupter\/([^\/]+)\/([^\/]+)(\/|)\/code\.vue$/)

        var code_dir = '/var/_localAppDATA';

        this.sendUI = () => {
            if (!mp && mp.length !==3) {
                res.send('Error uri format');
            } else {
                const fn = code_dir  + '/' + mp[1] + '/' + mp[2] + '/code/dockerSetting/adupter/ui/main.js';
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
