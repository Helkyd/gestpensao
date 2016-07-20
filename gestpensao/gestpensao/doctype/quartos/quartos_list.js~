// Copyright (c) 2016, Helio de Jesus and contributors
// For license information, please see license.txt

// render
frappe.listview_settings['QUARTOS'] = {
	add_fields: ["status","tipo_quarto"],

	get_indicator: function(doc) {

		console.log(doc.status)
		if (doc.status== "Livre" ) {
			return [__("Livre - " + doc.tipo_quarto), "green"]
		} else if (doc.status== "Ocupado" ) {
			return [__("Ocupado - " + doc.tipo_quarto), "red"]
		} else if (doc.status== "Reservado" ) {
			return [__("Reservado - " + doc.tipo_quarto), "orange"]
		} else if (doc.status== "Manutenção" ) {
			return [__("Manutenção - " + doc.tipo_quarto), "yellow"]
		} else if (doc.status== "Não funcional" ) {
			return [__("Não funcional - " + doc.tipo_quarto), "black"]
		
		}
	},

	
};

