const XSLX = require('xlsx')

function leerExcelTotalesPorContratos(ruta){

    return new Promise((resolve, reject) => {
        const workbook = XSLX.readFile(ruta);   
        const workbookSheets = workbook.SheetNames;
        //console.log(workbookSheets)
        const sheet = workbookSheets[1];

        var data = XSLX.utils.sheet_to_json(workbook.Sheets[sheet],  { range: 10 });

        console.log('Cantidad de Registros a Transformar: '+ data.length)

        for(var i = 0; i < data.length; i++){ 
            for (var key in data[i]) {
            if(key.toLowerCase() !== key){
            data[i][key.toLowerCase()] = data[i][key];
            delete data[i][key];
            }
            }
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


module.exports.leerExcelTotalesPorContratos = leerExcelTotalesPorContratos();