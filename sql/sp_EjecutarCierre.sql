SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Eldher
-- =============================================
CREATE PROCEDURE [dbo].[sp_EjecutarCierre]
	@fecha_cierre date,
	@fecha_mes varchar
AS
BEGIN

EXEC ('USE [FOUNTAIN4];')



--DECLARE @fecha_cierre as date;
--SET @fecha_cierre = '2021-12-31';

--DECLARE @fecha_mes varchar;
--SET @fecha_mes  = '2021-12'

--------------------------------------------------------------------------
--                       CREACION CAMPO DE EMPRESA DISTRIBUIDORA
--------------------------------------------------------------------------


--alter table TotalesContratos2
--add empresa varchar(50); 


--update TotalesContratos2
--set empresa =  
--case 
--when nombre_contrato = '004_13 FOUNTAIN-ELEKTRA' then 'ENSA'
--when nombre_contrato = '05_13 FOUNTAIN-EDEMET' then 'EDEMET'
--when nombre_contrato = '13_13 FOUNTAIN-EDECHI' then 'EDECHI'
--when nombre_contrato = '09-20 FOUNTAIN - EDEMET' then 'EDEMET'
--when nombre_contrato = '017-20 FOUNTAIN - ENSA' then 'ENSA'
--when nombre_contrato = '29-20 FOUNTAIN - EDECHI' then 'EDECHI'
--end 
--where 
--nombre_contrato in ('004_13 FOUNTAIN-ELEKTRA', '05_13 FOUNTAIN-EDEMET' , '13_13 FOUNTAIN-EDECHI', '09-20 FOUNTAIN - EDEMET', '017-20 FOUNTAIN - ENSA', '29-20 FOUNTAIN - EDECHI' )



--------------------------------------------------------------------------
--                      INSERTAR CONTRATOS DE POTENCIA QUE NO VIENENE EN EL CONTRATO
--------------------------------------------------------------------------

--- para noviembre 2021

--INSERT INTO TotalesContratos2(fecha, hora, nombre_contrato, tipo_contrato, consumo, suplido, potencia_contratada, mwh_contrato, empresa)
--VALUES ('2021-11-30', 23, '08-21', 'N', 0, 0, 1.1968, 0, 'EDEMET');

--INSERT INTO TotalesContratos2(fecha, hora, nombre_contrato, tipo_contrato, consumo, suplido, potencia_contratada, mwh_contrato, empresa)
--VALUES ('2021-11-30', 23, '011-21', 'S', 0, 0, 4.7872, 0, 'ENSA');

--INSERT INTO TotalesContratos2(fecha, hora, nombre_contrato, tipo_contrato, consumo, suplido, potencia_contratada, mwh_contrato, empresa)
--VALUES ('2021-11-30', 23, '37-21', 'S', 0, 0, 1.056, 0, 'EDECHI');





--- para diciembre 2021

--INSERT INTO TotalesContratos2(fecha, hora, nombre_contrato, tipo_contrato, consumo, suplido, potencia_contratada, mwh_contrato, empresa)
--VALUES ('2021-12-31', 23, '10-20', 'N', 0, 0, 1.2563, 0, 'EDEMET');

--INSERT INTO TotalesContratos2(fecha, hora, nombre_contrato, tipo_contrato, consumo, suplido, potencia_contratada, mwh_contrato, empresa)
--VALUES ('2021-12-31', 23, '006-20', 'S', 0, 0, 3.7319, 0, 'ENSA');

--INSERT INTO TotalesContratos2(fecha, hora, nombre_contrato, tipo_contrato, consumo, suplido, potencia_contratada, mwh_contrato, empresa)
--VALUES ('2021-12-31', 23, '30-20', 'S', 0, 0, 0.8818, 0, 'EDECHI');


--------------------------------------------------------------------------
--                       CREACION TABLA DE ENERGIA
--------------------------------------------------------------------------


drop table if exists TotalEnergia
select fecha, empresa , energia
into TotalEnergia
from
(
	select
	EOMONTH(fecha) as fecha , sum(EDEMET) as EDEMET, sum(ENSA) as ENSA, SUM(EDECHI) as EDECHI
	from [preliminar_fountain_dia]
	group by EOMONTH(fecha)
) P
UNPIVOT 
	(energia  FOR empresa IN ([EDEMET],[ENSA],[EDECHI]))AS UNPVT;

	   	  


--------------------------------------------------------------------------
--                       CREACION TABLA DE CONTRATOS CON PRECIOS POR MWH
--------------------------------------------------------------------------


