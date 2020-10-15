(function () { //
	var obj =  function (env, pkg, req, res) {
		var fs = require('fs');
		var path = require('path');
		this.get = function() {
			let p = req.params[0],
				mp = p.match(/\/([^\/]+)(\/|$)/);

			if (mp && mp[1] === 'api') {
				res.send(pkg.md5(new Date().getTime()));
				return true
			}

			if (mp && mp[1] === 'spa-package') {
				let SPA = pkg.require(__dirname + '/appSpaPackage.js');
				let spa= new SPA(env, pkg, req, res);
				spa.call(p);
				return true
			}
			if (p == '/') {
				var fn = env.root + '/www/index.html';
				res.sendFile(fn);
				return true
			} else {
				var fn = env.root + '/www' + p;
				fs.stat(fn, function(err, stat) {
					if(err == null) {
						res.sendFile(fn);
					} else  {
						res.render(env.root  + '/views/html/page404.ect');
					}
				});
			}
		};
	
		this.refreshTokenSend = (data) => {
			var MAuth= pkg.require(env.root+ '/modules/moduleAuth.js');
			var auth = new MAuth(env, pkg);
			auth.refreshAuthToken(
				req.body.authToken,
				() => {
					res.send(data);
				}
			)
		};

		this.post = () => {
			var me = this;
			var MServers = pkg.require(env.root+ '/modules/moduleServers.js');
			var MDbs = pkg.require(env.root+ '/modules/moduleMysql.js');

			let p = req.params[0],
				mp = p.match(/\/([^\/]+)(\/|$)/);

			if (!mp || mp[1] !== 'api') {
				res.render(env.root  + '/views/html/page404.ect');
				return true
			}

            switch(req.body.cmd) {
				case 'auth' :
					var MAuth= pkg.require(env.root+ '/modules/moduleAuth.js');
					var auth = new MAuth(env, pkg);
					var data = (!req.body.data) ? {} : req.body.data;
					if (req.body.authToken) data.authToken = req.body.authToken;
					auth.action(data, (data) => {
						res.send(data);
					});
					break;

				case 'resetVServer' :
	
					var Servers = new MServers(env, pkg);
					Servers.resetVServer(req.body.serverName,
						function(data) {
							me.refreshTokenSend(data);
						});
					break;
				
				case 'removeAllServers' :
	
					var Servers = new MServers(env, pkg);
					Servers.removeAllServers(
						function(data) {
							me.refreshTokenSend(data);
						});
					break;
				
				case 'restartProxy' :
	
					var Servers = new MServers(env, pkg);
					Servers.restartProxy(function(data) {
						me.refreshTokenSend(data);
					});
					break;
			    
				case 'pullCode' :

					var Servers = new MServers(env, pkg);
					Servers.pullCode(req.body.serverName,
						(data) => {
							me.refreshTokenSend(data);
						});
					break;

				case 'stopVServer' :

					var Servers = new MServers(env, pkg);
					Servers.stopVServer(req.body.serverName,
						(data) => {
							me.refreshTokenSend(data);
						});
					break;
					
				case 'getDbMysqlList' :
					var dbs = new MDbs(env, pkg);
					dbs.postLoadList(
						(data) => {
							me.refreshTokenSend(data);
						});
					break;
				
				case 'loadList' :
					var Servers = new MServers(env, pkg);
					Servers.postLoadList(
						(data) => {
							me.refreshTokenSend(data);
						});
					break;

				case 'gitRemoteBranchs' :
					me.gitRemoteBranchs(
						(data) => {
							me.refreshTokenSend(data);
						});
					break;

				case 'gitSwitchBranch' :
					var Servers = new MServers(env, pkg);
					Servers.switchBranch(req.body.serverName, req.body.branch,
						(data) => {
							me.refreshTokenSend(data);
					});
					break;

				case 'gitSiteBranchs' :
					me.gitSiteBranchs((data) => {
						me.refreshTokenSend(data);
					});
					break;

				case 'loadPublicDockersList' :
					me.loadPublicDockersList(
						(data) => {
						me.refreshTokenSend(data);
					});
					break;

				case 'addServer' :
					var Servers = new MServers(env, pkg);
					Servers.addVServer(req.body.data, (data) => {
						me.refreshTokenSend(data);
					});
					break;

				case 'deleteServer' :
					var Servers = new MServers(env, pkg);
					Servers.deleteVServer(req.body.serverName,
						(data) => {
							me.refreshTokenSend(data);
						});
					break;

              default :
                res.send({status:'failure', message : '404 wrong cmd!'});
            }
		};

		this.loadPublicDockersList = (callback) => {
			var MDockerfile= pkg.require(env.root+ '/modules/moduleDockerfile.js');
			var dockers = new MDockerfile(env, pkg);
			dockers.loadPublicDockersList(function(list) {
				callback({status:'success', list : list });
			});
		}

        this.gitRemoteBranchs = (callback) => {
			var MGit = pkg.require(env.root+ '/modules/moduleGit.js');
			var git = new MGit(env, pkg);
			git.gitRemoteBranchs(req.body.data, function(result) {
				callback(result);
			});
		}

        this.gitSiteBranchs = (callback) => {
			var MGit = pkg.require(env.root+ '/modules/moduleGit.js');
			var git = new MGit(env, pkg);
			git.gitSiteBranchs(req.body.serverName, function(result) {
				callback(result);
			});
		}
		
		this.sendFile = (fn) => {
			fs.stat(fn, function(err, stat) {
				if(err == null) {
					res.sendFile(fn);
				} else  {
					var fn_plus = env.root + '/views/html/' + path.basename(fn) + '.ect';
					fs.stat(fn_plus, function(err1, stat1) {
						if(err1 == null) {
							res.render('html/' + path.basename(fn_plus));
						} else {
							res.render('html/page404.ect');
						}
					});
				}
		    });
		}
	};
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = obj;
	} 

})();
