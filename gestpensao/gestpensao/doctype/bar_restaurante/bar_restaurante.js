// Copyright (c) 2016, Helio de Jesus and contributors
// For license information, please see license.txt

cur_frm.call({method:"empresa_load",args:{"start":"moeda"}})
//cur_frm.call({method:"empresa_load1",args:{"start":"moeda"}})
//cur_frm.add_fetch("nome_mesa","comp","nome_empresa")
lista =cur_frm.call({method:"lista_clientes",args:{"start":"moeda"}})

frappe.ui.form.on('BAR_RESTAURANTE', {
	onload: function(frm) {

		if (frm.doc.status_atendimento=="Ocupado" && frm.doc.bar_tender ==undefined){

			//Novo Registo 

			cur_frm.toggle_enable("bar_tender",false)
			cur_frm.toggle_enable("pagamento_por",false)
			cur_frm.toggle_enable("status_atendimento",false)
			
			
//			cur_frm.set_df_property("reserva_numero","hidden",true)
//			cur_frm.set_df_property("servico_pago_por","hidden",true)


		}else if (frm.doc.status_atendimento=="Ocupado" && frm.doc.total_servicos !=0){
			cur_frm.toggle_enable("nome_mesa",false)
			cur_frm.toggle_enable("nome_cliente",false)
			cur_frm.toggle_enable("status_atendimento",false)
//			cur_frm.toggle_enable("hora_entrada",false)
//			cur_frm.toggle_enable("hora_saida",false)
//			cur_frm.toggle_enable("pagamento_por",false)	
//			cur_frm.toggle_enable("status_reserva",false)	
//			cur_frm.set_df_property("reserva_numero","hidden",true)
//			cur_frm.set_df_property("servico_pago_por","hidden",true)
		}else if (frm.doc.status_atendimento=="Fechado"){
			cur_frm.toggle_enable("nome_mesa",false)
			cur_frm.toggle_enable("nome_cliente",false)
			cur_frm.toggle_enable("pagamento_por",false)
			cur_frm.toggle_enable("status_atendimento",false)
			cur_frm.toggle_enable("extras_item",false)
			cur_frm.toggle_enable("pagamento_botao",false)
	
//			cur_frm.toggle_enable("status_reserva",false)	
//			cur_frm.set_df_property("reserva_numero","hidden",true)
//			cur_frm.set_df_property("servico_pago_por","hidden",true)


		}

//		cur_frm.fields_dict["extras_item"].frm.grids[0].frm.fetch_dict["nome_servico"].set_query = function(doc){
//			return{
//				query: "gestpensao.controllers.queries.group_servicos_query",
//			}
//		}


		cur_frm.fetch_dict["nome_servico"].set_query= function(doc){
			return{
				query: "gestpensao.controllers.queries.group_servicos_query",
			}
		}


	}
});
frappe.ui.form.on('BAR_RESTAURANTE', {
	refresh: function(frm) {

		cur_frm.fields_dict['nome_mesa'].get_query = function(doc){
			return{
				filters:{
					"status_mesa":"Livre",

				},
				
			}
		}

		cur_frm.fields_dict["extras_item"].grid.get_field("nome_servico").get_query = function(doc){
			return{
				filters:{
					 "consumo_servico":"Consumo"
				}
			}
		}


		if (cur_frm.doc.bar_tender == undefined){

			cur_frm.fields_dict["bar_tender"].set_value = frappe.session.user	
			cur_frm.refresh_fields("bar_tender")	

		}	


		var me = this;
		if(this.load){
			alert(this.load)				
			this.load = false;
		}else {
//if(this.connection_status){
			//alert("outra coisa")

			if (frm.doc.status_atendimento=="Ocupado" && frm.doc.bar_tender ==undefined){
				//Novo Registo
//				cur_frm.page.clear_primary_action()
//				cur_frm.page.clear_secondary_action()
//				cur_frm.page.set_primary_action()
				cur_frm.page.clear_user_actions()

			}else if (cur_frm.doc.docstatus==0 &&  frm.doc.status_atendimento !="Fechado" &&  frm.doc.pagamento_por =="None") {
				cur_frm.page.set_secondary_action(__("PAGAMENTO"), function() {
					//me.validate()
					//me.create_invoice();
					//me.make_payment();
					//msgprint("Botao Pagar")
					//Muda o docstatus para poder imprimir.
					cur_frm.doc.docstatus = 1 
					//pagamento_botao(frm)
					
					frm.cscript.pagamento_botao.call()

					// Retira o menu NEW
					//cur_frm.page.clear_primary_action()

				}, "octicon octicon-credit-card");
			}else if(cur_frm.doc.docstatus == 1) {
				cur_frm.page.set_primary_action(__("Imprimir"), function() {
//					html = frappe.render_template("Recibo_Bar_Restaurante", {"nome_mesa": cur_frm.doc.nome_mesa})
					frappe.get_print("Print Format","Recibo_Bar_Restaurante",cur_frm.doc.nome_mesa)
					print_document(html)
				})
			}else if (frm.doc.status_atendimento !="Fechado") {
//				cur_frm.page.clear_primary_action()
				//cur_frm.page.set_primary_action()
				cur_frm.page.clear_user_actions()
			}else{
				cur_frm.page.clear_primary_action()
				cur_frm.page.clear_secondary_action()
			}

//			cur_frm.page.set_secondary_action(__("Save"), function() {
//				me.save_previous_entry();
//				me.create_new();
//			}, "octicon octicon-plus").addClass("btn-primary");
		}	

//		if (cur_frm.fields_dict["total_servicos"].df.fieldtype =="Currency" && cur_frm.fields_dict["total_servicos"].df.options){
//			if (cur_frm.doc.total_servicos.df.fieldtype=="Currency" && cur_frm.doc.total_servicos.df.options) {
//			if (cur_frm.fields_dict["total_servicos"].df.options!=-1){
//				add_field(cur_frm.fields_dict["total_servicos"].df.options.split(":")[1]);
//				}
		
//			}
//		}
		//if (cur_frm.doc.status_atendimento=="Ocupado"){
		//	frm.set_df_property("status_atendimento","options","Fechado")
		//}

	}
});

