-- liquidacion

select fecha_mes, version, fecha_carga, count(1) as cant_registros 
from LiquidacionFountain
group by fecha_mes, version, fecha_carga 
order by 1


--
select fecha_mes, version, fecha_carga, count(1) as cant_registros 
from SAERLP
group by fecha_mes, version, fecha_carga 
order by 1




select fecha_mes, version, fecha_carga, count(1) as cant_registros 
 from ServiciosAuxiliares
 group by fecha_mes, version, fecha_carga 
order by 1



select fecha, count(1) as cant_registros
from TotalEnergia
group by fecha


select fecha_mes, version, fecha_carga, count(1) as cant_registros 
from GeneracionObligada
group by fecha_mes, version, fecha_carga 
order by 1


--- pendiente
select fecha_mes, version, fecha_carga, count(1) as cant_registros 
from BalancesPotencia
group by fecha_mes, version, fecha_carga 
order by 1



select fecha_fin, count(1) as cant_registros 
from DetallePerdidas
group by fecha_fin
order by fecha_fin



select fecha_cierre, fecha_carga, count(1) as cant_registros 
from resumenes_generacion
group by fecha_cierre, fecha_carga
order by 1



select fecha_mes, version, fecha_carga, count(1) as cant_registros 
from SASD
group by fecha_mes, version, fecha_carga 
order by 1


select fecha, fecha_carga,  count(1) as cant_registros 
from TotalesContratos
group by fecha, fecha_carga
order by 1



select fecha, fecha_carga,  count(1) as cant_registros 
from TotalesContratos2
group by fecha, fecha_carga
order by 1

