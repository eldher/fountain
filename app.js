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


var bodyParser = require('body-parser');



app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', router);
app.set("view engine", "ejs");
console.log(path.join(__dirname , '/public/'));
app.use(express.static(path.join(__dirname , '/public/')));




// support parsing of application/json type post data


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






var id;
var tiposPrecio;


router.get('/agregarContrato/', function(req, res, next){
    //console.log('modificar contratos');
    (async function () 
    {
        try {
            let pool = await sql.connect(dbConfig_localhost)     
            let result = await pool.request()
            .query('select max(id) + 1 as next_id from CONTRATOS')
            id = result.recordsets[0];
            // console.log(contratos.length);

            let result3 = await pool.request()
            .query("SET LANGUAGE Spanish; select  \'\' as fecha, '' as mes, '' as anio  UNION ALL select distinct cast(fecha as varchar) as fecha ,DATENAME(MONTH, fecha) as mes ,cast(YEAR(fecha) as varchar) as anio from INGRESOS_CONTRATOS");
            fechas = result3.recordsets[0];

            let result4 = await pool.request()
            .query("select  DISTINCT categoria_precio  from tipo_precio ");
            categoriasPrecio = result4.recordsets[0];


            let result5 = await pool.request()
            .query('select id, cast(fecha_cierre as varchar) as fecha, categoria_precio, precio_base_usd_mwh, cargo_transmicion_seguimiento_electrico from tipo_precio')
            tiposPrecio = result5.recordsets[0];




        } catch (err) {            
            console.log(err);
        }

       
    })().then(() => res.render('agregarContrato', { id, fechas, categoriasPrecio, tiposPrecio, fecha : '' } ))
    
    sql.on('error', err => {
        console.log(err);        
    })   
});




router.get('/agregarPrecio/', function(req, res, next){
    //console.log('modificar contratos');
    (async function () 
    {
        try {
            let pool = await sql.connect(dbConfig_localhost)     
            let result = await pool.request()
            .query('select max(id) + 1 as next_id from tipo_precio')
            id = result.recordsets[0];
            // console.log(contratos.length);

            let result3 = await pool.request()
            .query("SET LANGUAGE Spanish; select  \'\' as fecha, '' as mes, '' as anio  UNION ALL select distinct cast(fecha as varchar) as fecha ,DATENAME(MONTH, fecha) as mes ,cast(YEAR(fecha) as varchar) as anio from INGRESOS_CONTRATOS");
            fechas = result3.recordsets[0];

        } catch (err) {            
            console.log(err);
        }

       
    })().then(() => res.render('agregarPrecio', { id, fechas, fecha : '' } ))
    
    sql.on('error', err => {
        console.log(err);        
    })   
});








app.post('/guardarContrato', function(req, res){
    console.log(req.body);

    
    const fecha = req.body.fecha;
    const nombre_contrato = req.body.nombre_contrato;
    const empresa = req.body.empresa;
    const potencia_contratada = req.body.potencia_contratada;
    const categoria_precio = req.body.categoria_precio;
    const precio = req.body.precio_base_usd_mwh*1 + req.body.cargo_transmicion_seguimiento_electrico*1
    const id = req.body.id;
    

    const queryString = "INSERT INTO CONTRATOS (fecha, nombre_contrato, empresa, potencia_contratada, categoria_precio, precio ) VALUES ('" +  fecha + "', '"+ nombre_contrato + "', '"+empresa+"', '"+potencia_contratada+"', '"+categoria_precio+"', '"+precio+"')";

    console.log(queryString);
    console.log(JSON.stringify(req.body));

    ( async function(){
        try {
            let pool = await sql.connect(dbConfig_localhost)     
            let result = await pool.request()
            .query(queryString)  

        } catch (error) {
            console.log(error);
        }

    })().then(() => res.send('<script type="text/javascript"> alert("Contrato Guardado!"); window.location="./contratos";</script>'))

  //res.send(JSON.stringify(req.body));  
}
);


app.post('/guardarPrecio', function(req, res){
    console.log(req.body);
    console.log(JSON.stringify(req.body));

    const id = req.body.id;
    const fecha = req.body.fecha;
    const categoria_precio = req.body.categoria_precio;
    const precio_base_usd_mwh = req.body.precio_base_usd_mwh;
    const cargo_transmicion_seguimiento_electrico = req.body.cargo_transmicion_seguimiento_electrico;
   // const sumprecio = req.body.precio_base_usd_mwh*1 + req.body.cargo_transmicion_seguimiento_electrico*1

    const queryString = "INSERT INTO tipo_precio (id, fecha_cierre, categoria_precio, precio_base_usd_mwh, cargo_transmicion_seguimiento_electrico ) VALUES ('" +  id + "', '"+ fecha + "', '"+ categoria_precio + "', '"+precio_base_usd_mwh+"', '"+cargo_transmicion_seguimiento_electrico+"')";

    console.log(queryString);
    
    ( async function(){
        try {
            let pool = await sql.connect(dbConfig_localhost)
            let result = await pool.request()
            .query(queryString)
        } catch (error) {
            console.log(error)            
        }
    })().then(() =>  res.send('<script type="text/javascript"> alert("Precio Guardado!"); window.location="./contratos";</script>') )   
});












app.listen(process.env.port || 3010 , function(){
    console.log("Server is running on localhost 3010");
});