--update contratos_fecha set nombre_contrato = trim(nombre_contrato)
--update contratos_fecha set fecha_cierre = '2021-12-31' where fecha_cierre = '2022-12-31'
--update tipo_precio set fecha_cierre = '2021-12-31' where fecha_cierre = '2022-12-31'


--drop table if exists #precios
--select a.* , b.precio_base_usd_mwh*b.cargo_transmicion_seguimiento_electrico as precio
--into #precios
--from contratos_fecha a
--left join tipo_precio b on a.fecha_cierre = b.fecha_cierre and a.categoria_precio = b.categoria_precio





--drop table if exists INGRESOS_CONTRATOS
--select distinct 
--EOMONTH(a.fecha) as fecha
--,a.empresa
--,trim(a.nombre_contrato) as nombre_contrato
--,potencia_contratada
--,b.categoria_precio
--,b.precio
--,c.dmg
--,c.dmg_s
--,c.dmm_s
--,d.energia
--,(potencia_contratada/dmm_s)*energia as EAR
--,(potencia_contratada/dmm_s)*energia*precio as ingreso_precio_contado
--into INGRESOS_CONTRATOS
--from TotalesContratos2 a 
--left join #precios b on ( EOMONTH(a.fecha)= b.fecha_cierre  ) and (trim(a.nombre_contrato) = trim(b.nombre_contrato) )
--left join TotalesContratos c on EOMONTH(a.fecha) = EOMONTH(c.fecha) and a.empresa = c.Distribuidores
--left join TotalEnergia d on EOMONTH(a.fecha) = d.fecha and a.empresa = d.empresa



--select fecha , categoria_precio , sum(ingreso_precio_contado) as ingresos 
--from  INGRESOS_CONTRATOS
--group by fecha, categoria_precio
--order by 1



--select *
--from  INGRESOS_CONTRATOS
--where categoria_precio = 'Energia Corto Plazo I'
--and fecha = '2021-12-31'

--select *
--from  INGRESOS_CONTRATOS
--where categoria_precio = 'Energia Largo Plazo'
--and fecha = '2021-12-31'

--select *
--from  INGRESOS_CONTRATOS
--where categoria_precio = 'Potencia II'
--and fecha = '2021-12-31'



--------------------------------------------------------------------------
--                      SECCION 2 -- TABLA MENSUAL
--------------------------------------------------------------------------


-- save in temp table first
drop table if exists #temp_dia
select 
fecha
,avg(cast(subsistema as int)     ) as subsistema
,avg(cms                         ) as cms
,sum(fountain_a_bai230_27_e      ) as fountain_a_bai230_27_e     
,sum(fountain_a_bai230_27_s		 ) as fountain_a_bai230_27_s		
,sum(fountain_a_bai230_28b_e	 ) as fountain_a_bai230_28b_e	
,sum(fountain_a_bai230_28b_s	 ) as fountain_a_bai230_28b_s	
,sum(fountain_a_bfrio230_28_e	 ) as fountain_a_bfrio230_28_e	
,sum(fountain_a_bfrio230_28_s	 ) as fountain_a_bfrio230_28_s	
,sum(fountain_a_bfrio230_36_e	 ) as fountain_a_bfrio230_36_e	
,sum(fountain_a_bfrio230_36_s	 ) as fountain_a_bfrio230_36_s	
,sum(fountain_a_compra_mer_con	 ) as fountain_a_compra_mer_con	
,sum(fountain_a_cons_exp		 ) as fountain_a_cons_exp		
,sum(fountain_a_entrando		 ) as fountain_a_entrando		
,sum(fountain_a_saliendo		 ) as fountain_a_saliendo		
,sum(fountain_a_vta_mer_con		 ) as fountain_a_vta_mer_con		
,sum(fountain_a_vta_mer_opo		 ) as fountain_a_vta_mer_opo		
,sum(fountain_a_perdida_real	 ) as fountain_a_perdida_real	
,sum(fountain_a_perdida_teorica	 ) as fountain_a_perdida_teorica	
,sum(fountain_a_perdida_total	 ) as fountain_a_perdida_total	
,sum(fountain_a_saliendo_bruto	 ) as fountain_a_saliendo_bruto	
,sum(fountain_a_supl_loc		 ) as fountain_a_supl_loc		
,sum(perdida_consumo			 ) as perdida_consumo			
,sum(energia_asignada			 ) as energia_asignada			
,sum(suplido_pos_contratos		 ) as suplido_pos_contratos		
,sum(suplido_mo					 ) as suplido_mo					
,sum(suplido_mo_imp				 ) as suplido_mo_imp				
,sum(consumo					 ) as consumo					
,sum(ocasional_compra			 ) as ocasional_compra			
,sum(ocasional_venta			 ) as ocasional_venta			
,sum(ocasional_debito			 ) as ocasional_debito			
,sum(ocasional_credito			 ) as ocasional_credito			
,sum(ensa						 ) as ensa						
,sum(edemet						 ) as edemet						
,sum(edechi						 ) as edechi						
,sum(prog_exp					 ) as prog_exp					
,version
into #temp_dia
from (select distinct * from LiquidacionFountain) a
where a.version = 'Oficial'
group by a.fecha, a.version

