# Fase 2

# Carga de Archivos

library(dplyr)
library(readxl)
library(tidyverse)
library(data.table)
library(stringi)
library(lubridate)
library(readr)
library(DBI)
library(odbc)



options(OutDec=".")

printMoney <- function(x){
  format(x, digits = 9, decimal.mark = ".", big.mark="," , small.mark=".", small.interval=3)
}


setwd("C:/Fase 2/")


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
  
  detalle_perdidas$fecha_fin <- detalle_perdidas$fecha
  day(detalle_perdidas$fecha_fin) <- days_in_month(detalle_perdidas$fecha)
  
  detalle_perdidas2 <- select(detalle_perdidas, fecha_fin, precio) %>%
    group_by(fecha_fin) %>% summarise(precio = mean(precio))
  
  cp <- as.data.table(detalle_perdidas2)
  
  if (k > 0) {
    DetallePerdidas <-  bind_rows(DetallePerdidas, cp)
  }else{
    DetallePerdidas <- cp
  }
  k = k +1
}
DetallePerdidas <- distinct(DetallePerdidas) %>% filter(!is.na(fecha_fin) & !is.na(precio))
rm(obj)



setwd("C:/output")

write.table(DetallePerdidas, "DetallePerdidas.csv", row.names = F, quote = F, sep = ";" , fileEncoding = "UTF-16LE")


# prueba azure
con <- dbConnect(odbc(), "azure_fountain", uid= "admin_fountain", pwd="Panama04", timeout = 10, database = "FOUNTAIN4")
dbGetQuery(con, "SELECT * from TotalesContratos2")
