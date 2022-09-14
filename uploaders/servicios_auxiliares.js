const XSLX = require('xlsx')

function SerialDateToJSDate(serialDate, offsetUTC) {
    return new Date(Date.UTC(0, 0, serialDate, offsetUTC));
  }

function leerExcelServiciosAuxiliares(ruta){

    return new Promise((resolve, reject) => {
        const workbook = XSLX.readFile(ruta);   
        const workbookSheets = workbook.SheetNames;
        console.log(workbookSheets)
        //const sheet = workbookSheets[1];
        console.log(ruta);

        var data = XSLX.utils.sheet_to_json(
            // se coloca el nombre de la hoja a leer
            workbook.Sheets['Cobro_Reserva'], 
            // se colocan los overriden nombre de las columnas
            {header:[
                "empresas_acreedoras",
                "secundaria_mw",
                "operativa_mw",
                "secundaria_usd",
                "operativa_usd",
                "total_usd",
                "fecha_mes",
                "version"
            ], range:10 }
        );
         
        
        var extraccionFecha = XSLX.utils.sheet_to_json( workbook.Sheets['Resumen'], range = 'A1:A1');

        console.log('Cantidad de Registros a Transformar: '+ data.length)

  



        let fecha_ts = Date.now()
        let hoy = new Date(fecha_ts)

        
        for (let i = 0; i < data.length; i++) {      
            // convertir fechas de formato Excel a JS
            data[i].fecha = SerialDateToJSDate(extraccionFecha, -24) //.toISOString().slice(0, 19).replace('T', ' ')  
            // agregar la fecha de carga
            data[i].fecha_carga = hoy.toISOString().slice(0, 19).replace('T', ' ')
        }


        console.log('Cantidad de Registros a Cargar: '+ data.length)

        if(data.length>0){
            resolve(data);
        }
        else{
            reject('Error en la definicion del JSON para carga Liquidacion')           
        }

    });
};


module.exports.leerExcelServiciosAuxiliares = leerExcelServiciosAuxiliares
