

const cookieParser = require('cookie-parser');
const express = require("express");
const app = express();
const path = require('path');
const router = express.Router();
const ejs = require("ejs");
const dbConfig_localhost = require("./dbConfig_localhost");
const sql = require('mssql');
const port = process.env.PORT || 3000
const XSLX = require('xlsx')



const totales_por_contratos = require('./uploaders/totales_por_contratos.js')
const balance_de_potencia = require('./uploaders/balance_de_potencia.js')
const servicios_auxiliares = require('./uploaders/servicios_auxiliares.js')
const generacion_obligada = require('./uploaders/generacion_obligada.js')
const resumen_generacion = require('./uploaders/resumen_generacion.js')
const valores_negativos = require('./uploaders/valores_negativos.js')
const sasd = require('./uploaders/sasd.js')
const saerlp = require('./uploaders/saerlp.js')

const users = require('./uploaders/users.js')


var bodyParser = require('body-parser');

// middleware to extract latest data 
async function getLatestDateFromTable() {
    try {
        let pool = await sql.connect(dbConfig_localhost);

        let result = await pool.request()
            // its only possible to extract Oficial dates
            .query("SELECT cast(MAX(fecha) as nvarchar) AS latestDate FROM LiquidacionFountain where version = 'Oficial'" );

        return result.recordset[0].latestDate;
    } catch (err) {
        console.log(err);
        return null;
    }
}


async function getLastestIngresosPreliminaresDate() {
    try {
        let pool = await sql.connect(dbConfig_localhost);

        let result = await pool.request()            
            .query("SELECT cast(MAX(fecha) as nvarchar)  AS latestDate FROM LiquidacionFountain where version = 'Preliminar'" );
        return result.recordset[0].latestDate;
    } catch (err) {
        console.log(err);
        return null;
    }
}



app.use(async (req, res, next) => {
    try {
        const latestDate = await getLatestDateFromTable();
        if (latestDate) {
            res.locals.latestDate  = latestDate;
            // res.locals.latestYear  = latestDate.getFullYear();
            // res.locals.latestMonth = String(latestDate.getMonth() + 1).padStart(2, '0'); // Adding 1 to month since getMonth() returns 0-11
            // res.locals.latestDay   = String(latestDate.getDate()).padStart(2, '0');
        }
        next();
    } catch (err) {
        console.log(err);
        next();
    }
});


app.use(async (req, res, next) => {
    try {
        const ingresosPreliminaresDate = await getLastestIngresosPreliminaresDate();
        if (ingresosPreliminaresDate) {
            res.locals.FechaIngresosPreliminares  = ingresosPreliminaresDate;
        }
        next();
    } catch (err) {
        console.log(err);
        next();
    }
});




app.use(cookieParser());
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', router);
app.set("view engine", "ejs");
console.log(path.join(__dirname , '/public/'));
app.use(express.static(path.join(__dirname , '/public/'))); 



// middleware to auto by cookie
function requireAuth(req, res, next) {
    console.log('Running Middleware')
    console.log(req.cookies)
    if(req.cookies.email) {      
      next();
    } else {
      res.redirect('/login');
    }
  }
  


// router.get('/',function(req,res){    
//     res.sendFile(__dirname + "/index.html");
//     //__dirname : It will resolve to your project folder.
//   });



app.get('/login', (req, res) => {
    res.render('login', { errorMessage: null });
});


app.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Check if user exists
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        // Set a cookie with the user's email
        console.log("login found")
        res.cookie('email', user.email, { maxAge: 1000000, httpOnly: true })        
        res.redirect('/');  
    } else {
        console.log("login not found")
        res.status(401).send('Invalid credentials');
    }
});

// Logout route
app.get('/logout', (req, res) => {
    // Clear the email cookie to log the user out
    res.clearCookie('email');
    res.redirect('/');
});



// router.get('/', requireAuth, async function(req,res){    
//     //const email = req.cookies.email;
//     (async function () 
//     {
//         try {
//             let pool = await sql.connect(dbConfig_localhost)     

//             let query_anios = await pool.request()
//             .query('select distinct YEAR(fecha) as anio from LiquidacionFountain')
//             anios = query_anios.recordsets[0];


//             let result = await pool.request()
//             .input('anio', 2023)
//             .input('mes', 01)
//             .execute('sp_Dashboard')              
//             graficos  = result.recordsets[0];
//             cards  = result.recordsets[1];
//             EAR  = result.recordsets[2];

//             //console.log(EAR);    
//         } catch (err) {            
//             console.log(err);
//         }
       
//     })().then(() => res.render('index', { anios, anio: 2022 , mes: 05 ,graficos, cards, EAR} ))
//     sql.on('error', err => {
//         console.log(err);        
//     })   
// });

router.get('/', requireAuth, async function (req, res) {
    // Retrieve the latest date from res.locals.latestDate
    const latestDate = res.locals.latestDate;

    if (latestDate) {
        // Extract the year and month from the latest date
        const latestYear = latestDate.substring(0, 4);
        const latestMonth = latestDate.substring(5, 7);
       
        try {
            let pool = await sql.connect(dbConfig_localhost);

            let query_anios = await pool.request()
                .query('select distinct YEAR(fecha) as anio from LiquidacionFountain');
            anios = query_anios.recordsets[0];

            let result = await pool.request()
                .input('anio', latestYear)
                .input('mes', latestMonth)
                .execute('sp_Dashboard');
            graficos = result.recordsets[0];
            cards = result.recordsets[1];
            EAR = result.recordsets[2];

            // Render the index page with the latest year and month
            res.render('index', { anios, anio: latestYear, mes: latestMonth, graficos, cards, EAR  });
        } catch (err) {
            console.log(err);
            res.status(500).send('An error occurred.');
        }
    } else {
        // Handle the case where latestDate is not available
        res.status(500).send('Latest date not available.');
    }
});



