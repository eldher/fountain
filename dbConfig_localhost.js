
// var dbConfig_localhost ={
//     user: 'admin_fountain',
//     password: 'Panama04',
//     server: 'localhost',
//     database: 'FOUNTAIN5',    
//     options: {
//         "enableArithAbort": true,
//         "encrypt":false
//     }

// };






var sql = require('mssql');

var dbConfig_localhost ={
    user: 'admin_fountain',
    password: 'Panama04',
    server: 'fountaincorp.database.windows.net',
    database: 'FOUNTAIN5',
    port : 1433,
    requestTimeout: 300000 ,
    pool: {
        max:10,
        min: 0,
        idleTimeoutMillis: 300000
    },
    options:{
        encrypt: true,
        trustServerCertificate: true
        //trustedConnection: true,
        //enableArithPort: true,
        //instancename : ''
    }

};



 module.exports = dbConfig_localhost;