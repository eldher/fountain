

/****** Object:  StoredProcedure [dbo].[sp_EjecutarCierre]    Script Date: 6/27/2022 3:27:10 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Eldher
-- =============================================
ALTER PROCEDURE [dbo].[sp_Dashboard]
	@anio as int,
	@mes as int
AS
BEGIN

declare @fecha as date
select @fecha = EOMONTH(DATEFROMPARTS(@anio, @mes, 01) )






select 
cast(fecha as varchar) as fecha
,sum(fountain_a_supl_loc) as fountain_a_supl_loc
,sum(energia_asignada) as energia_asignada
,avg(cms) as cms
from [dbo].[LiquidacionFountain]
where EOMONTH(fecha) = @fecha
and version = 'Oficial'
group by fecha






select 
sum(fountain_a_saliendo) as fountain_a_saliendo
,avg(cms) as cms
,sum(ocasional_venta) as ocasional_venta
,format(sum(ocasional_credito)/1000, 'c','en-US') as  ocasional_credito
,sum(ocasional_compra) as ocasional_compra
,format(sum(ocasional_debito)/1000, 'c','en-US') as ocasional_debito
from [dbo].[LiquidacionFountain]
where EOMONTH(fecha) = @fecha
and version = 'Oficial'

-- se solicito cambio de EAR a Energia Asignada desde liquidacion


drop table if exists #temp

select
cast(EOMONTH(fecha) as varchar) as fecha
,sum(energia_asignada) as EAR 
into #temp
from [dbo].[LiquidacionFountain]
where EOMONTH(fecha)  = @fecha
and version = 'Oficial'
group by EOMONTH(fecha) 




--select cast(fecha as varchar) as fecha, sum(EAR) as EAR 
--into #temp
--from INGRESOS_CONTRATOS 
--where fecha = @fecha
--group by fecha


declare @COUNT_RESULTS int;
select @COUNT_RESULTS = count(*) from #temp

IF @COUNT_RESULTS > 0 
BEGIN
select * from #temp
END
ELSE
BEGIN
select @fecha as fecha , 6000 as EAR
END

end