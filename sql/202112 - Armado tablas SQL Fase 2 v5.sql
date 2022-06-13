
USE FOUNTAIN4;

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


drop table if exists #precios
select a.* , b.precio_base_usd_mwh*b.cargo_transmicion_seguimiento_electrico as precio
into #precios
from contratos_fecha a
left join tipo_precio b on a.fecha_cierre = b.fecha_cierre and a.categoria_precio = b.categoria_precio

select * from #precios order by 1,2


--select distinct EOMONTH(fecha) as fecha, a.empresa, a.nombre_contrato, potencia_contratada 
--from TotalesContratos2 a


drop table if exists INGRESOS_CONTRATOS
select distinct 
EOMONTH(a.fecha) as fecha
,a.empresa
,trim(a.nombre_contrato) as nombre_contrato
,potencia_contratada
,b.categoria_precio
,b.precio
,c.dmg
,c.dmg_s
,c.dmm_s
,d.energia
,(potencia_contratada/dmm_s)*energia as EAR
,(potencia_contratada/dmm_s)*energia*precio as ingreso_precio_contado
into INGRESOS_CONTRATOS
from TotalesContratos2 a 
left join #precios b on ( EOMONTH(a.fecha)= b.fecha_cierre  ) and (trim(a.nombre_contrato) = trim(b.nombre_contrato) )
left join TotalesContratos c on EOMONTH(a.fecha) = EOMONTH(c.fecha) and a.empresa = c.Distribuidores
left join TotalEnergia d on EOMONTH(a.fecha) = d.fecha and a.empresa = d.empresa



select fecha , categoria_precio , sum(ingreso_precio_contado) as ingresos 
from  INGRESOS_CONTRATOS
group by fecha, categoria_precio
order by 1



select *
from  INGRESOS_CONTRATOS
where categoria_precio = 'Energia Corto Plazo I'
and fecha = '2021-12-31'

select *
from  INGRESOS_CONTRATOS
where categoria_precio = 'Energia Largo Plazo'
and fecha = '2021-12-31'

select *
from  INGRESOS_CONTRATOS
where categoria_precio = 'Potencia II'
and fecha = '2021-12-31'





--------------------------------------------------------------------------
--                      SECCION 1 -- MODIFICACIONES A LAS BASES DE DATOS
--------------------------------------------------------------------------


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
--                      SECCION 2 -- EJECUCION DE LAS TABLAS
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
select  @precio_perdida = (select MAX(precio) as precio from DetallePerdidas where EOMONTH(fecha) = '2021-12-31')


--select distinct EOMONTH(fecha) as fecha ,
--AVG(precio)  as precio  
--from DetallePerdidas
--group by  EOMONTH(fecha) 


declare @compesacion_potencia decimal(10,2);
select @compesacion_potencia = ( 
	select sum(credito_en_usd) 
	from BalancesPotencia
	where codigo_de_empresa = 'FOUNTAIN'
	AND fecha_mes = '2021-12'
	and version = 'Oficial'
	)


	
declare @servicios_auxiliares decimal(10,2);
select @servicios_auxiliares  = (
	select total_usd from ServiciosAuxiliares
	where empresas_acreedoras = 'FOUNTAIN_A'
	and fecha_mes = '2021-12'
	and version = 'Oficial'
)



--------------------------------------------------------------------------
--                        CREACION TABLA TOTAL ENERGIA
--------------------------------------------------------------------------


-- xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
--select * from TotalEnergia

--drop table if exists TotalEnergia

--select * 
--into TotalEnergia
--from(
--SELECT     
--'ENSA' as empresa, 
--sum([ensa]) as E_TOTAL
-- FROM [dbo].[preliminar_fountain_dia]
-- where EOMONTH(fecha) = '2021-12-31'

-- UNION ALL
-- SELECT     
--'EDEMET' as empresa, 
--sum(edemet) as E_TOTAL
-- FROM [dbo].[preliminar_fountain_dia]
-- where EOMONTH(fecha) = '2021-12-31'

-- UNION ALL
-- SELECT     
--'EDECHI' as empresa, 
--sum(edechi) as E_TOTAL
-- FROM [dbo].[preliminar_fountain_dia]
-- where EOMONTH(fecha) = '2021-12-31'

-- ) a 
--xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx




-- Contratos Energia -13
drop table if exists rsm_contratos_energia_1

select distinct nombre_contrato, a.empresa, potencia_contratada, b.dmm_s, c.E_TOTAL,
(potencia_contratada/b.dmm_s)*c.E_TOTAL as EAR,
(potencia_contratada/b.dmm_s)*c.E_TOTAL*126.287 as Ingreso_Precio_Contado
into rsm_contratos_energia_1
from TotalesContratos2 a
left join (select distinct Distribuidores, dmm_s from TotalesContratos where EOMONTH(fecha)  = '2021-12-31' ) b on a.empresa = b.Distribuidores
left join TotalEnergia c on a.empresa = c.empresa
where EOMONTH(fecha)  = '2021-12-31'
and nombre_contrato like '%_13%'
--group by nombre_contrato

--select * from rsm_contratos_energia_1_total



