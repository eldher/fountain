# Fase 2

# Carga de Archivos

library(dplyr)
library(readxl)
library(tidyverse)
library(data.table)
library(reshape2)
library(stringi)
library(lubridate)
library(readr)

options(OutDec=".")

printMoney <- function(x){
  format(x, digits = 9, decimal.mark = ".", big.mark="," , small.mark=".", small.interval=3)
}


setwd("C:/Users/eld02/Documents/FOUNTAIN CORP/Fase 2/")


#### Detalle de Perdidas ####

## scanner de archivos
name <- "detalle_perdida"  
archivos <- list.files(pattern = name, recursive = TRUE)
archivos <- archivos[!archivos %like% "~" & !archivos %like% ".csv" & !archivos %like% ".dtsx" ]
print(archivos)

DetallePerdidas <- list()
k = 0

for (filename in archivos) {
filename <- archivos[1]  
  
  split_name <- unlist(str_split(filename, "/"))
  clean_name <-split_name[length(split_name)]

vars <- unlist(str_split(filename, "_"))
obj <- list(name= name, anio = vars[3], month = vars[4] )

detalle_perdidas <- read_excel(filename, sheet = "PERDIDAS", skip=3)
names(detalle_perdidas) <- stri_trans_general(str = names(detalle_perdidas),id = "Latin-ASCII")
names(detalle_perdidas) <- tolower(names(detalle_perdidas))
detalle_perdidas$valorizado <- stri_trans_general(str = detalle_perdidas$valorizado ,id = "Latin-ASCII")

cp <- as.data.table(detalle_perdidas)

if (k > 0) {
  DetallePerdidas <-  bind_rows(DetallePerdidas, cp)
}else{
  DetallePerdidas <- cp
}
k = k +1
}
DetallePerdidas <- distinct(DetallePerdidas)
rm(obj)



#### Preliminar Balance de Potencia ####

## scanner de archivos
name <- "Balance_de_Potencia" 
archivos <- list.files(pattern = name, recursive = TRUE)
archivos <- archivos[!archivos %like% "~" & !archivos %like% ".csv"]

print(archivos)
BalancesPotencia <- list()

k = 0

for (filename in archivos) {

  split_name <- unlist(str_split(filename, "/"))
  clean_name <-split_name[length(split_name)]
    
  vars <- unlist(str_split(clean_name, "_"))
  fecha <- substr(vars[length(vars)],1,6) # extrae fecha del ultimo componente evitar (2) o (3) de archivos dups
  obj <- list(name= name, version = vars[1], anio = substr(fecha,1,4), mes = substr(fecha,5,6) )
  
  
  
  compensacion_potencia <- read_excel(filename, sheet = "Compensacion de Potencia", skip=6)
  names(compensacion_potencia) <- stri_trans_general(str = names(compensacion_potencia),id = "Latin-ASCII")
  names(compensacion_potencia) <- tolower(names(compensacion_potencia))
  names(compensacion_potencia) <- gsub("b/.","usd", names(compensacion_potencia))
  names(compensacion_potencia) <- gsub("/","", names(compensacion_potencia)) 
  names(compensacion_potencia) <- gsub("\\(","", names(compensacion_potencia))
  names(compensacion_potencia) <- gsub("\\)","", names(compensacion_potencia))
  names(compensacion_potencia) <- gsub("\\)","", names(compensacion_potencia))
  names(compensacion_potencia) <- gsub(" ","_", names(compensacion_potencia))
  names(compensacion_potencia) <- gsub("-","_", names(compensacion_potencia))
  
  names(compensacion_potencia)
  
  compensacion_potencia$fecha_mes <- paste0(year(compensacion_potencia$fecha),"-",month(compensacion_potencia$fecha))
  compensacion_potencia$version <- obj$version
  # 
  # rsm_compensacion <- group_by(compensacion_potencia, codigo_de_empresa, fecha_mes, version) %>% 
  #   summarise(sum_colocado_mw = sum(colocado_mw), sum_credito_usd = sum(credito_en_usd) )
  # 
  ##View(filter(rsm_compensacion, codigo_de_empresa == "FOUNTAIN"))
  
  cp <- as.data.table(compensacion_potencia)
  
  if (k > 0) {
    BalancesPotencia <-  bind_rows(BalancesPotencia, cp)
  }else{
    BalancesPotencia <- cp
  }
  k = k +1

}
BalancesPotencia <- distinct(BalancesPotencia)


