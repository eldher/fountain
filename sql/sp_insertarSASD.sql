--/****** Object:  Table [dbo].[ValoresNegativos]    Script Date: 10/8/2022 1:26:43 PM ******/
--SET ANSI_NULLS ON
--GO

--SET QUOTED_IDENTIFIER ON
--GO

--CREATE TABLE [dbo].SASD(
--fecha date NULL,
--AGENTE_DEUDOR nvarchar(100) NULL,
--ACP float NULL,
--ACPGEN float NULL,
--AES float NULL,
--CELSIACENT float NULL,
--CELSIABLM float NULL,
--EGESA float NULL,
--ENERGYST float NULL,
--ESEPSA float NULL,
--GANA float NULL,
--GENA float NULL,
--JINRO float NULL,
--KANAN float NULL,
--PANAM float NULL,
--PEDREGAL float NULL,
--SPARKLEPW float NULL,
--TOTAL float NULL
--fecha_mes
--version 
--fecha_carga

--) ON [PRIMARY]
--GO

--alter table SASD
--add version varchar(20), fecha_mes varchar(20)
alter table SASD
add fecha_carga datetime
--USE FOUNTAIN5
--GO


ALTER PROCEDURE insertarSASD

@fecha date  = NULL,
@AGENTE_DEUDOR nvarchar(100)  = NULL,
@ACP float  = NULL,
@ACPGEN float  = NULL,
@AES float  = NULL,
@CELSIACENT float  = NULL,
@CELSIABLM float  = NULL,
@EGESA float  = NULL,
@ENERGYST float  = NULL,
@ESEPSA float  = NULL,
@GANA float  = NULL,
@GENA float  = NULL,
@JINRO float  = NULL,
@KANAN float  = NULL,
@PANAM float  = NULL,
@PEDREGAL float  = NULL,
@SPARKLEPW float  = NULL,
@TOTAL float  = NULL,
@version varchar(20)  = NULL,
@fecha_mes varchar(20)  = NULL,
@fecha_carga datetime  = NULL

AS
BEGIN

INSERT INTO [dbo].[SASD]
(
[fecha]
,[AGENTE_DEUDOR]
,[ACP]
,[ACPGEN]
,[AES]
,[CELSIACENT]
,[CELSIABLM]
,[EGESA]
,[ENERGYST]
,[ESEPSA]
,[GANA]
,[GENA]
,[JINRO]
,[KANAN]
,[PANAM]
,[PEDREGAL]
,[SPARKLEPW]
,[TOTAL]
,[version]
,[fecha_mes]
,[fecha_carga]
)
VALUES
(
EOMONTH(@fecha) 
,@AGENTE_DEUDOR
,@ACP
,@ACPGEN
,@AES
,@CELSIACENT
,@CELSIABLM
,@EGESA
,@ENERGYST
,@ESEPSA
,@GANA
,@GENA
,@JINRO
,@KANAN
,@PANAM
,@PEDREGAL
,@SPARKLEPW
,@TOTAL
,@version
,@fecha_mes
,@fecha_carga
)

END
GO

-- select *from [dbo].SASD

-- delete from  [dbo].SASD where fecha_carga = '2022-09-12 19:28:09.000'

