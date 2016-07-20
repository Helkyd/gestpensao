// Copyright (c) 2016, Helio de Jesus and contributors
// For license information, please see license.txt

//var dd=cur_frm.call({method:"empresa_load",args:{"start":"moeda"}})

frappe.ui.form.on('GESTAO_QUARTOS', {
	onload: function(frm) {

		if (frm.doc.status_reserva=="Ocupado" && frm.doc.horas >=0){
			cur_frm.toggle_enable("numero_quarto",false)
			cur_frm.toggle_enable("horas",false)
			cur_frm.toggle_enable("hora_entrada",false)
			cur_frm.toggle_enable("hora_saida",false)
			cur_frm.toggle_enable("pagamento_por",false)
			cur_frm.set_df_property("reserva_numero","hidden",true)
			cur_frm.set_df_property("servico_pago_por","hidden",true)

		}else if (frm.doc.status_reserva=="Ocupado" && frm.doc.horas ==undefined){
			cur_frm.toggle_enable("status_reserva",false)	
			cur_frm.set_df_property("reserva_numero","hidden",true)
			cur_frm.set_df_property("servico_pago_por","hidden",true)

		}else if (frm.doc.status_reserva=="Fechado"){
			cur_frm.toggle_enable("numero_quarto",false)
			cur_frm.toggle_enable("horas",false)
			cur_frm.toggle_enable("hora_entrada",false)
			cur_frm.toggle_enable("hora_saida",false)
			cur_frm.toggle_enable("pagamento_por",false)	
			cur_frm.toggle_enable("status_reserva",false)	
			cur_frm.set_df_property("reserva_numero","hidden",true)
			cur_frm.set_df_property("servico_pago_por","hidden",true)

		}else if (frm.doc.status_reserva=="Ativo"){
			cur_frm.set_df_property("horas","label","Dias")
			cur_frm.toggle_enable("numero_quarto",false)
			cur_frm.toggle_enable("horas",false)
			cur_frm.toggle_enable("hora_entrada",false)
			cur_frm.toggle_enable("hora_saida",false)
			cur_frm.toggle_enable("pagamento_por",false)
			cur_frm.set_df_property("reserva_numero","hidden",true)
			cur_frm.set_df_property("servico_pago_por","hidden",true)

		}


	}
});

frappe.ui.form.on('GESTAO_QUARTOS', {
	refresh: function(frm) {
		cur_frm.fields_dict['numero_quarto'].get_query = function(doc){
			return{
				filters:{
					"status":"Livre"
				}
			}
		}
		calculate_totals(frm);
		
//		if (dd.readyState==4){
//			show_alert("Moeda : " + dd.responseJSON.message,2)
//			alert("carrega o Simbolo moeda ")
			
//		}

		if (cur_frm.doc.status_reserva=="Ocupado"){
			frm.set_df_property("status_reserva","options","Ocupado\nFechado")
		}else if (cur_frm.doc.status_reserva=="Ativo"){
			frm.set_df_property("status_reserva","options","Ativo\nFechado")
		}




	}
});


frappe.ui.form.on('GESTAO_QUARTOS','numero_quarto',function(frm,cdt,cdn){

//	if (frm.doc.numero_quarto !=""){
		quartos_('QUARTOS',frm.doc.numero_quarto)
//	}
	cur_frm.refresh_fields('preco','tipo_quarto');
	

});

frappe.ui.form.on('GESTAO_QUARTOS','horas',function(frm,cdt,cdn){


	frappe.model.set_value(cdt,cdn,'hora_saida',moment(cur_frm.doc.hora_entrada).add(cur_frm.doc.horas,'hours'))
	frappe.model.set_value(cdt,cdn,'total',frm.doc.preco*frm.doc.horas)
	cur_frm.refresh_fields();	

});


frappe.ui.form.on("RESERVAS_Services","nome_servico",function(frm,cdt,cdn){


	var d =locals[cdt][cdn];
	cur_frm.add_fetch('nome_servico','preco','preco_servico')	

	if (frm.doc.status_reserva=="Fechado"){
		//frappe.model.set_value(cdt,cdn,'nome_servico',"")
		frappe.utils.filter_dict(frm.fields_dict["servicos"].grid.docfields, {"fieldname": "nome_servico"})[0].read_only = true;	
		frappe.utils.filter_dict(frm.fields_dict["servicos"].grid.docfields, {"fieldname": "quantidade"})[0].read_only = true;	
		frappe.utils.filter_dict(frm.fields_dict["servicos"].grid.docfields, {"fieldname": "preco_servico"})[0].read_only = true;
		frappe.utils.filter_dict(frm.fields_dict["servicos"].grid.docfields, {"fieldname": "total"})[0].read_only = true;	
	
	}else{

		cur_frm.refresh_fields('preco_servico')

		frappe.model.set_value(cdt,cdn,'total',d.preco_servico*d.quantidade)
		frappe.utils.filter_dict(frm.fields_dict["servicos"].grid.docfields, {"fieldname": "preco_servico"})[0].read_only = true;
		frappe.utils.filter_dict(frm.fields_dict["servicos"].grid.docfields, {"fieldname": "total"})[0].read_only = true;
		calculate_totals(frm, cdt, cdn);
	}

});

