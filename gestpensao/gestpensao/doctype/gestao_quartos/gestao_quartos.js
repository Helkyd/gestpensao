// For license information, please see license.txt


cur_frm.call({method:"empresa_load",args:{"start":"moeda"}})
lista =cur_frm.call({method:"lista_clientes",args:{"start":"moeda"}})

frappe.ui.form.on('GESTAO_QUARTOS', {
	onload: function(frm) {


		if (frm.doc.status_reserva=="Ocupado" && frm.doc.horas >=0){
			cur_frm.toggle_enable("numero_quarto",false)
			cur_frm.toggle_enable("horas",false)
			cur_frm.toggle_enable("hora_entrada",false)
			cur_frm.toggle_enable("hora_saida",false)
			cur_frm.toggle_enable("tipo_quarto",false)
			cur_frm.toggle_enable("pagamento_por",false)
			cur_frm.set_df_property("reserva_numero","hidden",true)
			cur_frm.set_df_property("servico_pago_por","hidden",true)
			cur_frm.toggle_enable("nome_cliente",false)

		}else if (frm.doc.status_reserva=="Ocupado" && frm.doc.horas ==undefined){
			cur_frm.toggle_enable("status_reserva",false)	
			cur_frm.set_df_property("reserva_numero","hidden",true)
			cur_frm.set_df_property("servico_pago_por","hidden",true)
			cur_frm.toggle_enable("hora_saida",false)
			cur_frm.toggle_enable("total",false)

		}else if (frm.doc.status_reserva=="Fechado"){
			cur_frm.toggle_enable("numero_quarto",false)
			cur_frm.toggle_enable("horas",false)
			cur_frm.toggle_enable("hora_entrada",false)
			cur_frm.toggle_enable("hora_saida",false)
			cur_frm.toggle_enable("tipo_quarto",false)
			cur_frm.toggle_enable("pagamento_por",false)	
			cur_frm.toggle_enable("status_reserva",false)	
			cur_frm.set_df_property("reserva_numero","hidden",true)
			cur_frm.set_df_property("servico_pago_por","hidden",true)
			cur_frm.set_df_property("pagar_servicos","hidden",true)
			cur_frm.toggle_enable("nome_cliente",false)

		}else if (frm.doc.status_reserva=="Ativo"){
			cur_frm.set_df_property("horas","label","Dias")
			cur_frm.toggle_enable("numero_quarto",false)
			cur_frm.toggle_enable("horas",false)
			cur_frm.toggle_enable("hora_entrada",false)
			cur_frm.toggle_enable("hora_saida",false)
			cur_frm.toggle_enable("tipo_quarto",false)
			cur_frm.toggle_enable("pagamento_por",false)
			cur_frm.set_df_property("reserva_numero","hidden",true)
			cur_frm.set_df_property("servico_pago_por","hidden",true)
			cur_frm.toggle_enable("nome_cliente",false)

		}


	}
});

frappe.ui.form.on('GESTAO_QUARTOS', {
	refresh: function(frm) {
		cur_frm.fields_dict['numero_quarto'].get_query = function(doc){
			return{
				filters:{
					"status_quarto":"Livre"
				}
			}
		}
		calculate_totals(frm);

		if (cur_frm.doc.status_reserva=="Livre"){
			frm.set_df_property("status_reserva","options","Ocupado\nFechado")
		}else if (cur_frm.doc.status_reserva=="Ocupado"){
			frm.set_df_property("status_reserva","options","Ocupado\nFechado")
		}else if (cur_frm.doc.status_reserva=="Ativo"){
			frm.set_df_property("status_reserva","options","Ativo\nFechado")

		}
		
	}
});


