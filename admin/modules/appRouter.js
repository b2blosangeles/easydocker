(function () { //
	var obj =  function (env, pkg, req, res) {
		var fs = require('fs');
		var path = require('path');
		this.get = function() {
		    var me = this, p = req.params[0].replace(/^\//, '');
		    var fn = env.root + '/www/' + ((!p) ? 'index.html' : p);
		    me.sendFile(fn);
		};	
		this.post = () => {
			var me = this;
			var MHosts = pkg.require(env.root+ '/modules/moduleHosts.js');

            switch(req.body.cmd) {

				case 'resetVHost' :
	
					var hosts = new MHosts(env, pkg);
					hosts.resetVHost(req.body.serverName,
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

				case 'getDockerHostsList' :
		
					var hosts = new MHosts(env, pkg);
					hosts.getDockerHostsList(
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

				case 'loadDockersList' :
					me.loadDockersList();
					break;

				case 'addHost' :
					var hosts = new MHosts(env, pkg);
					hosts.addHost(req.body.data, function(data) {
						res.send(data);
					});
					break;

			/*	
              case 'addHost' :
                me.postSaveHost(req.body.data);
                break;
              case 'deleteHost' :
                me.postRemoveHost(req.body.serverName);
                break;
              case 'loadDockersList' :
                  me.loadDockersList();
                  break;

					*/
              default :
                res.send({status:'failure', message : '404 wrong cmd!'});
            }
		};

		this.loadDockersList = () => {
			var MDockerfile= pkg.require(env.root+ '/modules/moduleDockerfile.js');
			var dockers = new MDockerfile(env, pkg);
			dockers.loadDockersList(function(list) {
			  res.send({status:'successA', list : list });
			});
		}		

        this.gitRemoteBranchs = () => {
			var MGit = pkg.require(env.root+ '/modules/moduleGit.js');
			var git = new MGit(env);
			git.gitRemoteBranchs(req.body.data, function(result) {
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
