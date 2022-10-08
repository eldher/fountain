/****** Object:  StoredProcedure [dbo].[sp_EjecutarCierre]    Script Date: 10/8/2022 4:23:32 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO









-- =============================================
-- Author:		Eldher
-- =============================================
ALTER PROCEDURE [dbo].[sp_EjecutarCierre]
	@fecha_cierre date
	--@fecha_mes varchar
AS
BEGIN

DECLARE @fecha_mes varchar(20);


Select @fecha_mes = CONCAT(YEAR(@fecha_cierre),'-',MONTH(@fecha_cierre))

--DECLARE @fecha_cierre as date;
--SET @fecha_cierre = '2021-12-31';

--DECLARE @fecha_mes varchar;
--SET @fecha_mes  = '2021-12'

--------------------------------------------------------------------------
-- TOTALESCONTRATOS2                      CREACION CAMPO DE EMPRESA DISTRIBUIDORA 
--------------------------------------------------------------------------


--ALTER TABLE TotalesContratos2 ADD empresa varchar(20);
--ALTER TABLE TotalesContratos2 DROP COLUMN empresa 

--update TotalesContratos2
--set empresa =  
--case 
--when nombre_contrato LIKE '%ELEKTRA%' then 'ENSA'
--when nombre_contrato LIKE '%ENSA%' then 'ENSA'
--when nombre_contrato LIKE '%EDEMET%' then 'EDEMET'
--when nombre_contrato LIKE '%EDECHI%' then 'EDECHI'
--end
--select * from TotalesContratos2 order by fecha_carga




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

-- select * from #temp_dia

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

--	select * from preliminar_fountain_dia




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

--select * from TotalEnergia


--------------------------------------------------------------------------
--                       CREACION TABLA DE CONTRATOS CON PRECIOS POR MWH
--------------------------------------------------------------------------


--update contratos_fecha set nombre_contrato = trim(nombre_contrato)
--update contratos_fecha set fecha_cierre = '2021-12-31' where fecha_cierre = '2022-12-31'
--update tipo_precio set fecha_cierre = '2021-12-31' where fecha_cierre = '2022-12-31'
--select * from contratos_fecha


--------------------------------------------------------------------------
-- #PRECIOS                  CREACION TABLA DE CONTRATOS CON PRECIOS POR MWH
--------------------------------------------------------------------------

--drop table if exists #precios
--select a.* 
--,b.precio_base_usd_mwh
--,b.cargo_transmicion_seguimiento_electrico
--,b.precio_base_usd_mwh + b.cargo_transmicion_seguimiento_electrico as precio
--into #precios
--from contratos_fecha a
--left join tipo_precio b on a.fecha_cierre = b.fecha_cierre and a.categoria_precio = b.categoria_precio


--ALTER TABLE #precios ADD empresa varchar(20);

--update #precios
--set empresa =  
--case 
--when nombre_contrato LIKE '%ELEKTRA%' then 'ENSA'
--when nombre_contrato LIKE '%ENSA%' then 'ENSA'
--when nombre_contrato LIKE '%EDEMET%' then 'EDEMET'
--when nombre_contrato LIKE '%EDECHI%' then 'EDECHI'
--end


--------------------------------------------------------------------------
-- PRECIO                      AGREGAR SUMA DE PRECIO y CARGO TRANSMISION 
--------------------------------------------------------------------------

--alter table tipo_precio add precio float
--update tipo_precio set precio = precio_base_usd_mwh + cargo_transmicion_seguimiento_electrico




--------------------------------------------------------------------------
-- CONTRATOS                      CREACION TABLA DE CONTRATOS 
------------------------------------------------------------------------

--drop table if exists CONTRATOS;
--select distinct 
--coalesce(EOMONTH(a.fecha), b.fecha_cierre) as fecha
--,coalesce(trim(a.nombre_contrato), trim(b.nombre_contrato)) as  nombre_contrato
--,coalesce(trim(a.empresa), trim(b.empresa)) as  empresa
----,trim(a.nombre_contrato) as nombre_contrato
--,a.potencia_contratada
----,EOMONTH(b.fecha_cierre) as fecha
----,trim(b.nombre_contrato) as nombre_contrato
--,b.categoria_precio
----,b.precio_base_usd_mwh
----,b.cargo_transmicion_seguimiento_electrico
----,b.precio

--into CONTRATOS
--from TotalesContratos2 a 
--full join #precios b on ( EOMONTH(a.fecha)= b.fecha_cierre  ) and (trim(a.nombre_contrato) = trim(b.nombre_contrato) )
--order by 1,2


--ALTER TABLE dbo.CONTRATOS
--ADD id INT IDENTITY(1,1)

--select * from CONTRATOS


--------------------------------------------------------------------------
--                       CREACION TABLA DE INGRESOS POR CONTRATOS 
--------------------------------------------------------------------------

drop table if exists INGRESOS_CONTRATOS
select 
a.fecha
,a.nombre_contrato
,a.empresa
,a.potencia_contratada*1.0 as potencia_contratada
,a.categoria_precio
,d.precio_base_usd_mwh
,d.cargo_transmicion_seguimiento_electrico
,d.precio_base_usd_mwh +  d.cargo_transmicion_seguimiento_electrico as precio
,dmg     = IIF(LOWER(a.categoria_precio) LIKE '%energia%' or LOWER(a.categoria_precio) LIKE '%energía%', b.dmg , NULL) 
,dmg_s   = IIF(LOWER(a.categoria_precio) LIKE '%energia%' or LOWER(a.categoria_precio) LIKE '%energía%', b.dmg_s , NULL)  
,dmm_s   = IIF(LOWER(a.categoria_precio) LIKE '%energia%' or LOWER(a.categoria_precio) LIKE '%energía%', b.dmm_s , NULL)  
,energia = IIF(LOWER(a.categoria_precio) LIKE '%energia%' or LOWER(a.categoria_precio) LIKE '%energía%', c.energia , NULL) 
,EAR     = IIF(LOWER(a.categoria_precio) LIKE '%energia%' or LOWER(a.categoria_precio) LIKE '%energía%', (a.potencia_contratada/b.dmm_s)*energia , 0 ) 
,ingreso_precio_contado = 
	IIF(LOWER(a.categoria_precio) LIKE '%energia%' or LOWER(a.categoria_precio) LIKE '%energía%', 
	(a.potencia_contratada/b.dmm_s)*energia*(d.precio_base_usd_mwh +  d.cargo_transmicion_seguimiento_electrico) , 
	potencia_contratada*(d.precio_base_usd_mwh +  d.cargo_transmicion_seguimiento_electrico)*1000  )
into INGRESOS_CONTRATOS 
from CONTRATOS a
left join TotalesContratos b on a.fecha = EOMONTH(b.fecha) and a.empresa = b.Distribuidores
left join TotalEnergia c on a.fecha = c.fecha and a.empresa = c.empresa
left join tipo_precio d on a.fecha = d.fecha_cierre and a.categoria_precio = d.categoria_precio
order by 1,2

--select * from preliminar_fountain_dia
--select * from #temp_dia


--declare @fecha_cierre date
--set @fecha_cierre = '2022-05-31'


declare @precio_perdida decimal(20,4);
select  @precio_perdida = (
	select MAX(precio) as precio  
	from DetallePerdidas
	where fecha_fin = @fecha_cierre
	group by fecha_fin
) -- where EOMONTH(fecha) = @fecha_cierre )

--select @precio_perdida

--select * from [dbo].[DetallePerdidas] order by fecha_fin
--select distinct EOMONTH(fecha) as fecha ,
--AVG(precio)  as precio  
--from DetallePerdidas
--group by  EOMONTH(fecha) 



--declare @fecha_cierre date
--set @fecha_cierre = '2022-05-31'

declare @compensacion_potencia decimal(20,4);
select @compensacion_potencia = ( 
	select sum(credito_en_usd) 
	from BalancesPotencia
	where codigo_de_empresa = 'FOUNTAIN'
	AND EOMONTH(fecha) = @fecha_cierre
	and version = 'Oficial'
	)

--select @compensacion_potencia


--declare @fecha_cierre date
--set @fecha_cierre = '2022-02-28'

declare @servicios_auxiliares decimal(20,4);
select @servicios_auxiliares  = (
	select total_usd from ServiciosAuxiliares
	where lower(empresas_acreedoras) like  '%fountain%'
	AND fecha_mes = CONCAT(YEAR(@fecha_cierre),'-',MONTH(@fecha_cierre))
	and version = 'Oficial'
)



--declare @fecha_cierre as date = '2021-10-31'


declare @generacion_obligada decimal(20,4)
select @generacion_obligada = 
(
	select sum(sobre_costo_real) as sobre_costo_real 
	from [dbo].[GeneracionObligada] 
	where  lower(agente) like  '%fountain%'
	AND fecha_mes = CONCAT(YEAR(@fecha_cierre),'-',MONTH(@fecha_cierre))
	and version = 'Oficial'
)

--select @generacion_obligada

	--select * 
	--from [dbo].[GeneracionObligada] 
	--where  lower(agente) like  '%fountain%'


--select @servicios_auxiliares
--select * from ServiciosAuxiliares

--update ServiciosAuxiliares set fecha_mes = '2022-2' where fecha_mes = '2022-02'
--update ServiciosAuxiliares set fecha_mes = '2022-2' where fecha_mes = '2022-02'
--update ServiciosAuxiliares set fecha_mes = '2022-1' where fecha_mes = '2022-01'
--update ServiciosAuxiliares set fecha_mes = '2022-5' where fecha_mes = '2022-05'
--update ServiciosAuxiliares set fecha_mes = '2022-3' where fecha_mes = '2022-03'




--declare @fecha_cierre date  = '2021-12-31'

declare @ingresos_contratos decimal(20,4)
select @ingresos_contratos = 
(
	select sum(cast(ingreso_precio_contado as  decimal(20,4)) )  as ingreso
	from INGRESOS_CONTRATOS
	where fecha = @fecha_cierre
	and ingreso_precio_contado IS NOT NULL
) 
--select @ingresos_contratos




declare @sasd decimal(20,4)
select @sasd = 
(
	select total from sasd
	where AGENTE_DEUDOR like 'FOUNTAIN'
	and fecha = @fecha_cierre

) 




declare @saerlp decimal(20,4)
select @saerlp = 
(
	select sum(FOUNTAIN) 
	from SAERLP
	where fecha = @fecha_cierre
) 




declare @valores_negativos decimal(20,4)
select @valores_negativos = 
(
	select  sasd + generacion_obligada + servicios_auxiliares + compensacion_de_potencia as valoresnegativos
	from [dbo].[ValoresNegativos] 
	where fecha = @fecha_cierre
)

--------------------------------------------------------------------------
--                       CREACION #preV
--------------------------------------------------------------------------

drop table if exists #prev
select 
cms_promedio							= avg(cms)
,energia_generada						= sum(fountain_a_saliendo) 
,compras_energia_mercado_ocasional		= sum(ocasional_debito) 
,ventas_energia_mercado_ocasional		= sum(ocasional_credito) 
,ingresos_por_contratos					= ISNULL(@ingresos_contratos,0)
,SAERLP									= @saerlp
,debito_energia_perdida_transmision		= 0
,credito_energia_perdida_transmision	= (sum(suplido_pos_contratos) - sum(suplido_mo))*@precio_perdida
,sasd									= @sasd
,generacion_obligada					= @generacion_obligada 
,servicios_auxiliares					= @servicios_auxiliares
,compensacion_potencia					= ISNULL(@compensacion_potencia,0) 
,valores_negativos						= ISNULL(@valores_negativos,0) 
into #prev
from preliminar_fountain_dia
where EOMONTH(fecha) =  @fecha_cierre

--select * from #prev




--------------------------------------------------------------------------
--                       CREACION resumen
--------------------------------------------------------------------------
drop table if exists resumen

select 
cms_promedio = cast(ISNULL(cms_promedio,0) as decimal(20,2))
,energia_generada = ISNULL(energia_generada,0)
,compras_energia_mercado_ocasional = ISNULL(compras_energia_mercado_ocasional,0)
,ventas_energia_mercado_ocasional = ISNULL(ventas_energia_mercado_ocasional, 0)
,ingresos_por_contratos = ISNULL(ingresos_por_contratos, 0)
,SAERLP = ISNULL(SAERLP, 0)
,debito_energia_perdida_transmision = ISNULL(debito_energia_perdida_transmision, 0)
,credito_energia_perdida_transmision = ISNULL(credito_energia_perdida_transmision, 0)
,sasd = ISNULL(sasd, 0)
,generacion_obligada = ISNULL(generacion_obligada, 0)
,servicios_auxiliares = ISNULL(servicios_auxiliares, 0)
,compensacion_potencia = ISNULL(compensacion_potencia , 0)

,ingreso_total_neto = 
isnull(ventas_energia_mercado_ocasional,0) + 
isnull(ingresos_por_contratos, 0) + 
isnull(credito_energia_perdida_transmision,0) +
isnull(sasd,0) + 
isnull(generacion_obligada,0) + 
isnull(servicios_auxiliares,0) + 
isnull(compensacion_potencia,0) + 
isnull(SAERLP,0) -
isnull(compras_energia_mercado_ocasional, 0) - 
isnull(debito_energia_perdida_transmision, 0) -
isnull(valores_negativos, 0)
into resumen
from #prev

select * from resumen


END;
GO


--EXEC sp_EjecutarCierre N'2021-12-31'



