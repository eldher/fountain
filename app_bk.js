//import sql from "mssql";





const express = require("express");
const app = express();


const path = require('path');


const router = express.Router();
const ejs = require("ejs");
const dbConfig_localhost = require("./dbConfig_localhost");
const dbConfig = require("./dbConfig");
const sql = require('mssql');
const { render } = require("express/lib/response");
const { CLIENT_RENEG_LIMIT } = require("tls");
const { dirname } = require("path");
const { fileURLToPath } = require("url");



//app.use(express.static(__dirname + '/foldername'));

console.log(__dirname)


//const __dirname = dirname(fileURLToPath(import.meta.url))



// router.get('/',function(req,res){    
//     res.sendFile(__dirname + "/index.html");
//     //__dirname : It will resolve to your project folder.
//   });

router.get('/',function(req,res){    
res.render('index');
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
   

    let string = ""

    // connect to your database
    sql.connect(dbConfig_localhost, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
            
        
        request.query('select top 100 * from INGRESOS_CONTRATOS', function (err, recordset) {            
            if (err) console.log(err)
            console.log(recordset);            
            for (var i = 0; i < recordset.recordsets[0].length; i++) { 

                string =+ recordset.recordsets[0][i]["empresa"];
                console.log(recordset.recordsets[0][i]["empresa"]);
            };        
        });
    });
 // error render before querys
    console.log(string);
    render(string);
});







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







var firstQuery;
var secondQuery;
var thirdQuery;
var fourthQuery;
var fifthQuery;
var sixthQuery;


