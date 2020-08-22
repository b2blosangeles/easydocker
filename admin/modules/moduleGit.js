(function() {
    var exec = require('child_process').exec;
    var obj = function(env, pkg) {
        var me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = new pkg.crowdProcess();

        this.gitRemoteBranchs = (gitRecord, callback) => {
            var regex = /^(git|ssh|https?|git@[-\w.]+):(\/\/)?(.*@|)(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/;
            var uri_a = gitRecord.gitHub.match(regex);
            var uri = uri_a[1] + '://' + ((!gitRecord.userName) ? '' : 
                (encodeURIComponent(gitRecord.userName) + ':' + encodeURIComponent(gitRecord.password) + '@'));
            for (var i=4; i < uri_a.length; i++) {
                uri +=  uri_a[i];
            }
            var cmd = 'git ls-remote ' + uri;
            exec(cmd, {maxBuffer: 1024 * 2048},
                function(error, stdout, stderr) {
                    var branches = [];
                    var list = stdout.split(/\s+/);
                    if (!error) {
                        for (var i in list) {
                            let regs = /^refs\/heads\//i;
                            if (regs.test(list[i])) {
                                branches.push(list[i].replace(regs, ''));
                            }
                        }
                        callback({status : 'success', branches : branches });
                    } else {
                        callback({status : 'failure', message : error.message});
                    }

                    
            });
        }

        this.gitClone = (gitRecord, callback) => {
            
            var dirn = '/var/_localAppDATA/sites';
            
            var regex = /^(git|ssh|https?|git@[-\w.]+):(\/\/)?(.*@|)(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/;
            var uri_a = gitRecord.gitHub.match(regex);
            var uri = uri_a[1] + '://' + ((!gitRecord.serverrName) ? '' : 
                (encodeURIComponent(gitRecord.userName) + ':' + encodeURIComponent(gitRecord.password) + '@'));
            for (var i=4; i < uri_a.length; i++) {
                uri +=  uri_a[i];
            }
            var branchName = gitRecord.branch;

            var cmd = 'mkdir -p ' + dirn + ' && cd ' + dirn + ' && rm -fr ' + gitRecord.serverName + ' && git clone ' + 
                    uri + ' ' + gitRecord.serverName +  ' && ' + 
                    'cd ' + gitRecord.serverName  + ' && git checkout ' + branchName;

            exec(cmd, {maxBuffer: 1024 * 2048},
                function(error, stdout, stderr) {
                    if (!error) {
                        callback({status : 'success'});
                    } else {
                        callback({status : 'failure', message : error.message});
                    }
            });
        }
    }

    module.exports = obj;
})()