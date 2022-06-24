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




var firstQuery;
var secondQuery;
var thirdQuery;
var fourthQuery;
var fifthQuery;
var sixthQuery;






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








var ingresoMensual;
var cortoPlazoI;
var cortoPlazoII;
var largoPlazo;
var potenciaI;  
var potenciaII;  
var fechas;



router.get('/cierre/:fecha', function(req, res, next){
    //console.log("executiing");
    //console.log(req.params.fecha);

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
    //console.log('contratos');
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
    //console.log('contratos con fecha');
    (async function () 
    {
        try {
            let pool = await sql.connect(dbConfig_localhost)     
            let result = await pool.request()
            .input('fecha', req.params.fecha)
            .execute('sp_ObtenerContratosPorFecha')
            contratos = result.recordsets[0];
            // console.log(contratos.length);

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
    //console.log('modificar contratos');
    (async function () 
    {
        try {
            let pool = await sql.connect(dbConfig_localhost)     
            let result = await pool.request()
            .query('select id,cast(fecha as varchar) as fecha, nombre_contrato, empresa, potencia_contratada, categoria_precio, format(precio, \'c\', \'en-US\') as precio  from CONTRATOS')
            contratos = result.recordsets[0];
            // console.log(contratos.length);

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
    //console.log('modificar contratos');
    (async function () 
    {
        try {
            let pool = await sql.connect(dbConfig_localhost)     
            let result = await pool.request()
            .query('select id,cast(fecha as varchar) as fecha, nombre_contrato, empresa, potencia_contratada, categoria_precio, format(precio, \'c\', \'en-US\') as precio  from CONTRATOS where id =' + req.params.id )
            contratos = result.recordsets[0];
            // console.log(contratos.length);

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












var precios;

router.get('/modificarPrecios/:id', function(req, res, next){
    console.log('modificar precios');
    (async function () 
    {
        try {
            let pool = await sql.connect(dbConfig_localhost)     
            let result = await pool.request()
            .query('select id, cast(fecha_cierre as varchar) as fecha, categoria_precio, precio_base_usd_mwh, cargo_transmicion_seguimiento_electrico from tipo_precio where id =' + req.params.id)
            precios = result.recordsets[0];
            console.log(precios.length);

            let result3 = await pool.request()
            .query("SET LANGUAGE Spanish; select  \'\' as fecha, '' as mes, '' as anio  UNION ALL select distinct cast(fecha as varchar) as fecha ,DATENAME(MONTH, fecha) as mes ,cast(YEAR(fecha) as varchar) as anio from INGRESOS_CONTRATOS");
            fechas = result3.recordsets[0];


        } catch (err) {            
            console.log(err);
        }

       
    })().then(() => res.render('editarPrecios', { precios, fechas, fecha : '' } ))
    
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
