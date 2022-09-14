
-- Definicion de los datos
-- exec sp_help [BalancesPotencia]

-- SETUP:
-- agregar fecha a la tabla

--ALTER TABLE [dbo].[BalancesPotencia]
--ADD fecha_carga datetime

--USE FOUNTAIN5	
--GO	
	
	
ALTER PROCEDURE insertarBalancesPotencia

@fecha date  = NULL,
@codigo_de_empresa nvarchar(100)  = NULL,
@nombre_de_la_oferta nvarchar(100)  = NULL,
@oferta_en_usdkw_mes float  = NULL,
@disponible_mw float  = NULL,
@colocado_mw float  = NULL,
@faltante_mw float  = NULL,
@precio_del_mw_usd float  = NULL,
@credito_en_usd float  = NULL,
@fecha_mes nvarchar(100)  = NULL,
@version nvarchar(100)  = NULL,
@fecha_carga datetime  = NULL

AS
BEGIN

INSERT INTO [dbo].[BalancesPotencia]
(
[fecha]
,[codigo_de_empresa]
,[nombre_de_la_oferta]
,[oferta_en_usdkw_mes]
,[disponible_mw]
,[colocado_mw]
,[faltante_mw]
,[precio_del_mw_usd]
,[credito_en_usd]
,[fecha_mes]
,[version]
,[fecha_carga]
)
VALUES
(
@fecha
,@codigo_de_empresa
,@nombre_de_la_oferta
,@oferta_en_usdkw_mes
,@disponible_mw
,@colocado_mw
,@faltante_mw
,@precio_del_mw_usd
,@credito_en_usd
,@fecha_mes
,@version
,@fecha_carga
)

END
GO

	
-- select *from [dbo].BalancesPotencia	
	
-- delete from  [dbo].BalancesPotencia where fecha_carga = '2022-09-12 19:28:09.000'	



--select * from [dbo].BalancesPotencia	order by fecha_carga

--select distinct * 
--into BalancesPotenciaBackup
--from [dbo].BalancesPotencia	
 