#### Generacion Obligada #### Hoja K #######


## scanner de archivos
name <- "Generacion_Obligada" 
archivos <- list.files(pattern = name, recursive = TRUE)
archivos <- archivos[!archivos %like% "~" & !archivos %like% ".csv"]
print(archivos)

GeneracionObligada <- list()
k = 0

for (filename in archivos) {
  
  #filename <- archivos[1]
  
  split_name <- unlist(str_split(filename, "/"))
  clean_name <-split_name[length(split_name)]
  
  vars <- unlist(str_split(clean_name, "_"))
  fecha <- substr(vars[length(vars)],1,8) # extrae fecha del ultimo componente evitar (2) o (3) de archivos dups
  obj <- list(name= name, version = vars[1], anio = substr(fecha,5,8), mes = substr(fecha,3,4) )
  
  
  ##generacion_obligada <- read_excel("Preliminar_Generacion_Obligada_01112021_30112021.xlsx", sheet = "K", skip=10)
  generacion_obligada <- read_excel(filename, sheet = "K", skip=10)
  x <- names(generacion_obligada)
  x <- stri_trans_general(str = x,id = "Latin-ASCII")
  x <- tolower(x)
  x <- gsub("b/.","usd", x)
  #x <- gsub("\\[$\]","usd",   x) 
  x <- gsub("/","",   x) 
  x <- gsub("\\(","", x)
  x <- gsub("\\)","", x)
  x <- gsub("\\)","", x)
  x <- gsub(" ","_",  x)
  x <- gsub("-","_",  x)
  names(generacion_obligada) <- x
  
  generacion_obligada$fecha_mes <- paste0(year(generacion_obligada$fecha),"-",month(generacion_obligada$fecha))
  generacion_obligada$version <- obj$version
  
  ##View(filter(generacion_obligada, agente_responsable == "FOUNTAIN"))
  
  cp <- as.data.table(generacion_obligada)
  
  if (k > 0) {
    GeneracionObligada <-  bind_rows(GeneracionObligada, cp)
  }else{
    GeneracionObligada <- cp
  }
  k = k +1

}
  


#### Generacion Obligada #### Hoja Total #######
generacion_matriz <- read_excel("Preliminar_Generacion_Obligada_01112021_30112021.xlsx", sheet = "Total", skip=1)
#todo: separate table in sections from nulls tables B/s and MW
#to do: separate table in sections from nulls tables B/s and MW
#generacion_matriz[,1] <- NULL
#generacion_matriz[is.na(generacion_matriz$AGENTE_DEUDOR)]




##### Liquidacion Fountain +

## scanner de archivos
name <- "liquidacion_FOUNTAIN" 
archivos <- list.files(pattern = name, recursive = TRUE)
archivos <- archivos[!archivos %like% "~" & !archivos %like% ".csv"]
print(archivos)

LiquidacionFountain <- list()
k = 0

