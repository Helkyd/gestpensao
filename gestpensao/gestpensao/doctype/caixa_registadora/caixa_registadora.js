// Copyright (c) 2016, Helio de Jesus and contributors
// For license information, please see license.txt

cx_aberto =cur_frm.call({method:"caixa_aberto",args:{"start":"none"}})

cur_frm.call({method:"empresa_load",args:{"start":"moeda"}})

mesas_open =cur_frm.call({method:"mesas_abertas",args:{"start":"none"}})

tem_acesso = cur_frm.call({method:"check_user_acesso",args:{"start":"none"}})

var caixa_upd=0
var caix = 0

frappe.ui.form.on('CAIXA_Registadora', {
	onload: function(frm) {

		//Verifica se o Caixa esta aberto ... segudo controle caso cx_aberto nao retorne valores ....
//		caixa_stat =cur_frm.call({method:"caixa_stat",args:{"start":"none"}})
		frappe.call({
			method: "gestpensao.gestpensao.doctype.api.check_caixa_aberto",
			args: {},
			callback: function(r) {
//				var caix = frappe.model.sync(r.message);
//				msgprint(r.message)
				if (r.message !=undefined){
//					alert("Aberto ou em Curso")
					caix = r.message
//					return
				}else{
//					alert("CAIXA Fechado")
				}

			}
		});
//		d = frappe.get_list("CAIXA_Registadora",filters={'status_caixa':'Aberto'},fields=['name','status_caixa'])
//		d= frappe.get_value("CAIXA_Registadora",{'status_caixa':'Aberto'},'status_caixa')
//		alert(caixa_stat)
//		alert( d[0].name)
//		alert(d[0].status_caixa)
//		if (caixa_stat.responseText != "{}"){
//			if (caixa_stat.responseJSON.message =="Em Curso"){
				//Ja tem caixa Aberto

//			}else{
//				d = frappe.get_list("CAIXA_Registadora",filters={'status_caixa':'Em Curso'},fields=['name','status_caixa'])
//			}
//		}

//		alert(frm.doc.__islocal)
		//If Cx_aberto ABERTO no other record can be added until this is closed.
//		if ((cur_frm.docname.substring(0,3)=="New" || cur_frm.docname.substring(0,3)=="Nov") && cx_aberto.statusText=="OK" ){
//		alert(d[0].name)
		if (cur_frm.doc.docstatus ==1 && cur_frm.doc.status_caixa=="Aberto" ){
//			if (cx_aberto.responseText != "{}"){
			if (caix[0] !=[] ){
				alert("Caixa Registadora ja esta aberta!!!")
				cur_frm.toggle_enable("movimentos_caixa",false)	
				cur_frm.toggle_enable("amount_init",false)
				cur_frm.toggle_enable("data_hora",false)
				cur_frm.toggle_enable("status_caixa",false)
				cur_frm.toggle_enable("amount_caixa",false)
				cur_frm.toggle_enable("amount_tpa",false)
				cur_frm.toggle_enable("amount_conta_corrente",false)
				cur_frm.page.clear_primary_action()
			}else{
			// acrescenta os registos
				show_alert("Abertura do Caixa...",2)
				cur_frm.toggle_enable("movimentos_caixa",false)	
				cur_frm.toggle_enable("amount_init",true)
				cur_frm.toggle_enable("data_hora",false)
				cur_frm.toggle_enable("amount_caixa",false)
				cur_frm.toggle_enable("amount_tpa",false)
				cur_frm.toggle_enable("amount_conta_corrente",false)

				//movimentos_add(frm)
			}
		}else if (cur_frm.doc.docstatus ==0 && frm.doc.__unsaved==1){
//			if (cx_aberto.responseText != "{}"){
//				alert("Caixa aberto!!! Por favor fechar antes.")
//				cur_frm.page.clear_primary_action()
//			}else{
//				alert("aaaa")
//				cur_frm.toggle_enable("amount_init",true)			
//			}
		}else if (cur_frm.doc.status_caixa=="Em Curso"){
			cur_frm.toggle_enable("data_hora",false)
			cur_frm.toggle_enable("amount_init",false)
			cur_frm.toggle_enable("amount_caixa",false)
			cur_frm.toggle_enable("amount_tpa",false)
			cur_frm.toggle_enable("amount_conta_corrente",false)

			cur_frm.set_df_property("movimentos_caixa","hidden",false)	
			if (caixa_upd==0){
				movimentos_add(frm)
				caixa_upd=1
				cur_frm.reload_doc()
			}

		}else if (cur_frm.doc.status_caixa=="Fechado"){
			cur_frm.toggle_enable("data_hora",false)
			cur_frm.toggle_enable("amount_init",false)
			cur_frm.toggle_enable("amount_caixa",false)
			cur_frm.toggle_enable("amount_tpa",false)
			cur_frm.toggle_enable("amount_conta_corrente",false)

			cur_frm.toggle_enable("status_caixa",false)
			cur_frm.toggle_enable("movimentos_caixa",false)	
			cur_frm.disable_save()

		}else if (cur_frm.doc.docstatus ==1)  {
			//ADD New RECORD
			alert("bbbbb " + cur_frm.docname)
			cur_frm.toggle_enable("amount_init",true)
			cur_frm.enable_save()
//			movimentos_add(frm)
//			cur_frm.reload_doc()

		}else if (cur_frm.doc.docstatus ==1) {

//			d = frappe.get_list("CAIXA_Registadora",filters={'status_caixa':'Aberto'},fields=['name','status_caixa'])
//			if (d[0].status_caixa =="Aberto"){
				//Ja tem caixa Aberto
				cur_frm.toggle_enable("data_hora",false)
				cur_frm.toggle_enable("amount_init",false)
				cur_frm.toggle_enable("amount_caixa",false)
				cur_frm.toggle_enable("amount_tpa",false)
				cur_frm.toggle_enable("amount_conta_corrente",false)


//			}else{
//				d = frappe.get_list("CAIXA_Registadora",filters={'status_caixa':'Em Curso'},fields=['name','status_caixa'])
//				if (d[0].status_caixa =="Em Curso"){
					//Ja tem caixa Aberto	
//					alert("O CAIXA ja foi aberto")				
					cur_frm.toggle_enable("data_hora",false)
					cur_frm.toggle_enable("amount_init",false)
					cur_frm.toggle_enable("amount_caixa",false)
					cur_frm.toggle_enable("amount_tpa",false)
					cur_frm.toggle_enable("amount_conta_corrente",false)

					cur_frm.disable_save()
//				}else{
					// Pode Abrir novo Caixa
//					alert("Abrindo o Caixa!!!  Nao se esqueca que so pode fechar o Caixa depois de fechar todas a Mesas.")	
			
//					cur_frm.toggle_enable("data_hora",false)
//					cur_frm.toggle_enable("amount_init",true)
//					cur_frm.toggle_enable("amount_caixa",false)
//					cur_frm.toggle_enable("status_caixa",false)
//					cur_frm.toggle_enable("movimentos_caixa",false)	
//
//				}

//			}


		}else if (cur_frm.doc.status_caixa=="Aberto"){
			cur_frm.toggle_enable("data_hora",false)
			cur_frm.toggle_enable("amount_init",false)
			cur_frm.toggle_enable("amount_caixa",false)
			cur_frm.toggle_enable("amount_tpa",false)
			cur_frm.toggle_enable("amount_conta_corrente",false)

		}


	}
});

