

/****** Object:  StoredProcedure [dbo].[sp_EjecutarCierre]    Script Date: 6/27/2022 3:27:10 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Eldher
-- =============================================
CREATE PROCEDURE [dbo].[sp_Dashboard]
	@fecha date
AS
BEGIN



select 
cast(fecha as varchar) as fecha
,sum(fountain_a_supl_loc) as fountain_a_supl_loc
,sum(energia_asignada) as energia_asignada
,avg(cms) as cms
from [dbo].[LiquidacionFountain]
where EOMONTH(fecha) = @fecha
group by fecha






select 
sum(fountain_a_saliendo) as fountain_a_saliendo
,avg(cms) as cms
,sum(ocasional_venta) as ocasional_venta
,sum(ocasional_credito)/1000 as  ocasional_credito
,sum(ocasional_compra) as ocasional_compra
,sum(ocasional_debito)/1000 as ocasional_debito
from [dbo].[LiquidacionFountain]
where EOMONTH(fecha) = @fecha


select cast(fecha as varchar) as fecha, sum(EAR) as EAR from INGRESOS_CONTRATOS 
where fecha = @fecha
group by fecha

end