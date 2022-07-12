
const express = require("express");
const app = express();
const path = require('path');
const router = express.Router();
const ejs = require("ejs");
const dbConfig_localhost = require("./dbConfig_localhost");
const sql = require('mssql');
const port = process.env.PORT || 3000


var bodyParser = require('body-parser');



app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', router);
app.set("view engine", "ejs");
console.log(path.join(__dirname , '/public/'));
app.use(express.static(path.join(__dirname , '/public/')));





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
            .query('select a.id,cast(fecha as varchar) as fecha, nombre_contrato, empresa, potencia_contratada, a.categoria_precio,' +
                   'format(b.precio_base_usd_mwh, \'c\', \'en-US\') as precio_base_usd_mwh  , format(b.cargo_transmicion_seguimiento_electrico, \'c\', \'en-US\') as cargo_transmicion_seguimiento_electrico , ' + 
                   'format(b.precio,  \'c\', \'en-US\')  as precio ' +
                   'from CONTRATOS a ' +
                   'left join tipo_precio b on a.fecha = b.fecha_cierre and a.categoria_precio = b.categoria_precio ' )
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
            .query('select a.id,cast(fecha as varchar) as fecha, nombre_contrato, empresa, potencia_contratada, a.categoria_precio ' + 
                    ',format(b.precio_base_usd_mwh, \'c\', \'en-US\') as precio_base_usd_mwh  , format(b.cargo_transmicion_seguimiento_electrico, \'c\', \'en-US\') as cargo_transmicion_seguimiento_electrico ' + 
                    ',format(b.precio,  \'c\', \'en-US\')  as precio ' +       
                    'from CONTRATOS a ' + 
                    'left join tipo_precio b on a.fecha = b.fecha_cierre and a.categoria_precio = b.categoria_precio ' +                   
                    'where a.id =' + req.params.id )
            
            
            contratos = result.recordsets[0];
            // console.log(contratos.length);

            let result3 = await pool.request()
            .query("SET LANGUAGE Spanish; select  \'\' as fecha, '' as mes, '' as anio  UNION ALL select distinct cast(fecha as varchar) as fecha ,DATENAME(MONTH, fecha) as mes ,cast(YEAR(fecha) as varchar) as anio from INGRESOS_CONTRATOS");
            fechas = result3.recordsets[0];

            
            let result4 = await pool.request()
            .query("select distinct categoria_precio from tipo_precio WHERE fecha_cierre =( SELECT FECHA FROM CONTRATOS WHERE ID = + " +  req.params.id + " )");
            categoriasPrecio = result4.recordsets[0];


            qry = 'select id, cast(fecha_cierre as varchar) as fecha, categoria_precio, precio_base_usd_mwh, cargo_transmicion_seguimiento_electrico, precio from tipo_precio ' + 
            'WHERE fecha_cierre = ( SELECT FECHA FROM CONTRATOS WHERE ID = '+  req.params.id + ')'
            console.log(qry)
            let result5 = await pool.request()
            .query(qry);
            tiposPrecio = result5.recordsets[0];


        } catch (err) {            
            console.log(err);
        }

       
    })().then(() => res.render('editarContratos', { contratos, fechas, fecha : '', categoriasPrecio, tiposPrecio } ))
    
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
            .query('select id, cast(fecha_cierre as varchar) as fecha, categoria_precio ' +
            ',cast(precio_base_usd_mwh as decimal(10,3)) as precio_base_usd_mwh ' +
            ',cast(cargo_transmicion_seguimiento_electrico as decimal(10,3)) as cargo_transmicion_seguimiento_electrico ' +
            ',cast(precio as decimal(10,3)) as precio ' + 
            'from tipo_precio')
       
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
            .query('select id, cast(fecha_cierre as varchar) as fecha, categoria_precio, precio_base_usd_mwh, cargo_transmicion_seguimiento_electrico, precio from tipo_precio where id =' + req.params.id)
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
            .query('select id, cast(fecha_cierre as varchar) as fecha, categoria_precio, precio_base_usd_mwh, cargo_transmicion_seguimiento_electrico, precio from tipo_precio')
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

    const accion = req.body.accion
    const fecha = req.body.fecha;
    const nombre_contrato = req.body.nombre_contrato;
    const empresa = req.body.empresa;
    const potencia_contratada = req.body.potencia_contratada;
    const categoria_precio = req.body.categoria_precio;
    const precio = req.body.precio_base_usd_mwh*1 + req.body.cargo_transmicion_seguimiento_electrico*1
    const id = req.body.id;
    

    if(accion =="agregar"){

        var queryString = "INSERT INTO CONTRATOS (fecha, nombre_contrato, empresa, potencia_contratada, categoria_precio ) VALUES ('"+ fecha + "','"+ nombre_contrato + "','"+ empresa + "','"+potencia_contratada+"', '"+categoria_precio +"')";

        console.log(queryString);
        console.log(JSON.stringify(req.body));

        (async function(){
            try {
                let pool = await sql.connect(dbConfig_localhost)     
                let result = await pool.request()
                .query(queryString)  

            } catch (error) {
                console.log(error);
            }

    })().then(() => res.send('<script type="text/javascript"> alert("Contrato Guardado!"); window.location="./modificarContratos";</script>'))
    }

    
    if(accion == "modificar"){
        console.log("modificar")

        var queryString = "UPDATE CONTRATOS SET "+
        "nombre_contrato = '" + nombre_contrato + "'" +
        ", empresa = '" + empresa + "'" +
        ", potencia_contratada = "+potencia_contratada +
        ", categoria_precio = '"+categoria_precio + "'" +       
        " where id = "+id
        
        console.log(queryString);

        (async function(){
            try {
                let pool = await sql.connect(dbConfig_localhost)     
                let result = await pool.request()
                .query(queryString)  
    
            } catch (error) {
                console.log(error);
            }
    
        })().then(() => res.send('<script type="text/javascript"> alert("Contrato Guardado!"); window.location="./modificarContratos";</script>'))


    }


  //res.send(JSON.stringify(req.body));  
}
);


