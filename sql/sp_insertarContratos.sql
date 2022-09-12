
-- SETUP:
-- agregar fecha a la tabla

--ALTER TABLE [dbo].[TotalesContratos]
--ADD fecha_carga datetime



--USE FOUNTAIN5
--GO


aLTER PROCEDURE insertarContratos

@Distribuidores nvarchar(50)  = NULL,
@dmg float  = NULL,
@dmg_s float  = NULL,
@dmm_s float  = NULL,
@fecha datetime2  = NULL,
@fecha_carga datetime  = NULL

AS
BEGIN

INSERT INTO [dbo].[TotalesContratos]
(
[Distribuidores]
,[dmg]
,[dmg_s]
,[dmm_s]
,[fecha]
,[fecha_carga]
)
VALUES
(
@Distribuidores
,@dmg
,@dmg_s
,@dmm_s
,@fecha
,@fecha_carga
)

END
GO

-- select * from [dbo].[TotalesContratos]


--delete from  [dbo].[TotalesContratos] where fecha_carga = '2022-09-12 19:28:09.000'