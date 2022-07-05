USE FOUNTAIN5

-- TABLAS ORIGEN
select * from [dbo].[BalancesPotencia]
select * from [dbo].[DetallePerdidas]
select * from [dbo].GeneracionObligada
select * from [dbo].LiquidacionFountain
select * from [dbo].[ServiciosAuxiliares]
select * from [dbo].[TotalesContratos]
select * from [dbo].[TotalesContratos2]

-- DESDE PRECIOS
select * from [dbo].[tipo_precio]
select * from [dbo].[contratos_fecha]


-- CONSTRUCCION DE TABLAS 
	
select * from [dbo].[INGRESOS_CONTRATOS]
select * from [dbo].[TotalEnergia]



SELECT * FROM CONTRATOS where nombre_contrato like '%TEST%'


delete from CONTRATOS where nombre_contrato like '%TEST%'

delete from [dbo].[tipo_precio] where categoria_precio like '%TEST%'




select * from [dbo].[tipo_precio]


exec sp_executesql @statement=N'INSERT INTO CONTRATOS (fecha, nombre_contrato, empresa, potencia_contratada, categoria_precio, precio) VALUES (''2022-02-28'', ''FOUNTAIN TEST'', ''ENSA'', ''12.3'', '' Energia Corto Plazo II '', ''67.573'' )'


exec sp_executesql @statement=N'INSERT INTO CONTRATOS (fecha, nombre_contrato, empresa, potencia_contratada, categoria_precio, precio, id ) VALUES (''2022-01-31'', ''FOUNTAINT TEST'', ''ENSA'', ''123.45'', '' Energia Corto Plazo II '', ''69.182'')'

exec sp_executesql @statement=N'INSERT INTO tipo_precio (id, fecha, categoria_precio, precio_base_usd_mwh, cargo_transmicion_seguimiento_electrico ) VALUES (''31'', ''precio test 12'', ''12'', ''12.2'')'





exec sp_executesql @statement=N'select a.id,cast(fecha as varchar) as fecha, nombre_contrato, empresa, potencia_contratada, a.categoria_precio ,format(b.precio_base_usd_mwh, ''c'', ''en-US'') as precio_base_usd_mwh  , format(b.cargo_transmicion_seguimiento_electrico, ''c'', ''en-US'') as cargo_transmicion_seguimiento_electrico ,format(b.precio_base_usd_mwh + b.cargo_transmicion_seguimiento_electrico,  ''c'', ''en-US'')  as precio from CONTRATOS a left join tipo_precio b on a.fecha = b.fecha_cierre and a.categoria_precio = b.categoria_precio where a.id =13'



exec sp_executesql @statement=N'select a.id,cast(fecha as varchar) as fecha, nombre_contrato, empresa, potencia_contratada, a.categoria_precio,format(b.precio_base_usd_mwh, ''c'', ''en-US'') as precio_base_usd_mwh  , format(b.cargo_transmicion_seguimiento_electrico, ''c'', ''en-US'') as cargo_transmicion_seguimiento_electrico , format(b.precio,  ''c'', ''en-US'')  as precio from CONTRATOS a left join tipo_precio b on a.fecha = b.fecha_cierre and a.categoria_precio = b.categoria_precio '