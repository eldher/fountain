
-- Definicion de los datos
-- exec sp_help [ServiciosAuxiliares]

-- SETUP:
-- agregar fecha a la tabla

--ALTER TABLE [dbo].[ServiciosAuxiliares]
--ADD fecha_carga datetime

--USE FOUNTAIN5	
--GO	
	


CREATE PROCEDURE insertarServiciosAuxiliares

@empresas_acreedoras nvarchar(100)  = NULL,
@secundaria_mw float  = NULL,
@operativa_mw float  = NULL,
@secundaria_usd float  = NULL,
@operativa_usd float  = NULL,
@total_usd float  = NULL,
@fecha_mes nvarchar(100)  = NULL,
@version nvarchar(100)  = NULL,
@fecha_carga datetime  = NULL

AS
BEGIN

INSERT INTO [dbo].[ServiciosAuxiliares]
(
[empresas_acreedoras]
,[secundaria_mw]
,[operativa_mw]
,[secundaria_usd]
,[operativa_usd]
,[total_usd]
,[fecha_mes]
,[version]
,[fecha_carga]
)
VALUES
(
@empresas_acreedoras
,@secundaria_mw
,@operativa_mw
,@secundaria_usd
,@operativa_usd
,@total_usd
,@fecha_mes
,@version
,@fecha_carga
)

END
GO

-- select *from [dbo].ServiciosAuxiliares

-- delete from  [dbo].ServiciosAuxiliares where fecha_carga is not NULL
