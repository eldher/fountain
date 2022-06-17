
	

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


USE FOUNTAIN4

EXECUTE [dbo].[sp_EjecutarCierre] N'2021-10-31'
EXECUTE [dbo].[sp_ObtenerContratoCategoria] N'2021-12-31'
EXECUTE [dbo].[sp_ObtenerContratoCategoriaConTotal] N'2021-12-31'
EXECUTE [dbo].[sp_ObtenerContratoCategoriaConTotal] N'2022-01-31'

EXECUTE [dbo].[sp_ObtenerContratos]


select distinct * from [dbo].[tipo_precio]



USE FOUNTAIN4
select * from [dbo].[TotalesContratos]


SET SHOWPLAN_ALL ON
GO

-- FMTONLY will not exec stored proc
SET FMTONLY ON
GO

EXECUTE [dbo].[sp_ObtenerContratoCategoriaConTotal] N'2022-02-28'
GO

SET FMTONLY OFF
GO

SET SHOWPLAN_ALL OFF
GO