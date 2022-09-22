/****** Object:  StoredProcedure [dbo].[sp_ObtenerContratoCategoriaConTotal]    Script Date: 9/22/2022 6:12:42 PM ******/
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


-------------------- Corto Plazo I

--declare @fecha date;
--set @fecha = '2022-04-30'


drop table if exists #corto_plazo_1;

select  
cast(fecha as nvarchar) as fecha, 
EMPRESA, nombre_contrato, categoria_precio, precio_base_usd_mwh, cargo_transmicion_seguimiento_electrico, precio,
potencia_contratada , dmm_s, energia, EAR, 
ingreso_precio_contado
into #corto_plazo_1
from INGRESOS_CONTRATOS
where lower(categoria_precio) in  ('energia corto plazo i', 'energía corto plazo i')
and ingreso_precio_contado IS NOT NULL
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
		,precio_base_usd_mwh = max(precio_base_usd_mwh)
		,cargo_transmicion_seguimiento_electrico = max(cargo_transmicion_seguimiento_electrico)
		,precio = max(precio)
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
select cast(fecha as nvarchar) as fecha, 
EMPRESA, nombre_contrato, categoria_precio, precio_base_usd_mwh, cargo_transmicion_seguimiento_electrico, precio,
potencia_contratada , dmm_s, energia, EAR, 
ingreso_precio_contado
into #corto_plazo_2
from INGRESOS_CONTRATOS
where lower(categoria_precio) in  ('energia corto plazo ii', 'energía corto plazo ii')
and ingreso_precio_contado IS NOT NULL
and fecha = @fecha;


select @CONT = count(*) from #corto_plazo_2;


IF @CONT > 0
BEGIN 
	insert into #corto_plazo_2
	select 
	fecha = ''
	,empresa = ''
	,nombre_contrato = ''
	,categoria_precio = ''
	,precio_base_usd_mwh = max(precio_base_usd_mwh)
	,cargo_transmicion_seguimiento_electrico = max(cargo_transmicion_seguimiento_electrico)
	,precio = max(precio)
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
select cast(fecha as nvarchar) as fecha, 
EMPRESA, nombre_contrato, categoria_precio, precio_base_usd_mwh, cargo_transmicion_seguimiento_electrico, precio,
potencia_contratada , dmm_s, energia, EAR, 
ingreso_precio_contado
into #largo_plazo
from INGRESOS_CONTRATOS
where lower(categoria_precio) in  ('energia largo plazo')
and ingreso_precio_contado IS NOT NULL
and fecha = @fecha;


select @CONT = count(*) from #largo_plazo;


IF @CONT > 0
BEGIN 
	insert into #largo_plazo
	select 
	fecha = ''
	,empresa = ''
	,nombre_contrato = ''
	,categoria_precio = ''
	,precio_base_usd_mwh = max(precio_base_usd_mwh)
	,cargo_transmicion_seguimiento_electrico = max(cargo_transmicion_seguimiento_electrico)
	,precio = max(precio)
	,potencia_contratada = SUM(potencia_contratada)
	,dmm_s = SUM(dmm_s)
	,energia = SUM(energia)
	,EAR = SUM(EAR)
	,ingreso_precio_contado = SUM(ingreso_precio_contado)
	from #largo_plazo
END


-------------------- Potencia I

BEGIN
	select @CONT = 0;

	drop table if exists #potencia_1;

	select cast(fecha as nvarchar) as fecha, 
	EMPRESA, nombre_contrato, categoria_precio, precio_base_usd_mwh, cargo_transmicion_seguimiento_electrico, precio,
	potencia_contratada 
	,ingreso_precio_contado
	into #potencia_1
	from INGRESOS_CONTRATOS
	where categoria_precio = 'Potencia I'
	and ingreso_precio_contado IS NOT NULL
	and fecha = @fecha;


	select @CONT = count(*) from #potencia_1;

	--select @CONT

	IF @CONT > 0
	BEGIN
		insert into #potencia_1 (fecha, empresa, nombre_contrato, categoria_precio, precio_base_usd_mwh, cargo_transmicion_seguimiento_electrico, precio, potencia_contratada, ingreso_precio_contado)
		select 
		fecha = ''
		,empresa = ''
		,nombre_contrato = ''
		,categoria_precio = ''
		,precio_base_usd_mwh = max(precio_base_usd_mwh)
		,cargo_transmicion_seguimiento_electrico = max(cargo_transmicion_seguimiento_electrico)
		,precio = max(precio)
		,potencia_contratada = SUM(potencia_contratada)
		,ingreso_precio_contado = SUM(ingreso_precio_contado)
		from #potencia_1;
	END

END





-------------------- Potencia II
select @CONT = 0;

drop table if exists #potencia_2;

select cast(fecha as nvarchar) as fecha, 
EMPRESA, nombre_contrato, categoria_precio, precio_base_usd_mwh, cargo_transmicion_seguimiento_electrico, precio,
potencia_contratada
,ingreso_precio_contado
into #potencia_2
from INGRESOS_CONTRATOS
where categoria_precio = 'Potencia II'
and ingreso_precio_contado IS NOT NULL
and fecha = @fecha;


select @CONT = count(*) from #potencia_2;


IF @CONT > 0
BEGIN 
	insert into #potencia_2 (fecha, empresa, nombre_contrato, categoria_precio, precio_base_usd_mwh, cargo_transmicion_seguimiento_electrico, precio, potencia_contratada, ingreso_precio_contado)
	select 
	fecha = ''
	,empresa = ''
	,nombre_contrato = ''
	,categoria_precio = ''
	,precio_base_usd_mwh = max(precio_base_usd_mwh)
	,cargo_transmicion_seguimiento_electrico = max(cargo_transmicion_seguimiento_electrico)
	,precio = max(precio)
	,potencia_contratada = SUM(potencia_contratada)
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



END;




GO


