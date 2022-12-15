const XSLX = require('xlsx')



function SerialDateToJSDate(serialDate, offsetUTC) {
    return new Date(Date.UTC(0, 0, serialDate, offsetUTC));
  }





function LimpiarUltimasFilas(data){

    let index = data.length;
    while (index--) {
        if (data[index].fecha === "Average") {
        data.splice(index, 1);
        } else if (data[index].fecha === "P50 (daily average)") {
        data.splice(index, 1);
        } else if (data[index].fecha === "P50 (Net)") {
        data.splice(index, 1);
        } else if (data[index].fecha === "TOTAL") {
        data.splice(index, 1);
        } else if (data[index].fecha === "P50 (Budget)") {
        data.splice(index, 1);
        } else if (data[index].fecha === "Days") {
        data.splice(index, 1);
        } else if (data[index].fecha === "") {
        data.splice(index, 1);
        } else if (data[index].fecha === "0") {
        data.splice(index, 1);
        } else if (data[index].LAP_BRUTA_TOTAL === 0) {
        data.splice(index, 1);
        } else if (typeof data[index].LAP_BRUTA_TOTAL === "undefined") {
        data.splice(index, 1);
        } 
    }
    return data;
}


function Formatear(data){

    let fecha_ts = Date.now()
    let hoy = new Date(fecha_ts)
    let _hoy = hoy.toISOString().slice(0, 19).replace('T', ' ')


    
    for (let i = 0; i < data.length; i++) {      
        // convertir fechas de formato Excel a JS
        data[i].fecha = SerialDateToJSDate(data[i].fecha, -24).toISOString().slice(0, 19).replace('T', ' ')  
        // agregar la fecha de carga
        data[i].fecha_carga = _hoy
        data[i].spacer1 = 'NA'


        // calcular fecha de cierre
        let lastDate = new Date(data[i].fecha)


          //  data[i].fecha_mes = test.getFullYear() + "-" + test.getMonth()
      //  data[i].version = 'Oficial'
        data[i].fecha_cierre = new Date(lastDate.getFullYear(), lastDate.getMonth()+1, 0);

    }
    
    return(data)

}