var print_document = function(html){
	var w = window.open();
	w.document.write(html);
	w.document.close();
	setTimeout(function(){
		w.print();
		w.close();
	}, 1000)
}

frappe.ui.form.on("BAR_RESTAURANTE","nome_mesa",function(frm,cdt,cdn){

	frappe.model.set_value(cdt,cdn,'bar_tender',frappe.session.user)
	cur_frm.refresh_fields('bar_tender')

});

cur_frm.add_fetch('nome_servico','preco','preco_servico')	



frappe.ui.form.on("Extras_item","nome_servico",function(frm,cdt,cdn){


	frappe.model.set_value(cdt,cdn,'bar_tender',frappe.session.user)

	var d =locals[cdt][cdn];
	cur_frm.add_fetch('nome_servico','preco','preco_servico')	
	cur_frm.refresh_fields('preco_servico','bar_tender')

	servicos_('SERVICOS',d.nome_servico)

	cur_frm.refresh_fields('preco_servico','bar_tender')

	if (frm.doc.status_atendimento=="Fechado"){
		//frappe.model.set_value(cdt,cdn,'nome_servico',"")
		frappe.utils.filter_dict(frm.fields_dict["extras_item"].grid.docfields, {"fieldname": "nome_servico"})[0].read_only = true;	
		frappe.utils.filter_dict(frm.fields_dict["extras_item"].grid.docfields, {"fieldname": "quantidade"})[0].read_only = true;	
		frappe.utils.filter_dict(frm.fields_dict["extras_item"].grid.docfields, {"fieldname": "preco_servico"})[0].read_only = true;
		frappe.utils.filter_dict(frm.fields_dict["extras_item"].grid.docfields, {"fieldname": "total_extra"})[0].read_only = true;
		frappe.utils.filter_dict(frm.fields_dict["extras_item"].grid.docfields, {"fieldname": "tipo_extra"})[0].read_only = true;	
		frappe.utils.filter_dict(frm.fields_dict["extras_item"].grid.docfields, {"fieldname": "total_extra"})[0].read_only = true;
		frappe.utils.filter_dict(frm.fields_dict["extras_item"].grid.docfields, {"fieldname": "preco_extra"})[0].read_only = true;	
	
	}else{

//		cur_frm.refresh_fields('preco_servico')

		frappe.model.set_value(cdt,cdn,'total_extra',d.preco_servico*d.quantidade)
		frappe.utils.filter_dict(frm.fields_dict["extras_item"].grid.docfields, {"fieldname": "preco_servico"})[0].read_only = true;
		frappe.utils.filter_dict(frm.fields_dict["extras_item"].grid.docfields, {"fieldname": "total_extra"})[0].read_only = true;
		frappe.utils.filter_dict(frm.fields_dict["extras_item"].grid.docfields, {"fieldname": "preco_extra"})[0].read_only = true;	

		calculate_totals(frm, cdt, cdn);
	}

});


