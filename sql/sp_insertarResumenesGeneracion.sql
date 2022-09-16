


-- Definicion de los datos
-- exec sp_help [resumenes_generacion]

-- SETUP:
-- agregar fecha a la tabla

--ALTER TABLE [dbo].[resumenes_generacion]
--ADD fecha_carga datetime

--USE FOUNTAIN5	
--GO	


CREATE PROCEDURE insertarResumenesGeneracion

@fecha date  = NULL,
@LAP_GB_G1 float  = NULL,
@LAP_GB_G2 float  = NULL,
@LAP_GB_G3 float  = NULL,
@LAP_GB_G4 float  = NULL,
@LAP_BRUTA_TOTAL float  = NULL,
@LAP_CONSUMO_TOTAL float  = NULL,
@LAP_NETA_TOTAL float  = NULL,
@spacer1 nvarchar  = NULL,
@SAL_GB_G1 float  = NULL,
@SAL_GB_G2 float  = NULL,
@SAL_GB_G3 float  = NULL,
@SAL_BRUTA_TOTAL float  = NULL,
@SAL_CONSUMO_TOTAL float  = NULL,
@SAL_NETA_TOTAL float  = NULL,
@DAILY_NET float  = NULL,
@fecha_cierre date  = NULL,
@fecha_carga datetime  = NULL



AS
BEGIN

INSERT INTO [dbo].[resumenes_generacion]
(
[fecha]
,[LAP_GB_G1]
,[LAP_GB_G2]
,[LAP_GB_G3]
,[LAP_GB_G4]
,[LAP_BRUTA_TOTAL]
,[LAP_CONSUMO_TOTAL]
,[LAP_NETA_TOTAL]
,[spacer1]
,[SAL_GB_G1]
,[SAL_GB_G2]
,[SAL_GB_G3]
,[SAL_BRUTA_TOTAL]
,[SAL_CONSUMO_TOTAL]
,[SAL_NETA_TOTAL]
,[DAILY_NET]
,[fecha_cierre]
,[fecha_carga]
)
VALUES
(
@fecha
,@LAP_GB_G1
,@LAP_GB_G2
,@LAP_GB_G3
,@LAP_GB_G4
,@LAP_BRUTA_TOTAL
,@LAP_CONSUMO_TOTAL
,@LAP_NETA_TOTAL
,@spacer1
,@SAL_GB_G1
,@SAL_GB_G2
,@SAL_GB_G3
,@SAL_BRUTA_TOTAL
,@SAL_CONSUMO_TOTAL
,@SAL_NETA_TOTAL
,@DAILY_NET
,@fecha_cierre
,@fecha_carga
)

END
GO
use FOUNTAIN5


select fecha_carga, fecha, fecha_cierre , * from [dbo].resumenes_generacion order by 1,2

-- delete from  [dbo].resumenes_generacion where fecha_carga = '2022-09-12 19:28:09.000'
