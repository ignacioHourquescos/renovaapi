var sql        = require("mssql");

// config for your database
var config = {
    user: 'rnv_admin',
    password: 'Rnv_12345',
    server: '200.80.10.160',
    path:'/RPSISTEMAS',
    port:  50128,
    database: 'factu_renova',
    encrypt: false
};


var connection = sql.connect(config, function (err){
  if (err) console.log(err);

});


module.exports = connection;