frappe.ui.form.on("Extras_item","tipo_extra",function(frm,cdt,cdn){

	var d =locals[cdt][cdn];
	cur_frm.add_fetch('nome_servico','preco','preco_servico')	
	cur_frm.refresh_fields('preco_servico')

	servicos_('Extras',d.tipo_servico)

	cur_frm.refresh_fields('preco_servico','bar_tender')

	if (frm.doc.status_atendimento=="Fechado"){
		//frappe.model.set_value(cdt,cdn,'nome_servico',"")
		frappe.utils.filter_dict(frm.fields_dict["extras_item"].grid.docfields, {"fieldname": "nome_servico"})[0].read_only = true;	
		frappe.utils.filter_dict(frm.fields_dict["extras_item"].grid.docfields, {"fieldname": "quantidade"})[0].read_only = true;	
		frappe.utils.filter_dict(frm.fields_dict["extras_item"].grid.docfields, {"fieldname": "preco_servico"})[0].read_only = true;
		frappe.utils.filter_dict(frm.fields_dict["extras_item"].grid.docfields, {"fieldname": "total_extra"})[0].read_only = true;
		frappe.utils.filter_dict(frm.fields_dict["extras_item"].grid.docfields, {"fieldname": "tipo_extra"})[0].read_only = true;	
		frappe.utils.filter_dict(frm.fields_dict["extras_item"].grid.docfields, {"fieldname": "total_extra"})[0].read_only = true;
		frappe.utils.filter_dict(frm.fields_dict["extras_item"].grid.docfields, {"fieldname": "preco_extra"})[0].read_only = true;	
	
	}else{

//		cur_frm.refresh_fields('preco_servico')

		frappe.model.set_value(cdt,cdn,'total_extra',d.preco_servico*d.quantidade)
		frappe.utils.filter_dict(frm.fields_dict["extras_item"].grid.docfields, {"fieldname": "preco_servico"})[0].read_only = true;
		frappe.utils.filter_dict(frm.fields_dict["extras_item"].grid.docfields, {"fieldname": "total_extra"})[0].read_only = true;
		frappe.utils.filter_dict(frm.fields_dict["extras_item"].grid.docfields, {"fieldname": "preco_extra"})[0].read_only = true;	

		calculate_totals1(frm, cdt, cdn);
	}

});


frappe.ui.form.on("Extras_item","quantidade",function(frm,cdt,cdn){

	var d =locals[cdt][cdn];
	cur_frm.add_fetch('nome_servico','preco','preco_servico')

	servicos_('SERVICOS',d.nome_servico)

	frappe.model.set_value(cdt,cdn,'total_extra',d.preco_servico*d.quantidade)
	frappe.utils.filter_dict(frm.fields_dict["extras_item"].grid.docfields, {"fieldname": "preco_servico"})[0].read_only = true;
	frappe.utils.filter_dict(frm.fields_dict["extras_item"].grid.docfields, {"fieldname": "total_extra"})[0].read_only = true;
	frappe.utils.filter_dict(frm.fields_dict["extras_item"].grid.docfields, {"fieldname": "preco_extra"})[0].read_only = true;	
	calculate_totals(frm, cdt, cdn);


});