-- Validacion data de liquidacion
--select EOMONTH(fecha) , version
--,sum(ensa						 ) as ensa						
--,sum(edemet						 ) as edemet						
--,sum(edechi						 ) as edechi
--from LiquidacionFountain
--group by EOMONTH(fecha), version
--order by 1,2


--------------------------------------------------------------------------
--                       CREACION preliminar_fountain_dia  - Agrega Columnas de sumarizacion
--------------------------------------------------------------------------


drop table if exists preliminar_fountain_dia
select *
,total_gen_compras = fountain_a_supl_loc + ocasional_compra - fountain_a_bfrio230_36_e + (fountain_a_bfrio230_36_e - fountain_a_entrando)
,ventas_totales = energia_asignada + ocasional_venta + (suplido_pos_contratos - suplido_mo)  
,energy_balance_check = round(energia_asignada + ocasional_venta + (suplido_pos_contratos - suplido_mo) - (fountain_a_supl_loc + ocasional_compra - fountain_a_bfrio230_36_e + (fountain_a_bfrio230_36_e - fountain_a_entrando)),2)
into preliminar_fountain_dia
from #temp_dia


--select * from preliminar_fountain_dia
--select * from #temp_dia

declare @precio_perdida decimal(10,2);
select  @precio_perdida = (select MAX(precio) as precio from DetallePerdidas ) -- where EOMONTH(fecha) = @fecha_cierre )


--select distinct EOMONTH(fecha) as fecha ,
--AVG(precio)  as precio  
--from DetallePerdidas
--group by  EOMONTH(fecha) 


declare @compensacion_potencia decimal(10,2);
select @compensacion_potencia = ( 
	select sum(credito_en_usd) 
	from BalancesPotencia
	where codigo_de_empresa = 'FOUNTAIN'
	AND EOMONTH(fecha) = @fecha_cierre
	and version = 'Oficial'
	)





declare @servicios_auxiliares decimal(10,2);
select @servicios_auxiliares  = (
	select total_usd from ServiciosAuxiliares
	where empresas_acreedoras = 'FOUNTAIN_A'
	AND fecha_mes = '2021-12'
	and version = 'Oficial'
)






declare @ingresos_contratos decimal(10,2);
select @ingresos_contratos = 
(
	select sum(ingreso_precio_contado)  as ingreso
	from INGRESOS_CONTRATOS
	where fecha = @fecha_cierre
	and ingreso_precio_contado IS NOT NULL
) 




--------------------------------------------------------------------------
--                       CREACION #prev Diciembre
--------------------------------------------------------------------------

drop table if exists #prev
select 
cms_promedio							= avg(cms)
,energia_generada						= sum(fountain_a_saliendo) 
,compras_energia_mercado_ocasional		= sum(ocasional_debito) 
,ventas_energia_mercado_ocasional		= sum(ocasional_credito) 
,ingresos_por_contratos					= ISNULL(@ingresos_contratos,0)
,SAERLP									= 0
,debito_energia_perdida_transmision		= 0
,credito_energia_perdida_transmision	= (sum(suplido_pos_contratos) - sum(suplido_mo))*@precio_perdida
,sasd									= 0
,generacion_obligada					= 0 
,servicios_auxiliares					= @servicios_auxiliares
,compensacion_potencia					= ISNULL(@compensacion_potencia,0) 
into #prev
from preliminar_fountain_dia
where EOMONTH(fecha) =  @fecha_cierre

--select * from #prev




--------------------------------------------------------------------------
--                       CREACION resumen_mes
--------------------------------------------------------------------------
drop table if exists resumen

select 
*,
ingreso_total_neto = ventas_energia_mercado_ocasional + ingresos_por_contratos + credito_energia_perdida_transmision
+ sasd + generacion_obligada + servicios_auxiliares + compensacion_potencia + SAERLP - compras_energia_mercado_ocasional - debito_energia_perdida_transmision
into resumen
from
#prev


select * from resumen


END;