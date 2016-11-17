// Copyright (c) 2016, Helio de Jesus and contributors
// For license information, please see license.txt


frappe.ui.form.on('CONTAS_CORRENTES', {

	onload: function(frm, cdt,cdn) {





//		frm.fields_dict.cc_bar_restaurante.grid.get_field('numero_registo').set_query = function() {
//			return {
//				filters: {
//					"status_conta_corrente":"Pago"

//				}
//			}
	
//		}		

		cur_frm.toggle_enable("cc_nome_cliente",false)	
		cur_frm.toggle_enable("cc_bar_restaurante",false)	
		cur_frm.toggle_enable("cc_valor_divida",false)	
		cur_frm.toggle_enable("cc_valores_pagos",false)	

		frappe.utils.filter_dict(frm.fields_dict["cc_bar_restaurante"].grid.docfields, {"fieldname": "numero_registo"})[0].read_only = true;	
		frappe.utils.filter_dict(frm.fields_dict["cc_bar_restaurante"].grid.docfields, {"fieldname": "descricao_servico"})[0].read_only = true;	
		frappe.utils.filter_dict(frm.fields_dict["cc_bar_restaurante"].grid.docfields, {"fieldname": "total"})[0].read_only = true;	
		frappe.utils.filter_dict(frm.fields_dict["cc_bar_restaurante"].grid.docfields, {"fieldname": "total_servicos"})[0].read_only = true;	
		frappe.utils.filter_dict(frm.fields_dict["cc_bar_restaurante"].grid.docfields, {"fieldname": "data_registo"})[0].read_only = true;	


//		cur_frm.set_query("numero_registo","cc_bar_restaurante",function(doc,cdt,cdn){
//			var d = locals[cdt][cdn]
//			return{
//				filters: [
//					['CC_detalhes','status_conta_corrente','=','Pago']
//				]
			
//			}

//		});


	
//		frm.fields_dict['cc_bar_restaurante'].grid.get_field('numero_registo').set_query = function(cdt,cdn) {
//			var d = locals[cdt][cdn];
//			return {
//				filters:[
//					['CC_detalhes', 'status_conta_corrente', '=', 'Pago']
//				]
//			}
//		}




		
//		grid_row = frm.fields_dict['cc_bar_restaurante'].grid.grid_rows_by_docname['name']
//		field = frappe.utils.filter_dict(grid_row.docfields, {fieldname: "cc_bar_restaurante")[0]})

//		var field = frappe.utils.filter_dict(cur_frm.fields_dict["cc_bar_restaurante"].grid.grid_rows_by_docname[cdn].docfields, {'fieldname': "status_conta_corrente"})[0];
		

		
	
	},

	refresh: function(frm) {



		frappe.ui.form.GridRow = frappe.ui.form.GridRow.extend(
		{
			set_data: function() {
				//this.frm.clear_table("cc_bar_restaurante")
				
				console.log(this.doc.status_conta_corrente)
//				if (this.doc.status_conta_corrente == "Pago"){
//					this.wrapper.data({
//						"doc": this.doc
//					})
//				}
			},

		});

		cur_frm.page.set_secondary_action(__("ACTUALIZAR CONTAS"), function() {

			//Look for all records not inserted to update the debt
			ordem = cur_frm.call({method:"get_bar_restaurante_cc",args:{"cliente":cur_frm.doc.cc_nome_cliente}})



			divida = 0
			pago = 0
			var contas = frm.doc.cc_bar_restaurante || 	 [];
			for (var i = 0; i < contas.length; i++){
				if (contas[i].status_conta_corrente == "Não Pago") {
					divida += contas[i].total
				}else if (contas[i].status_conta_corrente == "Pago") {
					pago += contas[i].total
				}

			}
//			cur_frm.doc.cc_valor_divida = divida
			frappe.model.set_value(cur_frm.doctype,cur_frm.docname,'cc_valor_divida',divida)
			frappe.model.set_value(cur_frm.doctype,cur_frm.docname,'cc_valores_pagos',pago)
			//cur_frm.save()
			refresh_field("cc_valor_divida","cc_bar_restaurante")
			

			//Reorder IDX
			//ordem = cur_frm.call({method:"ordem_idx",args:{"cliente":cur_frm.doc.cc_nome_cliente}})

			//cur_frm.reload_doc()

		}, "octicon octicon-credit-card");

		if (cur_frm.doc.cc_status_conta_corrente =="Não Pago"){
			cur_frm.toggle_enable("cc_status_conta_corrente",true)	
		}else{
			cur_frm.toggle_enable("cc_status_conta_corrente",false)	
		}



	}
});


frappe.ui.form.on("CONTAS_CORRENTES","valor_divida",function(frm,cdt,cdn){

});


cur_frm.set_query("status_conta_corrente","cc_bar_restaurante",function(doc,cdt,cdn){
	var d = locals[cdt][cdn]
	return{
		filters: [
			['status_conta_corrente','=','Pago']
		]
			
	}

});



frappe.ui.form.on("CC_detalhes","status_conta_corrente",function(doc,cdt,cdn){

	//Needs to update the Record from BAR or Quarto to PAGO
	var d =locals[cdt][cdn];
	if (d.status_conta_corrente == "Pago"){	
		alert("aqui")
	}	
});

frappe.ui.form.on("CONTAS_CORRENTES","cc_status_conta_corrente",function(frm,cdt,cdn){
	if (cur_frm.doc.cc_status_conta_corrente =="Pago"){

		frappe.confirm(
		    'Todas as contas NAO PAGAS seram fechadas. Tem a certeza?',
		    function(){
//			cur_frm.save()
//			cur_frm.refresh()
			show_alert("Processando Contas...por favor aguarde",3 )

			fechar_contas = cur_frm.doc.cc_bar_restaurante || [];

			for (var i = 0; i < fechar_contas.length; i++){
				if (fechar_contas[i].cc_tipo == "Bar"){
					qq = cur_frm.call({method:"set_bar_cc",args:{"cliente":fechar_contas[i].numero_registo}})
				}else if  (fechar_contas[i].cc_tipo == "Quarto"){
					qq = cur_frm.call({method:"set_quartos_cc",args:{"cliente":fechar_contas[i].numero_registo}})
				}
				fechar_contas[i].status_conta_corrente = "Pago"

			}
			cur_frm.save()
			cur_frm.refresh()

			//fecharcontas = cur_frm.call({method:"set_bar_quartos_cc",args:{"cliente":cur_frm.doc.cc_nome_cliente}})
			
			
		    },
		    function(){
			show_alert('Cancelada!')
			cur_frm.doc.cc_status_conta_corrente =="Não Pago"
		    }
		)


		//cur_frm.reload_doc()
	}

});


