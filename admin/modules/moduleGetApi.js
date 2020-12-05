(function() {
    var exec = require('child_process').exec;
    var obj = function(env, pkg) {
        var me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = new pkg.crowdProcess(),
            MYSQL = pkg.require(env.root+ '/vendor/mysql/node_modules/mysql');

        var key_dir = '/var/_localAppKey';

        this.sendIt = (data, callback) => {
            var _f = {};
            fs.readdir(key_dir, (err, files) => {
                var list = (!files) ? [] : files;
                for (var i = 0; i < list.length; i++) {
                    _f['f_' + i] = ((i) => { 
                        return (cbk) =>{
                            var cfg = {};
                            try {
                                cfg =  pkg.require(key_dir + '/' + list[i]);
                            } catch (e) {}
                            cbk(cfg);
                        }
                    })(i);
                }

                CP.serial(_f, function(data) {
                    let passKey =  pkg.require(key_dir + '/db1.json');
                    var cfg = {
                        host: '10.10.10.254',
                        user: 'root',
                        port : '13306',
                        password: passKey.key,
                        database : 'mysql'
                    };
                    var connection = MYSQL.createConnection(cfg);
                    var sql_str = 'SELECT * from user';
                    connection.query(sql_str, function (error, results, fields) {
                        connection.end();
                        callback((error) ? error : results);
                    });
                }, 3000);
                // callback(files);
            });
        }
        
    }

    module.exports = obj;
})()