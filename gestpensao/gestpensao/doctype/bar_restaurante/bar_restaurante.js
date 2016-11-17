// Copyright (c) 2016, Helio de Jesus and contributors
// For license information, please see license.txt

cx_open =cur_frm.call({method:"check_caixa_aberto",args:{"start":"none"}})
caixaaber =cur_frm.call({method:"caixa_aberto",args:{"start":"none"}})
caixacur  =cur_frm.call({method:"caixa_curso",args:{"start":"none"}})
lista =cur_frm.call({method:"lista_clientes",args:{"start":"moeda"}})
cur_frm.call({method:"empresa_load",args:{"start":"moeda"}})
//cur_frm.call({method:"empresa_load1",args:{"start":"moeda"}})
//cur_frm.add_fetch("nome_mesa","comp","nome_empresa")


frappe.ui.form.on('BAR_RESTAURANTE', {
	onload: function(frm) {

		//Verifica se o Caixa esta aberto ... segudo controle caso cx_aberto nao retorne valores ....
//		d = frappe.get_list("CAIXA_Registadora",filters={'status_caixa':'Aberto'},fields=['name','status_caixa'])
//		if (d[0].status_caixa =="Aberto"){
//			//Ja tem caixa Aberto

//		}else{
//			d = frappe.get_list("CAIXA_Registadora",filters={'status_caixa':'Em Curso'},fields=['name','status_caixa'])
//		}

		frappe.call({
			method:"frappe.client.get_list",
			args:{
				doctype:"CAIXA_Registadora",
				filters: {
						status_caixa:['in', 'Aberto, Em Curso']
				},
				fields: ["status_caixa"]
			},
			callback: function(r) {
				if (r.message) {
					$.each(r.message, function(i,d) {
						console.log(i.toString() + ": " + d.status_caixa);
						caixaopen = d.status_caixa;
					});
				}
			}
		});



		show_alert("Verificando CAIXA ABERTO...",3)
		cur_frm.enable_save()
//		if (cx_open.statusText=="OK" ){

		if ((cur_frm.docname.substring(0,3)=="New" || cur_frm.docname.substring(0,3)=="Nov") && cx_open.responseText != "{}"){
			//CAIXA aberto ...



			if (cx_open.responseText == undefined){

				show_alert("É necessário fazer a Abertura do CAIXA...",3)
			}else if (frm.doc.status_atendimento=="Ocupado" && frm.doc.bar_tender ==undefined && cx_open.responseText != undefined){

				//Novo Registo 
				show_alert("Novo Registo de Caixa...",3)
				cur_frm.toggle_enable("bar_tender",false)
				cur_frm.toggle_enable("pagamento_por",false)
				cur_frm.toggle_enable("status_atendimento",false)
			

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
				if (frm.doc.conta_corrente_status =="Pago"){
					cur_frm.toggle_enable("conta_corrente_status",false)
				}else{
					cur_frm.toggle_enable("conta_corrente_status",true)
				}
	
		//			cur_frm.toggle_enable("status_reserva",false)	
		//			cur_frm.set_df_property("reserva_numero","hidden",true)
		//			cur_frm.set_df_property("servico_pago_por","hidden",true)
			}else{
				alert("Outro coisa")
			}

		

		}else if (cx_open.responseText == "{}" && cx_open.readyState == 4){
			//alert("Faca abertura do Caixa primeiro.")
			cur_frm.toggle_enable("nome_mesa",false)
			cur_frm.toggle_enable("nome_cliente",false)
			cur_frm.toggle_enable("extras_item",false)
			cur_frm.toggle_enable("status_atendimento",false)
			cur_frm.disable_save()
			return
		
		}else{
//			alert("CAIXA")
			//JSON status still 1... no CAIXA Info
			cur_frm.toggle_enable("nome_mesa",false)
			cur_frm.toggle_enable("nome_cliente",false)
			cur_frm.toggle_enable("extras_item",false)
			cur_frm.toggle_enable("status_atendimento",false)
			if (frm.doc.conta_corrente_status =="Pago"){
				cur_frm.toggle_enable("conta_corrente_status",false)
			}else{
				cur_frm.toggle_enable("conta_corrente_status",true)
			}
			
			return

		}


	}
});
frappe.ui.form.on('BAR_RESTAURANTE', {
	refresh: function(frm) {
//		alert(cx_open.statusText)
		if (cx_open.statusText=="OK" ){
//		if ((cur_frm.docname.substring(0,3)=="New" || cur_frm.docname.substring(0,3)=="Nov") && (d[0].status_caixa !="Aberto" && d[0].status_caixa !="Em Curso")){
			if (cx_open.responseText != "{}"){
				//CAIXA aberto ...

				frm.fields_dict.extras_item.grid.get_field('nome_servico').get_query = function() {
					return {
						filters: {
							"consumo_servico":"Consumo",
				 			"status_servicos":"Ativo"
						}
					}
			
				}		
				cur_frm.fields_dict['nome_mesa'].get_query = function(doc){
					return{
						filters:{
							"status_mesa":"Livre",

						},
				
					}
				}

//				cur_frm.fields_dict["extras_item"].grid.get_field("nome_servico").get_query = function(doc){
//					return{
//						filters:{
//							 "consumo_servico":"Servico"
//						}
//					}
//				}


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
//TEMP DISABLED						cur_frm.page.clear_user_actions()

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
//TEMP DISABLED
//						cur_frm.page.set_primary_action(__("Imprimir"), function() {
		//					html = frappe.render_template("Recibo_Bar_Restaurante", {"nome_mesa": cur_frm.doc.nome_mesa})
//							frappe.get_print("Print Format","Recibo_Bar_Restaurante",cur_frm.doc.nome_mesa)
//							print_document(html)
//						})
					}else if (frm.doc.status_atendimento !="Fechado") {
		//				cur_frm.page.clear_primary_action()
						//cur_frm.page.set_primary_action()
//TEMP DISABLED						cur_frm.page.clear_user_actions()
					}else{
//TEMP DISABLED						cur_frm.page.clear_primary_action()
//TEMP DISABLED						cur_frm.page.clear_secondary_action()
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
			}else{
				alert("Por favor abrir o Caixa antes de qualquer movimento. " )
				cur_frm.disable_save()
				return
			}
		}else if (cx_open.readyState==1 ){
		// ++++++ POR RESOLVER 
//			alert(caixaload)
			if (caixaaber.readyState == 1){			
				alert("Verificando se o CAIXA Ja esta aberto....")
				console.log("Verificando se o CAIXA Ja esta aberto....")

			}
//			frappe.get_meta("CAIXA_Registadora")
//			cx_open =cur_frm.call({method:"check_caixa_aberto",args:{"start":"none"}})
//			d = frappe.get_list("CAIXA_Registadora",filters={'status_caixa':'Aberto'},fields=['name','status_caixa'])
//			alert(d[0].status_caixa)
			if (caixaaber.responseText != "{}"){
				//Caixa Status ABERTO
				console.log("caixaaber ....")
			}else if (caixacur.responseText != "{}"){
				//Caixa Status EM CURSO
				console.log("caixacur ....")
			}else{
//			if (caixaaber.responseJSON.message[0].status_caixa != "Aberto" && caixacur.responseJSON.message[0].status_caixa != "Em Curso"){
//			if (d[0].status_caixa !="Aberto"){
				alert("Por favor abrir o Caixa antes de qualquer movimento. " + cx_open.readyState)
//			cur_frm.disable_save()
			}
			return

		}else{
			alert("PORQUE")
		}

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

frappe.ui.form.on("BAR_RESTAURANTE","conta_corrente_status",function(frm,cdt,cdn){
	if (cur_frm.doc.conta_corrente_status == "Pago"){
		frappe.confirm('Confirma que pagamento foi feito?' ,
			function(){
				//update Conta-correntes table
	
				ccorrente = cur_frm.call({method:"atualiza_ccorrente",args:{"cliente":cur_frm.doc.conta_corrente,"recibo":cur_frm.doc.name}})
				cur_frm.save()
				cur_frm.disable_save()
//				cur_frm.print_doc()

			},	
			function(){
				show_alert("Pagamento Cancelado !!!",5)
			}		
		);
		
	}
});

frappe.ui.form.on("BAR_RESTAURANTE","nome_mesa",function(frm,cdt,cdn){

	if (cx_open.statusText=="OK" ){
		if (cx_open.responseText != "{}"){
				//CAIXA aberto ...
			frappe.model.set_value(cdt,cdn,'bar_tender',frappe.session.user)
			cur_frm.refresh_fields('bar_tender')
		}
	}
	frm.fields_dict.extras_item.grid.get_field('nome_servico').get_query = function() {
		return {
			filters: {
				"consumo_servico":"Consumo",
	 			"status_servicos":"Ativo"
			}
		}
			
	}

	cur_frm.toggle_enable("status_atendimento",false)

});

cur_frm.add_fetch('nome_servico','preco','preco_servico')	



frappe.ui.form.on("Extras_item","nome_servico",function(frm,cdt,cdn){

//	cur_frm.fields_dict["nome_servico"].get_query = function(doc){
//		return{
//			filters:{
//				 "consumo_servico":"Consumo",
//				 "status_servicos":"Ativo"
//			}
//		}
//	}


//	frm.fields_dict.extras_item.grid.get_field('nome_servico').get_query = function() {
//		return {
//			filters: {
//				"consumo_servico":"Servico",
//	 			"status_servicos":"Ativo"
//			}
//		}
			
//	}

	frappe.model.set_value(cdt,cdn,'bar_tender',frappe.session.user)

	var d =locals[cdt][cdn];
	cur_frm.add_fetch('nome_servico','preco','preco_servico')	
	cur_frm.refresh_fields('preco_servico','bar_tender')
	
	if (d.nome_servico !=""){
		servicos_('SERVICOS',d.nome_servico)
	}

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


frappe.ui.form.on("Extras_item", "nome_servico_remove", function(frm) {
	//	console.log(frm.doc.nome_servico)
		calculate_totals(frm, cdt, cdn);
	//	cur_frm.refresh_fields('total_servicos')
		alert("apagou")

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

frappe.ui.form.on("extras_item","quantidade_remove",function(frm,cdt,cdn){
	alert("removeu")
});

cur_frm.cscript.pagamento_botao = function() {

	var d = locals[cur_frm.doctype][cur_frm.docname]

	//alert("Apos pagamento a Mesa estará livre.");
	calculate_totals2(cur_frm,cur_frm.doctype,cur_frm.docname)	
	avancar = false

	var d = frappe.prompt([
		{label:__("Valor a Pagar: "),fieldtype:"Currency",fieldname:"apagar",read_only: 1,default: cur_frm.doc.total_servicos},
		{label:__("Valor Pago: "),fieldtype:"Currency",fieldname:"vpago",default: cur_frm.doc.total_servicos},
		{label:__("Troco: "),fieldtype:"Currency",fieldname:"troco",read_only: 1},
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

		} else if (c.priority=="Cash")  {
			if ((c.vpago-c.apagar) !=0){
				frappe.confirm('Troco de: ' + (c.vpago-c.apagar) + ' Confirma?',
					function(){
						pagamento_cash(c.priority)

					},	
					function(){
						show_alert("Pagamento Cancelado !!!",5)

					}		

				);
			}else{
				pagamento_cash(c.priority)
			}
		} else if (c.priority=="TPA") {
			//Bar_Restaurante status Fechado ... Ja nao se pode alterar.
			frappe.model.set_value(cur_frm.doctype,cur_frm.docname,'status_atendimento',"Fechado")
			frappe.model.set_value(cur_frm.doctype,cur_frm.docname,'pagamento_por',c.priority)
			frappe.model.set_value(cur_frm.doctype,cur_frm.docname,'valor_pago',cur_frm.doc.total_servicos)
			cur_frm.refresh_fields("status_atendimento");	
			cur_frm.doc.docstatus = 1 
//			cur_frm.toggle_enable("pagamento_botao",false)

//			cur_frm.page.btn_primary.click()
			cur_frm.save() //this.cur_page.page.frm._save()
			cur_frm.disable_save()
			cur_frm.print_doc()

//TEMP DISABLED			cur_frm.page.clear_primary_action()
//TEMP DISABLED			cur_frm.page.clear_secondary_action()

//			cur_frm.page.set_primary_action(__("Imprimir"), function() {
//					html = frappe.render_template("Recibo_Bar_Restaurante", {"nome_mesa": cur_frm.doc.nome_mesa})
//				frappe.get_print("Print Format","Recibo_Bar_Restaurante",cur_frm.doc.nome_mesa)
//				print_document(html)
//			})
			

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
				cur_frm.save() //this.cur_page.page.frm._save()
				cur_frm.disable_save()
				cur_frm.print_doc()



//TEMP DISABLED				cur_frm.page.clear_primary_action()
//TEMP DISABLED				cur_frm.page.clear_secondary_action()



//				cur_frm.page.set_primary_action(__("Imprimir"), function() {
//					html = frappe.render_template("Recibo_Bar_Restaurante", {"nome_mesa": cur_frm.doc.nome_mesa})
//					frappe.get_print("Print Format","Recibo_Bar_Restaurante",cur_frm.doc.nome_mesa)
//					print_document(html)
//				})

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


var pagamento_cash = function(prioridade){

	//Bar_Restaurante status Fechado ... Ja nao se pode alterar.
	frappe.model.set_value(cur_frm.doctype,cur_frm.docname,'status_atendimento',"Fechado")
	frappe.model.set_value(cur_frm.doctype,cur_frm.docname,'pagamento_por',prioridade)
	frappe.model.set_value(cur_frm.doctype,cur_frm.docname,'valor_pago',cur_frm.doc.total_servicos)
	cur_frm.refresh_fields("status_atendimento");	
	cur_frm.doc.docstatus = 1 
	cur_frm.save() //this.cur_page.page.frm._save()
	cur_frm.disable_save()	
	cur_frm.print_doc()

// TEMP DISABLED
//	cur_frm.page.clear_primary_action()
//	cur_frm.page.clear_secondary_action()
//	cur_frm.page.set_primary_action(__("Imprimir"), function() {
	//					html = frappe.render_template("Recibo_Bar_Restaurante", {"nome_mesa": cur_frm.doc.nome_mesa})
//		frappe.get_print("Print Format","Recibo_Bar_Restaurante",cur_frm.doc.nome_mesa)
//		print_document(html)
//	})

}
