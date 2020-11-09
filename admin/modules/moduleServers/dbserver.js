(function() {
    var obj = function(env, pkg) {
        var me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = new pkg.crowdProcess();

        var sitesCfgFn = '/var/_localAppDATA/_servers_cfg.json';
        var data_dir = '/var/_localAppDATA';
        
        var _env = {};
        try {
            _env = require(data_dir + '/_env.json');
        } catch (e) {}

        this.sitesPath = () => {
            return data_dir + '/DBS';
        }

        this.sitePath = (serverName) => {
            return this.sitesPath() + '/' + serverName;
        }
        this.siteCodePath = (serverName) => {
            return this.sitePath(serverName) + '/code';
        }
        this.siteDataPath = (serverName) => {
            return this.sitePath(serverName) + '/data';
        }
        this.siteContainer = (serverName) => {
            return ('mysql-' + serverName + '-container').toLowerCase();
        }

        this.dockerPath = (serverName) => {
            return _env.data_folder + '/DBS/' + serverName;
        }
        this.dockerCodePath = (serverName) => {
            return this.dockerPath(serverName) + '/code';
        }
        this.dockerDataPath = (serverName) => {
            return this.dockerPath(serverName) + '/data';
        }
        this.pullCode = (serverName, callback) => {
            var cmd = 'cd ' + this.siteCodePath() + ' && git pull';
            exec(cmd, {maxBuffer: 1024 * 2048},
                function(error, stdout, stderr) {
                    callback({status:'success'});
            });
        }; 
        
        this.stopVServer = (serverName, callback) => {
            var cmd = '';
            cmd += 'echo "Start docker app .."' + "\n";
            cmd += 'docker container stop ' + this.siteContainer(serverName) + "\n";
            cmd += 'docker container rm ' + this.siteContainer(serverName) + "\n";
            me.setClone('stopVServer', cmd, callback);
        };

        this.createStartUpVServers = (callback) => {
            var v = me.getSitesCfg();
            var str = '';
            for (var o in v) {
                str += "## --- Start " + o + " ---\n";
                str += me.addDockerCMD(o);
            }
            fs.writeFile(data_dir + '/_startUpScript.sh', str, function (err) {
                setTimeout(() => {
                    callback({status:'success', message: 'createStartUpVServers'});
                }, 500)
            });
        };

        this.removeAllServers = (callback) => {
            setTimeout(
                () => {
                    callback({status:'success'});
                }, 6000
            );
        };

        this.resetVServer = (serverName, callback) => {
            me.addDocker(serverName, function() {
                callback();
            });
        };
        
        this.setClone = (code, str, callback) => {
            fs.writeFile(data_dir + '/_cron/' + code + '_' + new Date().getTime() + '.sh', str, function (err) {
                setTimeout(() => {
                    callback({status:'success', message: code});
                }, 500)
            });
        }

        this.saveEtcHosts = (callback) => {
            var str='';
            str += "#!/bin/bash\n";
            str += 'MARKS="#--UI_EASYDOCKER_S--"' + "\n" + 'MARKE="#--UI_EASYDOCKER_E--"' + "\n";
            str += 'NLINE=$' + "'" + '\\n' + "'\n" + 'TABL=$' + "'" + '\\t' + "'\n";
            str += 'v=$(sed "/"$MARKS"/,/"$MARKE"/d" /etc/hosts)' + "\n";
            
            var sites_list = me.getSitesCfg();
            str += 'p="';
            str += (!sites_list || !Object.keys(sites_list).length) ? '' : '${MARKS}${NLINE}';

            str += '127.0.0.1${TABL}admin.local${NLINE}';
            str += '127.0.0.1${TABL}admin_local${NLINE}';

            for (var o in sites_list) { 
                str += '127.0.0.1${TABL}' + o + '.local${NLINE}';
                str += '127.0.0.1${TABL}' + o + '_local${NLINE}';
            }
            str += (!sites_list || !Object.keys(sites_list).length) ? '"' : '${MARKE}"' + "\n";
            str += 'echo "${v}\n${p}" > /etc/hosts' + "\n";
            me.setClone('saveEtcHosts', str, callback);
        }
        
        this.postLoadList = (callback) => { // use this
            var sites_list = me.getSitesCfg();
            var list = [];
            for (o in sites_list ) {
                let v = sites_list[o];
                v.name = o;
                list.push(v);
            }
            callback({status:'success', list : list });
        }

        this.saveSitesServers = (data, callback) => {
            
            var v = me.getSitesCfg();
            v[data['serverName']] = {
                gitHub      : data['gitHub'],
                serverType  : data['serverType'],
                branch      : data['branch'],
                publicDocker: data['publicDocker'],
                unidx       : me.getNewUnIdx(),
                docker      : data['docker']
            };
            me.saveSitesCfg(v, () => {
                callback({status:'success', list : me.getSitesCfg()});
            });
        }

        this.switchBranch = (serverName, branch, callback) => {
            var MGit = pkg.require(env.root+ '/modules/moduleGit.js');
            var git = new MGit(env, pkg);
            git.gitSwitchBranch(serverName, branch, function(result) {
                var v = me.getSitesCfg();
                if (v[serverName]) {
                    v[serverName].branch = branch
                }
                me.saveSitesCfg(v, () => {
                    callback({status:'success'});
                });
            });
        }

        this.getSitesCfg = () => {
            var v = {}, p;
            try {
                var p = pkg.require(sitesCfgFn);
                if (typeof p == 'object') {
                    v = p;
                }
            } catch (e) {}
            return v;
        }

        this.saveSitesCfg = (v, callback) => {
            fs.writeFile(sitesCfgFn, JSON.stringify(v), 
                (err) => {
                    me.saveEtcHosts(
                        () => {
                            callback(err);
                        }
                    )
            });
        }    
        this.getNewUnIdx = () => {
            var unidx_max = 0,
                sites_list = me.getSitesCfg();
            for (var o in sites_list) { 
                unidx_max = (sites_list[o].unidx > unidx_max) ? sites_list[o].unidx : unidx_max;
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

        this.addVServer = (data, callback) => {
            var _f={};
 
            _f['cloneCode'] = function(cbk) {
                var MGit = pkg.require(env.root+ '/modules/moduleGit.js');
                var git = new MGit(env, pkg);
                git.gitCloneToFolder(me.siteCodePath(data.serverName), data, function(result) {
                    cbk(true);
                });
            };
       
            _f['SitesServers'] = function(cbk) {
                me.saveSitesServers(data, cbk);
            };
            
            _f['addDocker'] = function(cbk) {
                me.addDocker(data.serverName, cbk);
            };
            
            _f['createStartUpVServers'] = function(cbk) {
                me.createStartUpVServers(cbk); 
            };
           
            CP.serial(_f, function(result) {
                callback(CP.data.SitesServers);
            }, 30000);
        }

        this.deleteVServer = (serverName, callback) => {
            const   _f = {};
            _f['deleteCode'] = function(cbk) {
                cmd = 'rm -fr ' + me.sitePath(serverName);;
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

            _f['removeDocker'] = function(cbk) {
                me.removeDocker(serverName, cbk);
            };

            _f['createStartUpVServers'] = function(cbk) {
                me.createStartUpVServers(cbk); 
            };

            CP.serial(_f, function(data) {
                me.postLoadList(callback);
            }, 30000);
        };

        this.addDockerCMD = (serverName) => {
            var site_config = me.getSitesCfg().serverName;
            var cmd = '';
            cmd += 'mkdir -fr ' + me.dockerDataPath(serverName)  + "\n";
            cmd += 'mkdir -fr ' + me.dockerCodePath(serverName)  + "\n";
            cmd += 'cd ' + me.dockerCodePath(serverName) + "\n";
            cmd += 'echo "Start docker app ..' + serverName + ' "' + "\n";
            cmd += 'docker pull mysql/mysql-server:5.7' + "\n"; 

            var cmd_ports  = '';
            let ports = (!site_config || !site_config.docker) ? [] : site_config.docker.ports;
            for (var i = 0;  i < ports.length; i++) {
                cmd_ports += ' -p ' + (parseInt(site_config.unidx * 10000) + parseInt(ports[i])) + ':' + ports[i] + ' ';
            }
            
            cmd += 'docker run -d ' + cmd_ports + ' -v "'+ 
            me.dockerCodePath(serverName) + '":/var/_localApp  -v "'+ me.dockerDataPath(serverName)  + 
                '":/var/lib/mysql  --network network_easydocker --name ' + me.siteContainer(serverName) + 
                ' mysql/mysql-server:5.7 ' + "\n";
            
            cmd += "docker logs " + me.siteContainer(serverName) + " 2>&1 | grep 'GENERATED' | awk '{gsub(/^[^:]+: /,\"\")}1') > " + me.dockerCodePath(serverName) + '/adminPass';
            
            return cmd;
        }

        this.removeDockerContainerCMD = (serverName) => {
            var cmd = '';
            cmd += 'echo "Stop docker app .."' + "\n";
            cmd += 'docker container stop ' + me.siteContainer(serverName) + "\n";
            cmd += 'docker container rm ' + me.siteContainer(serverName) + "\n";
            return cmd;
         }

        this.addDocker = (serverName, callback) => {
            me.setClone('addDocker', removeDockerContainerCMD(serverName) + me.addDockerCMD(serverName), callback);
        }

        this.removeDocker = (serverName, callback) => {
            me.setClone('removeDocker', me.removeDockerContainerCMD(serverName), callback);
        }
    }
    module.exports = obj;
})()