for (filename in archivos) {
  
  
  #filename <- archivos[4]
  
  split_name <- unlist(str_split(filename, "/"))
  clean_name <-split_name[length(split_name)]
  
  vars <- unlist(str_split(clean_name, "_"))
  fecha <- substr(vars[length(vars)],1,9) # extrae fecha del ultimo componente evitar (2) o (3) de archivos dups
  
  ajuste <- ifelse(fecha %like% "Aj",1,0)
  
  obj <- list(name= name, version = vars[1], anio = substr(fecha,5,8), mes = substr(fecha,3,4) )
  
  
  
  
  ##generacion_obligada <- read_excel("Preliminar_Generacion_Obligada_01112021_30112021.xlsx", sheet = "K", skip=10)
  liquidacion <- read_excel(filename,  sheet = "MEDICIONES", skip = 5)
  liquidacion$Fecha <- gsub("ene","jan", liquidacion$Fecha)
  liquidacion$Fecha <- gsub("abr","apr", liquidacion$Fecha)
  liquidacion$Fecha <- gsub("ago","aug", liquidacion$Fecha)
  liquidacion$Fecha <- gsub("dic","dec", liquidacion$Fecha)
  liquidacion$Fecha2 <- as.Date(liquidacion$Fecha, format = ("%b/%d/%Y"))
  
  liquidacion$Fecha <- liquidacion$Fecha2
  liquidacion$Fecha2 <- NULL
  liquidacion$filename <- filename
  
  liquidacion <- filter(liquidacion, !is.na(Fecha))
  
  
  x <- names(liquidacion)
  x <- tolower(x)
  names(liquidacion) <- x
  liquidacion$fecha_mes <- paste0(year(liquidacion$fecha),"-", month(liquidacion$fecha))
  liquidacion$version <- obj$version
  liquidacion$ajuste <- ajuste
  
  cp <- as.data.table(liquidacion)
  
  if (k > 0) {
    LiquidacionFountain <-  bind_rows(LiquidacionFountain, cp)
  }else{
    LiquidacionFountain <- cp
  }
  k = k +1
  
}

#write.csv(LiquidacionFountain, "test_liquidacion3.csv")
LiquidacionFountain <- distinct(LiquidacionFountain)
table(LiquidacionFountain$filename)








#### Preliminar Servicios Auxiliares ####

name <- "Servicios_Auxiliares" 
archivos <- list.files(pattern = name, recursive = TRUE)
archivos <- archivos[!archivos %like% "~" & !archivos %like% ".csv"]
print(archivos)

ServiciosAuxiliares <- list()
k = 0


for (filename in archivos) {
  
  #filename <- archivos[1]
  
  split_name <- unlist(str_split(filename, "/"))
  clean_name <-split_name[length(split_name)]
  
  vars <- unlist(str_split(clean_name, "_"))
  fecha <- substr(vars[length(vars)],1,6) # extrae fecha del ultimo componente evitar (2) o (3) de archivos dups
  
  
  obj <- list(name= name, version = vars[1], anio = substr(fecha,1,4), mes = substr(fecha,5,6) )
  
  
  
  
  servicios_auxiliares <- read_excel(filename, sheet = "Cobro_Reserva", skip=8)
  
  names(servicios_auxiliares) <- c("empresas_acreedoras", "secundaria_mw", "operativa_mw", "secundaria_usd", "operativa_usd", "total_usd" )
  servicios_auxiliares <- servicios_auxiliares[-c(1),] 
  servicios_auxiliares <- filter(servicios_auxiliares, !is.na(empresas_acreedoras))
  
  servicios_auxiliares$fecha_mes <- paste0(obj$anio,"-", obj$mes)
  servicios_auxiliares$version <- obj$version
  
  #view(filter(servicios_auxiliares, empresas_acreedoras == "FOUNTAIN_A") %>% select(total_usd))
  
  
  cp <- as.data.table(servicios_auxiliares)
  
  if (k > 0) {
    ServiciosAuxiliares <-  bind_rows(ServiciosAuxiliares, cp)
  }else{
    ServiciosAuxiliares <- cp
  }
  k = k +1
  
}
  

  
#view(filter(servicios_auxiliares, empresas_acreedoras == "FOUNTAIN_A") %>% select(total_usd))



###################################################
############ TOTALES POR CONTRATOS ################
###################################################

setwd("C:/Users/eld02/Documents/FOUNTAIN CORP/Fase 2")
name <- "totales_por_contratos" 
archivos <- list.files(pattern = name, recursive = TRUE)
archivos <- archivos[!archivos %like% "~" & !archivos %like% ".csv"]
print(archivos)

