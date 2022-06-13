//import sql from "mssql";
const express = require("express");
const app = express();
const path = require('path');
const router = express.Router();
const ejs = require("ejs");
const dbConfig_localhost = require("./dbConfig_localhost");
const dbConfig = require("./dbConfig");
var sql = require('mssql');
const { render } = require("express/lib/response");



//app.use(express.static(__dirname + '/foldername'));

console.log(__dirname)

router.get('/',function(req,res){    
    res.sendFile(__dirname + "/index.html");
    //__dirname : It will resolve to your project folder.
  });

router.get('/dashboard',function(req,res){
    res.sendFile(__dirname+'/dashboard.html')
    //res.send('Prueba del Router');
});

router.get('/preliminar_liquidacion',function(req,res){
    res.sendFile(__dirname+'/preliminar_liquidacion.html');
});


router.get('/test',function(req,res){
   
    var sql = require("mssql");

    // connect to your database
    sql.connect(dbConfig, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
            
        // query to the database and get the records
        request.query('select top 100 * from DATA_CONTRATOS', function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            //res.send(recordset);
            //res.send
            console.log(recordset.recordsets[0].length);
            
            for (var i = 0; i < recordset.recordsets[0].length; i++) 
               {
                  //  res.send(recordset.recordsets[0][i]["EMPRESA_DISTRIBUIDORA"]);
                    console.log(recordset.recordsets[0][i]["EMPRESA_DISTRIBUIDORA"]);
               }
            
        });
    });
});


// router.get('/test2', function(req, res, next){
//     var sql = require("mssql");
//      sql.connect(dbConfig, function(err){
//         var request = new sql.Request();
//         request.query('select top 100 * from DATA_CONTRATOS', function(err, contractData){
//             if(err) console.log(err);
//             res.render('prueba', {title: 'Prueba EJS', data: contractData});
//         });
//      });
// });



function GetMonthly(){
    return new Promise((resove, reject) => {
        sql.connect(dbConfig, function(err){
            var request = new sql.Request();           
            request.query('select * from resumen_mes', function(err, contractData){
              //  console.log(contractData.recordsets[0].length);
              //  console.dir(contractData)
    
                firstQuery = contractData;
              //  console.dir(firstQuery);
                if(err) console.log(err);
                })

            });
    
        });
};





var firstQuery;
var secondQuery;
var thirdQuery;
var fourthQuery;
var fifthQuery;
var sixthQuery;


router.get('/test2', function(req, res, next){
    console.log("executiing");
    const sql = require('mssql');

    (async function () 
    {
        try {
            let pool = await sql.connect(dbConfig)

            let result1 = await pool.request()                
            .query('select * from resumen_mes')
            firstQuery = result1;    
            console.dir(result1)
        
              
            let result2 = await pool.request()                
            .query('select * from preliminar_fountain_dia')
            secondQuery = result2; 
            console.dir(result2)

            let result3 = await pool.request()                
            .query('select * from rsm_contratos_energia_1_total')
            thirdQuery = result3; 
            console.dir(result3)

            let result4 = await pool.request()                
            .query('select * from rsm_contratos_energia_2_total')
            fourthQuery = result4; 
            console.dir(result4)
        } catch (err) {
            // ... error checks
        }

    })().then(() => res.render('prueba', {
        title: 'Prueba Fountain', 
        data: firstQuery, 
        title2: 'Tabla Diaria',
        data2: secondQuery,
        title3: 'Contratos Energia -13',
        data3: thirdQuery,
        title4: 'Contratos Energia -20',
        data4: fourthQuery,        
    }))
    
    sql.on('error', err => {
        console.log(err);
        // ... error handler
    })   
});



////////////////////// DICIEMBRE



router.get('/diciembre', function(req, res, next){
    console.log("executiing");
    const sql = require('mssql');

    (async function () 
    {
        try {
            let pool = await sql.connect(dbConfig)

            let result1 = await pool.request()                
            .query('select * from resumen_diciembre')
            firstQuery = result1;    
            console.dir(result1)
        
            let result2 = await pool.request()                
            .query("SELECT *  FROM preliminar_fountain_dia where EOMONTH(fecha) = '2021-12-31' ")
            secondQuery = result2; 
            console.dir(result2)

            let result3 = await pool.request()                
            .query('select * from rsm_contratos_energia_1_total_dic')
            thirdQuery = result3; 
            console.dir(result3)

            let result4 = await pool.request()                
            .query('select * from rsm_contratos_energia_2_total_dic')
            fourthQuery = result4; 
            console.dir(result4)


            let result5 = await pool.request()                
            .query('select * from rsm_contratos_potencia_1_total_dic')
            fifthQuery = result5; 
            console.dir(result5)

            let result6 = await pool.request()                
            .query('select * from rsm_contratos_potencia_2_total_dic')
            sixthQuery = result6; 
            console.dir(result6)
        } catch (err) {
            // ... error checks
        }

       // cambiar el render 
    })().then(() => res.render('diciembre', {
        title: 'Prueba Fountain', 
        data: firstQuery, 
        title2: 'Tabla Diaria',
        data2: secondQuery,
        title3: 'Contratos Energia -13',
        data3: thirdQuery,
        title4: 'Contratos Energia -20',
        data4: fourthQuery,        

        title5: 'Contratos Potencia -13',
        data5: fifthQuery,

        title6: 'Contratos Potencia -20',
        data6: sixthQuery,        

    }))
    
    sql.on('error', err => {
        console.log(err);
        // ... error handler
    })   
});










