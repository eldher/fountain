-- Definicion de los datos
-- exec sp_help TotalesContratos2

-- SETUP:
-- agregar fecha a la tabla

--ALTER TABLE [dbo].[TotalesContratos2]
--ADD fecha_carga datetime



--USE FOUNTAIN5
--GO


CREATE PROCEDURE insertarContratos2

@fecha date  = NULL,
@hora tinyint  = NULL,
@nombre_contrato nvarchar  = NULL,
@tipo_contrato nvarchar  = NULL,
@consumo tinyint  = NULL,
@suplido float  = NULL,
@potencia_contratada float  = NULL,
@mwh_contrato float  = NULL,
@empresa varchar(20)  = NULL,
@fecha_carga datetime  = NULL


AS
BEGIN

INSERT INTO [dbo].[TotalesContratos2]
(
[fecha]
,[hora]
,[nombre_contrato]
,[tipo_contrato]
,[consumo]
,[suplido]
,[potencia_contratada]
,[mwh_contrato]
,[empresa]
,[fecha_carga]
)
VALUES
(
@fecha
,@hora
,@nombre_contrato
,@tipo_contrato
,@consumo
,@suplido
,@potencia_contratada
,@mwh_contrato
,@empresa
,@fecha_carga
)

END
GO

-- select *from [dbo].TotalesContratos2 order by fecha

-- delete from  [dbo].TotalesContratos2 where fecha_carga = '2022-09-12 19:28:09.000'

-- delete from  [dbo].TotalesContratos2 where  cast(fecha_carga as date) = '2022-09-12'

-- delete from  [dbo].TotalesContratos2 where  cast(fecha as date) > '2022-03-31'


--select *from [dbo].TotalesContratos2 where cast(fecha_carga as date) = '2022-09-12' order by 1