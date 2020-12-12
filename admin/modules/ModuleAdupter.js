const { send } = require('process');

(function() {
    var obj = function(env, pkg, req, res) {
        const me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = new pkg.crowdProcess(),
            data_dir = '/var/_localAppDATA',
            key_dir = '/var/_localAppKey',
            sitesCfgFn = data_dir + '/_servers_cfg.json';

        this.getSiteIP = (serverName) => {
            var v = {}, p;
            try {
                var p = pkg.require(sitesCfgFn);
                if (typeof p == 'object') {
                    v = p;
                }
            } catch (e) {}
            var cfg = v[serverName];
            if (!cfg) {
                return null;
            } else {
                return cfg.unidx * 10000 + parseInt(cfg.docker.ports[0]);
            }
        }

        this.call = (opt) => {
            let p = req.url;
            let mp = p.match(/\/([^\/]+)\/([^\/]+)\/(ui|api)\/(.+|$)/);
            if (!mp) {
                callback({ error : {
                    message: 'Unacceptable uri ' + p
                }});
            } else {
                me.dockerEnv = {};
                
                try {
                    me.dockerEnv = pkg.require(data_dir + '/_env.json');
                } catch (e) {}
                try {
                    me.dockerEnv.rootKey = pkg.require(key_dir + '/' + mp[2] + '.json');
                } catch (e) {}
                const dirFn = data_dir + '/' + mp[1] + '/' + mp[2] + '/code/dockerSetting/adupter/' + mp[3] + '/' + mp[4];
                me.dockerEnv.file = dirFn;

                me.dockerEnv.port = me.getSiteIP(mp[2]);

                if (opt === 'post' && mp[3] === 'api') {
                    me.post();
                } else {
                    me.get(mp[3]);
                }
            }
        },
    
        this.get = (type) => {
            if (type === 'ui') {
                fs.stat(me.dockerEnv.file, function(err, stat) {
                    if(err == null) {
                        fs.readFile(me.dockerEnv.file, (err, data)=> {
                            me.sendHeader('js');
                            res.send(data);
                        });
                    } else {
                        let fn = me.dockerEnv.file.split('/').pop().split('#')[0].split('?')[0];
                        res.send(fn + ' does not exist!');
                    }
                });
            } else {
                try {
                    var MgetApi= pkg.require(me.dockerEnv.file);
                    var mgetapi = new MgetApi((data) => {
                        res.send(data);
                    });
                    mgetapi.run(me.dockerEnv);               
                } catch (e) {
                    res.send(e.message);
                }
            }
        },
        this.post = () => {
            res.send(req.body);
        },
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
    }
    module.exports = obj;
})()
