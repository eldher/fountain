
-- Definicion de los datos
-- exec sp_help [GeneracionObligada]

-- SETUP:
-- agregar fecha a la tabla

--ALTER TABLE [dbo].[GeneracionObligada]
--ADD fecha_carga datetime

--USE FOUNTAIN5	
--GO	
	



CREATE PROCEDURE insertarGeneracionObligada

@fecha date  = NULL,
@hora tinyint  = NULL,
@subsistema nvarchar(100)  = NULL,
@unidad_obligada nvarchar(100)  = NULL,
@energia_mw float  = NULL,
@sobre_costo_real float  = NULL,
@agente_responsable nvarchar(100)  = NULL,
@agente nvarchar(100)  = NULL,
@fecha_mes nvarchar(100)  = NULL,
@version nvarchar(100)  = NULL,
@fecha_carga datetime  = NULL

AS
BEGIN

INSERT INTO [dbo].[GeneracionObligada]
(
[fecha]
,[hora]
,[subsistema]
,[unidad_obligada]
,[energia_mw]
,[sobre_costo_real]
,[agente_responsable]
,[agente]
,[fecha_mes]
,[version]
,[fecha_carga]
)
VALUES
(
@fecha
,@hora
,@subsistema
,@unidad_obligada
,@energia_mw
,@sobre_costo_real
,@agente_responsable
,@agente
,@fecha_mes
,@version
,@fecha_carga
)

END
GO

-- select *from [dbo].GeneracionObligada

-- delete from  [dbo].GeneracionObligada where fecha_carga = '2022-09-12 19:28:09.000'
