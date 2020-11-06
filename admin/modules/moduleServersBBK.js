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


        this.pullCode = (serverName, callback) => {
            var site_path = data_dir + '/sites/' + serverName;
            var cmd = 'cd ' + site_path + ' && git pull';
            exec(cmd, {maxBuffer: 1024 * 2048},
                function(error, stdout, stderr) {
                    callback({status:'success'});
            });
        }; 
        
        this.stopVServer = (serverName, callback) => {
            var site_container = serverName + '-container';
            var cmd = '';
            cmd += 'echo "Start docker app .."' + "\n";
            cmd += 'docker container stop ' + site_container.toLowerCase() + "\n";
            cmd += 'docker container rm ' + site_container.toLowerCase() + "\n";
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
            
            /*

            var cmd = 'docker stop $(docker ps -a -q) && docker rm $(docker ps -a -q)';
            exec(cmd, {maxBuffer: 1024 * 2048},
                function(error, stdout, stderr) {
                    callback({status:'success'});
            });*/
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
        
        this.restartProxy = (callback) => {
            var cmd = 'sh ' +  _env.code_folder + '/scriptStartup/nginx_proxy.sh ' + _env.data_folder;
            me.setClone('restartProxy', cmd, callback);
        };
        
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
                git.gitClone(data, function(result) {
                    cbk(true);
                });
            };
            
            _f['SitesServers'] = function(cbk) {
                me.saveSitesServers(data, cbk);
            };
            
            _f['addDocker'] = function(cbk) {
                me.addDocker(data.serverName, cbk);
            };
            
            _f['addProxyConfig'] = function(cbk) {
                me.addProxyConfig(data.serverName, cbk);
            };

            _f['restartProxy'] = function(cbk) {
                me.restartProxy(cbk);
            };
            _f['createStartUpVServers'] = function(cbk) {
                me.createStartUpVServers(cbk); 
            };
            
            CP.serial(_f, function(data) {
                callback(CP.data.SitesServers);
            }, 30000);
        }

        this.deleteVServer = (serverName, callback) => {
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

            _f['removeProxyConfig'] = function(cbk) {
                me.removeProxyConfig(serverName, cbk);
            };

            _f['removeDocker'] = function(cbk) {
                me.removeDocker(serverName, cbk);
            };

            _f['restartProxy'] = function(cbk) {
                me.restartProxy(cbk);
            };

            _f['createStartUpVServers'] = function(cbk) {
                me.createStartUpVServers(cbk); 
            };

            CP.serial(_f, function(data) {
                me.postLoadList(callback);
            }, 30000);
        };

        this.addProxyConfig = (serverName, callback) => {
            var proxy_fn = data_dir + '/proxy/' + serverName+'.local';
            var sites_list = me.getSitesCfg();
            var site_config = sites_list[serverName];

            var cmd_ports  = '';
            var str = '';

            let ports = (!site_config || !site_config.docker) ? [] : site_config.docker.ports;
            for (var i = 0;  i < ports.length; i++) {
                cmd_ports += parseInt(site_config.unidx * 10000) + parseInt(ports[i]);
                var u_str = 'http://10.10.10.254:' + cmd_ports + '/';
                var servasname_v = [serverName + '_local', serverName + '.local', serverName + '.shusiou.win'];
                for (var j = 0; j < servasname_v .length; j++) {
                    str += 'server {' + "\n";
                    str += '    listen       80;' + "\n";
                    str += '    server_name  ' + servasname_v[j] + ';' + "\n";
                    str += '    location / {' + "\n";
                    str += '        proxy_cache                     off;' + "\n";
                    str += '        proxy_pass ' + u_str + ';' + "\n";
                    str += '        proxy_redirect     off;' + "\n";
                    str += '        proxy_set_header   Host $host;' + "\n";
                    str += '        sub_filter ' + u_str + ' http://$host/;' + "\n";
                    str += '        sub_filter ' + u_str + ' http://$host/;' + "\n";
                    str += '        sub_filter_once off;' + "\n";
                    str += '      }' + "\n";
                    str += '}' + "\n";
                }
            }
            fs.writeFile(proxy_fn, str, function (err) {
                callback(true);
            });
        }

        this.removeProxyConfig = (serverName, callback) => {
            var proxy_fn = data_dir + '/proxy/' + serverName+'.local';
            var cmd = 'rm -fr ' + proxy_fn;
            exec(cmd, {maxBuffer: 1024 * 2048},
                function(error, stdout, stderr) {
                    callback({status:'success'});
            });
        }

        this.getDockerPath = (serverName) => {
            var sites_list = me.getSitesCfg();
            var site_config = sites_list[serverName];
            var p = '';

            if (!site_config.publicDocker) {
                p = _env.data_folder + '/sites/' + serverName + '/docker/';
            } else {
                p = _env.code_folder + '/dockerFiles/' + site_config.publicDocker + '/';
            }
           return p;
        }

        this.getDockerFileFn = (serverName) => {
            var sites_list = me.getSitesCfg();
            var site_config = sites_list[serverName];
           return me.getDockerPath(serverName) + site_config.docker.dockerFile;
        }

        this.getSiteImageName = (serverName) => {
            var sites_list = me.getSitesCfg();
            var site_config = sites_list[serverName];
            return ((!site_config.publicDocker) ? serverName : site_config.publicDocker).toLowerCase() + '-image';
        }

        this.addDockerCMD = (serverName) => {
           
            var sites_list = me.getSitesCfg();
            var site_config = sites_list[serverName];
            var site_image = me.getSiteImageName(serverName);
            var site_container = (serverName + '-container').toLowerCase();
            
            var cmd = '';
            
            cmd += 'cd ' + me.getDockerPath(serverName) + "\n";
            cmd += 'docker build -f ' + me.getDockerFileFn(serverName) + ' -t ' + site_image + ' .' + "\n";
            cmd += 'echo "Start docker app ..' + serverName + ' "' + "\n";
            cmd += 'docker container stop ' + site_container + "\n";
            cmd += 'docker container rm ' + site_container + "\n"; 
            var cmd_ports  = '';
            let ports = (!site_config || !site_config.docker) ? [] : site_config.docker.ports;
            for (var i = 0;  i < ports.length; i++) {
                cmd_ports += ' -p ' + (parseInt(site_config.unidx * 10000) + parseInt(ports[i])) + ':' + ports[i] + ' ';
            }
            
            var site_path =  _env.data_folder + '/sites/' + serverName;
            cmd += 'docker run -d ' + cmd_ports + ' -v "'+ site_path + '":/var/_localApp  --network network_easydocker --name ' + site_container + ' ' + site_image  + "\n";
            
            return cmd;
        }

        this.addDocker = (serverName, callback) => {
            me.setClone('addDocker', me.addDockerCMD(serverName), callback);
        }

        this.removeDocker = (serverName, callback) => {
            var site_container = serverName.toLowerCase() + '-container';
            var cmd = '';
            cmd += 'echo "Start docker app .."' + "\n";
            cmd += 'docker container stop ' + site_container + "\n";
            cmd += 'docker container rm ' + site_container + "\n";
            cmd += 'docker image rm -f ' + serverName.toLowerCase() + '-image' + "\n";
            me.setClone('removeDocker', cmd, callback);
        }
    }
    module.exports = obj;
})()