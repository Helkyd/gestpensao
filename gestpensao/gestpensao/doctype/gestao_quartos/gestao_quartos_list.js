// Copyright (c) 2016, Helio de Jesus and contributors
// For license information, please see license.txt

// render
frappe.listview_settings['GESTAO_QUARTOS'] = {
	add_fields: ["status_reserva","tipo_quarto"],

	get_indicator: function(doc) {

		console.log(doc.status)
		if (doc.status_reserva== "Livre" ) {
			return [__("Livre - " + doc.tipo_quarto), "green"]
		} else if (doc.status_reserva== "Ocupado" ) {
			return [__("" + doc.tipo_quarto), "red"]
		} else if (doc.status_reserva== "Ativo" ) {
			return [__("" + doc.tipo_quarto), "orange"]

		} else if (doc.status_reserva== "Fechado" ) {
			return [__("" + doc.tipo_quarto), "blue"]
		
		}
	},
	colwidths: {"subject": 3, "indicator": 3,"Horas Entrada": 6,"Horas Saida": 6},
	
};