frappe.ui.form.on('GESTAO_QUARTOS','tipo_quarto',function(frm,cdt,cdn){

	quartos_('QUARTOS_TIPO',frm.doc.tipo_quarto)
	cur_frm.refresh_fields('preco','hora_diaria_noite','total');
	if (cur_frm.doc.hora_diaria_noite =="Noite"){
		//disable Horas and set 1; disable hora_entrada and calculate as from now until 
		cur_frm.set_df_property("horas","label","Dia")
		frappe.model.set_value(cdt,cdn,'horas',1);
	//	frappe.model.set_value(cdt,cdn,'hora_entrada',frappe.utils.data.now_datetime());
		frappe.model.set_value(cdt,cdn,'hora_saida',moment(moment(cur_frm.doc.hora_entrada).add(12,'hours')).format('DD/MM/YY, h:mm a'));
		frappe.model.set_value(cdt,cdn,'total',cur_frm.doc.preco*1)
	}else if (cur_frm.doc.hora_diaria_noite =="Hora"){
		// Horas set 2; 
		cur_frm.set_df_property("horas","label","Horas")
		frappe.model.set_value(cdt,cdn,'horas',2);
	//	frappe.model.set_value(cdt,cdn,'hora_entrada',frappe.utils.data.now_datetime());
		frappe.model.set_value(cdt,cdn,'hora_saida',moment(moment(cur_frm.doc.hora_entrada).add(cur_frm.doc.horas,'hours')));
		cur_frm.doc.hora_saida = moment(cur_frm.doc.hora_entrada).add(cur_frm.doc.horas,'hours');
// moment(frm.doc.hora_entrada).add(frm.doc.horas,'hours')).format('DD/MM/YY, h:mm a'));
		frappe.model.set_value(cdt,cdn,'total',cur_frm.doc.preco*cur_frm.doc.horas)

	}else if (cur_frm.doc.hora_diaria_noite =="Diaria"){
		// Horas set 1 Dia; 
		cur_frm.set_df_property("horas","label","Dias")
		frappe.model.set_value(cdt,cdn,'horas',1);
	//	frappe.model.set_value(cdt,cdn,'hora_entrada',frappe.utils.data.now_datetime());
		frappe.model.set_value(cdt,cdn,'hora_saida',frappe.datetime.add_days(cur_frm.doc.hora_entrada, 1));
		frappe.model.set_value(cdt,cdn,'total',cur_frm.doc.preco*cur_frm.doc.horas)


	}
	frappe.model.set_value(cdt,cdn,'usuario_quarto',frappe.session.user)
	cur_frm.refresh_fields();





});


frappe.ui.form.on('GESTAO_QUARTOS','horas',function(frm,cdt,cdn){

	if (cur_frm.doc.hora_diaria_noite =="Noite"){
		//disable Horas and set 1; disable hora_entrada and calculate as from now until 
//		frappe.model.set_value(cdt,cdn,'horas',1);
	//	frappe.model.set_value(cdt,cdn,'hora_entrada',frappe.utils.data.now_datetime());
		frappe.model.set_value(cdt,cdn,'hora_saida',moment(cur_frm.doc.hora_entrada).add(12,'hours'));
		frappe.model.set_value(cdt,cdn,'total',cur_frm.doc.preco*1)
	}else if (cur_frm.doc.hora_diaria_noite =="Diaria"){
		// Horas set 1 Dia; 
		//frappe.model.set_value(cdt,cdn,'horas',1);
	//	frappe.model.set_value(cdt,cdn,'hora_entrada',frappe.utils.data.now_datetime());
		frappe.model.set_value(cdt,cdn,'hora_saida',frappe.datetime.add_days(cur_frm.doc.hora_entrada, cur_frm.doc.horas));
		frappe.model.set_value(cdt,cdn,'total',cur_frm.doc.preco*cur_frm.doc.horas)

	}else{
		frappe.model.set_value(cdt,cdn,'hora_saida',moment(moment(cur_frm.doc.hora_entrada).add(cur_frm.doc.horas,'hours')));
		//cur_frm.doc.hora_saida = moment(cur_frm.doc.hora_entrada).add(frm.doc.horas,'hours');
		frappe.model.set_value(cdt,cdn,'total',cur_frm.doc.preco*cur_frm.doc.horas)
		cur_frm.refresh_fields();	

	}
});


frappe.ui.form.on('GESTAO_QUARTOS','hora_entrada',function(frm,cdt,cdn){

	if (frm.doc.hora_diaria_noite =="Noite"){

	}else if (frm.doc.hora_diaria_noite =="Diaria"){

	}else{
		frappe.model.set_value(cdt,cdn,'hora_saida',moment(moment(frm.doc.hora_entrada).add(frm.doc.horas,'hours')));;
		//cur_frm.doc.hora_saida = moment(cur_frm.doc.hora_entrada).add(frm.doc.horas,'hours');
		frappe.model.set_value(cdt,cdn,'total',frm.doc.preco*frm.doc.horas)

	}
	cur_frm.refresh_fields('total','hora_saida');	

});

