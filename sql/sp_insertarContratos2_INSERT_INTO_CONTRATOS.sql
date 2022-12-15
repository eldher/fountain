/****** Object:  StoredProcedure [dbo].[insertarContratos2_INSERT_INTO_CONTRATOS]    Script Date: 12/5/2022 2:31:49 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



--------------------------------------------------------------------------
-- CONTRATOS                      INSERCION EN LA TABLA
------------------------------------------------------------------------
/* Se verifica que el contrato no exista ya en la tabla de contratos, por fecha, nombre, empresa y potencia_contratada 
 si el b.id es NULL entonces se debe insertar con el id
 */


--drop table if exists CONTRATOS;
-- actualizar EMPRESA DISTRIBUIDORA


ALTER PROCEDURE [dbo].[insertarContratos2_INSERT_INTO_CONTRATOS] AS


BEGIN

--------------------------------------------------------------------------------
-- Selecciona la maxima fecha de los totales por contratos2
--------------------------------------------------------------------------------
drop table if exists #date_log
select * 
into #date_log
from (

select eomonth(fecha) as fecha, fecha_carga, ROW_NUMBER() OVER(PARTITION BY eomonth(fecha) ORDER BY fecha_carga DESC) as nr
from [TotalesContratos2]

) x where x.nr = 1

  --select * from #date_log

delete from [TotalesContratos2] where fecha_carga not in (select fecha_carga from #date_log)

--------------------------------------------------------------------------------
-- Selecciona la maxima fecha de los totales por contratos
--------------------------------------------------------------------------------
drop table if exists #date_log2

select * 
into #date_log2
from (

select eomonth(fecha) as fecha, fecha_carga, ROW_NUMBER() OVER(PARTITION BY eomonth(fecha) ORDER BY fecha_carga DESC) as nr
from [TotalesContratos]

) x where x.nr = 1

  --select * from #date_log

delete from [TotalesContratos] where fecha_carga not in (select fecha_carga from #date_log2)



-----------------------------------------------------------------------------------
-----------------------------------------------------------------------------------


update TotalesContratos2
set empresa =  
case 
when nombre_contrato LIKE '%ELEKTRA%' then 'ENSA'
when nombre_contrato LIKE '%ENSA%' then 'ENSA'
when nombre_contrato LIKE '%EDEMET%' then 'EDEMET'
when nombre_contrato LIKE '%EDECHI%' then 'EDECHI'
end;



--- Insertar CONTRATOS que no Existen 

INSERT INTO CONTRATOS

select distinct 
EOMONTH(a.fecha) as fecha
,trim(a.nombre_contrato) as  nombre_contrato
,trim(a.empresa) as  empresa
,a.potencia_contratada
,b.id
--into CONTRATOS
from TotalesContratos2 a 
left join CONTRATOS b on 
	EOMONTH(a.fecha) = b.fecha and 
	a.nombre_contrato = b.nombre_contrato and 
	a.potencia_contratada = b.potencia_contratada

where b.id IS NULL




END
GO


