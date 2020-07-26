(function() {
    var obj = function(env, pkg) {
        var fs = require('fs');
        var exec = require('child_process').exec;

        var sites_cfg = '/var/_localAppDATA/_sites_cfg.json';
	var data_dir = '/var/_localAppDATA';
	    
        this.pullCode = (serverName, callback) => {
            var data_dir = '/var/_localAppDATA';

            var site_path = data_dir + '/sites/' + serverName;

            var cmd = 'cd ' + site_path + ' && git pull';
    
            exec(cmd, {maxBuffer: 1024 * 2048},
                function(error, stdout, stderr) {
                    callback({status:'success'});
            });
        }; 
       this.stopVHost = (serverName, callback) => {
            var data_dir = '/var/_localAppDATA';
            var dirn = data_dir + '/sites';
            var _f = {};
            var _env = {};
            try {
                _env = require(data_dir + '/_env.json');
            } catch (e) {}

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
            var data_dir = '/var/_localAppDATA';
            var dirn = data_dir + '/sites';
            var _f = {};
            var _env = {};
            try {
                _env = require(data_dir + '/_env.json');
            } catch (e) {}
            
            var dockerFile = 'angular11';
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
           
            cmd += 'docker run -d ' + cmd_ports + ' -v "'+ site_path + '":/var/_localApp  --name  ' + site_container + ' ' + site_image  + "\n";
             
            
            fs = require('fs');
            fs.writeFile(data_dir + '/_cron/addHost_' + new Date().getTime() + '.sh', cmd, function (err) {
                setTimeout(() => {
                    callback({status:'success'});
                }, 500)
            });
	};
	this.restartProxy = (callback) = {
		fs = require('fs');
		var cmd = '';
		fs.writeFile(data_dir + '/_cron/restartProxy_' + new Date().getTime() + '.sh', cmd, function (err) {
			setTimeout(() => {
				callback({status:'success'});
			}, 500)
		});
	};
	    
        this.getDockerHostsList = (callback) => {
            var CP = new pkg.crowdProcess();
            var dirn = '/var/_localAppDATA/sites';
            var _f = {};

            fs.readdir(dirn, function (err, files) {
                var list = (err) ? [] : files.filter((v) => {
                    return !(/^\./.test(v));
                });
                var list1 = [];
                for (o in list) {
                    _f[list[o]] = (function(o) {
                        return (cbk) => {
                            var v = {};
                            try {
                                v = require(dirn + '/' + list[o] + '/dockerSetting.json');

                            } catch (e) {}
                            list1.push({name : list[o], ports: v.ports.join(',')});
                            cbk(true);
                        }
                    })(o);
                    
                }
                CP.serial(_f, (data) => {
                    callback({status:'success', list : list1});
                }, 3000);  
            });   
        };
	
	this.postLoadList = (callback) => {
            var CP = new pkg.crowdProcess();
            var _f = {};

            var sitesCfg = {};
            try {
                sitesCfg= pkg.require(sites_cfg);
            } catch (e) {}

            var dirn = '/var/_localAppDATA/sites';

            var list = [];
            for (o in sitesCfg) {
                _f[o] = (function(o) {
                    return (cbk) => {
                        var v = {};
                        try {
                            v = pkg.require(dirn + '/' + o + '/dockerSetting.json');
                        } catch (e) {}
                        var ports = [];
                        for (var i = 0; i < v.ports.length; i++) {
                            ports.push({i : v.ports[i], o : (sitesCfg[o].unidx * 10000) + v.ports[i]})
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
            
            var v = {};
            try {
                v = require(sites_cfg);
            } catch (e) {}
            try {
                v[data['serverName']] = {
                    dockerFile : data['dockerFile'],
                    gitHub     : data['gitHub'],
                    branch     : data['branch'],
                    ports      : data['ports'],
                    unidx      : data['unidx'] 
                }
            } catch (e) {}
            
            fs.writeFile(sites_cfg, 
                JSON.stringify(v), (err) => {
                    callback(err);
            });
        }
        this.getSitesCfg = () => {
            var v = {};
            try {
                v = require(sites_cfg);
            } catch (e) {}
            return v;
        }    
        this.getNewUnIdx = () => {
            var me = this;
            var sites_cfg = me.getSitesCfg();
            var unidx_max = 0;
            for (var o in sites_cfg) { 
                if (sites_cfg[o].unidx > unidx_max) {
                    unidx_max = sites_cfg[o].unidx;
                }
            }
            for (var i = 0; i < unidx_max; i++) {
                var mark = 0;
                for (var o in sites_cfg) { 
                    if (sites_cfg[o].unidx === (i + 1)) {
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
/*
        this.callList = (callback) => {
            var me = this;
            var list = me.getList();
            callback(list)
        }
        this.getList = () => {
            var me = this;
            var list = [];
            try { 
                delete require.cache[fn];
                list = require(fn);
            } catch(e) {}
            return list;
        }
        this.addHost = (data, callback) => {
            var me = this;
            var _f={};
            data.unidx = me.getUnIdx();

            _f['cloneCode'] = function(cbk) {
                delete require.cache[env.root+ '/modules/moduleGit.js'];
                var MGit = require(env.root+ '/modules/moduleGit.js');
                var git = new MGit(env);
                git.gitClone(data, function(result) {
                    cbk(true);
                });
            };

            _f['SitesHosts'] = function(cbk) {
                me.saveSitesHosts(data, cbk);
            };


            _f['EtcHosts'] = function(cbk) {
                me.saveEtcHosts(cbk);
            };
            _f['VHosts'] = function(cbk) {
                me.createVhostConfig(cbk);
            };

            _f['addSiteClonDataFolder'] = function(cbk) {
                me.addSiteClonDataFolder(data, cbk);
            };

            _f['addDocker'] = function(cbk) {
                me.addDocker(data, cbk);
            };

            _f['refreshProxy'] = function(cbk) {
                me.refreshProxy(cbk);
            };

            CP.serial(_f, function(data) {
                callback(CP.data.SitesHosts);
            }, 30000);
        }
        this.removeHost = (serverName, callback) => {
            var me = this;
            var dirn = env.sites;
            var _f={};
            var exec = require('child_process').exec;
            _f['deleteCode'] = function(cbk) {
                cmd = 'rm -fr ' + dirn + '/' + serverName;
                exec(cmd, {maxBuffer: 1024 * 2048},
                    function(error, stdout, stderr) {
                        cbk(true);
                });
            };

            _f['SitesHosts'] = function(cbk) {
                me.deleteSitesHosts(serverName, cbk);
            };

            _f['EtcHosts'] = function(cbk) {
                me.saveEtcHosts(cbk);
            };

            _f['VHosts'] = function(cbk) {
                me.createVhostConfig(cbk);
            };

            _f['removeDocker'] = function(cbk) {
                me.removeDocker(serverName, cbk);
            };

            _f['removeSiteClonDataFolder'] = function(cbk) {
                me.removeSiteClonDataFolder(serverName, cbk);
            };

            _f['refreshProxy'] = function(cbk) {
                me.refreshProxy(cbk);
            };

            CP.serial(_f, function(data) {
                callback(CP.data.SitesHosts);
            }, 30000);
        }
        this.saveSitesHosts = (data, callback) => {
            var me = this;
            var list = me.getList();
            var v = {
                dockerFile : data['dockerFile'],
                serverName : data['serverName'],
                gitHub     : data['gitHub'],
                branch     : data['branch'],
                ports      : data['ports'],
                unidx      : data['unidx'] 
            }
            list.push(v);
            fs.writeFile(fn, 
                JSON.stringify(list), (err) => {
                    callback(err);
            });
        }
        this.deleteSitesHosts = (serverName, callback) => {
            var me = this;
            var list = me.getList(), v = [];

            for (var i = 0; i < list.length; i++) {
                if (list[i].serverName !== serverName) {
                    v.push(list[i]);
                }
            }
            fs.writeFile(fn, 
                JSON.stringify(v), (err) => {
                    callback(err);
            });
        }
        this.getUnIdx = () => {
            var me = this;
            var list = me.getList();
            var idxList = [];

            for (var i = 0; i < list.length; i++) { 
                if (list[i].unidx) {
                    idxList.push(list[i].unidx);
                }
            }
            for (var i = 0; i < list.length; i++) {
                if (idxList.indexOf(i+1) === -1) {
                    return i + 1;
                }
            }
            return list.length + 1;
        }
        this.saveEtcHosts = (callback) => {
            var me = this;
            var str='',
                err = {};

            str += "#!/bin/bash\n";
            str += 'MARKS="#--UI_MAC_LOCAL_S--"' + "\n";
            str += 'MARKE="#--UI_MAC_LOCAL_E--"' + "\n";
            str += 'NLINE=$' + "'" + '\\n' + "'\n";
            str += 'TABL=$' + "'" + '\\t' + "'\n";
        
            str += 'v=$(sed "/"$MARKS"/,/"$MARKE"/d" /etc/hosts)' + "\n";

            var list = me.getList();
            str += 'p="$v $NLINE$NLINE$MARKS$NLINE';
            for (var i=0; i < list.length; i++) {
                str += '"127.0.0.1"$TABL"' + list[i].serverName + '.local"$NLINE';
                str += '"127.0.0.1"$TABL"' + list[i].serverName + '_local"$NLINE';
            }
            str += '$MARKE$NLINE"' + "\n";
            str += 'echo "$p" > /etc/hosts' + "\n";
            fs.writeFile(fnHosts, str, (err) => {
                callback(err);
            });
        }

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

        this.addDocker = (rec, callback) => {
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

        this.vHostRec = (rec) => {
            var str = '';
            str += '<VirtualHost *:80>' + "\n";
            str += 'ServerName ' + rec.serverName +  ".local\n";
            str += 'ProxyRequests On' + "\n";
            str += 'ProxyPreserveHost Off' + "\n";
            str += 'ProxyPass / http://' + rec.ip + ':' + rec.port + '/' + "\n";
            str += 'ProxyPassReverse / http://' + rec.ip + ':' + rec.port + '/' + "\n";
            str += '</VirtualHost>' + "\n\n";

            str += '<VirtualHost *:80>' + "\n";
            str += 'ServerName ' + rec.serverName +  "_local\n";
            str += 'ProxyRequests On' + "\n";
            str += 'ProxyPreserveHost Off' + "\n";
            str += 'ProxyPass / http://' + rec.ip + ':' + rec.port + '/' + "\n";
            str += 'ProxyPassReverse / http://' + rec.ip + ':' + rec.port + '/' + "\n";
            str += '</VirtualHost>' + "\n\n";
            return str;
        }
        */
    }
    module.exports = obj;
})()
