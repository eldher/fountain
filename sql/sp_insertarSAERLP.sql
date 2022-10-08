--/****** Object:  Table [dbo].[ValoresNegativos]    Script Date: 10/8/2022 1:26:43 PM ******/
--SET ANSI_NULLS ON
--GO

--SET QUOTED_IDENTIFIER ON
--GO

--CREATE TABLE [dbo].SAERLP(
--fecha date   NULL,
--DEUDORES nvarchar(100)   NULL,
--ACP float   NULL,
--ACPGEN float   NULL,
--AES float   NULL,
--ALTOVALLE float   NULL,
--CALDERA float   NULL,
--CELSIACENT float   NULL,
--CELSIABLM float   NULL,
--CELSIABON float   NULL,
--DESHIDCORP float   NULL,
--EISA float   NULL,
--ENERGYST float   NULL,
--ESEPSA float   NULL,
--FORTUNA float   NULL,
--FOUNTAIN float   NULL,
--GENA float   NULL,
--GENISA float   NULL,
--GENPED float   NULL,
--HBOQUERON float   NULL,
--HBTOTUMA float   NULL,
--HIBERICA float   NULL,
--HIDRO float   NULL,
--HTERIBE float   NULL,
--IDEALPMA float   NULL,
--JINRO float   NULL,
--P_ANCHO float   NULL,
--PANAM float   NULL,
--PEDREGAL float   NULL,
--RCHICO float   NULL,
--SFRAN float   NULL,
--version varchar(20) NULL,
--fecha_mes varchar(20) NULL,
--fecha_carga datetime NULL
--)


USE FOUNTAIN5
GO

ALTER PROCEDURE insertarSAERLP

@fecha date  = NULL,
@DEUDORES nvarchar(100)  = NULL,
@ACP float  = NULL,
@ACPGEN float  = NULL,
@AES float  = NULL,
@ALTOVALLE float  = NULL,
@CALDERA float  = NULL,
@CELSIACENT float  = NULL,
@CELSIABLM float  = NULL,
@CELSIABON float  = NULL,
@DESHIDCORP float  = NULL,
@EISA float  = NULL,
@ENERGYST float  = NULL,
@ESEPSA float  = NULL,
@FORTUNA float  = NULL,
@FOUNTAIN float  = NULL,
@GENA float  = NULL,
@GENISA float  = NULL,
@GENPED float  = NULL,
@HBOQUERON float  = NULL,
@HBTOTUMA float  = NULL,
@HIBERICA float  = NULL,
@HIDRO float  = NULL,
@HTERIBE float  = NULL,
@IDEALPMA float  = NULL,
@JINRO float  = NULL,
@P_ANCHO float  = NULL,
@PANAM float  = NULL,
@PEDREGAL float  = NULL,
@RCHICO float  = NULL,
@SFRAN float  = NULL,
@version varchar(20)  = NULL,
@fecha_mes varchar(20)  = NULL,
@fecha_carga datetime  = NULL


AS
BEGIN

INSERT INTO [dbo].[SAERLP]
(
[fecha]
,[DEUDORES]
,[ACP]
,[ACPGEN]
,[AES]
,[ALTOVALLE]
,[CALDERA]
,[CELSIACENT]
,[CELSIABLM]
,[CELSIABON]
,[DESHIDCORP]
,[EISA]
,[ENERGYST]
,[ESEPSA]
,[FORTUNA]
,[FOUNTAIN]
,[GENA]
,[GENISA]
,[GENPED]
,[HBOQUERON]
,[HBTOTUMA]
,[HIBERICA]
,[HIDRO]
,[HTERIBE]
,[IDEALPMA]
,[JINRO]
,[P_ANCHO]
,[PANAM]
,[PEDREGAL]
,[RCHICO]
,[SFRAN]
,[version]
,[fecha_mes]
,[fecha_carga]
)
VALUES
(
EOMONTH(@fecha)
,@DEUDORES
,@ACP
,@ACPGEN
,@AES
,@ALTOVALLE
,@CALDERA
,@CELSIACENT
,@CELSIABLM
,@CELSIABON
,@DESHIDCORP
,@EISA
,@ENERGYST
,@ESEPSA
,@FORTUNA
,@FOUNTAIN
,@GENA
,@GENISA
,@GENPED
,@HBOQUERON
,@HBTOTUMA
,@HIBERICA
,@HIDRO
,@HTERIBE
,@IDEALPMA
,@JINRO
,@P_ANCHO
,@PANAM
,@PEDREGAL
,@RCHICO
,@SFRAN
,@version
,@fecha_mes
,@fecha_carga
)

END
GO

-- select *from [dbo].SAERLP

-- delete from  [dbo].SAERLP where fecha_carga = '2022-09-12 19:28:09.000'
