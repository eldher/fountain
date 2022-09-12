const XSLX = require('xlsx')

function SerialDateToJSDate(serialDate, offsetUTC) {
    return new Date(Date.UTC(0, 0, serialDate, offsetUTC));
  }



function LimpiarUltimasFilas(data){
    var data_filter = data.filter( element => element.fecha != "Average" && element.fecha !="P50 (daily average)"  &&  element.fecha !="P50 (Net)" && element.fecha !="TOTAL" )
    return(data)

}



function leerExcelResumenGeneracion(ruta){

    return new Promise((resolve, reject) => {
        const workbook = XSLX.readFile(ruta);   
        const workbookSheets = workbook.SheetNames;
        console.log(workbookSheets)
        //const sheet = workbookSheets[1];
        console.log(ruta);

        var ResumenHeaders = ["fecha","LAP_GB_G1","LAP_GB_G2","LAP_GB_G3","LAP_GB_G4","LAP_BRUTA_TOTAL","LAP_CONSUMO_TOTAL","LAP_NETA_TOTAL","spacer1","SAL_GB_G1","SAL_GB_G2","SAL_GB_G3","SAL_BRUTA_TOTAL","SAL_CONSUMO_TOTAL","SAL_NETA_TOTAL","DAILY_NET"]

        var Enero = XSLX.utils.sheet_to_json(workbook.Sheets['Enero'], {header: ResumenHeaders, range:5 });
        var Febrero = XSLX.utils.sheet_to_json(workbook.Sheets['Febrero'], {header: ResumenHeaders, range:5 });
        var Marzo = XSLX.utils.sheet_to_json(workbook.Sheets['Marzo'], {header: ResumenHeaders, range:5 });
        var Abril = XSLX.utils.sheet_to_json(workbook.Sheets['Abril'], {header: ResumenHeaders, range:5 });
        var Mayo = XSLX.utils.sheet_to_json(workbook.Sheets['Mayo'], {header: ResumenHeaders, range:5 });
        var Junio = XSLX.utils.sheet_to_json(workbook.Sheets['Junio'], {header: ResumenHeaders, range:5 });
        var Julio = XSLX.utils.sheet_to_json(workbook.Sheets['Julio'], {header: ResumenHeaders, range:5 });
        var Agosto = XSLX.utils.sheet_to_json(workbook.Sheets['Agosto'], {header: ResumenHeaders, range:5 });
        var Septiembre = XSLX.utils.sheet_to_json(workbook.Sheets['Septiembre'], {header: ResumenHeaders, range:5 });
        var Octubre = XSLX.utils.sheet_to_json(workbook.Sheets['Octubre'], {header: ResumenHeaders, range:5 });
        var Noviembre = XSLX.utils.sheet_to_json(workbook.Sheets['Noviembre'], {header: ResumenHeaders, range:5 });
        var Diciembre = XSLX.utils.sheet_to_json(workbook.Sheets['Diciembre'], {header: ResumenHeaders, range:5 });
         
    

        console.log(LimpiarUltimasFilas(Enero)      ) 
        console.log(Febrero    )
        console.log(Marzo      )
        console.log(Abril      )
        console.log(Mayo       )
        console.log(Junio      ) 
        console.log(Julio      ) 
        console.log(Agosto     ) 
        console.log(Septiembre )  
        console.log(Octubre    )   
        console.log(Noviembre  )
        console.log(LimpiarUltimasFilas(Diciembre))



      //  var extraccionFecha = XSLX.utils.sheet_to_json( workbook.Sheets['Resumen'], range = 'A1:A1');

        //console.log('Cantidad de Registros a Transformar: '+ data.length)

  



        // let fecha_ts = Date.now()
        // let hoy = new Date(fecha_ts)

        
        // for (let i = 0; i < data.length; i++) {      
        //     // convertir fechas de formato Excel a JS
        //     data[i].fecha = SerialDateToJSDate(extraccionFecha, 19) //.toISOString().slice(0, 19).replace('T', ' ')  
        //     // agregar la fecha de carga
        //     data[i].fecha_carga = hoy.toISOString().slice(0, 19).replace('T', ' ')
        // }



        if(Enero.length>0){
            resolve(Enero);
        }
        else{
            reject('Error en la definicion del JSON para carga Liquidacion')           
        }

    });
};


module.exports.leerExcelResumenGeneracion = leerExcelResumenGeneracion
