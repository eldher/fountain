-- liquidacion

select fecha_mes, version, fecha_carga, count(1) as cant_registros 
from LiquidacionFountain
group by fecha_mes, version, fecha_carga 
order by 1


--
select * from SAERLP

select * from ServiciosAuxiliares

select * from TotalEnergia

select * from GeneracionObligada

select * from BalancesPotencia

select * from DetallePerdidas

select * from resumenes_generacion

select * from SASD

select * from TotalesContratos

select * from TotalesContratos2

