	

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Eldher
-- =============================================
CREATE PROCEDURE [dbo].[sp_ObtenerContratoCategoria]
	@fecha date
AS
BEGIN

EXEC ('USE [FOUNTAIN5];')



--DECLARE @categoria_precio as varchar(50);
--SET @categoria_precio = 'Potencia II'

--DECLARE @fecha as date;
--SET @fecha = '2021-12-31'



select fecha, EMPRESA, nombre_contrato, categoria_precio, potencia_contratada , dmm_s, energia, EAR, 
iif(categoria_precio like '%Potencia%', ingreso_precio_contado*1000, ingreso_precio_contado) as ingreso_precio_contado
from INGRESOS_CONTRATOS
where categoria_precio = 'Energia Corto Plazo I'
and fecha = @fecha

select fecha, EMPRESA, nombre_contrato, categoria_precio, potencia_contratada , dmm_s, energia, EAR, 
iif(categoria_precio like '%Potencia%', ingreso_precio_contado*1000, ingreso_precio_contado) as ingreso_precio_contado
from INGRESOS_CONTRATOS
where categoria_precio = 'Energia Corto Plazo II'
and fecha = @fecha


select fecha, EMPRESA, nombre_contrato, categoria_precio, potencia_contratada , dmm_s, energia, EAR, 
iif(categoria_precio like '%Potencia%', ingreso_precio_contado*1000, ingreso_precio_contado) as ingreso_precio_contado
from INGRESOS_CONTRATOS
where categoria_precio = 'Energia Largo Plazo'
and fecha = @fecha

select fecha, EMPRESA, nombre_contrato, categoria_precio, potencia_contratada , dmm_s, energia, EAR, 
iif(categoria_precio like '%Potencia%', ingreso_precio_contado*1000, ingreso_precio_contado) as ingreso_precio_contado
from INGRESOS_CONTRATOS
where categoria_precio = 'Potencia I'
and fecha = @fecha

select fecha, EMPRESA, nombre_contrato, categoria_precio, potencia_contratada , dmm_s, energia, EAR, 
iif(categoria_precio like '%Potencia%', ingreso_precio_contado*1000, ingreso_precio_contado) as ingreso_precio_contado
from INGRESOS_CONTRATOS
where categoria_precio = 'Potencia II'
and fecha = @fecha



END;