cur_frm.cscript.pagamento_botao = function() {

	var d = locals[cur_frm.doctype][cur_frm.docname]

	//alert("Apos pagamento a Mesa estará livre.");
	calculate_totals2(cur_frm,cur_frm.doctype,cur_frm.docname)	
	avancar = false

	var d = frappe.prompt([
		{label:__("Valor a Pagar: "),fieldtype:"Read Only",fieldname:"apagar",default: cur_frm.doc.total_servicos},
		{label:__("Valor Pago: "),fieldtype:"Currency",fieldname:"vpago",default: cur_frm.doc.total_servicos},
		{label:__("Troco: "),fieldtype:"Read Only",fieldname:"troco",default: 0},
        	{label:__("Pagamento por:"), fieldtype:"Select",options: ["Cash","TPA", "Conta-Corrente","Não Pagar"],fieldname:"priority",'reqd': 1,default:"Cash"},
        ],
        function(values){
            var c = d.get_values();
            var me = this;
            show_alert("Selecionado : " + c.priority,5)
		// Status Mesa deve mudar para Livre
		// Status do Bar_Restaurante para 


		if (c.priority=="Não Pagar"){
			//Manter bar_restaurante status OCUPADO
			frappe.model.set_value(cur_frm.doctype,cur_frm.docname,'status_atendimento',"Ocupado")
			cur_frm.refresh_fields("status_atendimento");	

		} else if ((c.priority=="Cash") || (c.priority=="TPA")) {
			//Bar_Restaurante status Fechado ... Ja nao se pode alterar.
			frappe.model.set_value(cur_frm.doctype,cur_frm.docname,'status_atendimento',"Fechado")
			frappe.model.set_value(cur_frm.doctype,cur_frm.docname,'pagamento_por',c.priority)
			frappe.model.set_value(cur_frm.doctype,cur_frm.docname,'valor_pago',cur_frm.doc.total_servicos)
			cur_frm.refresh_fields("status_atendimento");	
			cur_frm.doc.docstatus = 1 
//			cur_frm.toggle_enable("pagamento_botao",false)

//			cur_frm.page.btn_primary.click()
			this.cur_page.page.frm._save()
			cur_frm.page.clear_primary_action()
			cur_frm.page.clear_secondary_action()

			cur_frm.page.set_primary_action(__("Imprimir"), function() {
//					html = frappe.render_template("Recibo_Bar_Restaurante", {"nome_mesa": cur_frm.doc.nome_mesa})
				frappe.get_print("Print Format","Recibo_Bar_Restaurante",cur_frm.doc.nome_mesa)
				print_document(html)
			})
			

		} else if (c.priority=="Conta-Corrente") {
			//Bar_Restaurante status Fechado ... Ja nao se pode alterar.
			//Contas ou valores para a Conta corrente do cliente.
			frappe.model.set_value(cur_frm.doctype,cur_frm.docname,'status_atendimento',"Fechado")
			frappe.model.set_value(cur_frm.doctype,cur_frm.docname,'pagamento_por',"Conta-Corrente")
			frappe.model.set_value(cur_frm.doctype,cur_frm.docname,'conta_corrente',"nome do cliente")
			frappe.model.set_value(cur_frm.doctype,cur_frm.docname,'valor_pago',cur_frm.doc.total_servicos)
			cur_frm.refresh_fields("status_atendimento");	
			//Dialog a pedir o Cliente
			// Status tem que mudar para conta-corrente ...
			
			if (cur_frm.doc.nome_cliente=="Diversos"){
				// Verifica se nome_cliente is empty e pede para selecionar o Cliente autorizado (MEMBROS ONLY!!!!)
				avancar = true	
				CC_nomecliente()	
				cur_frm.toggle_enable("pagamento_botao",false)		
			}


		}

        },
        	'Pagamento',
	        'Fazer Pagamento'
     
        );
}