TotalesContratos <- list()
TotalesContratos2 <- list()
k = 0
j = 0

for (filename in archivos) {
  
  #filename <- archivos[1]
  
  split_name <- unlist(str_split(filename, "/"))
  clean_name <-split_name[length(split_name)]
  
  vars <- unlist(str_split(clean_name, "_"))
  fecha <- vars[4] # extrae fecha del ultimo componente evitar (2) o (3) de archivos dups
  
  
  obj <- list(name= name, version = vars[1], anio = vars[4], mes = vars[5] )
  
  z <- obj$mes 
  obj$mes <- case_when(
    z == "enero" ~ 1,
    z == "febrero" ~ 2,
    z == "marzo" ~ 3,
    z == "abril" ~ 4,
    z == "mayo" ~ 5,
    z == "junio" ~ 6,
    z == "julio" ~ 7,
    z == "agosto" ~ 8,
    z == "septiembre" ~ 9,
    z == "octubre" ~ 10,
    z == "noviembre" ~ 11,
    z == "diciembre" ~ 12
  )
  
  
  totales_contratos <- read_excel(filename, sheet = "TOTALESCONTRATOS", skip=10)
  totales_contratos <- totales_contratos[c(1:3),c(1:4)]
  totales_contratos$fecha <- paste0(obj$anio,"-",obj$mes,"-1")
  
  
  
  cp <- as.data.table(totales_contratos)
  
  if (k > 0) {
    TotalesContratos <-  bind_rows(TotalesContratos, cp)
  }else{
    TotalesContratos <- cp
  }
  k = k +1
  
  
  totales_contratos_2 <- read_excel(filename, sheet = "TOTALESCONTRATOS", skip=16)
  x <- names(totales_contratos_2)
  x <- stri_trans_general(str = x,id = "Latin-ASCII")
  x <- tolower(x)
  x <- gsub("b/.","usd", x)
  #x <- gsub("\\[$\]","usd",   x) 
  x <- gsub("/","",   x) 
  x <- gsub("\\(","", x)
  x <- gsub("\\)","", x)
  x <- gsub("\\)","", x)
  x <- gsub(" ","_",  x)
  x <- gsub("-","_",  x)
  names(totales_contratos_2) <- x
  rsm_totales_contratos_2 <- group_by(totales_contratos_2, nombre_contrato) %>% summarise(suma_dwh_contrato = sum(mwh_contrato)) 
  
  # 
  # 
  # cp <- as.data.table(totales_contratos_2)
  # 
  # if (k > 0) {
  #   ServiciosAuxiliares <-  bind_rows(ServiciosAuxiliares, cp)
  # }else{
  #   ServiciosAuxiliares <- cp
  # }
  # k = k +1
  
  #view(filter(totales_contratos_2, `Nombre Contrato` %like% "%FOUNTAIN%"))
  
  totales_contratos_2 <- read_excel(filename, sheet = "TOTALESCONTRATOS", skip=16)
  
  x <- names(totales_contratos_2)
  x <- stri_trans_general(str = x,id = "Latin-ASCII")
  x <- tolower(x)
  x <- gsub("b/.","usd", x)
  #x <- gsub("\\[$\]","usd",   x) 
  x <- gsub("/","",   x) 
  x <- gsub("\\(","", x)
  x <- gsub("\\)","", x)
  x <- gsub("\\)","", x)
  x <- gsub(" ","_",  x)
  x <- gsub("-","_",  x)
  names(totales_contratos_2) <- x
  

  #view(filter(servicios_auxiliares, empresas_acreedoras == "FOUNTAIN_A") %>% select(total_usd))

  cp <- as.data.table(totales_contratos_2)
  
  if (k > 0) {
    TotalesContratos2 <-  bind_rows(TotalesContratos2, cp)
  }else{
    TotalesContratos2 <- cp
  }
  k = k +1
  
}

