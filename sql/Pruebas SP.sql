
	

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


USE FOUNTAIN4

EXECUTE [dbo].[sp_EjecutarCierre] N'2022-03-31'
EXECUTE [dbo].[sp_ObtenerContratoCategoria] N'2021-12-31'
EXECUTE [dbo].[sp_ObtenerContratoCategoriaConTotal] N'2021-12-31'
EXECUTE [dbo].[sp_ObtenerContratoCategoriaConTotal] N'2022-03-31'
EXECUTE [dbo].[sp_ObtenerContratosPorFecha] N'2022-03-31'

EXECUTE [dbo].[sp_ObtenerContratos]


exec sp_executesql @statement=N'SET LANGUAGE Spanish; select  as fecha, '''' as mes, '''' as anio  UNION ALL select distinct cast(fecha as varchar) as fecha ,DATENAME(MONTH, fecha) as mes ,cast(YEAR(fecha) as varchar) as anio from INGRESOS_CONTRATOS'

select distinct * from [dbo].[tipo_precio]



USE FOUNTAIN4
select * from [dbo].[TotalesContratos]


USE FOUNTAIN4


SET LANGUAGE Spanish; 
select '' as fecha, '' as mes, '' as anio 
UNION ALL
select distinct cast(fecha as varchar) as fecha ,DATENAME(MONTH, fecha) as mes ,cast(YEAR(fecha) as varchar) as anio from INGRESOS_CONTRATOS





SET LANGUAGE Spanish; 
select '' as fecha, '' as mes, '' as anio  
UNION ALL select distinct cast(fecha as varchar) as fecha ,DATENAME(MONTH, fecha) as mes ,cast(YEAR(fecha) as varchar) as anio from INGRESOS_CONTRATOS



exec sp_executesql @statement=N'SET LANGUAGE Spanish; select '''' as fecha, '''' as mes, '''' as anio  UNION ALL select distinct cast(fecha as varchar) as fecha ,DATENAME(MONTH, fecha) as mes ,cast(YEAR(fecha) as varchar) as anio from INGRESOS_CONTRATOS'


select * from [dbo].[tipo_precio]