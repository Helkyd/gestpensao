// Copyright (c) 2016, Helio de Jesus and contributors
// For license information, please see license.txt

// render
frappe.listview_settings['CLIENTES'] = {
	add_fields: ["cliente_tipo"],

	get_indicator: function(doc) {		

		
		if (doc.cliente_tipo== "Membro" ) {
			return [__("Membro"), "green", "cliente_tipo,=,Membro"]
		} else if (doc.cliente_tipo== "Não-Membro" ) {
			return [__("Não-Membro"), "blue", "cliente_tipo,=,Não-Membro"]
		
		}
	},

	
};