frappe.ui.form.on('CAIXA_Registadora', {
	refresh: function(frm) {

//		if (d.length ==0){
//			d = frappe.get_list("CAIXA_Registadora",filters={'status_caixa':'Aberto'},fields=['name','status_caixa'])
//		}
//		if (d[0].status_caixa =="Aberto"){
			//Nao pode insert novo Caixa
//			cur_frm.toggle_enable("status_caixa",false)
//			cur_frm.disable_save())
		if (cur_frm.doc.docstatus ==1 && caix[0] !=[] ) { //cx_aberto.statusText=="OK"){
//			alert("Caixa Registadora ja esta aberta!!!")
//			cur_frm.page.clear_primary_action()
			if (caix[0] !=[]){
				alert("O CAIXA ja esta aberto")	
				cur_frm.toggle_enable("amount_init",true)
				cur_frm.toggle_enable("data_hora",false)
				cur_frm.toggle_enable("amount_caixa",false)
				cur_frm.toggle_enable("amount_tpa",false)
				cur_frm.toggle_enable("amount_conta_corrente",false)

				cur_frm.toggle_enable("status_caixa",false)
				cur_frm.set_df_property("movimentos_caixa","hidden",false)
				cur_frm.disable_save()
		
			}else{
			// acrescenta os registos
				//alert("aqui!!!")
				cur_frm.toggle_enable("movimentos_caixa",false)	
				cur_frm.toggle_enable("amount_init",true)
				cur_frm.toggle_enable("data_hora",false)
				cur_frm.toggle_enable("amount_caixa",false)
				cur_frm.toggle_enable("amount_tpa",false)
				cur_frm.toggle_enable("amount_conta_corrente",false)

			}


		}else if (cur_frm.doc.status_caixa=="Fechado"){
			cur_frm.toggle_enable("data_hora",false)
			cur_frm.toggle_enable("amount_init",false)
			cur_frm.toggle_enable("amount_caixa",false)
			cur_frm.toggle_enable("amount_tpa",false)
			cur_frm.toggle_enable("amount_conta_corrente",false)

			cur_frm.toggle_enable("status_caixa",false)
			cur_frm.set_df_property("movimentos_caixa","hidden",false)
			frappe.utils.filter_dict(frm.fields_dict["movimentos_caixa"].grid.docfields, {"fieldname": "descricao_movimento"})[0].read_only = true;	
			frappe.utils.filter_dict(frm.fields_dict["movimentos_caixa"].grid.docfields, {"fieldname": "tipo_pagamento"})[0].read_only = true;	
			frappe.utils.filter_dict(frm.fields_dict["movimentos_caixa"].grid.docfields, {"fieldname": "valor_pago"})[0].read_only = true;
			frappe.utils.filter_dict(frm.fields_dict["movimentos_caixa"].grid.docfields, {"fieldname": "hora_atendimento"})[0].read_only = true;


		}else if (cur_frm.doc.docstatus ==1 && frm.doc.status_caixa=="Aberto" && caix[0] !=[]){
			alert("O CAIXA ja foi aberto!!!")	
			cur_frm.toggle_enable("data_hora",false)
			cur_frm.toggle_enable("amount_init",false)
			cur_frm.toggle_enable("amount_caixa",false)
			cur_frm.toggle_enable("amount_tpa",false)
			cur_frm.toggle_enable("amount_conta_corrente",false)

			cur_frm.set_df_property("movimentos_caixa","hidden",false)
			frappe.utils.filter_dict(frm.fields_dict["movimentos_caixa"].grid.docfields, {"fieldname": "descricao_movimento"})[0].read_only = true;	
			frappe.utils.filter_dict(frm.fields_dict["movimentos_caixa"].grid.docfields, {"fieldname": "tipo_pagamento"})[0].read_only = true;	
			frappe.utils.filter_dict(frm.fields_dict["movimentos_caixa"].grid.docfields, {"fieldname": "valor_pago"})[0].read_only = true;
			frappe.utils.filter_dict(frm.fields_dict["movimentos_caixa"].grid.docfields, {"fieldname": "hora_atendimento"})[0].read_only = true;
			cur_frm.disable_save()

		}else if (cur_frm.doc.docstatus ==0 && frm.doc.status_caixa=="Aberto" && caix[0] !=undefined){
			if (cur_frm.docname.substring(0,3)=="New" || cur_frm.docname.substring(0,3)=="Nov"){
				alert("O CAIXA ja foi aberto!!!")	
				cur_frm.disable_save()
			}
			cur_frm.toggle_enable("data_hora",false)
			cur_frm.toggle_enable("amount_init",false)
			cur_frm.toggle_enable("amount_caixa",false)
			cur_frm.toggle_enable("amount_tpa",false)
			cur_frm.toggle_enable("amount_conta_corrente",false)

			cur_frm.set_df_property("movimentos_caixa","hidden",false)
			frappe.utils.filter_dict(frm.fields_dict["movimentos_caixa"].grid.docfields, {"fieldname": "descricao_movimento"})[0].read_only = true;	
			frappe.utils.filter_dict(frm.fields_dict["movimentos_caixa"].grid.docfields, {"fieldname": "tipo_pagamento"})[0].read_only = true;	
			frappe.utils.filter_dict(frm.fields_dict["movimentos_caixa"].grid.docfields, {"fieldname": "valor_pago"})[0].read_only = true;
			frappe.utils.filter_dict(frm.fields_dict["movimentos_caixa"].grid.docfields, {"fieldname": "hora_atendimento"})[0].read_only = true;

		}else if (cur_frm.doc.docstatus ==0 && frm.doc.status_caixa=="Aberto" && caix[0] ==undefined){
//			alert("aqui")
//			if (cx_aberto.responseText != []){
//				cur_frm.toggle_enable("amount_init",false)
//			}else{
			cur_frm.toggle_enable("amount_init",true)
//			}
			cur_frm.toggle_enable("movimentos_caixa",false)	
			cur_frm.toggle_enable("amount_tpa",false)
			cur_frm.toggle_enable("amount_conta_corrente",false)

			cur_frm.toggle_enable("data_hora",false)
			cur_frm.toggle_enable("amount_caixa",false)
		}

		if (cur_frm.doc.status_caixa=="Em Curso"){
			frm.set_df_property("status_caixa","options","Em Curso\nFechado")
		}else if (cur_frm.doc.status_caixa=="Aberto"){
			frm.set_df_property("status_caixa","options","Aberto\nEm Curso")

		}
	
	}
});

