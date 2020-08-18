(function() {
    var obj = function(env, pkg) {
        var me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = new pkg.crowdProcess();

        var sitesCfgFn = '/var/_localAppDATA/_sites_cfg.json';
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
            me.setClone('stopVHost', cmd, callback);
        };

        this.dockerSetting = (serverName) => {
            let cfg = {};
            try {
                cfg = require(data_dir + '/sites/' + serverName +  '/docker/setting.json');

            } catch (e) {}
            /*
            cfg = {
                "ports" : [3000],
                "dockerFile" : data_dir + '/sites/' + serverName +  '/docker/setting.json'
              };*/
            return cfg;
        }

        this.dockerLibSetting = (dockerName) => {
            let cfg = {};
            try {
                cfg = require(env.root + '/cockerFiles/' + dockerName +  '/setting.json'); 
            } catch (e) {}
            return cfg;
        }

        this.resetVHost = (serverName, callback) => {
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
            var cmd = 'sh ' +  _env.code_folder + '/nginx_proxy.sh ' + _env.data_folder;
            me.setClone('restartProxy', cmd, callback);
        };
        
        this.postLoadList = (callback) => { // use this
            var sites_list = me.getSitesCfg();
            var list = [];
            for (o in sites_list ) {
                var ports = [];
                site_ports = sites_list[o].ports;
                for (var i = 0; i < site_ports.length; i++) {
                    ports.push({i : site_ports[i], o : (sites_list[o].unidx * 10000) + site_ports[i]});
                }
                list.push({name : o, ports: ports});
            }
            callback({status:'success', list : list });
        }


        this.saveSitesHosts = (data, callback) => {
            var v = me.getSitesCfg();
            var _f = {};
            _f['getDockerSetting'] = function(cbk) {
                var dockerSetting = {type: null, dockerFile : null, dockerPath : null, dockerFileFn : null,  ports: []},
                    dockerFileName = '',
                    ports = [];

                try {
                    dockerSetting = me.dockerSetting(data['serverName']);
                    dockerFileName = (dockerSetting.dockerFile) ? dockerSetting.dockerFile : 'dockerFile',
                    ports = (dockerSetting.ports) ? dockerSetting.ports : [];

                    cbk({
                        type        : dockerSetting.type,
                        dockerFile  : dockerSetting.dockerFile,
                        dockerPath  : _env.data_folder + '/sites/' + data['serverName'] + '/docker',
                        dockerFileFn: dockerFileName,
                        ports       : ports
                    });
                } catch (e) {}

                if (!dockerSetting.ports) {
                    try {
                        code_dir = _env.code_folder;

                        dockerSetting = me.dockerLibSetting(dockerSetting.dockerFile);
                        dockerFileName = (dockerSetting.dockerFile) ? dockerSetting.dockerFile : 'dockerFile',
                        ports = (dockerSetting.ports) ? dockerSetting.ports : [];

                        cbk({
                            type        : dockerSetting.type,
                            dockerFile  : dockerSetting.dockerFile,
                            dockerPath  : _env.code_folder + '/dockerFiles/' + data['dockerFile'],
                            dockerFileFn: 'dockerFile',
                            ports       : ports
                        });
                    } catch (e) {}
                }
            }

            _f['siteConfig'] = function(cbk) {
                v[data['serverName']] = {
                    dockerFile  : CP.data.getDockerSetting.dockerFile,
                    dockerFileFn: CP.data.getDockerSetting.dockerFileFn,
                    dockerPath  : CP.data.getDockerSetting.dockerPath,
                    gitHub      : data['gitHub'],
                    branch      : data['branch'],
                    ports       : CP.data.getDockerSetting.ports,
                    unidx       : data['unidx']
                };
                cbk(v);
            }
            CP.serial(_f, (dataCP) => {
                me.saveSitesCfg(CP.data.siteConfig, () => {
                    callback({status:'success', list : me.getSitesCfg()});
                });
            }, 3000); 
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

        this.addVHost = (data, callback) => {
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

            _f['addDocker'] = function(cbk) {
                me.addDocker(data.serverName, cbk);
            };

            _f['addProxyConfig'] = function(cbk) {
                me.addProxyConfig(data.serverName, cbk);
            };

            _f['restartProxy'] = function(cbk) {
                me.restartProxy(cbk);
            };

            CP.serial(_f, function(data) {
                callback(CP.data.SitesHosts);
            }, 30000);
        }

        this.deleteVHost = (serverName, callback) => {
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

            ports = (site_config.ports) ? site_config.ports : [];
            for (var i = 0;  i < ports.length; i++) {
                cmd_ports += (site_config.unidx * 10000) + ports[i];
                var u_str = 'http://10.10.10.254:' + cmd_ports + '/';
                var servasname_v = [serverName + '_local', serverName + '.local']
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

        this.addDocker = (serverName, callback) => {
            var sites_list = me.getSitesCfg();
            var site_config = sites_list[serverName];

            var site_image = site_config.dockerFile + '-image'; 
            var site_container = serverName + '-container';
            var cmd = '';
            cmd += 'cd ' + site_config.dockerPath + "\n";
            cmd += 'docker build -f ' + site_config.dockerPath  + '/' + site_config.dockerFileFn + ' -t ' + site_image + ' .' + "\n";
            cmd += 'echo "Start docker app .."' + "\n";
            cmd += 'docker container stop ' + site_container + "\n";
            cmd += 'docker container rm ' + site_container + "\n";
            var cmd_ports  = ''
                       
            var cmd_ports  = '',
                ports = (site_config.ports) ? site_config.ports : [3300, 3301];
            for (var i = 0;  i < ports.length; i++) {
                cmd_ports += ' -p ' + ((site_config.unidx * 10000) + ports[i]) + ':' + ports[i] + ' ';
            }
            
            var site_path = data_dir + '/sites/' + serverName;
            cmd += 'docker run -d ' + cmd_ports + ' -v "'+ site_path + '":/var/_localApp  --network network_easydocker --name ' + site_container + ' ' + site_image  + "\n";
            
            me.setClone('addDocker', cmd, callback);
        }

        this.removeDocker = (serverName, callback) => {
            var site_container = serverName + '-container';
            var cmd = '';
            cmd += 'echo "Start docker app .."' + "\n";
            cmd += 'docker container stop ' + site_container + "\n";
            cmd += 'docker container rm ' + site_container + "\n";
            me.setClone('removeDocker', cmd, callback);
        }
    }
    module.exports = obj;
})()
