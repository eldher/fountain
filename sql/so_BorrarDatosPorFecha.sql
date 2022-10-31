--- DELETE MONTH FROM DATA 

USE FOUNTAIN8

select * from [dbo].[LiquidacionFountain]  where EOMONTH(fecha) = '2022-09-30' and version = 'Oficial'
delete from [dbo].[LiquidacionFountain] where EOMONTH(fecha) = '2022-09-30'  and version = 'Oficial'


select * from [dbo].[LiquidacionFountain]  where EOMONTH(fecha) = '2022-09-30' and version = 'preliminar'
delete from [dbo].[LiquidacionFountain] where EOMONTH(fecha) = '2022-09-30'  and version = 'Preliminar'



-----------------------------------------------------------------------------------
------- Contratos: Se actualiza completa al cargar un archivo de contratos
-----------------------------------------------------------------------------------

-- Borrar Total Contratos por Empresa Distribuidora

select * from [dbo].[TotalesContratos] where EOMONTH(fecha) = '2022-09-30'
delete from [dbo].[TotalesContratos] where EOMONTH(fecha) = '2022-09-30'


-- Borrar Totales por Contratos 

select * from [dbo].[TotalesContratos2] where EOMONTH(fecha) = '2022-09-30'
delete from [dbo].[TotalesContratos2] where EOMONTH(fecha) = '2022-09-30'


-- Borrar Contratos 
select * from CONTRATOS where EOMONTH(fecha) = '2022-09-30' 
delete from CONTRATOS where EOMONTH(fecha) = '2022-09-30' 

-- Borrar Ingresos por contratos
select * from INGRESOS_CONTRATOS where fecha = '2022-09-30'
delete from INGRESOS_CONTRATOS where fecha = '2022-09-30'

-----------------------------------------------------------------------------------
-----------------------------------------------------------------------------------




select * from CONTRATOS where categoria_precio IS NULL

select distinct nombre_contrato, categoria_precio from CONTRATOS
where nombre_contrato not in ('09-20 FOUNTAIN - EDEMET', '29-20 FOUNTAIN - EDECHI')
order by 1




--update tipo_precio set categoria_precio = 'Energía Largo Plazo' where TRIM(categoria_precio) = 'Energia Largo Plazo'
--update tipo_precio set categoria_precio = 'Energía Corto Plazo I' where TRIM(categoria_precio) = 'Energia Corto Plazo I'
--update tipo_precio set categoria_precio = 'Energía Largo Plazo II' where TRIM(categoria_precio) = 'Energia Corto Plazo II'


--update CONTRATOS set categoria_precio = 'Energía Largo Plazo' where TRIM(categoria_precio) = 'Energia Largo Plazo'
--update CONTRATOS set categoria_precio = 'Energía Corto Plazo I' where TRIM(categoria_precio) = 'Energia Corto Plazo I'
--update CONTRATOS set categoria_precio = 'Energía Largo Plazo II' where TRIM(categoria_precio) = 'Energia Corto Plazo II'




-- Borrar Detalle de Perdidas
select * from DetallePerdidas where fecha_fin = '2022-09-30' 


-- Borrar Balance Potencia
select * from BalancesPotencia where fecha_mes = '2022-9' 
delete from BalancesPotencia where fecha_mes = '2022-9' and version ='Preliminar' 


-- Borrar ServiciosAuxiliares
select * from ServiciosAuxiliares where fecha_mes = '2022-9' and version = 'Oficial'
delete from ServiciosAuxiliares where fecha_mes = '2022-9' and version = 'Preliminar'


-- Borrar  [GeneracionObligada]
select * from GeneracionObligada where fecha_mes = '2022-9' and version = 'Oficial'
delete from GeneracionObligada where fecha_mes = '2022-9' and version = 'Preliminar'





-- Borrar SASD
select * from sasd where fecha_mes = '2022-9' and version = 'Oficial'
delete from sasd where fecha_mes = '2022-3' and version = 'Oficial'



-- Borrar SAE Reserva Largo Plazo
select * from SAERLP where fecha_mes = '2022-9' and version = 'Oficial'
delete from SAERLP where version = 'Preliminar'
	
-- Borrar Valores Negativos	
select * from [dbo].[ValoresNegativos]  where fecha = '2022-09-30'


-- Validar resumenes de generacion

select * from resumenes_generacion