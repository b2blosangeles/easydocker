(function() {
    var obj = function(env, pkg) {
        var fs = require('fs');
        var exec = require('child_process').exec;

        var sites_cfg = '/var/_localAppDATA/_sites_cfg.json';
        var data_dir = '/var/_localAppDATA';
        
        var _env = {};
        try {
            _env = require(data_dir + '/_env.json');
        } catch (e) {}


        this.pullCode = (serverName, callback) => {
            var site_path = data_dir + '/sites/' + serverName;

            var cmd = 'cd ' + site_path + ' && git pull';

            exec(cmd, {maxBuffer: 1024 * 2048},
                function(error, stdout, stderr) {
                    callback({status:'success'});
            });
        }; 

        this.stopVHost = (serverName, callback) => {
            var site_container = serverName + '-container';
            var cmd = '';
            cmd += 'echo "Start docker app .."' + "\n";
            cmd += 'docker container stop ' + site_container + "\n";
            cmd += 'docker container rm ' + site_container + "\n";
            
            fs = require('fs');
            fs.writeFile(data_dir + '/_cron/stopHost_' + new Date().getTime() + '.sh', cmd, function (err) {
                setTimeout(() => {
                    callback({status:'success'});
                }, 500)
            });
        };

        this.resetVHost = (serverName, callback) => {
                var dirn = data_dir + '/sites';

                var dockerFn = _env.code_folder + '/dockerFiles/admin_dockerfile/dockerFile';
                
                var site_image = 'admin-image'; // ---TODO
                var site_container = serverName + '-container';
                
                var site_path = _env.data_folder + '/sites/' + serverName;
                
                var cfg = {};
                
                try {
                    cfg = require(dirn + '/' + serverName +  '/dockerSetting.json'); 
                } catch (e) {}
                
                var sitesCfg = {};
                try {
                    sitesCfg= pkg.require(sites_cfg)[serverName];
                } catch (e) {}

                var cmd = '';
                cmd += 'echo "Start docker app .."' + "\n";
                cmd += 'cd ' + site_path + "\n";
                cmd += 'docker build -f ' + dockerFn + ' -t ' + site_image + ' .' + "\n";
                cmd += 'docker container stop ' + site_container + "\n";
                cmd += 'docker container rm ' + site_container + "\n";
                
                var cmd_ports  = '';
                for (var i = 0;  i < cfg.ports.length; i++) {
                    cmd_ports += ' -p ' + ((sitesCfg.unidx * 10000) + cfg.ports[i]) + ':' + cfg.ports[i] + ' ';
                }
            
                cmd += 'docker run -d ' + cmd_ports + ' -v "'+ site_path + '":/var/_localApp  --name --network network_easydocker ' + site_container + ' ' + site_image  + "\n";
                
                fs = require('fs');
                fs.writeFile(data_dir + '/_cron/addHost_' + new Date().getTime() + '.sh', cmd, function (err) {
                    setTimeout(() => {
                        callback({status:'success'});
                    }, 500)
                });
        };
        


        this.saveEtcHosts = (callback) => {
            var me = this;
            var str='';
            str += "#!/bin/bash\n";
            str += 'MARKS="#--UI_EASYDOCKER_S--"' + "\n";
            str += 'MARKE="#--UI_EASYDOCKER_E--"' + "\n";
            str += 'NLINE=$' + "'" + '\\n' + "'\n";
            str += 'TABL=$' + "'" + '\\t' + "'\n";
        
            str += 'v=$(sed "/"$MARKS"/,/"$MARKE"/d" /etc/hosts)' + "\n";
            
            var sites_list = me.getSitesCfg();
            str += 'p="';
            str += (!sites_list || !Object.keys(sites_list).length) ? '' : '${MARKS}${NLINE}';

            for (var o in sites_list) { 
                str += '127.0.0.1${TABL}' + o + '.local${NLINE}';
                str += '127.0.0.1${TABL}' + o + '_local${NLINE}';
            }
            str += (!sites_list || !Object.keys(sites_list).length) ? '"' : '${MARKE}"';
            str += "\n";
            str += 'echo "${v}\n${p}" > /etc/hosts' + "\n";
            fs.writeFile(data_dir + '/_cron/etchost_' + new Date().getTime() + '.sh', str, (err) => {
                callback(err);
            });
        }
        
        this.restartProxy = (callback) => {
            var fs = require('fs');
            var cmd = '';
                cmd += 'sh ' +  _env.code_folder + '/nginx_proxy.sh ' + _env.data_folder;

            fs.writeFile(data_dir + '/_cron/restartProxy_' + new Date().getTime() + '.sh', cmd, function (err) {
                setTimeout(() => {
                    callback({status:'success', message : 'restartProxy'});
                }, 500)
            });
        };
        
        this.postLoadList = (callback) => { // use this
            var me = this;
            var CP = new pkg.crowdProcess();
            var _f = {};

            var sites_list = me.getSitesCfg();
            var dirn = '/var/_localAppDATA/sites';

            var list = [];
            for (o in sites_list ) {
                _f[o] = (function(o) {
                    return (cbk) => {
                        var v = {};
                        try {
                            v = pkg.require(dirn + '/' + o + '/dockerSetting.json');
                        } catch (e) {}
                        var ports = [];
                        for (var i = 0; i < v.ports.length; i++) {
                            ports.push({i : v.ports[i], o : (sites_list[o].unidx * 10000) + v.ports[i]})
                        }
                        list.push({name : o, ports: ports});
                        cbk(true);
                    }
                })(o);
            }
            CP.serial(_f, (data) => {
                callback({status:'success', list : list});
            }, 3000); 
        }


        this.saveSitesHosts = (data, callback) => {
            var me = this;
            var v = me.getSitesCfg();
            v[data['serverName']] = {
                dockerFile : data['dockerFile'],
                gitHub     : data['gitHub'],
                branch     : data['branch'],
                ports      : data['ports'],
                unidx      : data['unidx'] 
            };
            me.saveSitesCfg(v, () => {
                callback({status:'success', list : me.getSitesCfg()});
            });
        }
        this.getSitesCfg = () => {
            var v = {}, p;
            try {
                var p = pkg.require(sites_cfg);
                if (typeof p == 'object') {
                    v = p;
                }
            } catch (e) {}
            return v;
        }

        this.saveSitesCfg = (v, callback) => {
            var me = this;
            fs.writeFile(sites_cfg, JSON.stringify(v), 
                (err) => {
                    me.saveEtcHosts(
                        () => {
                            callback(err);
                        }
                    )
            });
        }    
        this.getNewUnIdx = () => {
            var me = this;
            var sites_list = me.getSitesCfg();
            var unidx_max = 0;
            for (var o in sites_list) { 
                if (sites_list[o].unidx > unidx_max) {
                    unidx_max = sites_list[o].unidx;
                }
            }
            for (var i = 0; i < unidx_max; i++) {
                var mark = 0;
                for (var o in sites_list) { 
                    if (sites_list[o].unidx === (i + 1)) {
                        mark = 1;
                        break;
                    }
                }
                if (!mark) {
                    return i + 1;
                }
            }
            return unidx_max + 1;
        }

        this.addHost = (data, callback) => {
            var me = this;
            var CP = new pkg.crowdProcess();
            var _f={};

            data.unidx = me.getNewUnIdx();

            _f['cloneCode'] = function(cbk) {
                var MGit = pkg.require(env.root+ '/modules/moduleGit.js');
                var git = new MGit(env);
                git.gitClone(data, function(result) {
                    cbk(true);
                });
            };


            _f['SitesHosts'] = function(cbk) {
                me.saveSitesHosts(data, cbk);
            };

            CP.serial(_f, function(data) {
                callback(CP.data.SitesHosts);
            }, 30000);
        }

        this.deleteVHost = (serverName, callback) => {
            var me = this;
            var CP = new pkg.crowdProcess();
            var _f = {};
            _f['deleteCode'] = function(cbk) {
                var site_path = data_dir + '/sites/' + serverName;
                cmd = 'rm -fr ' + site_path;
                exec(cmd, {maxBuffer: 1024 * 2048},
                    function(error, stdout, stderr) {
                        cbk(true);
                });
            };
            _f['deleteCfg'] = function(cbk) {
                var sites_list = me.getSitesCfg();
                delete sites_list[serverName];
                me.saveSitesCfg(sites_list, () => {
                    cbk(true);
                });
            };
            CP.serial(_f, function(data) {
                me.postLoadList(callback);
            }, 30000);
        };

        this.addDocker = (serverName, callback) => {
            var me = this;
            var site_path = data_dir + '/sites/' + serverName;
            var sites_list = me.getSitesCfg();
            var site_config = sites_list[serverName];
            var code_dir = _env.code_folder;

            var site_image = site_config.dockerFile + '-image'; 
            var site_container = serverName + '-container';
            var cmd = '';
            cmd += 'cd ' + site_path + "\n";
            cmd += 'docker build -f ' + code_dir + '/dockerFiles/' + site_config.dockerFile + '/dockerFile' + ' -t ' + site_image + ' .' + "\n";
            cmd += 'echo "Start docker app .."' + "\n";
            cmd += 'docker container stop ' + site_container + "\n";
            cmd += 'docker container rm ' + site_container + "\n";
            
            fs = require('fs');
            fs.writeFile(data_dir + '/_cron_addDocker_' + new Date().getTime() + '.sh', cmd, function (err) {
                setTimeout(() => {
                    callback({status:'success'});
                }, 500)
            });
            return true;
        }
        this.addDocker0 = (rec, callback) => {
            var me = this;
            var str='', err = {}, DOCKERCMD = {};
            try {
            delete require.cache[env.dataFolder  + '/DOCKERCMD.json'];
            DOCKERCMD = require(env.dataFolder  + '/DOCKERCMD.json');
            } catch (e) {};
        
            var dname = rec.serverName.toLowerCase();
            var iname = rec.dockerFile.toLowerCase();
            str +=  'cd ' + DOCKERCMD.ROOT + '/_localChannel/dockerFiles/' + rec.dockerFile + '/ ' + "\n";
            str += DOCKERCMD.DOCKERCMD + ' build -f  dockerFile' + ' -t ' + iname + '-image .'  + "\n";
            str += DOCKERCMD.DOCKERCMD + ' container stop site_channel_container-'  + dname + "\n";
            str += DOCKERCMD.DOCKERCMD + ' container rm site_channel_container-' + dname  + "\n";
            
            var p_str = '', p = rec.ports.split(',');
            
            for (var i = 0; i < p.length; i++) {
                p_str += ' -p ' + (parseInt(rec.unidx + '0000') + parseInt(p[i])) + ':' + parseInt(p[i]) + ' ';
            }
            
            str += DOCKERCMD.DOCKERCMD + ' run -d --network=network_ui_app ' + p_str;
            str += ' -v  "'+ DOCKERCMD.DATAPATH + '/sites/' + dname + '":/var/_localApp ';
            str += ' -v  "'+ DOCKERCMD.DATAPATH + '/cronData/' + dname + '":/var/_cronData ';
            str += '--name site_channel_container-' + dname + '  ' + iname + '-image';
            str += "\n";

            var fnDocker = env.dataFolder + '/bootup/addDocker_' + dname +'.sh';
            var fnTask = env.dataFolder + '/tasks/addDocker_' + dname +'.sh';

            fs.writeFile(fnDocker, str, (err) => {
                me.copyToTasks(fnDocker, fnTask, callback);
            //   callback(err);
            });
        }

        this.removeDocker = (dname, callback) => {
            var me = this;
            var str='', DOCKERCMD = {};
            try {
            delete require.cache[env.dataFolder  + '/DOCKERCMD.json'];
            DOCKERCMD = require(env.dataFolder  + '/DOCKERCMD.json');
            } catch (e) {};

            str += DOCKERCMD.DOCKERCMD + ' container stop site_channel_container-'  + dname + "\n";
            str += DOCKERCMD.DOCKERCMD + ' container rm site_channel_container-' + dname  + "\n";

            var fnDocker = env.dataFolder + '/bootup/addDocker_' + dname + '.sh';
            var fnRemoveDocker = env.dataFolder + '/tasks/removeDocker.sh';

            fs.writeFile(fnRemoveDocker, str, (err) => {
                me.removeBootupFile(fnDocker, callback);
            });
        }
/*

        this.copyToTasks = (fname, fnTask, cbk) => {
            var cmd = 'cp -fr ' + fname + ' ' + fnTask;
            exec(cmd, {maxBuffer: 1024 * 2048},
                function(error, stdout, stderr) {
                    cbk(true);
            });
        }
        this.removeBootupFile = (fname, cbk) => {
            var cmd = 'rm -fr ' + fname;
            exec(cmd, {maxBuffer: 1024 * 2048},
                function(error, stdout, stderr) {
                    cbk(true);
            });
        }

        this.addSiteClonDataFolder = (rec, cbk) => {
            var me = this;
            var dname = rec.serverName.toLowerCase();
            var cmd = 'mkdir -p ' + env.dataFolder + '/cronData/' + dname + '/upload'; 
            cmd += ' && ' + 'mkdir -p ' + env.dataFolder + '/cronData/' + dname + '/inBound';
            cmd += ' && ' + 'mkdir -p ' + env.dataFolder + '/cronData/' + dname + '/outBound';
            exec(cmd, {maxBuffer: 1024 * 2048},
                function(error, stdout, stderr) {
                    cbk(true);
            });
        }

        this.removeSiteClonDataFolder = (fname, cbk) => {
            var me = this;
            var cmd = 'rm -fr ' + env.dataFolder + '/cronData/' + fname; 
            exec(cmd, {maxBuffer: 1024 * 2048},
                function(error, stdout, stderr) {
                    cbk(true);
            });
        }

        this.refreshProxy = (callback) => {
            var me = this;
            var str='', err = {}, DOCKERCMD = {};
            try {
               delete require.cache[env.dataFolder  + '/DOCKERCMD.json'];
               DOCKERCMD = require(env.dataFolder  + '/DOCKERCMD.json');
            } catch (e) {};
           
            str += 'sleep 2 && ' + DOCKERCMD.DOCKERCMD + ' restart local_proxy_container ';
            str += "\n";

            fs.writeFile(fnRefreshProxy, str, (err) => {
                callback(true);               
            });
        }

        */
    }
    module.exports = obj;
})()