router.get('/test2', function(req, res, next){
    console.log("executiing");
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

    (async function () 
    {
        try {
            let pool = await sql.connect(dbConfig_localhost)

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


    (async function () 
    {
        try {
            let pool = await sql.connect(dbConfig_localhost)

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





// this works !!
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


// this also works !!
app.get('/localtest', function (req, res) {
   
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
        request.query('select top 10 * from TotalesContratos2', function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            res.send(recordset);
            
        });
    });
});



router.get('/localtest_db', function(req, res){
    console.log("executiing local db test");

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









var ingresoMensual;
var cortoPlazoI;
var cortoPlazoII;
var largoPlazo;
var potenciaI;  
var potenciaII;  
var fechas;




router.get('/cierre_noasync', function(req, res){
    console.log("executiing local db test");
    
    sql.connect(dbConfig_localhost, function(err){
         

        // query total ingresos del mes
        var request = new sql.Request();
         request.input('fecha_cierre', sql.Date, '2021-12-31' );
         request.input('fecha_mes', sql.Date, '2021-12' );
         request.execute('sp_EjecutarCierre', function(err, result){
             if(err) console.log(err);
             console.log("IngresoMensual");
             ingresoMensual = result.recordset[0];             
             //res.send(recordset)
        });


        var rq = new sql.Request();
         rq.input('fecha', sql.Date, '2021-12-31' );
         rq.execute('sp_ObtenerContratoCategoria', function(err, recordsets){
            if(err) console.log(err);
            console.log("prueba");

            cortoPlazoI     = recordsets.recordset[0];
            cortoPlazoII    = recordsets.recordset[1];
            largoPlazo      = recordsets.recordset[2];
            potenciaI       = recordsets.recordset[3];
            potenciaII      = recordsets.recordset[4];
            
             //res.json(categorias);
             //res.send(recordset)
             res.render('cierre', {
                title: 'Prueba Fountain',
                ingresoMensual,
                cortoPlazoI, 
                cortoPlazoII, 
                largoPlazo,   
                potenciaI,    
                potenciaII   
             });
        });
        
    });   
});




// app.get("/cierre", (req, res) => {

//     res.status(301).redirect("localhost:3010/cierre/2021-12-31")

// })


router.get('/cierre/:fecha', function(req, res, next){
    console.log("executiing");
    console.log(req.params.fecha);

    (async function () 
    {
        try {
            let pool = await sql.connect(dbConfig_localhost)

            let result1 = await pool.request()                
            .input('fecha_cierre', sql.Date, req.params.fecha )
            .execute('sp_EjecutarCierre')
            firstQuery = result1;    
            //console.dir(result1);



            let result2 = await pool.request()                
            .input('fecha', sql.Date, req.params.fecha )             // 2021-12-31
            .execute('sp_ObtenerContratoCategoriaConTotal')
            //firstQuery = result1;    
            //console.dir(result2);
            cortoPlazoI     = result2.recordsets[0];
            cortoPlazoII    = result2.recordsets[1];
            largoPlazo      = result2.recordsets[2];
            potenciaI       = result2.recordsets[3];
            potenciaII      = result2.recordsets[4];


            let result3 = await pool.request()
            .query('SET LANGUAGE Spanish; select distinct cast(fecha as varchar) as fecha ,DATENAME(MONTH, fecha) as mes ,YEAR(fecha) as anio from INGRESOS_CONTRATOS')
            fechas = result3.recordsets[0];



        } catch (err) {
            // ... error checks
        }

       // cambiar el render 
    })().then(() => res.render('cierre', {
        title: 'Prueba Fountain',
        fecha:  req.params.fecha,
        data: firstQuery, 
        fechas,
        cortoPlazoI, 
        cortoPlazoII,
        largoPlazo,  
        potenciaI,   
        potenciaII  
    }))
    
    sql.on('error', err => {
        console.log(err);
        // ... error handler
    })   
});


var contratos;  

router.get('/contratos', function(req, res, next){
    console.log('contratos');
    (async function () 
    {
        try {
            let pool = await sql.connect(dbConfig_localhost)     
            let result = await pool.request()
            .execute('sp_ObtenerContratos');
            contratos = result.recordsets[0];            
            console.log(contratos.length);

            let result3 = await pool.request()
            .query('SET LANGUAGE Spanish; select \'\' as fecha, \'\' as mes, \'\' as anio  UNION ALL select distinct cast(fecha as varchar) as fecha ,DATENAME(MONTH, fecha) as mes ,cast(YEAR(fecha) as varchar) as anio from INGRESOS_CONTRATOS');
            fechas = result3.recordsets[0];


        } catch (err) {            
            console.log(err);
        }

       
    })().then(() => res.render('contratos', { contratos, fechas, fecha: '' } ))
    
    sql.on('error', err => {
        console.log(err);        
    })   
});


router.get('/contratos/:fecha', function(req, res, next){
    console.log('contratos con fecha');
    (async function () 
    {
        try {
            let pool = await sql.connect(dbConfig_localhost)     
            let result = await pool.request()
            .input('fecha', req.params.fecha)
            .execute('sp_ObtenerContratosPorFecha')
            contratos = result.recordsets[0];
            console.log(contratos.length);

            let result3 = await pool.request()
            .query("SET LANGUAGE Spanish; select  \'\' as fecha, '' as mes, '' as anio  UNION ALL select distinct cast(fecha as varchar) as fecha ,DATENAME(MONTH, fecha) as mes ,cast(YEAR(fecha) as varchar) as anio from INGRESOS_CONTRATOS");
            fechas = result3.recordsets[0];


        } catch (err) {            
            console.log(err);
        }

       
    })().then(() => res.render('contratos', { contratos, fechas, fecha : req.params.fecha } ))
    
    sql.on('error', err => {
        console.log(err);        
    })   
});




router.get('/modificarContratos', function(req, res, next){
    console.log('modificar contratos');
    (async function () 
    {
        try {
            let pool = await sql.connect(dbConfig_localhost)     
            let result = await pool.request()
            .query('select id,cast(fecha as varchar) as fecha, nombre_contrato, empresa, potencia_contratada, categoria_precio, format(precio, \'c\', \'en-US\') as precio  from CONTRATOS')
            contratos = result.recordsets[0];
            console.log(contratos.length);

            let result3 = await pool.request()
            .query("SET LANGUAGE Spanish; select  \'\' as fecha, '' as mes, '' as anio  UNION ALL select distinct cast(fecha as varchar) as fecha ,DATENAME(MONTH, fecha) as mes ,cast(YEAR(fecha) as varchar) as anio from INGRESOS_CONTRATOS");
            fechas = result3.recordsets[0];


        } catch (err) {            
            console.log(err);
        }

       
    })().then(() => res.render('modificarContratos', { contratos, fechas, fecha : '' } ))
    
    sql.on('error', err => {
        console.log(err);        
    })   
});





router.get('/modificarContratos/:id', function(req, res, next){
    console.log('modificar contratos');
    (async function () 
    {
        try {
            let pool = await sql.connect(dbConfig_localhost)     
            let result = await pool.request()
            .query('select id,cast(fecha as varchar) as fecha, nombre_contrato, empresa, potencia_contratada, categoria_precio, format(precio, \'c\', \'en-US\') as precio  from CONTRATOS where id =' + req.params.id )
            contratos = result.recordsets[0];
            console.log(contratos.length);

            let result3 = await pool.request()
            .query("SET LANGUAGE Spanish; select  \'\' as fecha, '' as mes, '' as anio  UNION ALL select distinct cast(fecha as varchar) as fecha ,DATENAME(MONTH, fecha) as mes ,cast(YEAR(fecha) as varchar) as anio from INGRESOS_CONTRATOS");
            fechas = result3.recordsets[0];


        } catch (err) {            
            console.log(err);
        }

       
    })().then(() => res.render('editarContratos', { contratos, fechas, fecha : '' } ))
    
    sql.on('error', err => {
        console.log(err);        
    })   
});





















var precios;

router.get('/modificarPrecios', function(req, res, next){
    console.log('modificar precios');
    (async function () 
    {
        try {
            let pool = await sql.connect(dbConfig_localhost)     
            let result = await pool.request()
            .query('select id, cast(fecha_cierre as varchar) as fecha, categoria_precio, precio_base_usd_mwh, cargo_transmicion_seguimiento_electrico from tipo_precio')
            precios = result.recordsets[0];
            console.log(precios.length);

            let result3 = await pool.request()
            .query("SET LANGUAGE Spanish; select  \'\' as fecha, '' as mes, '' as anio  UNION ALL select distinct cast(fecha as varchar) as fecha ,DATENAME(MONTH, fecha) as mes ,cast(YEAR(fecha) as varchar) as anio from INGRESOS_CONTRATOS");
            fechas = result3.recordsets[0];


        } catch (err) {            
            console.log(err);
        }

       
    })().then(() => res.render('modificarPrecios', { precios, fechas, fecha : '' } ))
    
    sql.on('error', err => {
        console.log(err);        
    })   
});























app.use('/', router);
app.set("view engine", "ejs");
console.log(path.join(__dirname , '/public/'));
app.use(express.static(path.join(__dirname , '/public/')));
app.listen(process.env.port || 3010 , function(){
    console.log("Server is running on localhost 3010");
});