function leerExcelResumenGeneracion(ruta, version){

    return new Promise((resolve, reject) => {
        const workbook = XSLX.readFile(ruta);   
        const workbookSheets = workbook.SheetNames;
        console.log(workbookSheets)
        //const sheet = workbookSheets[1];
        console.log(ruta);

        var ResumenHeaders = ["fecha","LAP_GB_G1","LAP_GB_G2","LAP_GB_G3","LAP_GB_G4","LAP_BRUTA_TOTAL","LAP_CONSUMO_TOTAL","LAP_NETA_TOTAL","spacer1","SAL_GB_G1","SAL_GB_G2","SAL_GB_G3","SAL_BRUTA_TOTAL","SAL_CONSUMO_TOTAL","SAL_NETA_TOTAL","DAILY_NET"]

        var Enero = XSLX.utils.sheet_to_json(workbook.Sheets['Enero'], {header: ResumenHeaders, range:4 });
        var Febrero = XSLX.utils.sheet_to_json(workbook.Sheets['Febrero'], {header: ResumenHeaders, range:4 });
        var Marzo = XSLX.utils.sheet_to_json(workbook.Sheets['Marzo'], {header: ResumenHeaders, range:4 });
        var Abril = XSLX.utils.sheet_to_json(workbook.Sheets['Abril'], {header: ResumenHeaders, range:4 });
        var Mayo = XSLX.utils.sheet_to_json(workbook.Sheets['Mayo'], {header: ResumenHeaders, range:4 });
        var Junio = XSLX.utils.sheet_to_json(workbook.Sheets['Junio'], {header: ResumenHeaders, range:4 });
        var Julio = XSLX.utils.sheet_to_json(workbook.Sheets['Julio'], {header: ResumenHeaders, range:4 });
        var Agosto = XSLX.utils.sheet_to_json(workbook.Sheets['Agosto'], {header: ResumenHeaders, range:4 });
        var Septiembre = XSLX.utils.sheet_to_json(workbook.Sheets['Septiembre'], {header: ResumenHeaders, range:4 });
        var Octubre = XSLX.utils.sheet_to_json(workbook.Sheets['Octubre'], {header: ResumenHeaders, range:4 });
        var Noviembre = XSLX.utils.sheet_to_json(workbook.Sheets['Noviembre'], {header: ResumenHeaders, range:4 });
        var Diciembre = XSLX.utils.sheet_to_json(workbook.Sheets['Diciembre'], {header: ResumenHeaders, range:4 });
         
    


        Enero     = LimpiarUltimasFilas(Enero      ); 
        Febrero   = LimpiarUltimasFilas(Febrero    );
        Marzo     = LimpiarUltimasFilas(Marzo      );
        Abril     = LimpiarUltimasFilas(Abril      );
        Mayo      = LimpiarUltimasFilas(Mayo       );
        Junio     = LimpiarUltimasFilas(Junio      ); 
        Julio     = LimpiarUltimasFilas(Julio      ); 
        Agosto    = LimpiarUltimasFilas(Agosto     ); 
        Septiembre= LimpiarUltimasFilas(Septiembre );  
        Octubre   = LimpiarUltimasFilas(Octubre    );   
        Noviembre = LimpiarUltimasFilas(Noviembre  );
        Diciembre = LimpiarUltimasFilas(Diciembre  );



        Enero     = Formatear(Enero      ); 
        Febrero   = Formatear(Febrero    );
        Marzo     = Formatear(Marzo      );
        Abril     = Formatear(Abril      );
        Mayo      = Formatear(Mayo       );
        Junio     = Formatear(Junio      ); 
        Julio     = Formatear(Julio      ); 
        Agosto    = Formatear(Agosto     ); 
        Septiembre= Formatear(Septiembre );  
        Octubre   = Formatear(Octubre    );   
        Noviembre = Formatear(Noviembre  );
        Diciembre = Formatear(Diciembre  );





        let UnionMensual = []


        console.log(Enero.length );
        console.log(Febrero.length );
        console.log(Marzo.length );
        console.log(Abril.length );
        console.log(Mayo.length );
        console.log(Junio.length );
        console.log(Julio.length );
        console.log(Agosto.length );
        console.log(Septiembre.length );
        console.log(Octubre.length );
        console.log(Noviembre.length);
        console.log(Diciembre.length );

        for(var json of [Enero,Febrero,Marzo,Abril,Mayo,Junio, Julio, Agosto, Septiembre, Octubre, Noviembre, Diciembre]){
            if(json.length > 0){
                UnionMensual.push(json)
            }
        }


        // if (Enero.length > 0) { for (let i = 0; i < Enero.length; i++) {UnionMensual.push( Enero[i] ); } }
        // if (Febrero.length > 0) { for (let i = 0; i < Febrero.length; i++) {UnionMensual.push( Febrero[i] ); } }
        // if (Marzo.length > 0) { for (let i = 0; i < Marzo.length; i++) {UnionMensual.push( Marzo[i] ); } }
        // if (Abril.length > 0) { for (let i = 0; i < Abril.length; i++) {UnionMensual.push( Abril[i] ); } }
        // if (Mayo.length > 0) { for (let i = 0; i < Mayo.length; i++) {UnionMensual.push( Mayo[i] ); } }
        // if (Junio.length > 0) { for (let i = 0; i < Junio.length; i++) {UnionMensual.push( Junio[i] ); } }
        // if (Julio.length > 0) { for (let i = 0; i < Julio.length; i++) {UnionMensual.push( Julio[i] ); } }
        // if (Agosto.length > 0) { for (let i = 0; i < Agosto.length; i++) {UnionMensual.push( Agosto[i] ); } }
        // if (Septiembre.length > 0) { for (let i = 0; i < Septiembre.length; i++) {UnionMensual.push( Septiembre[i] ); } }
        // if (Octubre.length > 0) { for (let i = 0; i < Octubre.length; i++) {UnionMensual.push( Octubre[i] ); } }
        // if (Noviembre.length > 0) { for (let i = 0; i < Noviembre.length; i++) {Noviembre.push( Noviembre[i] ); } }
        // if (Diciembre.length > 0) { for (let i = 0; i < Diciembre.length; i++) {Diciembre.push( Diciembre[i] ); } }
    


        if(UnionMensual.length>0){
            //console.log(UnionMensual);
            resolve(UnionMensual);
            
        }
        else{
            reject('Error en la definicion del JSON para carga Liquidacion')           
        }

    });
};



module.exports.leerExcelResumenGeneracion = leerExcelResumenGeneracion
