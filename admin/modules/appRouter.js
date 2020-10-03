(function () { //
	var obj =  function (env, pkg, req, res) {
		var fs = require('fs');
		var path = require('path');
		this.get = function() {
			let p = req.params[0],
				mp = p.match(/\/([^\/]+)(\/|$)/);

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
		this.post = () => {
			var me = this;
			var MHosts = pkg.require(env.root+ '/modules/moduleHosts.js');

			let p = req.params[0],
				mp = p.match(/\/([^\/]+)(\/|$)/);

			if (!mp || mp[1] !== 'api') {
				res.render(env.root  + '/views/html/page404.ect');
				return true
			}

            switch(req.body.cmd) {

				case 'resetVHost' :
	
					var hosts = new MHosts(env, pkg);
					hosts.resetVHost(req.body.serverName,
						function(data) {
							res.send(data);
						});
					break;
				
				case 'removeAllHosts' :
	
					var hosts = new MHosts(env, pkg);
					hosts.removeAllHosts(
						function(data) {
							res.send(data);
						});
					break;
				
				case 'restartProxy' :
	
					var hosts = new MHosts(env, pkg);
					hosts.restartProxy(function(data) {
						res.send(data);
					});
					break;
			    
				case 'pullCode' :

					var hosts = new MHosts(env, pkg);
					hosts.pullCode(req.body.serverName,
						function(data) {
							res.send(data);
						});
					break;

				case 'stopVHost' :

					var hosts = new MHosts(env, pkg);
					hosts.stopVHost(req.body.serverName,
						function(data) {
							res.send(data);
						});
					break;

				case 'loadList' :
		
					var hosts = new MHosts(env, pkg);
					hosts.postLoadList(
						function(data) {
							res.send(data);
						});
					break;

				case 'gitRemoteBranchs' :
					me.gitRemoteBranchs();
					break;

				case 'gitSwitchBranch' :
					me.gitSwitchBranch();
					break;

				case 'gitSiteBranchs' :
					me.gitSiteBranchs();
					break;

				case 'loadPublicDockersList' :
					me.loadPublicDockersList();
					break;

				case 'addHost' :
					var hosts = new MHosts(env, pkg);
					hosts.addVHost(req.body.data, function(data) {
						res.send(data);
					});
					break;

				case 'deleteHost' :
					var hosts = new MHosts(env, pkg);
					hosts.deleteVHost(req.body.serverName,
						function(data) {
							res.send(data);
						});
					break;

              default :
                res.send({status:'failure', message : '404 wrong cmd!'});
            }
		};

		this.loadPublicDockersList = () => {
			var MDockerfile= pkg.require(env.root+ '/modules/moduleDockerfile.js');
			var dockers = new MDockerfile(env, pkg);
			dockers.loadPublicDockersList(function(list) {
			  res.send({status:'successA', list : list });
			});
		}

        this.gitRemoteBranchs = () => {
			var MGit = pkg.require(env.root+ '/modules/moduleGit.js');
			var git = new MGit(env, pkg);
			git.gitRemoteBranchs(req.body.data, function(result) {
			  res.send(result);
			});
		}

        this.gitSiteBranchs = () => {
			var MGit = pkg.require(env.root+ '/modules/moduleGit.js');
			var git = new MGit(env, pkg);
			git.gitSiteBranchs(req.body.serverName, function(result) {
			  res.send(result);
			});
		}
		
		this.gitSwitchBranch = () => {
			var MGit = pkg.require(env.root+ '/modules/moduleGit.js');
			var git = new MGit(env, pkg);
			git.gitSwitchBranch(req.body.serverName, req.body.branch,  function(result) {
			  res.send(result);
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