app.post('/guardarPrecio', function(req, res){
    console.log(req.body);
    console.log(JSON.stringify(req.body));

    const accion = req.body.accion
    const id = req.body.id;
    const fecha = req.body.fecha;
    const categoria_precio = req.body.categoria_precio;
    const precio_base_usd_mwh = parseFloat(req.body.precio_base_usd_mwh);
    const cargo_transmicion_seguimiento_electrico = parseFloat(req.body.cargo_transmicion_seguimiento_electrico);
    const precio = precio_base_usd_mwh + cargo_transmicion_seguimiento_electrico
   // const sumprecio = req.body.precio_base_usd_mwh*1 + req.body.cargo_transmicion_seguimiento_electrico*1


   if(accion == 'agregar'){

        const queryString = "INSERT INTO tipo_precio (id, fecha_cierre, categoria_precio, precio_base_usd_mwh, cargo_transmicion_seguimiento_electrico, precio ) " + 
        "VALUES ('" +  id + "', '"+ fecha + "', '"+ categoria_precio + "', '"+precio_base_usd_mwh+"', '"+cargo_transmicion_seguimiento_electrico +"', '"+ precio + "')";

        console.log(queryString);
        
        ( async function(){
            try {
                let pool = await sql.connect(dbConfig_localhost)
                let result = await pool.request()
                .query(queryString)
            } catch (error) {
                console.log(error)            
            }
        })().then(() =>  res.send('<script type="text/javascript"> alert("Precio Guardado!"); window.location="./modificarPrecios";</script>') )   

    }

    if(accion == 'modificar'){
        console.log("Modificar Precio")
        const queryString = "UPDATE  tipo_precio SET  categoria_precio ='"+categoria_precio+"', precio_base_usd_mwh =" + precio_base_usd_mwh + ", cargo_transmicion_seguimiento_electrico = " +  cargo_transmicion_seguimiento_electrico +
        ", precio ="+ precio + " where id="+id
        
        console.log(queryString);

        // "INSERT INTO tipo_precio (id, fecha_cierre, categoria_precio, precio_base_usd_mwh, cargo_transmicion_seguimiento_electrico, precio ) " + 
        // "VALUES ('" +  id + "', '"+ fecha + "', '"+ categoria_precio + "', '"+precio_base_usd_mwh+"', '"+cargo_transmicion_seguimiento_electrico +"', '"+ precio + "')";


        
        ( async function(){
            try {
                let pool = await sql.connect(dbConfig_localhost)
                let result = await pool.request()
                .query(queryString)
            } catch (error) {
                console.log(error)            
            }
        })().then(() =>  res.send('<script type="text/javascript"> alert("Precio Guardado!"); window.location="./modificarPrecios";</script>') )   

    }


});







app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })




// app.listen(process.env.port || 3010 , function(){
//     console.log("Server is running on localhost 3010");
// });
