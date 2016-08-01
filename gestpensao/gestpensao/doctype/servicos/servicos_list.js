// Copyright (c) 2016, Helio de Jesus and contributors
// For license information, please see license.txt

// render
frappe.listview_settings['SERVICOS'] = {
	add_fields: ["status_servicos","consumo_servico"],

	get_indicator: function(doc) {


		if (doc.status_servicos== "Ativo" ) {
			return [__("Ativo-" + doc.consumo_servico), "green"]
		} else if (doc.status_servicos== "Não Ativo") {
			return [__("Não Ativo-"+ doc.consumo_servico), "red"]
		} else if (doc.status_servicos== "Outros" ) {
			return [__("Outros-"+ doc.consumo_servico), "orange"]
		}
	},
	colwidths: {"subject": 3, "indicator": 3,"Tipo de Produto": 2,"Preco": 2},	
};

