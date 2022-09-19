
--------------------------------------------------------------------------
-- CONTRATOS                      INSERCION EN LA TABLA
------------------------------------------------------------------------
/* Se verifica que el contrato no exista ya en la tabla de contratos, por fecha, nombre, empresa y potencia_contratada 
 si el b.id es NULL entonces se debe insertar con el id
 */


--drop table if exists CONTRATOS;
-- actualizar EMPRESA DISTRIBUIDORA


CREATE PROCEDURE insertarContratos2_INSERT_INTO_CONTRATOS AS

BEGIN


update TotalesContratos2
set empresa =  
case 
when nombre_contrato LIKE '%ELEKTRA%' then 'ENSA'
when nombre_contrato LIKE '%ENSA%' then 'ENSA'
when nombre_contrato LIKE '%EDEMET%' then 'EDEMET'
when nombre_contrato LIKE '%EDECHI%' then 'EDECHI'
end



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

--delete from INGRESOS_CONTRATOS where EOMONTH(fecha) = '2022-06-30'
--delete from TotalesContratos2 where EOMONTH(fecha) = '2022-06-30'
--delete from Contratos where EOMONTH(fecha) = '2022-06-30'




