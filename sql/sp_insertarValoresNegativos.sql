--USE FOUNTAIN5
--GO


ALTER PROCEDURE insertarValoresNegativos

@fecha date  = NULL,
@sasd float  = NULL,
@generacion_obligada float  = NULL,
@servicios_auxiliares float  = NULL,
@compensacion_de_potencia float  = NULL


AS
BEGIN

INSERT INTO [dbo].[ValoresNegativos]
(
[fecha]
,[sasd]
,[generacion_obligada]
,[servicios_auxiliares]
,[compensacion_de_potencia]
)
VALUES
(
@fecha
,@sasd
,@generacion_obligada
,@servicios_auxiliares
,@compensacion_de_potencia
)




END
GO

-- select *from [dbo].ValoresNegativos

-- delete from  [dbo].ValoresNegativos where fecha_carga = '2022-09-12 19:28:09.000'