router.get('/:anio&:mes', requireAuth, function(req,res){    
    (async function () 
    {
        try {
            let pool = await sql.connect(dbConfig_localhost)     

            let query_anios = await pool.request()
            .query('select distinct YEAR(fecha) as anio from LiquidacionFountain')
            anios = query_anios.recordsets[0];


            let result = await pool.request()
            .input('anio', req.params.anio)
            .input('mes', req.params.mes)
            .execute('sp_Dashboard')            
            graficos  = result.recordsets[0];
            cards  = result.recordsets[1];
            EAR  = result.recordsets[2];

            //console.log(EAR);    
        } catch (err) {            
            console.log(err);
        }
       
    })().then(() => res.render('index', { anios, anio: req.params.anio, mes: req.params.mes ,graficos, cards, EAR} ))
    sql.on('error', err => {
        console.log(err);        
    })   
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



router.get('/cierre/:fecha', requireAuth, function(req, res, next){
    //console.log("executiing");
    //console.log(req.params.fecha);


    
    // if(!req.params)
    // return res.send("NO PARAMS PASSED")

    // if(!req.params.fecha)
    // return res.send("NO address_line PASSED")

    // if(req.params.fecha === ""){
    // res.send("ADDRESS LINE EMPTY.")
    // } else {
    // res.send("ADDRESS LINE > ",req.params.fecha)
    // }


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

            .query('SET LANGUAGE Spanish; ' +
            'select distinct ' +
            'cast(EOMONTH(fecha) as varchar) as fecha ' +
            ",concat( DATENAME(MONTH, EOMONTH(fecha)) ,\' \', cast(YEAR(EOMONTH(fecha)) as varchar)) as  mes_y_anio  " +
            'from [dbo].[LiquidacionFountain] order by 1 ') 

            //.query('SET LANGUAGE Spanish; select distinct cast(fecha as varchar) as fecha ,DATENAME(MONTH, fecha) as mes ,YEAR(fecha) as anio from INGRESOS_CONTRATOS')
            //.query('SET LANGUAGE Spanish; select distinct cast(fecha_cierre as varchar) as fecha ,DATENAME(MONTH, fecha_cierre) as mes ,YEAR(fecha_cierre) as anio from tipo_precio')


            fechas = result3.recordsets[0];



        } catch (err) {
            // ... error checks
        }

       // cambiar el render 
    })().then(() => res.render('cierre', {
        title: 'Ingreso Mensual',
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





router.get('/cierre_preliminar/:fecha_preliminar', requireAuth, function(req, res, next){
    //console.log("executiing");
    //console.log(req.params.fecha);

    (async function () 
    {
        try {
            let pool = await sql.connect(dbConfig_localhost)

            let result1 = await pool.request()                
            .input('fecha_preliminar', sql.Date, req.params.fecha_preliminar )
            .execute('sp_EjecutarCierre_Preliminar')
            firstQuery = result1;    
            //console.dir(result1);




            let result2 = await pool.request()                
            .input('fecha_preliminar', sql.Date, req.params.fecha_preliminar )             // 2021-12-31
            .execute('sp_ObtenerContratoCategoriaConTotal_Preliminar')
            //firstQuery = result1;    
            //console.dir(result2);
            cortoPlazoI     = result2.recordsets[0];
            cortoPlazoII    = result2.recordsets[1];
            largoPlazo      = result2.recordsets[2];
            potenciaI       = result2.recordsets[3];
            potenciaII      = result2.recordsets[4];


            let result3 = await pool.request()

            // .query('SET LANGUAGE Spanish; ' +
            // 'select distinct ' +
            // 'cast(EOMONTH(fecha) as varchar) as fecha ' +
            // ",concat( DATENAME(MONTH, EOMONTH(fecha)) ,\' \', cast(YEAR(EOMONTH(fecha)) as varchar)) as  mes_y_anio  " +
            // 'from [dbo].[LiquidacionFountain] where version=\'Preliminar\' order by 1 ') 


            //.query("select cast( cast(max(fecha) as date) as nvarchar) as fecha from [dbo].[LiquidacionFountain] where version='Preliminar' group by EOMONTH(fecha) order by 1 ") 
            .query("select cast(max(fecha) as varchar) as fecha from LiquidacionFountain where version = 'Preliminar' group by fecha_mes, fecha_carga, version order by 1")

            //.query('SET LANGUAGE Spanish; select distinct cast(fecha as varchar) as fecha ,DATENAME(MONTH, fecha) as mes ,YEAR(fecha) as anio from INGRESOS_CONTRATOS')
            //.query('SET LANGUAGE Spanish; select distinct cast(fecha_cierre as varchar) as fecha ,DATENAME(MONTH, fecha_cierre) as mes ,YEAR(fecha_cierre) as anio from tipo_precio')


            fechas = result3.recordsets[0];



        } catch (err) {
            // ... error checks
        }

       // cambiar el render 
    })().then(() => res.render('cierre_preliminar', {
        title: 'Ingreso Mensual',
        fecha:  req.params.fecha_preliminar,
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

router.get('/contratos', requireAuth, function(req, res, next){
    //console.log('contratos');
    (async function () 
    {
        try {
            let pool = await sql.connect(dbConfig_localhost)     
            let result = await pool.request()
            .execute('sp_ObtenerContratos');
            contratos = result.recordsets[0];            
            console.log('Cantidad de Contratos: ' + contratos.length);

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



router.get('/contratos/:fecha', requireAuth, function(req, res, next){
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




router.get('/modificarContratos', requireAuth, function(req, res, next){
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
                   'left join tipo_precio b on a.fecha = b.fecha_cierre and a.categoria_precio = b.categoria_precio ' +
                   ' order by fecha ASC, a.categoria_precio '
                   )
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





router.get('/modificarContratos/:id', requireAuth ,function(req, res, next){
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
                    'where a.id =' + req.params.id  + ' order by fecha ASC') 
            
            
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



router.get('/eliminarContratos/:id', requireAuth, function(req, res, next){

    let contratoBorrar 

    console.log('eliminar contrato: ' + req.params.id);
    (async function () 
    {
        try {
            let pool = await sql.connect(dbConfig_localhost)     


            let result1 = await pool.request()
            .query('select cast(fecha as varchar(10)) as fecha, nombre_contrato from [dbo].[CONTRATOS] where id =' + req.params.id)
            contratoBorrar = result1.recordsets[0];
      

            console.log(contratoBorrar)

            let result2 = await pool.request()
            .query('delete from [dbo].[CONTRATOS] where id =' + req.params.id)  

        } catch (err) {            
            console.log(err);
        }



       
    })().then(() => res.send('<script type="text/javascript"> alert("Contrato '+ contratoBorrar[0].nombre_contrato + '  ' + contratoBorrar[0].fecha + ' Eliminado!"); window.location="../modificarPrecios";</script>'))
    
    sql.on('error', err => {
        console.log(err);        
    })   
});








router.get('/modificarPrecios', requireAuth, function(req, res, next){
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
            'from tipo_precio order by fecha_cierre asc')
       
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

router.get('/modificarPrecios/:id', requireAuth, function(req, res, next){
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




router.get('/eliminarPrecios/:id', requireAuth, function(req, res, next){

    let precioBorrar 

    console.log('eliminar precio:' + req.params.id);
    (async function () 
    {
        try {
            let pool = await sql.connect(dbConfig_localhost)     


            let result1 = await pool.request()
            .query('select cast(fecha_cierre as varchar(10)) as fecha_cierre, categoria_precio from tipo_precio where id =' + req.params.id)
            precioBorrar = result1.recordsets[0];
      

            console.log(precioBorrar)

            let result2 = await pool.request()
            .query('delete from tipo_precio where id =' + req.params.id)  

        } catch (err) {            
            console.log(err);
        }



       
    })().then(() => res.send('<script type="text/javascript"> alert("Precio '+ precioBorrar[0].categoria_precio + '  ' + precioBorrar[0].fecha_cierre + ' Eliminado!"); window.location="../modificarPrecios";</script>'))
    
    sql.on('error', err => {
        console.log(err);        
    })   
});








var id;
var tiposPrecio;


router.get('/agregarContrato/', requireAuth, function(req, res, next){
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
            //.query("SET LANGUAGE Spanish; select  \'\' as fecha, '' as mes, '' as anio  UNION ALL select distinct cast(fecha as varchar) as fecha ,DATENAME(MONTH, fecha) as mes ,cast(YEAR(fecha) as varchar) as anio from INGRESOS_CONTRATOS");
            .query('SET LANGUAGE Spanish; ' +
            'select distinct ' +
            'cast(EOMONTH(fecha) as varchar) as fecha ' +
            ",concat( DATENAME(MONTH, EOMONTH(fecha)) ,\' \', cast(YEAR(EOMONTH(fecha)) as varchar)) as  mes_y_anio  " +
            'from [dbo].[LiquidacionFountain] order by 1 ') 
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




router.get('/agregarPrecio/', requireAuth, function(req, res, next){
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
            //.query("SET LANGUAGE Spanish; select  \'\' as fecha, '' as mes, '' as anio  UNION ALL select distinct cast(fecha as varchar) as fecha ,DATENAME(MONTH, fecha) as mes ,cast(YEAR(fecha) as varchar) as anio from INGRESOS_CONTRATOS");
            .query('SET LANGUAGE Spanish; ' +
                'select distinct ' +
                'cast(EOMONTH(fecha) as varchar) as fecha ' +
                ",concat( DATENAME(MONTH, EOMONTH(fecha)) ,\' \', cast(YEAR(EOMONTH(fecha)) as varchar)) as  mes_y_anio  " +
                'from [dbo].[LiquidacionFountain] order by 1 ') 
            fechas = result3.recordsets[0];

        } catch (err) {            
            console.log(err);
        }

       
    })().then(() => res.render('agregarPrecio', { id, fechas, fecha : '' } ))
    
    sql.on('error', err => {
        console.log(err);        
    })   
});








app.post('/guardarContrato',  function(req, res){
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


app.post('/guardarPrecio',  function(req, res){
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

        // // modificado para quitar el max id, usando el identity de sql server se evita problemas de duplicacion
        // const queryString = "INSERT INTO tipo_precio (id, fecha_cierre, categoria_precio, precio_base_usd_mwh, cargo_transmicion_seguimiento_electrico, precio ) " + 
        // "VALUES ('" +  id + "', '"+ fecha + "', '"+ categoria_precio + "', '"+precio_base_usd_mwh+"', '"+cargo_transmicion_seguimiento_electrico +"', '"+ precio + "')";


        const queryString = "INSERT INTO tipo_precio (fecha_cierre, categoria_precio, precio_base_usd_mwh, cargo_transmicion_seguimiento_electrico, precio ) " + 
        "VALUES ('"+ fecha + "', '"+ categoria_precio + "', '"+precio_base_usd_mwh+"', '"+cargo_transmicion_seguimiento_electrico +"', '"+ precio + "')";

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





var tabla_eb1
var tabla_eb2
var tabla_eb3
var tabla_eb4
var result




app.get('/energyBalance/', requireAuth, function(req, res){
    //console.log('modificar contratos');
    (async function () 
    {
        try {

            let pool = await sql.connect(dbConfig_localhost)  
            let query_anios = await pool.request()
            //.query('select distinct anio from tb1')
            query('select distinct anio from (select distinct anio from tb1 union all select  distinct substring(fecha_mes,1,4) from [dbo].[LiquidacionFountain]) a');
             anios = query_anios.recordsets[0];

            console.log(anions)

            //let pool = await sql.connect(dbConfig_localhost)     
            let result = await pool.request()
            .execute('sp_EnergyBalance')                
            energyBalance = result.recordsets;
            tabla_eb1  = result.recordsets[0];
            tabla_eb2  = result.recordsets[1];
            tabla_eb3  = result.recordsets[2];
            tabla_eb4  = result.recordsets[3];        
            console.log(tabla_eb4);    
        } catch (err) {            
            console.log(err);
        }
       
    })().then(() => res.render('energyBalance', { anios, anio: '', tabla_eb1, tabla_eb2, tabla_eb3, tabla_eb4 } ))
    
    sql.on('error', err => {
        console.log(err);        
    })   
});





app.get('/energyBalance/:anio', requireAuth, function(req, res){
    //console.log('modificar contratos');
    
    let result;

    (async function () 
    {

        try {
            let pool = await sql.connect(dbConfig_localhost)  
            let query_anios = await pool.request()
            //.query('select distinct anio from tb1')
            .query('select distinct anio from (select distinct anio from tb1 union all select distinct substring(fecha_mes,1,4) from [dbo].[LiquidacionFountain]) a');
            anios = query_anios.recordsets[0];   

            if (req.params.anio < '2022') {
                result = await pool.request()
                .input('anio', req.params.anio)
                .execute('sp_EnergyBalancePorFecha')
            }
            else{
                result = await pool.request()
                .input('anio', req.params.anio)
                .execute('sp_EnergyBalance')
            }

            // let result = await pool.request()
            // .input('anio', req.params.anio)
            // .execute('sp_EnergyBalancePorFecha')
            energyBalance = result.recordsets;
            tabla_eb1  = result.recordsets[0];
            tabla_eb2  = result.recordsets[1];
            tabla_eb3  = result.recordsets[2];
            tabla_eb4  = result.recordsets[3];        
            console.log(tabla_eb4);    
        } catch (err) {            
            console.log(err);
        }



       
       
    })().then(() => res.render('energyBalance', { anios, anio : req.params.anio, tabla_eb1, tabla_eb2, tabla_eb3, tabla_eb4 } ))
    
    sql.on('error', err => {
        console.log(err);        
    })   
});


var graficos;
var cards;
var EAR;


app.get('/chart-test', function(req, res){

    (async function () 
    {
        try {
            let pool = await sql.connect(dbConfig_localhost)     
            let result = await pool.request()
            .input('fecha', "2022-05-31")
            .execute('sp_Dashboard')            
            graficos  = result.recordsets[0];
            cards  = result.recordsets[1];
            EAR  = result.recordsets[2];

            console.log(EAR);    
        } catch (err) {            
            console.log(err);
        }
       
    })().then(() => res.render('chart-test', { graficos, cards, EAR} ))
    sql.on('error', err => {
        console.log(err);        
    })   
});




router.get('/cargarDataAplicacion', requireAuth, function(req, res){
    res.render('cargarDataAplicacion')}
);

router.get('/cargarDataPowerBi', requireAuth, function(req, res){
    res.render('cargarDataPowerBi')}
);





var multer = require('multer');
const { leerExcelSaerlp } = require("./uploaders/saerlp");
const { query } = require("express");
 
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        //var datetimestamp = Date.now();
        //cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        cb(null, file.originalname)
    }
});

var upload = multer({ //multer settings
                storage: storage
            }).single('file');
/** API path that will upload the files */



var data;


// function leerExcelTotalesPorContratos(ruta){

//     return new Promise((resolve, reject) => {
//         const workbook = XSLX.readFile(ruta);   
//         const workbookSheets = workbook.SheetNames;
//         //console.log(workbookSheets)
//         const sheet = workbookSheets[1];

//         var data = XSLX.utils.sheet_to_json(workbook.Sheets[sheet],  { range: 10 });

//         console.log('Cantidad de Registros a Transformar: '+ data.length)

//         for(var i = 0; i < data.length; i++){ 
//             for (var key in data[i]) {
//             if(key.toLowerCase() !== key){
//             data[i][key.toLowerCase()] = data[i][key];
//             delete data[i][key];
//             }
//             }
//         }
        
//         console.log('Cantidad de Registros a Cargar: '+ data.length)

//         if(data.length>0){
//             resolve(data);
//         }
//         else{
//             reject('Error en la definicion del JSON para carga Liquidacion')
//            //throw new Error();
//         }

//     });
// };
  

function SerialDateToJSDate(serialDate, offsetUTC) {
    return new Date(Date.UTC(0, 0, serialDate, offsetUTC));
  }


function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}


function leerExcelLiquidacion(ruta, version){

    // Se integra en Promise para hacerla async() y esperar el resultado.

    return new Promise((resolve, reject) => {

        const workbook = XSLX.readFile(ruta);   
        const workbookSheets = workbook.SheetNames;
        //console.log(workbookSheets)
        const sheet = workbookSheets[1];

        // usar { range: 5} para saltarse las primeras filas del archivo
        var data = XSLX.utils.sheet_to_json(workbook.Sheets[sheet],  { range: 5 });
        //console.log(data);

        // pasar todas las keys a lowercase

        console.log('Cantidad de Registros a Transformar: '+ data.length)

        // pasar los nombres de variables a lowercase
        for(var i = 0; i < data.length; i++){ 
            for (var key in data[i]) {
            if(key.toLowerCase() !== key){
            data[i][key.toLowerCase()] = data[i][key];
            delete data[i][key];
            }
            }
        }
        
        //console.log(data);

        for (var i = 0; i < data.length; i++) {
            //console.log(data[i].Fecha);
            //console.log(i)
            var nMes = ''


            //@eldher changed to Date Format from Original FIle

            console.log(typeof data[i].fecha);   

            if (typeof data[i].fecha === 'string') { // Check if fecha is a string
                const splitted = data[i].fecha.split("/");

                switch(splitted[0]){
                    case 'ene': nMes ='01'; break;
                    case 'feb': nMes ='02'; break;
                    case 'mar': nMes ='03'; break;
                    case 'abr': nMes ='04'; break;
                    case 'may': nMes ='05'; break;
                    case 'jun': nMes ='06'; break;
                    case 'jul': nMes ='07'; break;
                    case 'ago': nMes ='08'; break;
                    case 'sep': nMes ='09'; break;
                    case 'oct': nMes ='10'; break;
                    case 'nov': nMes ='11'; break;
                    case 'dic': nMes ='12'; break;
    
                    case '1': nMes ='01'; break;
                    case '2': nMes ='02'; break;
                    case '3': nMes ='03'; break;
                    case '4': nMes ='04'; break;
                    case '5': nMes ='05'; break;
                    case '6': nMes ='06'; break;
                    case '7': nMes ='07'; break;
                    case '8': nMes ='08'; break;
                    case '9': nMes ='09'; break;
                    case '10': nMes ='10'; break;
                    case '11': nMes ='11'; break;
                    case '12': nMes ='12'; break;
    
                };
    
    
                data[i].fecha = splitted[2] + '-' + nMes + '-' + splitted[1];
                data[i].fecha_mes = splitted[2] + '-' + nMes

            } else {

                data[i].fecha = SerialDateToJSDate(data[i].fecha, -24).toISOString().slice(0, 19).replace('T', ' ')  

                //agregar fecha_mes
                let test = new Date(data[i].fecha)
                data[i].fecha_mes = test.getFullYear() + "-" + pad((test.getMonth() + 1),2) //+ "-" + pad(test.getDate(),2) ;
  
            }

            
            data[i].version = version
            data[i].ajuste = 0
            //data[i].fecha_carga = Date.now().toISOString().slice(0, 9).replace('T', ' ')
            
            let fecha_ts = Date.now()
            let hoy = new Date(fecha_ts)

            data[i].fecha_carga = hoy.toISOString().slice(0, 19).replace('T', ' ')

            //console.log(data[i].fecha_carga);        
        }   

        console.log('Cantidad de Registros a Cargar: '+ data.length)

        if(data.length>0){
            resolve(data);
        }
        else{
            reject('Error en la definicion del JSON para carga Liquidacion')
           //throw new Error();
        }
    });

};



app.post('/upload_liquidacion_fountain', function(req, res) {

   
    let archivoCargado;


    const uploadPromise = () => {

        return new Promise((resolve, reject) => {
            
            upload(req,res,function(err){                    
                if(err){
                    console.log('Multer Error:' + err);
                    return reject(err)                                
                }else{
                    archivoCargado = req.file.filename;
                    console.log(archivoCargado);
                    console.log('uploads/'+ archivoCargado)
                    resolve(archivoCargado)
                    // data =  leerExcelLiquidacion('uploads/'+ archivoCargado)
                    //res.send(data);
                    //res.send('Archivo cargado!');
                }
                
            }) ;

        });
   }
      
    




    //funcion para leer linea a linea el JSON
    (async function () 
    {
       // data = await leerExcelLiquidacion('uploads/' + archivoCargado)
        //console.log("Filas convertidas a JSON: " + data.length)


 
        archivoCargado = await uploadPromise(req,res)
       
        let data = await leerExcelLiquidacion('uploads/'+ archivoCargado, req.body.version)

        console.log(req.body.version)


        try {
            let pool = await sql.connect(dbConfig_localhost);     
            for ( i = 0; i < data.length; i++) {
                // const queryString = "INSERT INTO insert_test (hora, subsistema) " + 
                //  "VALUES ('" +  data[i].hora + "', '"+ data[i].subsistema + " ') ";

                //  console.log(queryString);
                // let result = await pool.request()
                // .query(queryString)            
                //console.log(data[i].fecha)
                let result = await pool.request()
                .input('fecha', sql.Date, data[i].fecha)
                .input('hora', sql.SmallInt, data[i].hora)
                .input('subsistema', sql.SmallInt, data[i].subsistema)
                .input('cms', sql.Float, data[i].cms)
                .input('fountain_a_bai230_27_e', sql.Float, data[i].fountain_a_bai230_27_e)
                .input('fountain_a_bai230_27_s', sql.SmallInt, data[i].fountain_a_bai230_27_s)
                .input('fountain_a_bai230_28b_e', sql.Float, data[i].fountain_a_bai230_28b_e)
                .input('fountain_a_bai230_28b_s', sql.Float, data[i].fountain_a_bai230_28b_s)
                .input('fountain_a_bfrio230_28_e', sql.Float, data[i].fountain_a_bfrio230_28_e)
                .input('fountain_a_bfrio230_28_s', sql.Float, data[i].fountain_a_bfrio230_28_s)
                .input('fountain_a_bfrio230_36_e', sql.Float, data[i].fountain_a_bfrio230_36_e)
                .input('fountain_a_bfrio230_36_s', sql.Float, data[i].fountain_a_bfrio230_36_s)
                .input('fountain_a_compra_mer_con', sql.SmallInt, data[i].fountain_a_compra_mer_con)
                .input('fountain_a_cons_exp', sql.SmallInt, data[i].fountain_a_cons_exp)
                .input('fountain_a_entrando', sql.SmallInt, data[i].fountain_a_entrando)
                .input('fountain_a_saliendo', sql.Float, data[i].fountain_a_saliendo)
                .input('fountain_a_vta_mer_con', sql.SmallInt, data[i].fountain_a_vta_mer_con)
                .input('fountain_a_vta_mer_opo', sql.SmallInt, data[i].fountain_a_vta_mer_opo)
                .input('fountain_a_perdida_real', sql.Float, data[i].fountain_a_perdida_real)
                .input('fountain_a_perdida_teorica', sql.Float, data[i].fountain_a_perdida_teorica)
                .input('fountain_a_perdida_total', sql.Float, data[i].fountain_a_perdida_total)
                .input('fountain_a_saliendo_bruto', sql.Float, data[i].fountain_a_saliendo_bruto)
                .input('fountain_a_supl_loc', sql.Float, data[i].fountain_a_supl_loc)
                .input('perdida_consumo', sql.SmallInt, data[i].perdida_consumo)
                .input('energia_asignada', sql.Float, data[i].energia_asignada)
                .input('suplido_pos_contratos', sql.Float, data[i].suplido_pos_contratos)
                .input('suplido_mo', sql.Float, data[i].suplido_mo)
                .input('suplido_mo_imp', sql.SmallInt, data[i].suplido_mo_imp)
                .input('consumo', sql.SmallInt, data[i].consumo)
                .input('ocasional_compra', sql.Float, data[i].ocasional_compra)
                .input('ocasional_venta', sql.Float, data[i].ocasional_venta)
                .input('ocasional_debito', sql.Float, data[i].ocasional_debito)
                .input('ocasional_credito', sql.Float, data[i].ocasional_credito)
                .input('ensa', sql.Float, data[i].ensa)
                .input('edemet', sql.Float, data[i].edemet)
                .input('edechi', sql.Float, data[i].edechi)
                .input('prog_exp', sql.SmallInt, data[i].prog_exp)
                .input('fecha_mes', sql.NVarChar ([50]), data[i].fecha_mes)
                .input('version', sql.NVarChar ([50]), data[i].version)
                .input('ajuste', sql.SmallInt, data[i].ajuste)
                .input('fecha_carga', sql.DateTime, data[i].fecha_carga)
                .execute('insertarLiquidacion')

            }

        } catch (err) {            
            console.log(err);
        }
       
    })().then(() => res.send('<script type="text/javascript"> alert("Archivo de Liquidación Cargado!"); window.location="./cargarDataAplicacion";</script>') )
    sql.on('error', err => {
        console.log(err);        
    }); 



});


app.post('/upload_totales_por_contratos', function(req, res){
    let data;   
    let archivoCargado;
    console.log('Prueba');
   
    const uploadPromise = () => {

        return new Promise((resolve, reject) => {
            
            upload(req,res,function(err){                    
                if(err){
                    console.log('Multer Error:' + err);
                    return reject(err)                                
                }else{
                    archivoCargado = req.file.filename;
                    console.log(archivoCargado);
                    console.log('uploads/'+ archivoCargado)
                    resolve(archivoCargado)
                    // data =  leerExcelLiquidacion('uploads/'+ archivoCargado)
                    //res.send(data);
                    //res.send('Archivo cargado!');
                }
                
            }) ;

        });
   }
      
    
    //funcion para leer linea a linea el JSON
    (async function () 
    {
       // data = await leerExcelLiquidacion('uploads/' + archivoCargado)
        //console.log("Filas convertidas a JSON: " + data.length)
        archivoCargado = await uploadPromise(req,res)
        data =  await totales_por_contratos.leerExcelTotalesPorContratos('uploads/'+ archivoCargado)
        //console.log(data.distribuidores  )

        try {


            let pool = await sql.connect(dbConfig_localhost);     
            
            // insertar info por Distribuidores

            for ( i = 0; i < data.distribuidores.length; i++) {
                let result = await pool.request()
                .input('Distribuidores', sql.NVarChar ([50]) , data.distribuidores[i].distribuidores)
                .input('dmg', sql.Float, data.distribuidores[i].dmg)
                .input('dmg_s', sql.Float, data.distribuidores[i].dmg_s)
                .input('dmm_s', sql.Float, data.distribuidores[i].dmm_s)
                .input('fecha', sql.DateTime2, data.distribuidores[i].fecha)
                .input('fecha_carga', sql.DateTime, data.distribuidores[i].fecha_carga)
                .execute('insertarContratos')
            }

            // insertar info en SQL por Contratos

            for ( i = 0; i < data.contratos.length; i++) {
    
                if (i <= 10) {
                   // console.log(data.contratos[i])
                }
                
                let result = await pool.request()
                .input('fecha', sql.Date,  data.contratos[i].fecha)
                .input('hora', sql.SmallInt,  data.contratos[i].hora)
                .input('nombre_contrato', sql.NVarChar ([100]),  data.contratos[i].nombre_contrato)
                .input('tipo_contrato', sql.NVarChar ([100]),  data.contratos[i].tipo_contrato)
                .input('consumo', sql.SmallInt,  data.contratos[i].consumo)
                .input('suplido', sql.Float,  data.contratos[i].suplido)
                .input('potencia_contratada', sql.Float,  data.contratos[i].potencia_contratada)
                .input('mwh_contrato', sql.Float,  data.contratos[i].mwh_contrato)
                .input('empresa', sql.VarChar ([20]),  data.contratos[i].empresa)
                .input('fecha_carga', sql.DateTime,  data.contratos[i].fecha_carga)
                .execute('insertarContratos2')
            }



            let actualizar_contratos = await pool.request()
            .execute('insertarContratos2_INSERT_INTO_CONTRATOS')

            console.log('Filas insertadas: ' + actualizar_contratos.rowsAffected)



        } catch (err) {            
            console.log(err);


        }
       
    })().then(() => res.send('<script type="text/javascript"> alert("Archivo de Totales por Contrato Cargado!"); window.location="./cierre/2022-07-31";</script>') )
    sql.on('error', err => {
        console.log(err);        
    }); 



        
   //})().then(() => res.send(JSON.stringify(data,null, '\t')))

});






app.post('/upload_balance_de_potencia', function(req, res){
    let data;   
    let archivoCargado;
   
    const uploadPromise = () => {
        return new Promise((resolve, reject) => {
            upload(req,res,function(err){                    
                if(err){
                    console.log('Multer Error:' + err);
                    return reject(err)                                
                }else{
                    archivoCargado = req.file.filename;
                    console.log(archivoCargado);
                    console.log('uploads/'+ archivoCargado)
                    resolve(archivoCargado)
                    // data =  leerExcelLiquidacion('uploads/'+ archivoCargado)
                    //res.send(data);
                    //res.send('Archivo cargado!');
                }                
            }) ;
        });
   }
      
    
    //funcion para leer linea a linea el JSON
    (async function () 
    {
       // data = await leerExcelLiquidacion('uploads/' + archivoCargado)
        //console.log("Filas convertidas a JSON: " + data.length)
        archivoCargado = await uploadPromise(req,res)

        data =  await balance_de_potencia.leerExcelBalanceDePotencia('uploads/'+ archivoCargado, req.body.version)
        //console.log(data)

        try {


            let pool = await sql.connect(dbConfig_localhost);     
            
            // insertar info por Distribuidores

            for ( i = 0; i < data.length; i++) {
                let result = await pool.request()
                .input('fecha', sql.Date, data[i].fecha)
                .input('codigo_de_empresa', sql.NVarChar ([100]), data[i].codigo_de_empresa)
                .input('nombre_de_la_oferta', sql.NVarChar ([100]), data[i].nombre_de_la_oferta)
                .input('oferta_en_usdkw_mes', sql.Float, data[i].oferta_en_usdkw_mes)
                .input('disponible_mw', sql.Float, data[i].disponible_mw)
                .input('colocado_mw', sql.Float, data[i].colocado_mw)
                .input('faltante_mw', sql.Float, data[i].faltante_mw)
                .input('precio_del_mw_usd', sql.Float, data[i].precio_del_mw_usd)
                .input('credito_en_usd', sql.Float, data[i].credito_en_usd)
                .input('fecha_mes', sql.NVarChar ([100]), data[i].fecha_mes)
                .input('version', sql.NVarChar ([100]), data[i].version)        
                .input('fecha_carga', sql.DateTime, data[i].fecha_carga)        
                .execute('insertarBalancesPotencia')
            }

            // insertar info en SQL por Contratos

        } catch (err) {            
            console.log(err);

            
        }

        
   })().then(() => res.send('<script type="text/javascript"> alert("Archivo de Balances de Potencia Cargado!"); window.location="./cargarDataAplicacion";</script>') )

});




app.post('/upload_servicios_auxiliares', function(req, res){
    let data;   
    let archivoCargado;
   
    const uploadPromise = () => {
        return new Promise((resolve, reject) => {
            upload(req,res,function(err){                    
                if(err){
                    console.log('Multer Error:' + err);
                    return reject(err)                                
                }else{
                    archivoCargado = req.file.filename;
                    console.log(archivoCargado);
                    console.log('uploads/'+ archivoCargado)
                    resolve(archivoCargado)
                    // data =  leerExcelLiquidacion('uploads/'+ archivoCargado)
                    //res.send(data);
                    //res.send('Archivo cargado!');
                }                
            }) ;
        });
   }
      
    
    //funcion para leer linea a linea el JSON
    (async function () 
    {
       // data = await leerExcelLiquidacion('uploads/' + archivoCargado)
        //console.log("Filas convertidas a JSON: " + data.length)
        archivoCargado = await uploadPromise(req,res)
        data =  await servicios_auxiliares.leerExcelServiciosAuxiliares('uploads/'+ archivoCargado, req.body.version)

        try {


            let pool = await sql.connect(dbConfig_localhost);     
            
            // insertar info por Distribuidores

            for ( i = 0; i < data.length; i++) {
                let result = await pool.request()

                .input('empresas_acreedoras', sql.NVarChar ([100]), data[i].empresas_acreedoras)
                .input('secundaria_mw', sql.Float, data[i].secundaria_mw)
                .input('operativa_mw', sql.Float, data[i].operativa_mw)
                .input('secundaria_usd', sql.Float, data[i].secundaria_usd)
                .input('operativa_usd', sql.Float, data[i].operativa_usd)
                .input('total_usd', sql.Float, data[i].total_usd)
                .input('fecha_mes', sql.NVarChar ([100]), data[i].fecha_mes)
                .input('version', sql.NVarChar ([100]), data[i].version)
                .input('fecha_carga', sql.DateTime, data[i].fecha_carga)

                .execute('insertarServiciosAuxiliares')
            }

            //insertar info en SQL por Contratos

        } catch (err) {            
            console.log(err);

            
        }

        
   })().then(() => res.send('<script type="text/javascript"> alert("Archivo de Servicios Auxiliares Cargado!"); window.location="./cargarDataAplicacion";</script>') )
        
   //})().then(() => res.json((data)))

});



app.post('/upload_generacion_obligada', function(req, res){
    let data;   
    let archivoCargado;
   
    const uploadPromise = () => {
        return new Promise((resolve, reject) => {
            upload(req,res,function(err){                    
                if(err){
                    console.log('Multer Error:' + err);
                    return reject(err)                                
                }else{
                    archivoCargado = req.file.filename;
                    console.log(archivoCargado);
                    console.log('uploads/'+ archivoCargado)
                    resolve(archivoCargado)
                    // data =  leerExcelLiquidacion('uploads/'+ archivoCargado)
                    //res.send(data);
                    //res.send('Archivo cargado!');
                }                
            }) ;
        });
   }
      
    
    //funcion para leer linea a linea el JSON
    (async function () 
    {
       // data = await leerExcelLiquidacion('uploads/' + archivoCargado)
        //console.log("Filas convertidas a JSON: " + data.length)
        archivoCargado = await uploadPromise(req,res)
        data =  await generacion_obligada.leerExcelGeneracionObligada('uploads/'+ archivoCargado, req.body.version)

        try {


            let pool = await sql.connect(dbConfig_localhost);     
            
            // insertar info por Distribuidores

            for ( i = 0; i < data.length; i++) {
                let result = await pool.request()

                .input('fecha', sql.Date, data[i].fecha)
                .input('hora', sql.SmallInt, data[i].hora)
                .input('subsistema', sql.NVarChar ([100]), data[i].subsistema)
                .input('unidad_obligada', sql.NVarChar ([100]), data[i].unidad_obligada)
                .input('energia_mw', sql.Float, data[i].energia_mw)
                .input('sobre_costo_real', sql.Float, data[i].sobre_costo_real)
                .input('agente_responsable', sql.NVarChar ([100]), data[i].agente_responsable)
                .input('agente', sql.NVarChar ([100]), data[i].agente)
                .input('fecha_mes', sql.NVarChar ([100]), data[i].fecha_mes)
                .input('version', sql.NVarChar ([100]), data[i].version)
                .input('fecha_carga', sql.DateTime, data[i].fecha_carga)
                

                .execute('insertarGeneracionObligada')
            }

            //insertar info en SQL por Contratos

        } catch (err) {            
            console.log(err);            
        }

        
   })().then(() => res.send('<script type="text/javascript"> alert("Archivo de Generación Obligada Cargado!"); window.location="./cargarDataAplicacion";</script>') )
        
   //})().then(() => res.json((data)))

});




app.post('/upload_resumen_generacion', function(req, res){
    let data;   
    let archivoCargado;
   
    const uploadPromise = () => {
        return new Promise((resolve, reject) => {
            upload(req,res,function(err){                    
                if(err){
                    console.log('Multer Error:' + err);
                    return reject(err)                                
                }else{
                    archivoCargado = req.file.filename;
                    console.log(archivoCargado);
                    console.log('uploads/'+ archivoCargado)
                    resolve(archivoCargado)
                    // data =  leerExcelLiquidacion('uploads/'+ archivoCargado)
                    //res.send(data);
                    //res.send('Archivo cargado!');
                }                
            }) ;
        });
   }
      
    
    //funcion para leer linea a linea el JSON
    (async function () 
    {
       // data = await leerExcelLiquidacion('uploads/' + archivoCargado)
        //console.log("Filas convertidas a JSON: " + data.length)
        archivoCargado = await uploadPromise(req,res)
        data =  await resumen_generacion.leerExcelResumenGeneracion('uploads/'+ archivoCargado, req.body.version)
        //console.log(data)

        
        try {


            let pool = await sql.connect(dbConfig_localhost);     
            
            // insertar info por Distribuidores
           // console.log('***********');
  
            for ( i = 0; i < data.length; i++) {
                for( j = 0; j < data[i].length; j++){
                    
                 //   console.log(data[i][j])
                 //   console.log(i , j)
        
                    let result = await pool.request()


                    .input('fecha', sql.Date, data[i][j].fecha)
                    .input('LAP_GB_G1', sql.Float, data[i][j].LAP_GB_G1)
                    .input('LAP_GB_G2', sql.Float, data[i][j].LAP_GB_G2)
                    .input('LAP_GB_G3', sql.Float, data[i][j].LAP_GB_G3)
                    .input('LAP_GB_G4', sql.Float, data[i][j].LAP_GB_G4)
                    .input('LAP_BRUTA_TOTAL', sql.Float, data[i][j].LAP_BRUTA_TOTAL)
                    .input('LAP_CONSUMO_TOTAL', sql.Float, data[i][j].LAP_CONSUMO_TOTAL)
                    .input('LAP_NETA_TOTAL', sql.Float, data[i][j].LAP_NETA_TOTAL)
                    .input('spacer1', sql.NVarChar, data[i][j].spacer1)
                    .input('SAL_GB_G1', sql.Float, data[i][j].SAL_GB_G1)
                    .input('SAL_GB_G2', sql.Float, data[i][j].SAL_GB_G2)
                    .input('SAL_GB_G3', sql.Float, data[i][j].SAL_GB_G3)
                    .input('SAL_BRUTA_TOTAL', sql.Float, data[i][j].SAL_BRUTA_TOTAL)
                    .input('SAL_CONSUMO_TOTAL', sql.Float, data[i][j].SAL_CONSUMO_TOTAL)
                    .input('SAL_NETA_TOTAL', sql.Float, data[i][j].SAL_NETA_TOTAL)
                    .input('DAILY_NET', sql.Float, data[i][j].DAILY_NET)
                    .input('fecha_cierre', sql.Date, data[i][j].fecha_cierre)
                    .input('fecha_carga', sql.DateTime, data[i][j].fecha_carga)
                                

                    .execute('insertarResumenesGeneracion')

                }
            }

            //insertar info en SQL por Contratos

        } catch (err) {            
            console.log(err);            
        }

        
   })().then(() => res.send('<script type="text/javascript"> alert("Archivo de Resumen Generación!"); window.location="./cargarDataAplicacion";</script>') )
        
//   })().then(() => 
  
  
//     {
    
//         res.status(200);

//         // Set the response headers
//         res.set({
//             'Content-Type': 'application/json',
//             'X-Custom-Header': 'Custom Value'
//         });

//         console.log("el size es:" + data[0].length)
//         // Convert the JSON object to a string using JSON.stringify()
//         var jsonString = JSON.stringify(data[0][31].fecha, { space: 2 });

//         // Send the response
//         res.send(jsonString);
//         //res.send(JSON.stringify(data, { space: '\t' }))
//     } 
  
//   )

});





app.post('/upload_valores_negativos', function(req, res){
    let data;   
    let archivoCargado;
   
    const uploadPromise = () => {
        return new Promise((resolve, reject) => {
            upload(req,res,function(err){                    
                if(err){
                    console.log('Multer Error:' + err);
                    return reject(err)                                
                }else{
                    archivoCargado = req.file.filename;
                    console.log(archivoCargado);
                    console.log('uploads/'+ archivoCargado)
                    resolve(archivoCargado)
                    // data =  leerExcelLiquidacion('uploads/'+ archivoCargado)
                    //res.send(data);
                    //res.send('Archivo cargado!');
                }                
            }) ;
        });
   }
      
    
    //funcion para leer linea a linea el JSON
    (async function () 
    {
       // data = await leerExcelLiquidacion('uploads/' + archivoCargado)
        //console.log("Filas convertidas a JSON: " + data.length)
        archivoCargado = await uploadPromise(req,res)
        data =  await valores_negativos.leerExcelValoresNegativos('uploads/'+ archivoCargado, req.body.version)
        //console.log(data)

        
        try {


            let pool = await sql.connect(dbConfig_localhost);     
            
            // insertar info por Distribuidores

            for ( i = 0; i < data.length; i++) {
                let result = await pool.request()

                .input('fecha', sql.Date, data[i].fecha)
                .input('sasd', sql.Float, data[i].sasd)
                .input('generacion_obligada', sql.Float, data[i].generacion_obligada)
                .input('servicios_auxiliares', sql.Float, data[i].servicios_auxiliares)
                .input('compensacion_de_potencia', sql.Float, data[i].compensacion_de_potencia)
                .execute('insertarValoresNegativos')
            }

            //insertar info en SQL por Contratos

        } catch (err) {            
            console.log(err);            
        }

        
   })().then(() => res.send('<script type="text/javascript"> alert("Archivo de Valores Negativos!"); window.location="./cargarDataAplicacion";</script>') )
        
  //})().then(() => res.json((data)))

});









app.post('/upload_sasd', function(req, res){
    let data;   
    let archivoCargado;
   
    const uploadPromise = () => {
        return new Promise((resolve, reject) => {
            upload(req,res,function(err){                    
                if(err){
                    console.log('Multer Error:' + err);
                    return reject(err)                                
                }else{
                    archivoCargado = req.file.filename;
                    console.log(archivoCargado);
                    console.log('uploads/'+ archivoCargado)
                    resolve(archivoCargado)
                    // data =  leerExcelLiquidacion('uploads/'+ archivoCargado)
                    //res.send(data);
                    //res.send('Archivo cargado!');
                }                
            }) ;
        });
   }
      
    
    //funcion para leer linea a linea el JSON
    (async function () 
    {
       // data = await leerExcelLiquidacion('uploads/' + archivoCargado)
        //console.log("Filas convertidas a JSON: " + data.length)
        archivoCargado = await uploadPromise(req,res)
        data =  await sasd.leerExcelSasd('uploads/'+ archivoCargado ,req.body.version)
        //console.log(data)

        
        try {


            let pool = await sql.connect(dbConfig_localhost);     
            
            // insertar info por Distribuidores

            for ( i = 0; i < data.length; i++) {
                let result = await pool.request()

                .input('fecha', sql.Date, data[i].fecha)
                .input('AGENTE_DEUDOR', sql.NVarChar ([100]), data[i].AGENTE_DEUDOR)
                .input('ACP', sql.Float, data[i].ACP)
                .input('ACPGEN', sql.Float, data[i].ACPGEN)
                .input('AES', sql.Float, data[i].AES)
                .input('CELSIACENT', sql.Float, data[i].CELSIACENT)
                .input('CELSIABLM', sql.Float, data[i].CELSIABLM)
                .input('EGESA', sql.Float, data[i].EGESA)
                .input('ENERGYST', sql.Float, data[i].ENERGYST)
                .input('ESEPSA', sql.Float, data[i].ESEPSA)
                .input('GANA', sql.Float, data[i].GANA)
                .input('GENA', sql.Float, data[i].GENA)
                .input('JINRO', sql.Float, data[i].JINRO)
                .input('KANAN', sql.Float, data[i].KANAN)
                .input('PANAM', sql.Float, data[i].PANAM)
                .input('PEDREGAL', sql.Float, data[i].PEDREGAL)
                .input('SPARKLEPW', sql.Float, data[i].SPARKLEPW)
                .input('TOTAL', sql.Float, data[i].TOTAL)
                .input('version', sql.VarChar ([20]), data[i].version)
                .input('fecha_mes', sql.VarChar ([20]), data[i].fecha_mes)
                .input('fecha_carga', sql.DateTime, data[i].fecha_carga)

                .execute('insertarSASD')
            }

            //insertar info en SQL por Contratos

        } catch (err) {            
            console.log(err);            
        }

        
   })().then(() => res.send('<script type="text/javascript"> alert("Archivo de SASD Cargado!"); window.location="./cargarDataAplicacion";</script>') )
        
  //})().then(() => res.json((data)))

});




app.post('/upload_saerlp', function(req, res){
    let data;   
    let archivoCargado;
   
    const uploadPromise = () => {
        return new Promise((resolve, reject) => {
            upload(req,res,function(err){                    
                if(err){
                    console.log('Multer Error:' + err);
                    return reject(err)                                
                }else{
                    archivoCargado = req.file.filename;
                    console.log(archivoCargado);
                    console.log('uploads/'+ archivoCargado)
                    resolve(archivoCargado)
                    // data =  leerExcelLiquidacion('uploads/'+ archivoCargado)
                    //res.send(data);
                    //res.send('Archivo cargado!');
                }                
            }) ;
        });
   }
      
    
    //funcion para leer linea a linea el JSON
    (async function () 
    {
       // data = await leerExcelLiquidacion('uploads/' + archivoCargado)
        //console.log("Filas convertidas a JSON: " + data.length)
        archivoCargado = await uploadPromise(req,res)
        data =  await saerlp.leerExcelSaerlp('uploads/'+ archivoCargado, req.body.version )
        //console.log(data)

        
        try {


            let pool = await sql.connect(dbConfig_localhost);     
            
            // insertar info por Distribuidores

            for ( i = 0; i < data.length; i++) {
                let result = await pool.request()

                .input('fecha', sql.Date, data[i].fecha)
                .input('DEUDORES', sql.NVarChar ([100]), data[i].DEUDORES)
                .input('ACP', sql.Float, data[i].ACP)
                .input('ACPGEN', sql.Float, data[i].ACPGEN)
                .input('AES', sql.Float, data[i].AES)
                .input('ALTOVALLE', sql.Float, data[i].ALTOVALLE)
                .input('CALDERA', sql.Float, data[i].CALDERA)
                .input('CELSIACENT', sql.Float, data[i].CELSIACENT)
                .input('CELSIABLM', sql.Float, data[i].CELSIABLM)
                .input('CELSIABON', sql.Float, data[i].CELSIABON)
                .input('DESHIDCORP', sql.Float, data[i].DESHIDCORP)
                .input('EISA', sql.Float, data[i].EISA)
                .input('ENERGYST', sql.Float, data[i].ENERGYST)
                .input('ESEPSA', sql.Float, data[i].ESEPSA)
                .input('FORTUNA', sql.Float, data[i].FORTUNA)
                .input('FOUNTAIN', sql.Float, data[i].FOUNTAIN)
                .input('GENA', sql.Float, data[i].GENA)
                .input('GENISA', sql.Float, data[i].GENISA)
                .input('GENPED', sql.Float, data[i].GENPED)
                .input('HBOQUERON', sql.Float, data[i].HBOQUERON)
                .input('HBTOTUMA', sql.Float, data[i].HBTOTUMA)
                .input('HIBERICA', sql.Float, data[i].HIBERICA)
                .input('HIDRO', sql.Float, data[i].HIDRO)
                .input('HTERIBE', sql.Float, data[i].HTERIBE)
                .input('IDEALPMA', sql.Float, data[i].IDEALPMA)
                .input('JINRO', sql.Float, data[i].JINRO)
                .input('P_ANCHO', sql.Float, data[i].P_ANCHO)
                .input('PANAM', sql.Float, data[i].PANAM)
                .input('PEDREGAL', sql.Float, data[i].PEDREGAL)
                .input('RCHICO', sql.Float, data[i].RCHICO)
                .input('SFRAN', sql.Float, data[i].SFRAN)
                .input('version', sql.VarChar ([20]), data[i].version)
                .input('fecha_mes', sql.VarChar ([20]), data[i].fecha_mes)
                .input('fecha_carga', sql.DateTime, data[i].fecha_carga)
                

                .execute('insertarSAERLP')
            }

            //insertar info en SQL por Contratos

        } catch (err) {            
            console.log(err);            
        }

        
   })().then(() => res.send('<script type="text/javascript"> alert("Archivo de SASD Cargado!"); window.location="./cargarDataAplicacion";</script>') )
        
  //})().then(() => res.json((data)))

});




router.get('/agregarDetallePerdida/:fecha', requireAuth, function(req, res){


    let DetallePerdidas;
    let fechas;

    (async function (){

        try {
            let pool = await sql.connect(dbConfig_localhost)
            let result = await pool.request()
            .query('select cast(cast(fecha_fin as date) as varchar) as fecha_fin,  cast(precio as decimal(13,2)) as precio from [dbo].[DetallePerdidas] order by fecha_fin')
            DetallePerdidas = result.recordset;

            //console.log(DetallePerdidas)

            let result2 = await pool.request()
            .query('SET LANGUAGE Spanish; ' +
            'select distinct ' +
            'cast(EOMONTH(fecha) as varchar) as fecha ' +
            ",concat( DATENAME(MONTH, EOMONTH(fecha)) ,\' \', cast(YEAR(EOMONTH(fecha)) as varchar)) as  mes_y_anio  " +
            'from [dbo].[LiquidacionFountain]'+ 
            'where EOMONTH(fecha) NOT IN (select fecha_fin from DetallePerdidas) order by 1') 



            
            fechas = result2.recordset;           

            //console.log(fechas)
            
        } catch (error) {
            
        }
    })().then(() => {  
        res.render('agregarDetallePerdida' , { DetallePerdidas, fechas, fecha: req.params.fecha } ) ;
    }
        
);   

    
});


app.post('/guardarDetallePerdida', function(req, res){


    const accion = req.body.accion
    const fecha = req.body.fecha;
    const precio = req.body.precio;
 

    if(accion == "agregar"){ 
        (async function (){
            try {               
                const queryString = "INSERT INTO [dbo].[DetallePerdidas] (fecha_fin, precio) " + "VALUES ('" +  fecha + "', '"+ precio + "' )";

                console.log(queryString);
                let pool = await sql.connect(dbConfig_localhost)
                let result = await pool.request().query(queryString)
            } catch (error) {
                console.log(error)
            }
        })().then(() => res.send('<script type="text/javascript"> alert("Detalle de Pérdida Agregado!"); window.location="./agregarDetallePerdida/0";</script>') )
    }
    
    
    if(accion== "modificar"){ 
        (async function (){
            try {               
                const queryString = "UPDATE [dbo].[DetallePerdidas] SET precio = "+ precio + " where fecha_fin = '" + fecha +"'" ;
                console.log(queryString);
                let pool = await sql.connect(dbConfig_localhost)
                let result = await pool.request().query(queryString)
            } catch (error) {
                console.log(error)
            }
        })().then(() => res.send('<script type="text/javascript"> alert("Detalle de Pérdida Modificado!"); window.location="./agregarDetallePerdida/0";</script>') )
     }


});





router.post('/agregarDetallePerdida/:fecha/:precio', function(req, res){


    let DetallePerdidas;
    let fechas;

    (async function (){

        try {
            let pool = await sql.connect(dbConfig_localhost)
            let result = await pool.request()
            .query('select cast(cast(fecha_fin as date) as varchar) as fecha_fin,  cast(precio as decimal(13,4)) as precio from [dbo].[DetallePerdidas] order by fecha_fin')
            DetallePerdidas = result.recordset;

            console.log(DetallePerdidas)

            let result2 = await pool.request()
            .query('SET LANGUAGE Spanish; ' +
            'select distinct ' +
            'cast(EOMONTH(fecha) as varchar) as fecha ' +
            ",concat( DATENAME(MONTH, EOMONTH(fecha)) ,\' \', cast(YEAR(EOMONTH(fecha)) as varchar)) as  mes_y_anio  " +
            'from [dbo].[LiquidacionFountain] order by 1 ') 

            fechas = result2.recordset;           

            console.log(fechas)
            
        } catch (error) {
            
        }
    })().then(() => {
    
    
        if(req.params.accion == "mostrar"){   
            res.render('agregarDetallePerdida' , { DetallePerdidas, fechas } ) ;///mostrar/0/0',  )
        }
            
            
        
        
    }
        
);   

    
});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  });

