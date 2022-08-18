USE [FOUNTAIN5]
GO


ALTER PROCEDURE insertarLiquidacion 

@fecha date  = NULL,
@hora tinyint  = NULL,
@subsistema tinyint  = NULL,
@cms float  = NULL,
@fountain_a_bai230_27_e float  = NULL,
@fountain_a_bai230_27_s tinyint  = NULL,
@fountain_a_bai230_28b_e float  = NULL,
@fountain_a_bai230_28b_s float  = NULL,
@fountain_a_bfrio230_28_e float  = NULL,
@fountain_a_bfrio230_28_s float  = NULL,
@fountain_a_bfrio230_36_e float  = NULL,
@fountain_a_bfrio230_36_s float  = NULL,
@fountain_a_compra_mer_con tinyint  = NULL,
@fountain_a_cons_exp tinyint  = NULL,
@fountain_a_entrando tinyint  = NULL,
@fountain_a_saliendo float  = NULL,
@fountain_a_vta_mer_con tinyint  = NULL,
@fountain_a_vta_mer_opo tinyint  = NULL,
@fountain_a_perdida_real float  = NULL,
@fountain_a_perdida_teorica float  = NULL,
@fountain_a_perdida_total float  = NULL,
@fountain_a_saliendo_bruto float  = NULL,
@fountain_a_supl_loc float  = NULL,
@perdida_consumo tinyint  = NULL,
@energia_asignada float  = NULL,
@suplido_pos_contratos float  = NULL,
@suplido_mo float  = NULL,
@suplido_mo_imp tinyint  = NULL,
@consumo tinyint  = NULL,
@ocasional_compra float  = NULL,
@ocasional_venta float  = NULL,
@ocasional_debito float  = NULL,
@ocasional_credito float  = NULL,
@ensa float  = NULL,
@edemet float  = NULL,
@edechi float  = NULL,
@prog_exp tinyint  = NULL,
@fecha_mes nvarchar(50)  = NULL,
@version nvarchar(50)  = NULL,
@ajuste tinyint  = NULL,
@fecha_carga datetime  = NULL


AS 
BEGIN




INSERT INTO [dbo].[LiquidacionFountain]
           ([fecha]
           ,[hora]
           ,[subsistema]
           ,[cms]
           ,[fountain_a_bai230_27_e]
           ,[fountain_a_bai230_27_s]
           ,[fountain_a_bai230_28b_e]
           ,[fountain_a_bai230_28b_s]
           ,[fountain_a_bfrio230_28_e]
           ,[fountain_a_bfrio230_28_s]
           ,[fountain_a_bfrio230_36_e]
           ,[fountain_a_bfrio230_36_s]
           ,[fountain_a_compra_mer_con]
           ,[fountain_a_cons_exp]
           ,[fountain_a_entrando]
           ,[fountain_a_saliendo]
           ,[fountain_a_vta_mer_con]
           ,[fountain_a_vta_mer_opo]
           ,[fountain_a_perdida_real]
           ,[fountain_a_perdida_teorica]
           ,[fountain_a_perdida_total]
           ,[fountain_a_saliendo_bruto]
           ,[fountain_a_supl_loc]
           ,[perdida_consumo]
           ,[energia_asignada]
           ,[suplido_pos_contratos]
           ,[suplido_mo]
           ,[suplido_mo_imp]
           ,[consumo]
           ,[ocasional_compra]
           ,[ocasional_venta]
           ,[ocasional_debito]
           ,[ocasional_credito]
           ,[ensa]
           ,[edemet]
           ,[edechi]
           ,[prog_exp]
           ,[fecha_mes]
           ,[version]
           ,[ajuste]
		   ,[fecha_carga])
     VALUES
           (@fecha,
			@hora,
			@subsistema,
			@cms,
			@fountain_a_bai230_27_e,
			@fountain_a_bai230_27_s,
			@fountain_a_bai230_28b_e,
			@fountain_a_bai230_28b_s,
			@fountain_a_bfrio230_28_e,
			@fountain_a_bfrio230_28_s,
			@fountain_a_bfrio230_36_e,
			@fountain_a_bfrio230_36_s,
			@fountain_a_compra_mer_con,
			@fountain_a_cons_exp,
			@fountain_a_entrando,
			@fountain_a_saliendo,
			@fountain_a_vta_mer_con,
			@fountain_a_vta_mer_opo,
			@fountain_a_perdida_real,
			@fountain_a_perdida_teorica,
			@fountain_a_perdida_total,
			@fountain_a_saliendo_bruto,
			@fountain_a_supl_loc,
			@perdida_consumo,
			@energia_asignada,
			@suplido_pos_contratos,
			@suplido_mo,
			@suplido_mo_imp,
			@consumo,
			@ocasional_compra,
			@ocasional_venta,
			@ocasional_debito,
			@ocasional_credito,
			@ensa,
			@edemet,
			@edechi,
			@prog_exp,
			@fecha_mes,
			@version,
			@ajuste,
			@fecha_carga
)
END

GO


--select hora, subsistema
--into insert_test
--from LiquidacionFountain

--select * from insert_test

--select * from LiquidacionFountain

--delete from LiquidacionFountain where version = 'OficialTEST'
--delete from LiquidacionFountain where version IS NULL



-- ejecutar para instalar tabla
--alter table [LiquidacionFountain]
--add fecha_carga datetime NULL

--alter table [LiquidacionFountain]
--drop column fecha_carga 
