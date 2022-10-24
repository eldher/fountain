const XSLX = require('xlsx')

function SerialDateToJSDate(serialDate, offsetUTC) {
    return new Date(Date.UTC(0, 0, serialDate, offsetUTC));
  }

function leerExcelGeneracionObligada(ruta, version){

    return new Promise((resolve, reject) => {
        const workbook = XSLX.readFile(ruta);   
        const workbookSheets = workbook.SheetNames;
        console.log(workbookSheets)
        //const sheet = workbookSheets[1];
        console.log(ruta);

        var data = XSLX.utils.sheet_to_json(
            // se coloca el nombre de la hoja a leer
            workbook.Sheets['K'], 
            // se colocan los overriden nombre de las columnas
            {header:[
                "fecha",
                "hora",
                "subsistema",
                "unidad_obligada",
                "energia_mw",
                "sobre_costo_real",
                "agente_responsable",
                "agente",                
            ], range:11 }
        );
         
        
        // let extraccionFecha = XSLX.utils.sheet_to_json( workbook.Sheets['Resumen'], { header: ["fecha_archivo"] , range : 'A1:A1'} );

        // console.log('Cantidad de Registros a Transformar: '+ data.length)

        // console.log(extraccionFecha)



        let fecha_ts = Date.now()
        let hoy = new Date(fecha_ts)

        
        for (let i = 0; i < data.length; i++) {      
            // convertir fechas de formato Excel a JS
            data[i].fecha = SerialDateToJSDate(data[i].fecha, -24).toISOString().slice(0, 19).replace('T', ' ')  
            // agregar la fecha de carga

            let test = new Date(data[i].fecha)
            data[i].fecha_mes = test.getFullYear() + "-" + (test.getMonth() + 1)
            data[i].version = version

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


module.exports.leerExcelGeneracionObligada = leerExcelGeneracionObligada
