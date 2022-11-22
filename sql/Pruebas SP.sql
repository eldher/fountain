

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO





--select max(fecha) as fecha from LiquidacionFountain where version = 'Preliminar' group by fecha_mes, fecha_carga, version
USE FOUNTAIN9

select max(fecha), fecha_mes, fecha_carga, version 
from LiquidacionFountain
where version = 'Preliminar'
group by fecha_mes, fecha_carga, version 


-- Preliminares
EXECUTE [dbo].[sp_EjecutarCierre_Preliminar]
EXECUTE [dbo].[sp_ObtenerContratoCategoriaConTotal_Preliminar] 




EXECUTE [dbo].[insertarContratos2_INSERT_INTO_CONTRATOS]
EXECUTE [dbo].[sp_EjecutarCierre] N'2022-07-31'
EXECUTE [dbo].[sp_EjecutarCierre_Preliminar] N'2022-10-30'
EXECUTE [dbo].[sp_ObtenerContratoCategoria] N'2022-05-31'

EXECUTE [dbo].[sp_ObtenerContratoCategoriaConTotal] N'2022-04-30'



EXECUTE [dbo].[sp_ObtenerContratos]
EXECUTE [dbo].[sp_ObtenerContratosPorFecha] N'2022-04-30'
EXECUTE [dbo].[sp_EnergyBalance]

EXEC [dbo].[sp_Dashboard] @anio=2022, @mes=10;

EXECUTE [dbo].[sp_EnergyBalancePorFecha]  N'2022'



exec sp_executesql @statement=N'SET LANGUAGE Spanish; select '''' as fecha, '''' as mes, '''' as anio  UNION ALL select distinct cast(fecha as varchar) as fecha ,DATENAME(MONTH, fecha) as mes ,cast(YEAR(fecha) as varchar) as anio from INGRESOS_CONTRATOS'

use fountain5
select distinct * from [dbo].[tipo_precio]


select * from [dbo].[TotalesContratos]


select  DISTINCT categoria_precio  from tipo_precio


SET LANGUAGE Spanish; 
select '' as fecha, '' as mes, '' as anio 
UNION ALL
select distinct cast(fecha as varchar) as fecha ,DATENAME(MONTH, fecha) as mes ,cast(YEAR(fecha) as varchar) as anio from INGRESOS_CONTRATOS





SET LANGUAGE Spanish; 
select '' as fecha, '' as mes, '' as anio  
UNION ALL select distinct cast(fecha as varchar) as fecha ,DATENAME(MONTH, fecha) as mes ,cast(YEAR(fecha) as varchar) as anio from INGRESOS_CONTRATOS



exec sp_executesql @statement=N'SET LANGUAGE Spanish; select '''' as fecha, '''' as mes, '''' as anio  UNION ALL select distinct cast(fecha as varchar) as fecha ,DATENAME(MONTH, fecha) as mes ,cast(YEAR(fecha) as varchar) as anio from INGRESOS_CONTRATOS'


select * from [dbo].[tipo_precio]




select max(id) + 1 as next_id

SELECT * from CONTRATOS


select DISTINCT categoria_precio  from tipo_precio


--select * from [dbo].[TotalesContratos2]


--USE FOUNTAIN5

select * from [dbo].[TotalesContratos]
select * from [dbo].[TotalEnergia]
select * from [dbo].[preliminar_fountain_dia]


delete from CONTRATOS where nombre_contrato like '%TEST%'

delete from tipo_precio where categoria_precio like '%TEST%'


SELECT * from CONTRATOS where nombre_contrato like '%TEST%'


select distinct anio from tb1

select * from tb1

select distinct YEAR(fecha) as anio , MONTH(fecha) as mes from LiquidacionFountain