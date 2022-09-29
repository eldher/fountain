const XSLX = require('xlsx')


function SerialDateToJSDate(serialDate, offsetUTC) {
    return new Date(Date.UTC(0, 0, serialDate, offsetUTC));
  }

function leerExcelBalanceDePotencia(ruta){

    return new Promise((resolve, reject) => {
        const workbook = XSLX.readFile(ruta);   
        const workbookSheets = workbook.SheetNames;
        console.log(workbookSheets)
        const sheet = workbookSheets[1];
        console.log(ruta);

        var data = XSLX.utils.sheet_to_json(
            workbook.Sheets['Compensacion de Potencia'], 
            {header:[
                "fecha",
                "codigo_de_empresa",
                "nombre_de_la_oferta",
                "oferta_en_usdkw_mes",
                "disponible_mw",
                "colocado_mw",
                "faltante_mw",
                "precio_del_mw_usd",
                "credito_en_usd"
            ], range:7 }
        );
          

        console.log('Cantidad de Registros a Transformar: '+ data.length)

        // pasar nombres de keys a minusculas de json distribuidores
        for(var i = 0; i < data.length; i++){ 
            for (var key in data[i]) {
            if(key.toLowerCase() !== key){
                data[i][key.toLowerCase()] = data[i][key];
                delete data[i][key];  
            }
            }
        }
        

        // Eliminar los espacios y dejar underscore
        data.forEach(function(e, i) {
            // Iterate over the keys of object
            Object.keys(e).forEach(function(key) {
              // Copy the value
              var val = e[key],
                newKey = key.replace(/\s+/g, '_');
              // Remove key-value from object
              delete data[i][key];
          // Add value with new key
              data[i][newKey] = val;
            });
          });


        let fecha_ts = Date.now()
        let hoy = new Date(fecha_ts)

        
        for (let i = 0; i < data.length; i++) {      
            // convertir fechas de formato Excel a JS
            data[i].fecha = SerialDateToJSDate(data[i].fecha, -24).toISOString().slice(0, 19).replace('T', ' ')  

            
            
            //agregar fecha_mes
            let test = new Date(data[i].fecha)
            data[i].fecha_mes = test.getFullYear() + "-" + (test.getMonth() + 1)

            // cambiar este parametro a input desde formulario
            data[i].version = 'Oficial'

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


module.exports.leerExcelBalanceDePotencia = leerExcelBalanceDePotencia
