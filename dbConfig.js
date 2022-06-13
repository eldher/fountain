
var sql = require('mssql');

var dbConfig ={
    user: 'admin_fountain',
    password: 'Panama04',
    server: 'fountaincorp00.database.windows.net',
    database: 'FOUNTAIN4',
    port : 1433,
    pool: {
        max:10,
        min: 0,
        idleTimeoutMillis: 3000
    },
    options:{
        encrypt: true,
        trustServerCertificate: true
        //trustedConnection: true,
        //enableArithPort: true,
        //instancename : ''
    }
};




module.exports = dbConfig;