TotalesContratos <- distinct(TotalesContratos)
TotalesContratos2 <- distinct(TotalesContratos2)




# 
# 
# 
# 
# totales_contratos <- read_excel("totales_por_contratos_2021_noviembre_FOUNTAIN (6).xlsx", sheet = "TOTALESCONTRATOS", skip=10)
# totales_contratos <- totales_contratos[c(1:3),c(1:4)]
# 
# 
# 
# 
# view(filter(totales_contratos_2, `Nombre Contrato` %like% "%FOUNTAIN%"))
# 
# 
# x <- names(totales_contratos_2)
# x <- stri_trans_general(str = x,id = "Latin-ASCII")
# x <- tolower(x)
# x <- gsub("b/.","usd", x)
# #x <- gsub("\\[$\]","usd",   x) 
# x <- gsub("/","",   x) 
# x <- gsub("\\(","", x)
# x <- gsub("\\)","", x)
# x <- gsub("\\)","", x)
# x <- gsub(" ","_",  x)
# x <- gsub("-","_",  x)
# names(totales_contratos_2) <- x
# 
# rsm_totales_contratos_2 <- group_by(totales_contratos_2, nombre_contrato) %>% summarise(suma_dwh_contrato = sum(mwh_contrato)) 
# 
# ##"C:\Users\eld02\Documents\FOUNTAIN CORP\Fase 2\Preliminar_Servicios_Auxiliares_202111 (4).xlsx"



# 
# setwd("C:/Users/eld02/Documents/FOUNTAIN CORP/Fase 2/output")
# 
# write.table(compensacion_potencia, "compensacion_potencia.csv", row.names = F, quote = F, sep = ";" , fileEncoding = "UTF-16LE")
# write.table(detalle_perdidas, "detalle_perdidas.csv", row.names = F, quote = F, sep = ";" , fileEncoding = "UTF-16LE")
# 
# write.table(generacion_matriz, "generacion_matriz.csv", row.names = F, quote = F, sep = ";" , fileEncoding = "UTF-16LE")
# write.table(generacion_obligada, "generacion_obligada.csv", row.names = F, quote = F, sep = ";" , fileEncoding = "UTF-16LE")
# 
# write.table(preliminar_fountain, "preliminar_fountain.csv", row.names = F, quote = F, sep = ";" , fileEncoding = "UTF-16LE")
# write.table(servicios_auxiliares, "servicios_auxiliares.csv", row.names = F, quote = F, sep = ";" , fileEncoding = "UTF-16LE")
# write.table(totales_contratos, "totales_contratos.csv", row.names = F, quote = F, sep = ";" , fileEncoding = "UTF-16LE")
# write.table(totales_contratos_2, "totales_contratos_2.csv", row.names = F, quote = F, sep = ";" , fileEncoding = "UTF-16LE")


getwd()

setwd("C:/Users/eld02/Documents/FOUNTAIN CORP/Fase 2/output")

write.table(DetallePerdidas, "DetallePerdidas.csv", row.names = F, quote = F, sep = ";" , fileEncoding = "UTF-16LE")
write.table(BalancesPotencia, "BalancesPotencia.csv", row.names = F, quote = F, sep = ";" , fileEncoding = "UTF-16LE")
write.table(GeneracionObligada, "GeneracionObligada.csv", row.names = F, quote = F, sep = ";" , fileEncoding = "UTF-16LE")
write.table(LiquidacionFountain, "LiquidacionFountain.csv", row.names = F, quote = F, sep = ";" , fileEncoding = "UTF-16LE")
write.table(ServiciosAuxiliares, "ServiciosAuxiliares.csv", row.names = F, quote = F, sep = ";" , fileEncoding = "UTF-16LE")
write.table(TotalesContratos, "TotalesContratos.csv", row.names = F, quote = F, sep = ";" , fileEncoding = "UTF-16LE")
write.table(TotalesContratos2, "TotalesContratos2.csv", row.names = F, quote = F, sep = ";" , fileEncoding = "UTF-16LE")