cur_frm.add_fetch('nome_servico','preco','preco_servico')	

frappe.ui.form.on("RESERVAS_Services","nome_servico",function(frm,cdt,cdn){


	var d =locals[cdt][cdn];
	cur_frm.add_fetch('nome_servico','preco','preco_servico')	

	servicos_('SERVICOS',d.nome_servico)

	cur_frm.refresh_fields('preco_servico')

	if (frm.doc.status_reserva=="Fechado"){
		//frappe.model.set_value(cdt,cdn,'nome_servico',"")
		frappe.utils.filter_dict(frm.fields_dict["servicos"].grid.docfields, {"fieldname": "nome_servico"})[0].read_only = true;	
		frappe.utils.filter_dict(frm.fields_dict["servicos"].grid.docfields, {"fieldname": "quantidade"})[0].read_only = true;	
		frappe.utils.filter_dict(frm.fields_dict["servicos"].grid.docfields, {"fieldname": "preco_servico"})[0].read_only = true;
		frappe.utils.filter_dict(frm.fields_dict["servicos"].grid.docfields, {"fieldname": "total"})[0].read_only = true;	
	
	}else{

//		cur_frm.refresh_fields('preco_servico')

		frappe.model.set_value(cdt,cdn,'total',d.preco_servico*d.quantidade)
		frappe.utils.filter_dict(frm.fields_dict["servicos"].grid.docfields, {"fieldname": "preco_servico"})[0].read_only = true;
		frappe.utils.filter_dict(frm.fields_dict["servicos"].grid.docfields, {"fieldname": "total"})[0].read_only = true;
		calculate_totals(frm, cdt, cdn);
	}

});

frappe.ui.form.on("RESERVAS_Services","quantidade",function(frm,cdt,cdn){

	var d =locals[cdt][cdn];
	cur_frm.add_fetch('nome_servico','preco','preco_servico')

	servicos_('SERVICOS',d.nome_servico)

	frappe.model.set_value(cdt,cdn,'total',d.preco_servico*d.quantidade)
	frappe.utils.filter_dict(frm.fields_dict["servicos"].grid.docfields, {"fieldname": "preco_servico"})[0].read_only = true;
	frappe.utils.filter_dict(frm.fields_dict["servicos"].grid.docfields, {"fieldname": "total"})[0].read_only = true;
	calculate_totals(frm, cdt, cdn);


});


