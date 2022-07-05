USE [FOUNTAIN5]
GO

/****** Object:  StoredProcedure [dbo].[sp_ObtenerContratos]    Script Date: 6/27/2022 3:40:27 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO




-- =============================================
-- Author:		Eldher
-- =============================================
CREATE PROCEDURE [dbo].[sp_ObtenerContratos]
AS
BEGIN


select 
cast(fecha as varchar) as fecha,
nombre_contrato, empresa, 
potencia_contratada, 
categoria_precio, 
format(precio_base_usd_mwh, '#,0.00') as precio_base_usd_mwh,
format(cargo_transmicion_seguimiento_electrico, '#,0.00') as cargo_transmicion_seguimiento_electrico,
format(precio, '#,0.00') as precio,
format(dmg, '#,0.00') as dmg,
format(dmg_s, '#,0.00') as dmg_s,
format(dmm_s, '#,0.00') as dmm_s,
format(energia, '#,0.00') as energia,
format(EAR, '#,0.00') as EAR,
format(ingreso_precio_contado, 'c', 'en-US') as ingreso_precio_contado
from [dbo].[INGRESOS_CONTRATOS]


END
GO



