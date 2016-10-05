// Copyright (c) 2016, Helio de Jesus and contributors
// For license information, please see license.txt


cur_frm.call({method:"empresa_load",args:{"start":"moeda"}})
cx_aberto =cur_frm.call({method:"caixa_aberto",args:{"start":"none"}})
mesas_open =cur_frm.call({method:"mesas_abertas",args:{"start":"none"}})

frappe.ui.form.on('CAIXA_Registadora', {
	onload: function(frm) {

//		alert(frm.doc.__islocal)
		//If Cx_aberto ABERTO no other record can be added until this is closed.
		if (cur_frm.docname.substring(0,3)=="New" && cx_aberto.statusText=="OK" ){
			if (cx_aberto.responseText != "{}"){
				alert("Caixa Registadora ja esta aberta!!!")
				cur_frm.page.clear_primary_action()
			}
		}else if (cx_aberto.statusText=="OK" && frm.doc.__unsaved==1){
			if (cx_aberto.responseText != "{}"){
				alert("Caixa aberto!!! Por favor fechar antes.")
				cur_frm.page.clear_primary_action()
			}
		}else if (cur_frm.doc.status_caixa=="Fechado"){
			cur_frm.toggle_enable("data_hora",false)
			cur_frm.toggle_enable("amount_init",false)
			cur_frm.toggle_enable("amount_caixa",false)
			cur_frm.toggle_enable("status_caixa",false)
			cur_frm.disable_save()

		}else {
			cur_frm.enable_save()
		}


	}
});

frappe.ui.form.on('CAIXA_Registadora', {
	refresh: function(frm) {

		if (cur_frm.docname.substring(0,3)=="New" && cx_aberto.statusText=="OK" ){
//			alert("Caixa Registadora ja esta aberta!!!")
//			cur_frm.page.clear_primary_action()
			cur_frm.toggle_enable("amount_caixa",false)
			cur_frm.toggle_enable("status_caixa",false)

		}else if (cur_frm.doc.status_caixa=="Fechado"){
			cur_frm.toggle_enable("data_hora",false)
			cur_frm.toggle_enable("amount_init",false)
			cur_frm.toggle_enable("amount_caixa",false)
			cur_frm.toggle_enable("status_caixa",false)

		}else if (frm.doc.abertura_fecho=="Abertura" && frm.doc.status_caixa=="Aberto"){
			cur_frm.toggle_enable("data_hora",false)
			cur_frm.toggle_enable("amount_init",false)
			cur_frm.toggle_enable("amount_caixa",false)

		}

	
	}
});

frappe.ui.form.on("CAIXA_Registadora","abertura_fecho",function(frm,cdt,cdn){

	frappe.model.set_value(cdt,cdn,'usuario_caixa',user)
	cur_frm.refresh_fields('usuario_caixa')

});


frappe.ui.form.on("CAIXA_Registadora","validate",function(frm,cdt,cdn){

	if (mesas_open.statusText=="OK" ){
		if (mesas_open.responseText != "{}"){
			alert("Verifique as Mesas Abertas!!!")
			cur_frm.disable_save()
			cur_frm.reload_doc()
			//cur_frm.page.clear_primary_action()
			//cur_frm.refresh()
		}
	}

});


frappe.ui.form.on("CAIXA_Registadora","status_caixa",function(frm,cdt,cdn){

	if (cur_frm.doc.status_caixa=="Fechado"){
	    	show_alert("Verificando Mesas Abertas...",2)
		if (mesas_open.statusText=="OK" ){
			if (mesas_open.responseText != "{}"){
				alert("NAO PODE FECHAR O CAIXA. Ainda tem Mesas Abertas")
				cur_frm.disable_save()
				cur_frm.reload_doc()
			//cur_frm.page.clear_primary_action()
			//cur_frm.refresh()
			}
		}else{
			// check all tables from the open time until now and get the values PAID....
					frappe.call({
			method: "gestpensao.gestpensao.doctype.api.verifica_mesas_vendidas",
			args: {
				"start":frm.doc.data_hora,
				
			},
			callback: function(r) {
//				msgprint(r.message)
				if (r.message !=undefined){
					alert("Ocupado ou Ativo")
					return
				}else{
					alert("Pode ser Cancelado")
				}

			}
		});
		}		
		
	}
});


