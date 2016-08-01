// Copyright (c) 2016, Helio de Jesus and contributors
// For license information, please see license.txt

// render
frappe.listview_settings['BAR_RESTAURANTE'] = {
	add_fields: ["status_atendimento"],

	get_indicator: function(doc) {

		if (doc.status_atendimento== "Livre" ) {
			return [__("Livre  " ), "green"]
		} else if (doc.status_atendimento== "Ocupado" ) {
			return [__("Ocupado " ), "red"]
		} else if (doc.status_atendimento== "Fechado" ) {
			return [__("Fechado" ), "orange"]
		
		}
	},
	colwidths: {"subject": 3, "indicator": 2,"Empregado de Mesa": 6},

	
	
};

