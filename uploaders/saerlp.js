const XSLX = require('xlsx')

function SerialDateToJSDate(serialDate, offsetUTC) {
    return new Date(Date.UTC(0, 0, serialDate, offsetUTC));
  }

function leerExcelSaerlp(ruta, version){

    return new Promise((resolve, reject) => {
        const workbook = XSLX.readFile(ruta);   
        const workbookSheets = workbook.SheetNames;
        console.log(workbookSheets)
        //const sheet = workbookSheets[1];
        console.log(ruta);

        var data = XSLX.utils.sheet_to_json(
            // se coloca el nombre de la hoja a leer
            workbook.Sheets['monto'], 
            // se colocan los overriden nombre de las columnas
            {header:[
                "DEUDORES",
                "ACP",
                "ACPGEN",
                "AES",
                "ALTOVALLE",
                "CALDERA",
                "CELSIACENT",
                "CELSIABLM",
                "CELSIABON",
                "DESHIDCORP",
                "EISA",
                "ENERGYST",
                "ESEPSA",
                "FORTUNA",
                "FOUNTAIN",
                "GENA",
                "GENISA",
                "GENPED",
                "HBOQUERON",
                "HBTOTUMA",
                "HIBERICA",
                "HIDRO",
                "HTERIBE",
                "IDEALPMA",
                "JINRO",
                "P_ANCHO",
                "PANAM",
                "PEDREGAL",
                "RCHICO",
                "SFRAN"                                        
            ], range: 'A12:AE31' }
        );

        console.log('Cantidad de Registros a Transformar: '+ data.length)

        
        let extraccionFecha = XSLX.utils.sheet_to_json( workbook.Sheets['potencia'],  {header:["fecha"], range: 'F4:F4' });


        splitted = extraccionFecha[0].fecha.toLowerCase().split(" ")
        //console.log(splitted)

        // splitted[0] es el mes
        switch(splitted[0]){
            case 'enero':       nMes ='01'; break;
            case 'febrero':     nMes ='02'; break;
            case 'marzo':       nMes ='03'; break;
            case 'abril':       nMes ='04'; break;
            case 'mayo':        nMes ='05'; break;
            case 'junio':       nMes ='06'; break;
            case 'julio':       nMes ='07'; break;s
            case 'agosto':      nMes ='08'; break;
            case 'septiembre':  nMes ='09'; break;
            case 'octubre':     nMes ='10'; break;
            case 'noviembre':   nMes ='11'; break;
            case 'diciembre':   nMes ='12'; break;
        };

        let fecha = splitted[1] + '-' + nMes + '-' + '1';
        let fecha_mes = splitted[1] + '-' + nMes

        console.log(fecha_mes);

        console.log('Cantidad de Registros a Transformar: '+ data.length)
        
        let fecha_ts = Date.now()
        let hoy = new Date(fecha_ts)

        
        for (let i = 0; i < data.length; i++) {      
            // convertir fechas de formato Excel a JS
            data[i].fecha = fecha
            
            // agregar la fecha de carga

            let test = new Date(data[i].fecha)
            //console.log(test)
            data[i].fecha_mes = fecha_mes
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


module.exports.leerExcelSaerlp = leerExcelSaerlp;