var CC_nomecliente = function(frm,cdt,cdn){
	var listaclientes= []
	if (lista.statusText=="OK"){
		for (x in lista.responseJSON.message){
			if (lista.responseJSON.message[x] != "Diversos" && lista.responseJSON.message[x] != undefined){
				listaclientes[x]= lista.responseJSON.message[x]
			}
		}
	}

	if (avancar==true){
		var dd = frappe.prompt([
			{label:__("Nome do Cliente: "),fieldtype:"Select",fieldname:"pcliente",options: [listaclientes[0],listaclientes[1],listaclientes[2],listaclientes[3],listaclientes[4]]},
	        ],
        	function(values){
	        	var cc = dd.get_values();
            		var mee = this;
			show_alert("Selecionado : " + cc.pcliente,5)
			if (cc.pcliente !=""){
				cur_frm.set_value(cdt,cdn,'status_atendimento',"Fechado")
				cur_frm.set_value(cdt,cdn,'pagamento_por',"Conta-Corrente")
				cur_frm.set_value('conta_corrente',cc.pcliente)
				
				cur_frm.refresh_fields("status_atendimento","conta_corrente");	
				//Click SAVE				
//				cur_frm.page.btn_primary.click()
				this.cur_page.page.frm._save()
				cur_frm.page.clear_primary_action()
				cur_frm.page.clear_secondary_action()



				cur_frm.page.set_primary_action(__("Imprimir"), function() {
//					html = frappe.render_template("Recibo_Bar_Restaurante", {"nome_mesa": cur_frm.doc.nome_mesa})
					frappe.get_print("Print Format","Recibo_Bar_Restaurante",cur_frm.doc.nome_mesa)
					print_document(html)
				})

				//alert("Cliente " + cc.pcliente + " selecionado")
			}
		},
			'Lista de Clientes Membros',
			'Processar Conta-Corrente'
		);

	}



}

var calculate_totals2 = function(frm,cdt,cdn) {
	var tbl1 = cur_frm.doc.extras_item || [];
	var total_valor = 0; 
	for(var i = 0; i < tbl1.length; i++){
		total_valor += flt(tbl1[i].total_extra);
	}
	frappe.model.set_value(cdt,cdn,'total_servicos',total_valor)
	frm.doc.total_servicos = total_valor
	refresh_many(['total_servicos']);
}

var calculate_totals = function(frm, cdt,cdn) {
	var tbl1 = frm.doc.extras_item || [];
	var total_valor = 0; 
	for(var i = 0; i < tbl1.length; i++){
		total_valor += flt(tbl1[i].total_extra);
	}
	frappe.model.set_value(cdt,cdn,'total_servicos',total_valor)
	frm.doc.total_servicos = total_valor
	refresh_many(['total_servicos']);
}

var calculate_totals1 = function(frm, cdt,cdn) {
	var d = locals[cdt][cdn]
	var tbl1 = frm.extras_item || [];
	var total_valor = 0; 
	for(var i = 0; i < tbl1.length; i++){
		total_valor += flt(tbl1[i].total_extra);
	}
	frappe.model.set_value(cdt,cdn,'total_servicos',total_valor)
	frm.total_servicos = total_valor
	refresh_many(['total_servicos']);
}


var servicos_ = function(frm,cdt,cdn){
	frappe.model.with_doc(frm, cdt, function() { 
		var d = frappe.model.get_doc(frm,cdt)
//		cur_frm.doc.preco_servico = d.preco
		frappe.model.set_value(cdt,cdn,frappe.utils.filter_dict(cur_frm.fields_dict["extras_item"].grid.docfields, {"fieldname": "preco_servico"}),d.preco)
		cur_frm.refresh_fields()


	});
}

var add_field = function(fieldname) {
	var t = "`tabBAR_RESTAURANTE`.";
	this.fields = [];
	field = t + "`" + fieldname + "`"
	if(me.fields.indexOf(field)=== -1)
		me.fields.push(field);
	}