-- Contratos Energia -20
drop table if exists rsm_contratos_energia_2

select distinct nombre_contrato, a.empresa, potencia_contratada, b.dmm_s, c.E_TOTAL,
(potencia_contratada/b.dmm_s)*c.E_TOTAL as EAR,
(potencia_contratada/b.dmm_s)*c.E_TOTAL*76.587 as Ingreso_Precio_Contado
into rsm_contratos_energia_2
from TotalesContratos2 a
left join (select distinct Distribuidores, dmm_s from TotalesContratos where EOMONTH(fecha)  = '2021-12-31') b on a.empresa = b.Distribuidores
left join TotalEnergia c on a.empresa = c.empresa
where EOMONTH(fecha)  = '2021-12-31'
and nombre_contrato like '%-20 FOUNTAIN%'
--group by nombre_contrato
--select * from rsm_contratos_energia_2_total


-- Contratos Potencia -20
drop table if exists rsm_contratos_potencia_1

select distinct nombre_contrato, a.empresa, potencia_contratada,
(potencia_contratada*1000)*(4.50+0.474) as Ingreso_Precio_Contado
into rsm_contratos_potencia_1
from TotalesContratos2 a
left join (select distinct Distribuidores, dmm_s from TotalesContratos where EOMONTH(fecha)  = '2021-12-31') b on a.empresa = b.Distribuidores
left join TotalEnergia c on a.empresa = c.empresa
where EOMONTH(fecha)  = '2021-12-31'
and nombre_contrato like '%-20 FOUNTAIN%'
--select * from rsm_contratos_potencia_1_total


-- Contratos Potencia - no existentes
drop table if exists rsm_contratos_potencia_2

select distinct nombre_contrato, a.empresa, potencia_contratada,
(potencia_contratada*1000)*(4.50+0.474) as Ingreso_Precio_Contado
into rsm_contratos_potencia_2
from TotalesContratos2 a
left join (select distinct Distribuidores, dmm_s from TotalesContratos where EOMONTH(fecha)  = '2021-12-31' ) b on a.empresa = b.Distribuidores
left join TotalEnergia c on a.empresa = c.empresa
where EOMONTH(fecha)  = '2021-12-31'
and nombre_contrato in ('10-20','006-20','30-20' ) 
--select * from rsm_contratos_potencia_2_total



-- Contratos Potencia - no existentes
drop table if exists rsm_contratos_energia_3

select distinct nombre_contrato, a.empresa, potencia_contratada, b.dmm_s, c.E_TOTAL,
(potencia_contratada/b.dmm_s)*c.E_TOTAL as EAR,
(potencia_contratada/b.dmm_s)*c.E_TOTAL*(67.127	+ 1.127) as Ingreso_Precio_Contado
into rsm_contratos_energia_3
from TotalesContratos2 a
left join (select distinct Distribuidores, dmm_s from TotalesContratos where EOMONTH(fecha)  = '2021-12-31' ) b on a.empresa = b.Distribuidores
left join TotalEnergia c on a.empresa = c.empresa
where EOMONTH(fecha)  = '2021-12-31'
and nombre_contrato like '%21%'


--select * from rsm_contratos_energia_3



-------------------------------------------------------------------------------
--------- 
--------- CONECTARSE AL AZURE SOLAMENTE ACTUALIZAR ESTA TABLA
---------
---------*-*-*-*-*-*-*-----------*-*-*-*-*---------------*-*-*-*-------------*-*-

--USE FOUNTAIN2;
---- Contratos Energia
--drop table if exists rsm_contratos_energia_1




--select distinct nombre_contrato, a.empresa, potencia_contratada, b.dmm_s, c.E_TOTAL,
--(potencia_contratada/b.dmm_s)*c.E_TOTAL as EAR,
--(potencia_contratada/b.dmm_s)*c.E_TOTAL*125.675 as Ingreso_Precio_Contado
----into rsm_contratos_energia
--from totales_contratos_2 a
--left join (select distinct Distribuidores, dmm_s from totales_contratos) b on a.empresa = b.Distribuidores
--left join TotalEnergia c on a.empresa = c.empresa
--where fecha < '2021-11-30'
--and nombre_contrato like '%_13%'


-------------------------------------------------------------------------------
--------- 
--------- TABLAS RESUMENES DE INGRESOS POR CONTRATOS DE ENERGIA Y POTENCIA
---------
---------*-*-*-*-*-*-*-----------*-*-*-*-*---------------*-*-*-*-------------*-*-


drop table if exists rsm_contratos_energia_1_total_dic
SELECT 
	nombre_contrato = ISNULL(nombre_contrato, 'Total')
	,empresa = ISNULL(nombre_contrato, '')
	,potencia_contratada = SUM(potencia_contratada)
	,dmm_s = SUM(dmm_s)
	,E_TOTAL = SUM(E_TOTAL)
	,EAR = SUM(EAR)
	,Ingreso_Precio_Contado = SUM(Ingreso_Precio_Contado)
into rsm_contratos_energia_1_total_dic
FROM rsm_contratos_energia_1
GROUP BY ROLLUP(nombre_contrato)