frappe.ui.form.on('GESTAO_QUARTOS', {
	validate: function(frm) {
		
//cur_frm.cscript.custom_validate = function (doc){

		show_alert("Validando Dados...",3)


		if (cur_frm.doc.hora_diaria_noite =="Noite"){
			//disable Horas and set 1; disable hora_entrada and calculate as from now until 
	//		frappe.model.set_value(cdt,cdn,'horas',1);
		//	frappe.model.set_value(cdt,cdn,'hora_entrada',frappe.utils.data.now_datetime());
			cur_frm.doc.hora_saida= moment(cur_frm.doc.hora_entrada).add(12,'hours');
			cur_frm.doc.total=cur_frm.doc.preco*1
		}else if (cur_frm.doc.hora_diaria_noite =="Diaria"){
			// Horas set 1 Dia; 
			//frappe.model.set_value(cdt,cdn,'horas',1);
		//	frappe.model.set_value(cdt,cdn,'hora_entrada',frappe.utils.data.now_datetime());
			cur_frm.doc.hora_saida=frappe.datetime.add_days(cur_frm.doc.hora_entrada, cur_frm.doc.horas);
			cur_frm.doc.total=cur_frm.doc.preco*cur_frm.doc.horas

		}else{
			cur_frm.doc.hora_saida=moment(moment(cur_frm.doc.hora_entrada).add(cur_frm.doc.horas,'hours'));
			cur_frm.doc.total = cur_frm.doc.preco*cur_frm.doc.horas
			//cur_frm.call({method:"horas_quarto",args:{"horain":frm.doc.hora_entrada,"horaout":frm.doc.hora_entrada,"registo":frm.doc.name}})
			cur_frm.refresh_fields();	

		}



//		frappe.confirm(
//			'<hr><b> Data Entrada: </b>' + cur_frm.doc.hora_entrada + ' <b>Data Saida: </b>' + cur_frm.doc.hora_saida + ' <b>Total: </b>' + cur_frm.doc.total + ' </hr> <hr>Tem a certeza dos dados? </hr>', 
//			function(){
//				calculate_totals(cur_frm)	
//				validated = true;

//			},
//			function(){
//				cur_frm.doc.docstatus = 2
//				validated = false;
//				return 

//			}
		
//		)

	
	}

	
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

//	alert("Apos pagamento dos Serviços o Quarto estará livre.");
	show_alert("Apos pagamento dos Serviços o Quarto estará livre.",3)

	if (cur_frm.doc.hora_diaria_noite =="Noite"){
		//disable Horas and set 1; disable hora_entrada and calculate as from now until 
//		frappe.model.set_value(cdt,cdn,'horas',1);
	//	frappe.model.set_value(cdt,cdn,'hora_entrada',frappe.utils.data.now_datetime());
		frappe.model.set_value(cdt,cdn,'hora_saida',moment(cur_frm.doc.hora_entrada).add(12,'hours'));
		frappe.model.set_value(cdt,cdn,'total',cur_frm.doc.preco*1)
	}else if (cur_frm.doc.hora_diaria_noite =="Diaria"){
		// Horas set 1 Dia; 
		//frappe.model.set_value(cdt,cdn,'horas',1);
	//	frappe.model.set_value(cdt,cdn,'hora_entrada',frappe.utils.data.now_datetime());
		frappe.model.set_value(cdt,cdn,'hora_saida',frappe.datetime.add_days(cur_frm.doc.hora_entrada, cur_frm.doc.horas));
		frappe.model.set_value(cdt,cdn,'total',cur_frm.doc.preco*cur_frm.doc.horas)

	}else{
		frappe.model.set_value(cdt,cdn,'hora_saida',moment(moment(cur_frm.doc.hora_entrada).add(cur_frm.doc.horas,'hours')));;
//		cur_frm.doc.hora_saida = moment(cur_frm.doc.hora_entrada).add(frm.doc.horas,'hours'));
		frappe.model.set_value(cdt,cdn,'total',cur_frm.doc.preco*cur_frm.doc.horas)
		cur_frm.refresh_fields();	

	}
	calculate_totals1(frm,cdt,cdn)	
	
	var d = frappe.prompt([
		{label:__("Valor a Pagar: "),fieldtype:"Read Only",fieldname:"apagar",default: cur_frm.doc.total_servicos},
		{label:__("Valor Pago: "),fieldtype:"Currency",fieldname:"vpago",default: cur_frm.doc.total_servicos},
		{label:__("Troco: "),fieldtype:"Read Only",fieldname:"troco",default: 0},
        	{label:__("Pagamento por:"), fieldtype:"Select",options: ["1-Cash","2-TPA", "3-Conta-Corrente","4-Não Pagar"],fieldname:"priority",'reqd': 1,default:"1-Cash"},
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
			frappe.model.set_value(cdt,cdn,'servico_pago_por',c.priority)
			frappe.model.set_value(cdt,cdn,'status_reserva',"Fechado")
			cur_frm.refresh_fields("status_reserva");	

		} else if (c.priority=="3-Conta-Corrente") {
			//Gestao_quarto status Fechado ... Ja nao se pode alterar.
			//Contas ou valores para a Conta corrente do cliente.
			frappe.model.set_value(cur_frm.doctype,cur_frm.docname,'status_reserva',"Fechado")
			frappe.model.set_value(cur_frm.doctype,cur_frm.docname,'pagamento_por',"Conta-Corrente")
			if (cur_frm.doc.conta_corrente ==""){
				frappe.model.set_value(cur_frm.doctype,cur_frm.docname,'conta_corrente',"nome do cliente")
			}
			frappe.model.set_value(cur_frm.doctype,cur_frm.docname,'valor_pago',cur_frm.doc.total_servicos)
			frappe.model.set_value(cdt,cdn,'servico_pago_por',c.priority)

			cur_frm.refresh_fields("status_reserva");	


			//Dialog a pedir o Cliente
			if (cur_frm.doc.nome_cliente=="Diversos"){
				// Verifica se nome_cliente is empty e pede para selecionar o Cliente autorizado (MEMBROS ONLY!!!!)
				avancar = true	
				CC_nomecliente()	
				//cur_frm.toggle_enable("pagamento_botao",false)		
			}



			cur_frm.refresh_fields("status_reserva");	



		}
		cur_frm.enable_save()

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
			//alert("Pagamento de Serviços feito. Por favor salvar registo para liberar o Quarto.")	
			show_alert("Pagamento de Serviços feito. QUARTO LIVRE",3)
			this.cur_page.page.frm._save()
		} else if (frm.doc.total_servicos==0) {	
			show_alert("QUARTO LIVRE. Sem servicos por pagar...",3)
			this.cur_page.page.frm._save()
			cur_frm.reload_doc()
			cur_frm.refresh_fields()
		} else {
			// Esta vazio .....
			alert("Nao pode Fechar pois ainda nao foram feitos os pagamentos...")	
			cur_frm.disable_save()
//			frappe.model.set_value(cdt,cdn,'status',"Ocupado")
//			cur_frm.refresh_fields("status");	
		}
//	}else if ((frm.doc.status_reserva=="Ativo") && (frm.doc.reserva_numero !="")){
	//ATIVO only from RESERVAS
//		alert("Quarto Ativo... por favor Salvar registo")
//		show_alert("QUARTO ATIVO. Salvando registo...",3)
//		this.cur_page.page.frm._save()	
//		cur_frm.reload_doc()	
	}

});

