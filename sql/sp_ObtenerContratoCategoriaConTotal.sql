	

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Eldher
-- =============================================
ALTER PROCEDURE [dbo].[sp_ObtenerContratoCategoriaConTotal]
	@fecha date
AS
BEGIN


DECLARE @CONT INT;
SET @CONT = 0;

BEGIN tran
-------------------- Corto Plazo I


drop table if exists #corto_plazo_1;

select  
cast(fecha as nvarchar) as fecha, 
EMPRESA, nombre_contrato, categoria_precio, potencia_contratada , dmm_s, energia, EAR, 
iif(categoria_precio like '%Potencia%', ingreso_precio_contado*1000, ingreso_precio_contado) as ingreso_precio_contado
into #corto_plazo_1
from INGRESOS_CONTRATOS
where categoria_precio = 'Energia Corto Plazo I'
and fecha = @fecha;


select @CONT = count(*) 
from #corto_plazo_1;

IF @CONT > 0
	BEGIN
		insert into #corto_plazo_1
		select 
		fecha = ''
		,empresa = ''
		,nombre_contrato = ''
		,categoria_precio = ''
		,potencia_contratada = SUM(potencia_contratada)
		,dmm_s = SUM(dmm_s)
		,energia = SUM(energia)
		,EAR = SUM(EAR)
		,ingreso_precio_contado = SUM(ingreso_precio_contado)
		from #corto_plazo_1
	END	



-------------------- Corto Plazo 2
select @CONT = 0;

drop table if exists #corto_plazo_2
select cast(fecha as nvarchar) as fecha, EMPRESA, nombre_contrato, categoria_precio, potencia_contratada , dmm_s, energia, EAR, 
iif(categoria_precio like '%Potencia%', ingreso_precio_contado*1000, ingreso_precio_contado) as ingreso_precio_contado
into #corto_plazo_2
from INGRESOS_CONTRATOS
where categoria_precio = 'Energia Corto Plazo II'
and fecha = @fecha


select @CONT = count(*) from #corto_plazo_2;


IF @CONT > 0
BEGIN 
	insert into #corto_plazo_2
	select 
	fecha = ''
	,empresa = ''
	,nombre_contrato = ''
	,categoria_precio = ''
	,potencia_contratada = SUM(potencia_contratada)
	,dmm_s = SUM(dmm_s)
	,energia = SUM(energia)
	,EAR = SUM(EAR)
	,ingreso_precio_contado = SUM(ingreso_precio_contado)
	from #corto_plazo_2;
END





-------------------- Largo Plazo
select @CONT = 0;

drop table if exists #largo_plazo;
select cast(fecha as nvarchar) as fecha, EMPRESA, nombre_contrato, categoria_precio, potencia_contratada , dmm_s, energia, EAR, 
iif(categoria_precio like '%Potencia%', ingreso_precio_contado*1000, ingreso_precio_contado) as ingreso_precio_contado
into #largo_plazo
from INGRESOS_CONTRATOS
where categoria_precio = 'Energia Largo Plazo'
and fecha = @fecha


select @CONT = count(*) from #largo_plazo;


IF @CONT > 0
BEGIN 
	insert into #largo_plazo
	select 
	fecha = ''
	,empresa = ''
	,nombre_contrato = ''
	,categoria_precio = ''
	,potencia_contratada = SUM(potencia_contratada)
	,dmm_s = SUM(dmm_s)
	,energia = SUM(energia)
	,EAR = SUM(EAR)
	,ingreso_precio_contado = SUM(ingreso_precio_contado)
	from #largo_plazo
END


-------------------- Potencia I
select @CONT = 0;

drop table if exists #potencia_1;

select cast(fecha as nvarchar) as fecha, EMPRESA, nombre_contrato, categoria_precio, potencia_contratada , dmm_s, energia, EAR, 
iif(categoria_precio like '%Potencia%', ingreso_precio_contado*1000, ingreso_precio_contado) as ingreso_precio_contado
into #potencia_1
from INGRESOS_CONTRATOS
where categoria_precio = 'Potencia I'
and fecha = @fecha


select @CONT = count(*) from #potencia_1;


IF @CONT > 0
BEGIN 
	insert into #potencia_1
	select 
	fecha = ''
	,empresa = ''
	,nombre_contrato = ''
	,categoria_precio = ''
	,potencia_contratada = SUM(potencia_contratada)
	,dmm_s = SUM(dmm_s)
	,energia = SUM(energia)
	,EAR = SUM(EAR)
	,ingreso_precio_contado = SUM(ingreso_precio_contado)
	from #potencia_1;
END






-------------------- Potencia II
select @CONT = 0;

drop table if exists #potencia_2;

select cast(fecha as nvarchar) as fecha, EMPRESA, nombre_contrato, categoria_precio, potencia_contratada , dmm_s, energia, EAR, 
iif(categoria_precio like '%Potencia%', ingreso_precio_contado*1000, ingreso_precio_contado) as ingreso_precio_contado
into #potencia_2
from INGRESOS_CONTRATOS
where categoria_precio = 'Potencia II'
and fecha = @fecha;


select @CONT = count(*) from #potencia_2;


IF @CONT > 0
BEGIN 
	insert into #potencia_2
	select 
	fecha = ''
	,empresa = ''
	,nombre_contrato = ''
	,categoria_precio = ''
	,potencia_contratada = SUM(potencia_contratada)
	,dmm_s = SUM(dmm_s)
	,energia = SUM(energia)
	,EAR = SUM(EAR)
	,ingreso_precio_contado = SUM(ingreso_precio_contado)
	from #potencia_2;
END







select * from #corto_plazo_1 order by empresa desc ;
select * from #corto_plazo_2 order by empresa desc ;
select * from #largo_plazo order by empresa desc ;
select * from #potencia_1 order by empresa desc ;
select * from #potencia_2 order by empresa desc ;


drop table #corto_plazo_1;
drop table #corto_plazo_2;
drop table #largo_plazo;
drop table #potencia_1;
drop table #potencia_2;

COMMIT tran;

END;

