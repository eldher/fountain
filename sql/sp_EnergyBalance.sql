/****** Object:  StoredProcedure [dbo].[sp_EnergyBalance]  ***/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Eldher
-- =============================================
ALTER PROCEDURE [dbo].[sp_EnergyBalance]

AS
BEGIN



drop table if exists #energy_balance 

select 

EOMONTH(a.fecha) as fecha
,sum(fountain_a_saliendo) as fountain_a_saliendo
,sum(ocasional_compra) as ocasional_compra
,sum(ocasional_venta) as ocasional_venta
,avg(CASE WHEN ocasional_compra <> 0 THEN cms ELSE NULL END) as avg_purchase_price
,avg(CASE WHEN ocasional_venta <> 0 THEN cms ELSE NULL END) as avg_sale_price
,sum(suplido_pos_contratos - suplido_mo) as transmission_losses
,sum(fountain_a_bfrio230_36_s) as fhpc_generation_smec
into #energy_balance 
from [dbo].[LiquidacionFountain] a 
group by EOMONTH(a.fecha) 
order by EOMONTH(a.fecha) 



-- tabla 1 
select 
cast(a.fecha as varchar) as fecha
,a.fountain_a_saliendo as fhpc_generation
,a.ocasional_compra as spot_energy_purchases
,a.avg_purchase_price 
,(b.EAR + a.ocasional_venta + a.transmission_losses)/1000 as total_gwh_1
,a.ocasional_venta as spot_energy_sales
,a.avg_sale_price
,b.EAR as ppa_sales
,a.transmission_losses
,'' as exports
,(b.EAR + a.ocasional_venta + a.transmission_losses)/1000 as total_gwh_2
,fhpc_generation_smec
from #energy_balance a 
left join 	(select fecha, sum(EAR) as EAR from INGRESOS_CONTRATOS group by fecha) b  on a.fecha = b.fecha
where YEAR(a.fecha) = 2022
order by a.fecha



-- tabla 2
select 
cast(a.fecha as varchar) as fecha
,a.fountain_a_saliendo as delivered_cnd
,a.ocasional_compra as spot_energy_purchases
,(b.EAR + a.ocasional_venta + a.transmission_losses)/1000 as total_gwh_1
,b.EAR as ppa_sales
,a.ocasional_venta as spot_energy_sales
,a.transmission_losses
,'' as exports
,(b.EAR + a.ocasional_venta + a.transmission_losses)/1000 as total_gwh_2

from #energy_balance a 
left join 	(select fecha, sum(EAR) as EAR from INGRESOS_CONTRATOS group by fecha) b  on a.fecha = b.fecha
where YEAR(a.fecha) = 2022
order by a.fecha


-- tabla 3
select 
cast(a.fecha as varchar) as fecha
,a.fountain_a_saliendo/1000 as fic_generation_cnd
,a.ocasional_compra/1000 as spot_energy_purchases
,(b.EAR + a.ocasional_venta + a.transmission_losses)/1000 as total_gwh_1
,b.EAR/1000 as ppa_sales
,a.ocasional_venta/1000 as spot_energy_sales
,a.transmission_losses/1000 as transmission_losses
,(b.EAR + a.ocasional_venta + a.transmission_losses)/1000 as total_gwh_2

from #energy_balance a 
left join 	(select fecha, sum(EAR) as EAR from INGRESOS_CONTRATOS group by fecha) b  on a.fecha = b.fecha
where YEAR(a.fecha) = 2022
order by a.fecha




drop table if exists #resumen
select 
 fecha_cierre
,sum(LAP_BRUTA_TOTAL) + sum(SAL_BRUTA_TOTAL) as BRUTA_TOTAL
,sum(LAP_NETA_TOTAL) + sum(SAL_NETA_TOTAL) as NETA_TOTAL
into #resumen
from [dbo].[resumenes_generacion]
group by fecha_cierre



select 
cast(a.fecha_cierre as varchar) as fecha_cierre	
,a.BRUTA_TOTAL as fhcp_gross_enery_gop
,a.NETA_TOTAL  as fhcp_enery_gop
,b.fountain_a_saliendo as fhpc_generation_cnd
,b.fhpc_generation_smec
,(b.fhpc_generation_smec - b.fountain_a_saliendo )/b.fhpc_generation_smec as [losses_smec]
,(a.NETA_TOTAL - b.fountain_a_saliendo  )/a.NETA_TOTAL as [losses_gop]
,(a.BRUTA_TOTAL - b.fountain_a_saliendo  )/a.BRUTA_TOTAL as [losses_gross_generation_gop]

from #resumen a 
left join #energy_balance b on a.fecha_cierre = b.fecha
where YEAR(a.fecha_cierre) = 2022



END

