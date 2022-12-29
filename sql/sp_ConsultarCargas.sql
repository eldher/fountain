-- liquidacion

select 
'Liquidacion' as archivo,
fecha_mes, version, fecha_carga, count(1) as cant_registros 
from LiquidacionFountain
group by fecha_mes, version, fecha_carga 
order by 1


--
select 
'SAERLP' as archivo,
fecha_mes, version, fecha_carga, count(1) as cant_registros 
from SAERLP
group by fecha_mes, version, fecha_carga 
order by 1




select 
'Servicios Auxiliares' as archivo,
fecha_mes, version, fecha_carga, count(1) as cant_registros 
 from ServiciosAuxiliares
 group by fecha_mes, version, fecha_carga 
order by 1


select 
'SASD' as archivo,
fecha_mes, version, fecha_carga, count(1) as cant_registros 
from SASD
group by fecha_mes, version, fecha_carga 
order by 1




select 
'Generación Obligada' as archivo,
fecha_mes, version, fecha_carga, count(1) as cant_registros 
from GeneracionObligada
group by fecha_mes, version, fecha_carga 
order by 1


--- pendiente
select 
'Balances Potencia' as archivo,
fecha_mes, version, fecha_carga, count(1) as cant_registros 
from BalancesPotencia
group by fecha_mes, version, fecha_carga 
order by 1






select 
'Totales Contratos Energia' as archivo,
fecha, fecha_carga,  count(1) as cant_registros 
from TotalesContratos
group by fecha, fecha_carga
order by 1



select 
'Totales Contratos Individual' as archivo,
fecha, fecha_carga,  count(1) as cant_registros 
from TotalesContratos2
group by fecha, fecha_carga
order by 1



select 
'Resumenes Generacion' as archivo,
fecha_cierre, fecha_carga, count(1) as cant_registros 
from resumenes_generacion
group by fecha_cierre, fecha_carga
order by 1







select 
'Detalle Perdidas' as archivo,
fecha_fin, count(1) as cant_registros 
from DetallePerdidas
group by fecha_fin
order by fecha_fin


select 
'Total Energia' as archivo,
fecha, count(1) as cant_registros
from TotalEnergia
group by fecha

