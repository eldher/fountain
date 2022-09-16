const XSLX = require('xlsx')


function SerialDateToJSDate(serialDate, offsetUTC) {
    return new Date(Date.UTC(0, 0, serialDate, offsetUTC));
  }

function leerExcelTotalesPorContratos(ruta){

    return new Promise((resolve, reject) => {
        const workbook = XSLX.readFile(ruta);   
        const workbookSheets = workbook.SheetNames;
        console.log(workbookSheets)
        //const sheet = workbookSheets[1];
        console.log(ruta);

        var distribuidores = XSLX.utils.sheet_to_json(workbook.Sheets['TOTALESCONTRATOS'],  { range: "A11:D14" });

        var contratos = XSLX.utils.sheet_to_json(workbook.Sheets['TOTALESCONTRATOS'],  { range: 16 });

        console.log('Cantidad de Registros a Transformar: '+ distribuidores.length)
        console.log('Cantidad de Registros a Transformar: '+ contratos.length)


        // pasar nombres de keys a minusculas de json distribuidores
        for(var i = 0; i < distribuidores.length; i++){ 
            for (var key in distribuidores[i]) {
            if(key.toLowerCase() !== key){
                distribuidores[i][key.toLowerCase()] = distribuidores[i][key];
                delete distribuidores[i][key];  
            }
            }
        }


        // pasar nombres de keys a minusculas de json contratos
        for(var i = 0; i < contratos.length; i++){ 
            for (var key in contratos[i]) {
            if(key.toLowerCase() !== key){
                contratos[i][key.toLowerCase()] = contratos[i][key];
            delete contratos[i][key];
            }
            }
        }
        

        // Eliminar los espacios y dejar underscore
        contratos.forEach(function(e, i) {
            // Iterate over the keys of object
            Object.keys(e).forEach(function(key) {
              
              // Copy the value
              var val = e[key],
                newKey = key.replace(/\s+/g, '_');
              
              // Remove key-value from object
              delete contratos[i][key];
          
              // Add value with new key
              contratos[i][newKey] = val;
            });
          });

        
        // convertir fechas de formato Excel a JS
        for (let i = 0; i < contratos.length; i++) {            
            contratos[i].fecha = SerialDateToJSDate(contratos[i].fecha, -24 ).toISOString().slice(0, 19).replace('T', ' ')


            let fecha_ts = Date.now()
            let hoy = new Date(fecha_ts)
            contratos[i].fecha_carga = hoy.toISOString().slice(0, 19).replace('T', ' ')
        }



        // luego de procesar las fechas de los contratos, se le coloca la fecha a los distribuidores

        for (let i = 0; i < distribuidores.length; i++) {
            distribuidores[i].fecha = contratos[0].fecha
            distribuidores[i].fecha_carga = contratos[1].fecha_carga            
        }




        console.log('Cantidad de Registros a Cargar: '+ distribuidores.length)
        console.log('Cantidad de Registros a Cargar: '+ contratos.length)

        if(distribuidores.length>0){
            resolve( {
                distribuidores : distribuidores , 
                contratos : contratos } 
            );
        }
        else{
            reject('Error en la definicion del JSON para carga Liquidacion')
           //throw new Error();
        }

    });
};


module.exports.leerExcelTotalesPorContratos = leerExcelTotalesPorContratos