frappe.ui.form.on("RESERVAS_Services","quantidade",function(frm,cdt,cdn){

	var d =locals[cdt][cdn];
//	var item = frappe.get_doc(cdt,cdn)
	cur_frm.add_fetch('nome_servico','preco','preco_servico')

	frappe.model.set_value(cdt,cdn,'total',d.preco_servico*d.quantidade)
	frappe.utils.filter_dict(frm.fields_dict["servicos"].grid.docfields, {"fieldname": "preco_servico"})[0].read_only = true;
	frappe.utils.filter_dict(frm.fields_dict["servicos"].grid.docfields, {"fieldname": "total"})[0].read_only = true;
	calculate_totals(frm, cdt, cdn);


});


var calculate_totals = function(frm, cdt,cdn) {
	var tbl1 = frm.doc.servicos || [];
	var total_valor = 0; 
	for(var i = 0; i < tbl1.length; i++){
		total_valor += flt(tbl1[i].total);
	}
	frappe.model.set_value(cdt,cdn,'total_servicos',total_valor)
	frm.doc.total_servicos = total_valor
	refresh_many(['total_servicos']);
}

var calculate_totals1 = function(frm, cdt,cdn) {
	var d = locals[cdt][cdn]
	var tbl1 = frm.servicos || [];
	var total_valor = 0; 
	for(var i = 0; i < tbl1.length; i++){
		total_valor += flt(tbl1[i].total);
	}
	frappe.model.set_value(cdt,cdn,'total_servicos',total_valor)
	frm.total_servicos = total_valor
	refresh_many(['total_servicos']);
}

cur_frm.cscript.pagar_servicos = function(frm,cdt,cdn) {

	alert("Apos pagamento dos Serviços o Quarto estará livre.");
	calculate_totals1(frm,cdt,cdn)	
	
	var d = frappe.prompt([
        	{label:__("Pagamento por:"), fieldtype:"Select",options: ["1-Cash","2-TPA", "3-Conta-corrente","4-Não Pagar"],fieldname:"priority",'reqd': 1},
        ],
        function(values){
            var c = d.get_values();
            var me = this;
            show_alert("Selecionado : " + c.priority,5)
		// Status Quarto deve mudar para Livre
		// Status da Gestao_quarto para 
		if (c.priority=="4-Não Pagar"){
			//Manter Gestao_quarto status OCUPADO
			frappe.model.set_value(cdt,cdn,'status_reserva',"Ocupado")
			cur_frm.refresh_fields("status_reserva");	

		} else if ((c.priority=="1-Cash") || (c.priority=="2-TPA")) {
			//Gestao_quarto status Fechado ... Ja nao se pode alterar.
			frappe.model.set_value(cdt,cdn,'status_reserva',"Fechado")
			frappe.model.set_value(cdt,cdn,'servico_pago_por',c.priority)
			cur_frm.refresh_fields("status_reserva");	
		} else if (c.priority=="3-Conta-corrente") {
			//Gestao_quarto status Fechado ... Ja nao se pode alterar.
			//Contas ou valores para a Conta corrente do cliente.

			//Dialog a pedir o Cliente
			frappe.model.set_value(cdt,cdn,'status_reserva',"Fechado")
			frappe.model.set_value(cdt,cdn,'servico_pago_por',c.priority)
			cur_frm.refresh_fields("status_reserva");	



		}

        },
        	'Pagamento',
	        'Fazer Pagamento'
        );
	
}


frappe.ui.form.on("GESTAO_QUARTOS","status_reserva",function(frm,cdt,cdn){


	if (frm.doc.status_reserva=="Livre"){
	// Tem que verificar se as contas estao pagas.
		alert("Verificando contas")

	}else if (frm.doc.status_reserva=="Fechado"){
	// Tem que verificar os pagamentos ....
		cur_frm.toggle_display("servico_pago_por",true)
		if ((frm.doc.servico_pago_por =="1-Cash") || (frm.doc.servico_pago_por =="2-TPA")){
			// Pode prosseguir com pagamento
			alert("Pagamento de Serviços feito. Por favor salvar registo para liberar o Quarto.")	
		} else if (frm.doc.total_servicos==0) {
			alert("Quarto liberado pois nao tem servicos...")	
			
		} else {
			// Esta vazio .....
			alert("Nao pode Fechar pois ainda nao foram feitos os pagamentos...")	
//			frappe.model.set_value(cdt,cdn,'status',"Ocupado")
//			cur_frm.refresh_fields("status");	
		}
	}else if ((frm.doc.status_reserva=="Ativo") && (frm.doc.reserva_numero !="")){
		alert("Quarto Ativo... por favor Salvar registo")
		
	}

});

frappe.ui.form.on("GESTAO_QUARTOS","pagamento_por",function(frm,cdt,cdn){

	if (frm.doc.pagamento_por=="Conta-corrente"){
	// Pedir o Cliente e se o mesmo for membro e autorizado ...
 
		alert("Somente Membros podem ter Conta-corrente")

	
	}

});

var quartos_ = function(frm,cdt,cdn){
	frappe.model.with_doc(frm, cdt, function() { 
		var d = frappe.model.get_doc(frm,cdt)
		cur_frm.doc.preco = d.preco
		cur_frm.doc.tipo_quarto = d.tipo_quarto
	});
}