//frappe.ui.form.on("CAIXA_Registadora","abertura_fecho",function(frm,cdt,cdn){

//	frappe.model.set_value(cdt,cdn,'usuario_caixa',user)
//	cur_frm.refresh_fields('usuario_caixa')

//});


//frappe.ui.form.on("CAIXA_Registadora","validate",function(frm,cdt,cdn){

//	if (mesas_open.statusText=="OK" ){
//		if (mesas_open.responseText != "{}"){
//			alert("Verifique as Mesas Abertas!!!")
//			cur_frm.disable_save()
//			cur_frm.reload_doc()
			//cur_frm.page.clear_primary_action()
			//cur_frm.refresh()
//		}
//	}

//});


frappe.ui.form.on("CAIXA_Registadora","status_caixa",function(frm,cdt,cdn){

	var me = this;
//	var tem_acesso = true	
	if (cur_frm.doc.status_caixa=="Fechado"){
		if (frappe.session.user != cur_frm.doc.usuario_caixa){
			//Verify if GESTAO_PENSAO group than Admin is allowed otherwise 
			if (tem_acesso.responseJSON.message == "GesPensao"){	
//			for (regra in frappe.utils.user.get_roles(frappe.session.user)){
//				if (regra[0] == "GesPensao"){
					//Tem Acesso
				alert("ESTE USUARIO PODE FAZER O FECHO DE CAIXA " + frappe.session.user)	
				frappe.model.set_value(cdt,cdn,'usuario_caixa_fecho',frappe.session.user)				
//					tem_acesso = true
//				}else{
//					tem_acesso = false
//				}
//			}
			}else{
				alert("FECHO DE CAIXA SO PODE SER FEITO PELO USUARIO " + cur_frm.doc.usuario_caixa)
				frappe.model.set_value(cdt,cdn,'status_caixa','Em Curso')
				cur_frm.reload_doc()
			}
			

		}else{	
		    	show_alert("Verificando Mesas Abertas...",2)
			cur_frm.set_df_property("movimentos_caixa","hidden",false)			
			frappe.utils.filter_dict(frm.fields_dict["movimentos_caixa"].grid.docfields, {"fieldname": "descricao_movimento"})[0].read_only = false;	
			frappe.utils.filter_dict(frm.fields_dict["movimentos_caixa"].grid.docfields, {"fieldname": "tipo_pagamento"})[0].read_only = false;	
			frappe.utils.filter_dict(frm.fields_dict["movimentos_caixa"].grid.docfields, {"fieldname": "valor_pago"})[0].read_only = false;
			frappe.utils.filter_dict(frm.fields_dict["movimentos_caixa"].grid.docfields, {"fieldname": "hora_atendimento"})[0].read_only = false;

			if (mesas_open.statusText=="OK" ){
				if (mesas_open.responseText != "{}"){
					alert("NAO PODE FECHAR O CAIXA. Ainda tem Mesas Abertas")
					cur_frm.disable_save()
					cur_frm.reload_doc()
				//cur_frm.page.clear_primary_action()
				//cur_frm.refresh()

				}else{
				// Mesas Fechadas during open Caixa time to add ...
	//				show_alert("Processando Movimento do dia!!! Por favor aguarde...",3)
	//				cur_frm.reload_doc()
					this.cur_page.page.frm._save()
					//movimentos_add(frm)

	//				cur_frm.save()
	//				frappe.call({
	//					method: "gestpensao.gestpensao.doctype.api.caixa_movimentos_in",
	//						args: {
	//						"start":frm.doc.data_hora,
	//						"caixa":frm.doc.name,
	//				
	//					},
	//					callback: function(r) {
	//				msgprint(r.message)
	//						if (r.message !=undefined){
	//							show_alert("Calculos do Fecho concluidos",2)
	//							cur_frm.doc.set_value(cdt,cdn,'status_caixa',"Fechado")
	//							frappe.model.set_value(cdt,cdn,'amount_caixa',r.message)
	//							this.cur_page.page.frm._save()
	//							//cur_frm.save()
	//							cur_frm.reload_doc()
	//							cur_frm.refresh()

	//							frappe.utils.filter_dict(frm.fields_dict["movimentos_caixa"].grid.docfields, {"fieldname": "descricao_movimento"})[0].read_only = true;	
	//							frappe.utils.filter_dict(frm.fields_dict["movimentos_caixa"].grid.docfields, {"fieldname": "tipo_pagamento"})[0].read_only = true;	
	//							frappe.utils.filter_dict(frm.fields_dict["movimentos_caixa"].grid.docfields, {"fieldname": "valor_pago"})[0].read_only = true;
	//							frappe.utils.filter_dict(frm.fields_dict["movimentos_caixa"].grid.docfields, {"fieldname": "hora_atendimento"})[0].read_only = true;
								//this.cur_frm.page._save()
	//							cur_frm.save()
								
	//						}else{
	//							alert("Os Calculos do Fecho de Caixa nao foram feitos!")
	//							return
	//						}
	//
	//					}
	//				});
				}
			}else if (cur_frm.doc.amount_caixa==0){
				//Nao pode fechar o Caixa ... nao tem NADA !!!!
		
			}		

		
		}
	}
});



var movimentos_add = function(frm) {
	var me = this; 
	var fecho = 0;

	if (cur_frm.doc.status_caixa=="Fechado"){
		fecho = 2	
	}

	show_alert("Processando Movimento do dia!!! Por favor aguarde...",3)

	frappe.call({
		method: "gestpensao.gestpensao.doctype.api.caixa_movimentos_in",
		args: {
			"start":frm.doc.data_hora,
			"caixa":frm.doc.name,
			"fecho":fecho,
				
		},
		callback: function(r) {
			if (r.message !=undefined){
				show_alert("Calculos do Fecho concluidos",2)
				
				cur_frm.reload_doc()

			}else{
				//alert("Os Calculos do Fecho de Caixa nao foram feitos!")
				return
			}

		}
	});

}
