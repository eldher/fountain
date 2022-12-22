/****** Object:  StoredProcedure [dbo].[sp_EnergyBalance]    Script Date: 12/22/2022 2:02:24 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO




--USE FOUNTAIN5

-- =============================================
-- Author:		Eldher
-- =============================================
ALTER PROCEDURE [dbo].[sp_EnergyBalance]

AS
BEGIN





declare @fecha_mes_max_liquidacion_oficial as nvarchar(7);

declare @fecha_mes_max_liquidacion_preliminar as nvarchar(7);
declare @fecha_carga_max_liquidacion_carga as datetime;


select @fecha_mes_max_liquidacion_oficial = max(fecha_mes) from [LiquidacionFountain] where version= 'Oficial'

select @fecha_mes_max_liquidacion_preliminar = max(fecha_mes) from [LiquidacionFountain] where version= 'Preliminar' and fecha_mes >= @fecha_mes_max_liquidacion_oficial

select @fecha_carga_max_liquidacion_carga = max(fecha_carga) from [LiquidacionFountain] where fecha_mes = @fecha_mes_max_liquidacion_preliminar

--select @fecha_max_liquidacion
--select @fecha_max_liquidacion_carga


drop table if exists #energy_balance 

select 

EOMONTH(a.fecha) as fecha
,sum(fountain_a_saliendo) as fountain_a_saliendo
,sum(ocasional_compra) as ocasional_compra
,sum(ocasional_venta) as ocasional_venta
,avg(CASE WHEN ocasional_compra <> 0 THEN cms ELSE 0 END) as avg_purchase_price
,avg(CASE WHEN ocasional_venta <> 0 THEN cms ELSE 0 END) as avg_sale_price
,sum(suplido_pos_contratos - suplido_mo) as transmission_losses
,sum(fountain_a_bfrio230_36_s) as fhpc_generation_smec
into #energy_balance 
from [dbo].[LiquidacionFountain] a 
where version = 'Oficial' OR (fecha_mes = @fecha_mes_max_liquidacion_preliminar AND fecha_carga = @fecha_carga_max_liquidacion_carga )
--where fecha_mes = @fecha_max_liquidacion
--qand fecha_carga = @fecha_max_liquidacion_carga
group by EOMONTH(a.fecha) 
order by EOMONTH(a.fecha) 


--select * from #energy_balance order by fecha


-- tabla 1 
drop table if exists #tabla1
select 
cast(a.fecha as varchar) as fecha
,a.fountain_a_saliendo as fhpc_generation
,a.ocasional_compra as spot_energy_purchases
,a.avg_purchase_price 
,(ISNULL(b.EAR,0) + ISNULL(a.ocasional_venta,0) + ISNULL(a.transmission_losses,0))/1000 as total_gwh_1
,a.ocasional_venta as spot_energy_sales
,a.avg_sale_price
,ISNULL(b.EAR,0) as ppa_sales
,a.transmission_losses
,0 as exports
,(ISNULL(b.EAR,0) + ISNULL(a.ocasional_venta,0) + ISNULL(a.transmission_losses,0))/1000 as total_gwh_2
,fhpc_generation_smec
into #tabla1
from #energy_balance a 
left join 	(

-- @eldher 12/22/2022
-- select fecha, sum(EAR) as EAR from INGRESOS_CONTRATOS group by fecha
-- Esta parte se modifico para agregar los contratos de la tabla INGRESOS_CONTRATOS_PRELIMINAR
-- Haciendo un Join de tablas y sumando se mantiene el efecto
-- Hay que validar si no hay data oficial en INGRESOS_CONTRATOS
-- Si hay data preliminar y oficial del mismo mes en ambas tablas podrían generar montos adicionales


	select fecha as fecha, sum(EAR) as EAR from 
	(
		select * from INGRESOS_CONTRATOS
		UNION ALL 
		select * from INGRESOS_CONTRATOS_PRELIMINAR 
	)
	a group by fecha
) b  on a.fecha = b.fecha
where YEAR(a.fecha) = 2022
order by a.fecha

--select * from #tabla1 order by fecha
--select fecha, sum(EAR) as EAR from INGRESOS_CONTRATOS_PRELIMINAR group by fecha


-- tabla1 con totales
select 
fecha = ISNULL(fecha,'Total') 
,fhpc_generation = SUM(fhpc_generation)
,spot_energy_purchases = SUM(spot_energy_purchases)
,avg_purchase_price  = SUM(avg_purchase_price )
,total_gwh_1 = SUM(total_gwh_1)
,spot_energy_sales = SUM(spot_energy_sales)
,avg_sale_price = SUM(avg_sale_price)
,ppa_sales = SUM(ppa_sales)
,transmission_losses = SUM(transmission_losses)
,exports = SUM(exports)
,total_gwh_2 = SUM(total_gwh_2)
,fhpc_generation_smec = SUM(fhpc_generation_smec)
from #tabla1
GROUP BY ROLLUP(fecha)



-- tabla 2
drop table if exists #tabla2
select 
cast(a.fecha as varchar) as fecha
,a.fountain_a_saliendo as delivered_cnd
,a.ocasional_compra as spot_energy_purchases
,(ISNULL(b.EAR,0) + ISNULL(a.ocasional_venta,0) + ISNULL(a.transmission_losses,0))/1000 as total_gwh_1
,ISNULL(b.EAR,0) as ppa_sales
,a.ocasional_venta as spot_energy_sales
,a.transmission_losses
,0 as exports
,(ISNULL(b.EAR,0) + ISNULL(a.ocasional_venta,0) + ISNULL(a.transmission_losses,0))/1000 as total_gwh_2
into #tabla2
from #energy_balance a 
left join 	(

-- @eldher 12/22/2022
-- select fecha, sum(EAR) as EAR from INGRESOS_CONTRATOS group by fecha
-- Esta parte se modifico para agregar los contratos de la tabla INGRESOS_CONTRATOS_PRELIMINAR
-- Haciendo un Join de tablas y sumando se mantiene el efecto
-- Hay que validar si no hay data oficial en INGRESOS_CONTRATOS
-- Si hay data preliminar y oficial del mismo mes en ambas tablas podrían generar montos adicionales


	select fecha as fecha, sum(EAR) as EAR from 
	(
		select * from INGRESOS_CONTRATOS
		UNION ALL 
		select * from INGRESOS_CONTRATOS_PRELIMINAR 
	)
	a group by fecha

) b  on a.fecha = b.fecha
where YEAR(a.fecha) = 2022
order by a.fecha


-- tabla2 con totales
select 
fecha = ISNULL(fecha,'Total') 
,delivered_cnd = SUM(delivered_cnd)
,spot_energy_purchases = SUM(spot_energy_purchases)
,total_gwh_1 = SUM(total_gwh_1)
,ppa_sales = SUM(ppa_sales)
,spot_energy_sales = SUM(spot_energy_sales)
,transmission_losses = SUM(transmission_losses)
,exports = SUM(exports)
,total_gwh_2 = SUM(total_gwh_2)
from #tabla2
GROUP BY ROLLUP(fecha)










-- tabla 3
drop table  if exists #tabla3
select 
cast(a.fecha as varchar) as fecha
,a.fountain_a_saliendo/1000 as delivered_cnd
,a.ocasional_compra/1000 as spot_energy_purchases
--,(b.EAR + a.ocasional_venta + a.transmission_losses)/1000 as total_gwh_1
,(ISNULL(b.EAR,0) + ISNULL(a.ocasional_venta,0) + ISNULL(a.transmission_losses,0))/1000 as total_gwh_1
,ISNULL(b.EAR,0)/1000 as ppa_sales
,a.ocasional_venta/1000 as spot_energy_sales
,a.transmission_losses/1000 as transmission_losses
,0 as exports
,(ISNULL(b.EAR,0) + ISNULL(a.ocasional_venta,0) + ISNULL(a.transmission_losses,0))/1000 as total_gwh_2
into #tabla3
from #energy_balance a 
left join 	(

-- @eldher 12/22/2022
-- select fecha, sum(EAR) as EAR from INGRESOS_CONTRATOS group by fecha
-- Esta parte se modifico para agregar los contratos de la tabla INGRESOS_CONTRATOS_PRELIMINAR
-- Haciendo un Join de tablas y sumando se mantiene el efecto
-- Hay que validar si no hay data oficial en INGRESOS_CONTRATOS
-- Si hay data preliminar y oficial del mismo mes en ambas tablas podrían generar montos adicionales


	select fecha as fecha, sum(EAR) as EAR from 
	(
		select * from INGRESOS_CONTRATOS
		UNION ALL 
		select * from INGRESOS_CONTRATOS_PRELIMINAR 
	)
	a group by fecha
) b  on a.fecha = b.fecha
where YEAR(a.fecha) = 2022
order by a.fecha


-- tabla3 con totales
select 
fecha = ISNULL(fecha,'Total') 
,delivered_cnd = SUM(delivered_cnd)
,spot_energy_purchases = SUM(spot_energy_purchases)
,total_gwh_1 = SUM(total_gwh_1)
,ppa_sales = SUM(ppa_sales)
,spot_energy_sales = SUM(spot_energy_sales)
,transmission_losses = SUM(transmission_losses)
,exports = SUM(exports)
,total_gwh_2 = SUM(total_gwh_2)
from #tabla3
GROUP BY ROLLUP(fecha)





declare @fecha_max_cierre as date;
declare @fecha_max_carga as datetime;

select @fecha_max_cierre = max(fecha_cierre) from [resumenes_generacion]
select @fecha_max_carga = max(fecha_carga) from [resumenes_generacion] where fecha_cierre = @fecha_max_cierre



------------------------------
--Fix para traer la ultima fecha de carga para todos los meses
------------------------------------------

drop table if exists #date_log;
select fecha_carga, fecha_cierre
into #date_log
from (
	select fecha, fecha_carga, fecha_cierre, 
	ROW_NUMBER() OVER(PARTITION BY fecha_cierre ORDER BY fecha_carga) as rn
	from [resumenes_generacion]
) a where a.rn = 1



--select distinct fecha, fecha_carga, fecha_cierre from [resumenes_generacion] order by 3,2

-- tabla 4



drop table if exists #resumen
select 
 a.fecha_cierre
,sum(a.LAP_BRUTA_TOTAL) + sum(a.SAL_BRUTA_TOTAL) as BRUTA_TOTAL
,sum(a.LAP_NETA_TOTAL) +  sum(a.SAL_NETA_TOTAL) as NETA_TOTAL
into #resumen
from [dbo].[resumenes_generacion] a
inner join #date_log b on a.fecha_carga = b.fecha_carga and a.fecha_cierre = b.fecha_cierre
--where a.fecha_cierre = @fecha_max_cierre and fecha_carga = @fecha_max_carga
group by a.fecha_cierre


drop table if exists #tabla4
select 
cast(a.fecha_cierre as varchar) as fecha_cierre
,a.BRUTA_TOTAL as fhcp_gross_enery_gop
,a.NETA_TOTAL  as fhcp_enery_gop
,b.fountain_a_saliendo as fhpc_generation_cnd
,b.fhpc_generation_smec
,(b.fhpc_generation_smec - b.fountain_a_saliendo )/b.fhpc_generation_smec as [losses_smec]
,(a.NETA_TOTAL - b.fountain_a_saliendo  )/a.NETA_TOTAL as [losses_gop]
,(a.BRUTA_TOTAL - b.fountain_a_saliendo  )/a.BRUTA_TOTAL as [losses_gross_generation_gop]
into #tabla4
from #resumen a 
left join #energy_balance b on a.fecha_cierre = b.fecha
where YEAR(a.fecha_cierre) = 2022




-- tabla4 con totales
select 
fecha = ISNULL(fecha_cierre,'Total') 
,fhcp_gross_enery_gop = SUM(fhcp_gross_enery_gop)
,fhcp_enery_gop = SUM(fhcp_enery_gop)
,fhpc_generation_cnd = SUM(fhpc_generation_cnd)
,fhpc_generation_smec = SUM(fhpc_generation_smec)
,losses_smec = SUM(losses_smec)
,losses_gop = SUM(losses_gop)
,losses_gross_generation_gop = SUM(losses_gross_generation_gop)
from #tabla4
GROUP BY ROLLUP(fecha_cierre)


END

GO


