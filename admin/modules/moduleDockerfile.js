(function() {
    var obj = function(env, pkg) {
        var fs = require('fs');
        var CP = new pkg.crowdProcess();

        this.loadPublicDockersList = (callback) => {
            var me = this;
            var dirname = '/var/_localDockerFiles';
            var _f = {};
            fs.readdir(dirname, (err, files) => {
                var list = [];

                for (var i in files) {
                    _f['info_' + i] = (function(i) {
                        return function(cbk) {
                           if (files[i] === 'admin_dockerfile') {
                               cbk(true);
                           } else {
                                me.getDescription(dirname + '/' + files[i] + '/description',
                                    function(err, info) {
                                    if (!err) {
                                        let setting = {};
                                        try {
                                            setting = pkg.require(dirname + '/' + files[i] + '/setting.json');
                                        } catch (e) {

                                        }
                                        list.push({code : files[i], description : info, setting : setting});
                                    }
                                    cbk(true);
                                });
                           }
                        }
                    })(i);

                }
                
                CP.serial(_f, function(data) {
                    callback(list);
                }, 30000);
            });
        }
        this.getDescription = (fn, callback) => {
            fs.readFile(fn, 'utf8', function(err, contents) {
                var info = (!err) ? contents.replace(/(\r|\n|\r\n|\n\r)/g, '<br/>') : '';
                callback(err, info);
            });
        }
        
    }

    module.exports = obj;
})()