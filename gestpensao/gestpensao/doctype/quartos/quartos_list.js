// Copyright (c) 2016, Helio de Jesus and contributors
// For license information, please see license.txt

// render
frappe.listview_settings['QUARTOS'] = {
	add_fields: ["status_quarto","tipo_quarto"],

	get_indicator: function(doc) {


		if (doc.status_quarto== "Livre" ) {
			return [__("Livre - " + doc.tipo_quarto), "green"]
		} else if (doc.status_quarto== "Ocupado" ) {
			return [__("Ocupado - " + doc.tipo_quarto), "red"]
		} else if (doc.status_quarto== "Reservado" ) {
			return [__("Reservado - " + doc.tipo_quarto), "orange"]
		} else if (doc.status_quarto== "Manutenção" ) {
			return [__("Manutenção - " + doc.tipo_quarto), "yellow"]
		} else if (doc.status_quarto== "Não funcional" ) {
			return [__("Não funcional - " + doc.tipo_quarto), "black"]
		
		}
	},

	
};

