const XSLX = require('xlsx')

function leerExcel(ruta){
    const workbook = XSLX.readFile(ruta);
    const workbookSheets = workbook.SheetNames;
    //console.log(workbookSheets)
    const sheet = workbookSheets[1];
    var data = XSLX.utils.sheet_to_json(workbook.Sheets[sheet],  { range: 5 });
    //console.log(data);

    for (var i = 1; i < data.length; i++) {
        //console.log(data[i].Fecha);
        splitted = data[i].Fecha.split("/")


        // splitted[0] es el mes
        switch(splitted[0]){
            case 'ene': nMes ='01'
            case 'feb': nMes ='02'
            case 'mar': nMes ='03'
            case 'abr': nMes ='04'
            case 'may': nMes ='05'
            case 'jun': nMes ='06'
            case 'jul': nMes ='07'
            case 'ago': nMes ='08'
            case 'sep': nMes ='09'
            case 'oct': nMes ='10'
            case 'nov': nMes ='11'
            case 'dic': nMes ='12'
        };



        data[i].Fecha = splitted[2] + '-' + nMes + '-' + splitted[1];

        //console.log(data.Fecha[i]);        
    }   

    console.log(data);


}

leerExcel('public/Oficial_liquidacion_FOUNTAIN_01abr2022_30abr2022.xlsx')