drop table if exists rsm_contratos_energia_2_total_dic
SELECT 
	nombre_contrato = ISNULL(nombre_contrato, 'Total')
	,empresa = ISNULL(nombre_contrato, '')
	,potencia_contratada = SUM(potencia_contratada)
	,dmm_s = SUM(dmm_s)
	,E_TOTAL = SUM(E_TOTAL)
	,EAR = SUM(EAR)
	,Ingreso_Precio_Contado = SUM(Ingreso_Precio_Contado)
into rsm_contratos_energia_2_total_dic
FROM rsm_contratos_energia_2
GROUP BY ROLLUP(nombre_contrato)




drop table if exists rsm_contratos_potencia_1_total_dic
SELECT 
	nombre_contrato = ISNULL(nombre_contrato, 'Total')
	,empresa = ISNULL(nombre_contrato, '')
	,potencia_contratada = SUM(potencia_contratada)
	,Ingreso_Precio_Contado = SUM(Ingreso_Precio_Contado)
into rsm_contratos_potencia_1_total_dic
FROM rsm_contratos_potencia_1
GROUP BY ROLLUP(nombre_contrato)



drop table if exists rsm_contratos_potencia_2_total_dic
SELECT 
	nombre_contrato = ISNULL(nombre_contrato, 'Total')
	,empresa = ISNULL(nombre_contrato, '')
	,potencia_contratada = SUM(potencia_contratada)
	,Ingreso_Precio_Contado = SUM(Ingreso_Precio_Contado)
into rsm_contratos_potencia_2_total_dic
FROM rsm_contratos_potencia_2
GROUP BY ROLLUP(nombre_contrato)





-- dep
--declare @ingresos_contratos decimal(10,2);
--select @ingresos_contratos = 
--(
--	select sum(ingreso) ingreso from (
--		select sum(Ingreso_Precio_Contado) ingreso from rsm_contratos_energia_1 union
--		select sum(Ingreso_Precio_Contado) ingreso from rsm_contratos_energia_2 union 
--		--select sum(Ingreso_Precio_Contado) ingreso from rsm_contratos_energia_3 union 
--		select sum(Ingreso_Precio_Contado) ingreso from rsm_contratos_potencia_1 union
--		select sum(Ingreso_Precio_Contado) ingreso from rsm_contratos_potencia_2 
--	) a
--)


declare @ingresos_contratos decimal(10,2);
select @ingresos_contratos = 
(
	select sum(ingreso_precio_contado)  as ingreso
	from INGRESOS_CONTRATOS
	where fecha = '2021-12-31'
) 

select @ingresos_contratos


--------------------------------------------------------------------------
--                       CREACION #prev Noviembre
--------------------------------------------------------------------------

--drop table if exists #prev
--select 
--cms_promedio							= avg(cms)
--,energia_generada						= sum(fountain_a_saliendo) 
--,compras_energia_mercado_ocasional		= sum(ocasional_debito) 
--,ventas_energia_mercado_ocasional		= sum(ocasional_credito) 
--,ingreos_por_contratos					= 2198833.71
--,SAERLP									= 0
--,debito_energia_perdida_transmision		= 0
--,credito_energia_perdida_transmision	= (sum(suplido_pos_contratos) - sum(suplido_mo))*@precio_perdida
--,sasd									= 0
--,generacion_obligada					= 0 
--,servicios_auxiliares					= @servicios_auxiliares
--,compensacion_potencia					= @compesacion_potencia 
--into #prev
--from preliminar_fountain_dia
--where EOMONTH(fecha) = '2021-11-30'



--------------------------------------------------------------------------
--                       CREACION #prev Diciembre
--------------------------------------------------------------------------

drop table if exists #prev
select 
cms_promedio							= avg(cms)
,energia_generada						= sum(fountain_a_saliendo) 
,compras_energia_mercado_ocasional		= sum(ocasional_debito) 
,ventas_energia_mercado_ocasional		= sum(ocasional_credito) 
,ingresos_por_contratos					= @ingresos_contratos --- 2198833.71   ------ revisar porque se debe tomar la suma de los contratos de energia
,SAERLP									= 0
,debito_energia_perdida_transmision		= 0
,credito_energia_perdida_transmision	= (sum(suplido_pos_contratos) - sum(suplido_mo))*@precio_perdida
,sasd									= 0
,generacion_obligada					= 0 
,servicios_auxiliares					= @servicios_auxiliares
,compensacion_potencia					= @compesacion_potencia 
into #prev
from preliminar_fountain_dia
where EOMONTH(fecha) = '2021-12-31'

--select * from #prev




--------------------------------------------------------------------------
--                       CREACION resumen_mes
--------------------------------------------------------------------------
drop table if exists resumen_diciembre

select 
*,
ingreso_total_neto = ventas_energia_mercado_ocasional + ingresos_por_contratos + credito_energia_perdida_transmision
+ sasd + generacion_obligada + servicios_auxiliares + compensacion_potencia + SAERLP - compras_energia_mercado_ocasional - debito_energia_perdida_transmision
into resumen_diciembre
from
#prev




