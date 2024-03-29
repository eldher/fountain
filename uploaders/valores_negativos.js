const XSLX = require('xlsx')

function SerialDateToJSDate(serialDate, offsetUTC) {
    return new Date(Date.UTC(0, 0, serialDate, offsetUTC));
  }

function leerExcelValoresNegativos(ruta, version){

    return new Promise((resolve, reject) => {
        const workbook = XSLX.readFile(ruta);   
        const workbookSheets = workbook.SheetNames;
        console.log(workbookSheets)
        //const sheet = workbookSheets[1];
        console.log(ruta);

        var data = XSLX.utils.sheet_to_json(
            // se coloca el nombre de la hoja a leer
            workbook.Sheets['data'], 
            // se colocan los overriden nombre de las columnas
            {header:[
                "fecha",
                "sasd",
                "generacion_obligada",
                "servicios_auxiliares",
                "compensacion_de_potencia"                
            ], range: 1 }
        );
         
        
        console.log('Cantidad de Registros a Transformar: '+ data.length)

        let fecha_ts = Date.now()
        let hoy = new Date(fecha_ts)

        
        for (let i = 0; i < data.length; i++) {      
            // convertir fechas de formato Excel a JS
            data[i].fecha = SerialDateToJSDate(data[i].fecha, -24).toISOString().slice(0, 19).replace('T', ' ')  
            // agregar la fecha de carga

            let test = new Date(data[i].fecha)
            console.log(test)
            data[i].fecha_mes = test.getFullYear() + "-" + (test.getMonth() + 1)
            data[i].version = version

            data[i].fecha_carga = hoy.toISOString().slice(0, 19).replace('T', ' ')
        }


        console.log('Cantidad de Registros a Cargar: '+ data.length)

        if(data.length>0){
            console.log(data[0].fecha_mes)
            resolve(data);
        }
        else{
            reject('Error en la definicion del JSON para carga Valores Negativos')           
        }

    });
};


module.exports.leerExcelValoresNegativos = leerExcelValoresNegativos;
