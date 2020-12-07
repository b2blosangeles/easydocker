const { send } = require('process');

(function() {
    var obj = function(p, env, pkg, req, res) {
        var me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = new pkg.crowdProcess(),
            code_dir = '/var/_localAppDATA',
            key_dir = '/var/_localAppKey';

        this.sendHeader = (filetype) => {
            var me = this;
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.header('Access-Control-Allow-Headers', 'Content-Type'); 
            if (filetype === 'js' || filetype === 'jsx' || filetype === 'vue') {
                res.setHeader('Content-Type', "text/javascrip");
            } else if (filetype == 'css') {
                me.is_css = true;
                res.setHeader('Content-Type', "text/css");
            } else {
                res.setHeader('Content-Type', "text/plain");
            }			
        }

        this.getCode = () => {
            var mp = p.match(/\_dockerAdupter\/(ui|api)\/([^\/]+)\/([^\/]+)\/([^\/]+)$/)
            if (!mp || mp.length !== 5) {
                res.send('Error! uri format wrong.');
            } else {
                if (mp[1] === 'ui') {
                    const fn = code_dir  + '/' + mp[2] + '/' + mp[3] + '/code/dockerSetting/adupter/ui/' + mp[4];
                    fs.stat(fn, function(err, stat) {
                        // me.sendHeader = ('vue');
                        if(err == null) {
                            fs.readFile(fn, (err, data)=> {
								res.send(data);
							});
                        } else {
                            res.send(mp[4] + '.vue does not exist!');
                        }
                    });
                } else if (mp[1] === 'api') {
                    const dirn = code_dir  + '/' + mp[2] + '/' + mp[3] + '/code/dockerSetting/adupter/api';
                    const fn = dirn + '/' + mp[4];
                    var MgetApi= pkg.require(fn);

                    let passKey =  pkg.require(key_dir + '/' +mp[3]+ '.json');
                    var cfg = {
                        host: '10.10.10.254',
                        user: 'root',
                        port : '13306',
                        password: passKey.key,
                        database : 'mysql'
                    };

                    var mgetapi = new MgetApi(dirn, pkg, cfg, (data) => {
                            res.send(data);
                    });
                    mgetapi.run();
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
                const dir = code_dir  + '/' + mp[1] + '/' + mp[2] + '/code/dockerSetting/adupter/api/' + mp[3];
                
            }

        }

    }
    module.exports = obj;
})()