router.get('/noviembre', function(req, res, next){
    console.log("executiing");
    const sql = require('mssql');

    (async function () 
    {
        try {
            let pool = await sql.connect(dbConfig)

            let result1 = await pool.request()                
            .query('select * from resumen_noviembre')
            firstQuery = result1;    
            console.dir(result1)
        
            let result2 = await pool.request()                
            .query("SELECT *  FROM preliminar_fountain_dia where EOMONTH(fecha) = '2021-11-30' ")
            secondQuery = result2; 
            console.dir(result2)

            let result3 = await pool.request()                
            .query('select * from rsm_contratos_energia_1_total_nov')
            thirdQuery = result3; 
            console.dir(result3)

            let result4 = await pool.request()                
            .query('select * from rsm_contratos_energia_2_total_nov')
            fourthQuery = result4; 
            console.dir(result4)



            



        } catch (err) {
            // ... error checks
        }

       // cambiar el render 
    })().then(() => res.render('noviembre', {
        title: 'Prueba Fountain', 
        data: firstQuery, 
        title2: 'Tabla Diaria',
        data2: secondQuery,
        title3: 'Contratos Energia -13',
        data3: thirdQuery,
        title4: 'Contratos Energia -20',
        data4: fourthQuery,        

    }))
    
    sql.on('error', err => {
        console.log(err);
        // ... error handler
    })   
});







router.get('/localtest_db', function(req, res){
    console.log("executiing local db test");
    const sql = require('mssql');
      sql.connect(dbConfig_localhost, function(err){
         var request = new sql.Request();
         request.query('select top 100 * from TotalesContratos2', function(err, recordset){
             if(err) console.log(err);
             //console.log("Success!!");
             //console.dir(recordset);
             res.send(recordset)
         });
      });
    }
);



app.get('/localtest', function (req, res) {
   
    var sql = require("mssql");

    // config for your database
    var config = {
        user: 'admin_fountain',
        password: 'Panama04',
        server: 'localhost', 
        database: 'FOUNTAIN4' ,
        options: {
            "enableArithAbort": true,
            "encrypt":false
        }
    };

    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query('select top 100 * from TotalesContratos2', function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            res.send(recordset);
            
        });
    });
});



















router.get('/test3', function(req, res, next){
    console.log("executiing");
    //var sql = require("mssql");
    //  sql.connect(dbConfig, function(err){
    //     var request = new sql.Request();
     


    //      request.query('select * from resumen_mes', function(err, contractData){
    //       //  console.log(contractData.recordsets[0].length);
    //       //  console.dir(contractData)

    //         firstQuery = contractData;
    //       //  console.dir(firstQuery);
    //         if(err) console.log(err);
    //      });
    //     });
       
    //    console.dir(firstQuery);
    GetMonthly().then(() =>
   
    res.render('prueba', {title: 'Prueba Fountain', data: firstQuery}));   
        
        //     if(err) console.log(err);
        //     res.render('prueba', {title: 'Prueba Fountain', data: contractData});
    
});





app.use('/', router);
app.set("view engine", "ejs")

app.listen(process.env.port || 3010 , function(){
    console.log("Server is running on localhost 3010");
});

/*
app.listen(3000, function(){
});
*/


async function getContracts() {
    try{
        //let pool = await sql.connect(dbConfig);
        //let contracts = pool.request().query("SELECT 1500 as resultado");
        await sql.connect(dbConfig);
        //const result = await sql.query`select 1500 as resultado`
        //const result = await sql.query`select top 100 Contrato from FOUNTAIN3.dbo.DATA_CONTRATOS`
        const result = await sql.query`select top 100 * from DATA_CONTRATOS`   

        return result.recordsets;
        //pool.request().query("SELECT * FROM DATOS_CONTRATOS")
    }
    catch(error){
        console.log(error);

    }
}


/*
getContracts().then(result => {
    console.log(result)
})

*/




/*

    var conn = new sql.ConnectionPool(dbConfig);//Connection(dbConfig);

    conn.connect()
    .then(function () {
        var req = new sql.Request(conn);//Request(conn);

        req.query("select * from DATOS_CONTRATOS")
        .then( function(recordeset) {
            console.log(recordeset);
            conn.close();
        })
        .catch(function(err) {
            console.log(err);
            conn.close();
    })
    .catch(function(err){
        console.log(err);
        conn.close();
    })
});
}

*/
//getContracts();
//let res  = getContracts();
//console.log("Resultados")
//console.dir(getContracts());

