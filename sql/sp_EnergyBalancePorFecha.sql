USE [FOUNTAIN5]
GO

/****** Object:  StoredProcedure [dbo].[sp_EnergyBalancePorFecha]    Script Date: 8/12/2022 7:17:10 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO




-- =============================================
-- Author:		Eldher
-- =============================================
ALTER PROCEDURE [dbo].[sp_EnergyBalancePorFecha]
@anio int
AS

BEGIN

--declare @anio as int
--set @anio = 2020

-- tabla 1 

drop table if exists #tabla1
select 
	   cast( EOMONTH(datefromparts(anio,mes,1) ) as varchar) as fecha
      ,[fhpc_generation]
      ,[spot_energy_purchases]
      ,[avg_purchase_price]
      ,[total_gwh_1]
      ,[spot_energy_sales]
      ,[avg_sale_price]
      ,[ppa_sales]
      ,[transmission_losses]
      ,[exports]
      ,[total_gwh_2]
into #tabla1
FROM [dbo].[tb1]
where total_gwh_2*1 > 0 and anio = @anio

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
from #tabla1
GROUP BY ROLLUP(fecha)





-- tabla 2

drop table if exists #tabla2
select  cast( EOMONTH(datefromparts(anio,mes,1) ) as varchar) as fecha
      ,[delivered_cnd]
      ,[spot_energy_purchases]
      ,[total_gwh_1]
      ,[ppa_sales]
      ,[spot_energy_sales]
      ,[transmission_losses]
      ,[exports]
      ,[total_gwh_2]
into #tabla2
from tb2 where total_gwh_2*1 > 0 and anio = @anio

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

drop table if exists #tabla3
select  cast( EOMONTH(datefromparts(anio,mes,1) ) as varchar) as fecha
      ,[delivered_cnd]
      ,[spot_energy_purchases]
      ,[total_gwh_1]
      ,[ppa_sales]
      ,[spot_energy_sales]
      ,[transmission_losses]
      ,[exports]
      ,[total_gwh_2]
into #tabla3
from tb3 where total_gwh_2*1 > 0 and anio = @anio



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



drop table if exists #tabla4
select  cast( EOMONTH(datefromparts(anio,mes,1) ) as varchar) as fecha
      ,[fhcp_gross_enery_gop]
      ,[fhcp_enery_gop]
      ,[fhpc_generation_cnd]
      ,[fhpc_generation_smec]
      ,[losses_smec]
      ,[losses_gop]
      ,[losses_gross_generation_gop]
into #tabla4
from tb4 where anio = @anio

-- tabla4 con totales
select 
fecha = ISNULL(fecha,'Total') 
,fhcp_gross_enery_gop = SUM(fhcp_gross_enery_gop)
,fhcp_enery_gop = SUM(fhcp_enery_gop)
,fhpc_generation_cnd = SUM(fhpc_generation_cnd)
,fhpc_generation_smec = SUM(fhpc_generation_smec)
,losses_smec = SUM(losses_smec)
,losses_gop = SUM(losses_gop)
,losses_gross_generation_gop = SUM(losses_gross_generation_gop)
from #tabla4
GROUP BY ROLLUP(fecha)


END








--update tb1 set exports = 0 where exports = 'NA'
--update tb2 set exports = 0 where exports = 'NA'
--update tb3 set exports = 0 where exports = 'NA'
--update tb4 set exports = 0 where exports = 'NA'
GO


