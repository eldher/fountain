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

declare @anio as int
set @anio = 2020

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


select * from #tabla1




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

select * from #tabla2






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
select * from #tabla3


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


select * from #tabla4


END








--update tb1 set exports = 0 where exports = 'NA'
--update tb2 set exports = 0 where exports = 'NA'
--update tb3 set exports = 0 where exports = 'NA'
--update tb4 set exports = 0 where exports = 'NA'
GO


