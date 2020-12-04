(function() {
    var exec = require('child_process').exec;
    var obj = function(env, pkg) {
        var me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = new pkg.crowdProcess(),
            MYSQL = pkg.require(env.root+ '/vendor/mysql/node_modules/mysql');

        this.sendIt = (data, callback) => {
            var cfg = {
                host: '10.10.10.254',
                user: 'root',
                port : '13306',
                password: 'leZiGsDW0c8QT7JxuWp0QimIb565N31i',
                database : 'mysql'
            };
            var connection = MYSQL.createConnection(cfg);
            var sql_str = 'SELECT * from user';
            connection.query(sql_str, function (error, results, fields) {
                connection.end();
                callback((error) ? error : results);
            });
        }
        
    }

    module.exports = obj;
})()