frappe.ui.form.on("GESTAO_QUARTOS","pagamento_por",function(frm,cdt,cdn){

	if (frm.doc.pagamento_por=="Conta-Corrente"){
	// Pedir o Cliente e se o mesmo for membro e autorizado ...
 
		alert("Somente Membros podem ter Conta-corrente")
		//Gestao_quarto status Fechado ... Ja nao se pode alterar.
		//Contas ou valores para a Conta corrente do cliente.
		//frappe.model.set_value(cur_frm.doctype,cur_frm.docname,'status_reserva',"Fechado")
		frappe.model.set_value(cur_frm.doctype,cur_frm.docname,'pagamento_por',"Conta-Corrente")
		frappe.model.set_value(cur_frm.doctype,cur_frm.docname,'conta_corrente',"nome do cliente")
		frappe.model.set_value(cur_frm.doctype,cur_frm.docname,'valor_pago',cur_frm.doc.total_servicos)
//		frappe.model.set_value(cdt,cdn,'servico_pago_por',c.priority)

		cur_frm.refresh_fields("status_reserva");	

		//Dialog a pedir o Cliente
		if (cur_frm.doc.nome_cliente=="Diversos"){
			// Verifica se nome_cliente is empty e pede para selecionar o Cliente autorizado (MEMBROS ONLY!!!!)
			avancar = true	
			CC_nomecliente()	
			//cur_frm.toggle_enable("pagamento_botao",false)		
		}

	
	}

});

var quartos_ = function(frm,cdt,cdn){
	frappe.model.with_doc(frm, cdt, function() { 
		var d = frappe.model.get_doc(frm,cdt)

		cur_frm.doc.preco = d.preco
		cur_frm.doc.hora_diaria_noite = d.diaria_hora
		cur_frm.set_value("horas",2)
		cur_frm.refresh_fields()

	});


}

var servicos_ = function(frm,cdt,cdn){
	frappe.model.with_doc(frm, cdt, function() { 
		var d = frappe.model.get_doc(frm,cdt)
//		cur_frm.doc.preco_servico = d.preco
		frappe.model.set_value(cdt,cdn,frappe.utils.filter_dict(cur_frm.fields_dict["servicos"].grid.docfields, {"fieldname": "preco_servico"}),d.preco)
		cur_frm.refresh_fields()


	});
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
				cur_frm.set_value(cdt,cdn,'status_reserva',"Fechado")
				cur_frm.set_value(cdt,cdn,'pagamento_por',"Conta-Corrente")
				cur_frm.set_value('conta_corrente',cc.pcliente)
				cur_frm.set_value('servico_pago_por',"Conta-Corrente")

				cur_frm.refresh_fields("status_reserva","conta_corrente");	
				//Click SAVE				
//				cur_frm.page.btn_primary.click()
				this.cur_page.page.frm._save()
				cur_frm.page.clear_primary_action()
				cur_frm.page.clear_secondary_action()



				cur_frm.page.set_primary_action(__("Imprimir"), function() {
//					html = frappe.render_template("Recibo_Bar_Restaurante", {"nome_mesa": cur_frm.doc.nome_mesa})
					frappe.get_print("Print Format","GESTAO_QUARTOS_1",cur_frm.doc.numero_quarto)
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
