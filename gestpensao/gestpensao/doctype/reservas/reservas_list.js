// Copyright (c) 2016, Helio de Jesus and contributors
// For license information, please see license.txt

// render
frappe.listview_settings['RESERVAS'] = {
	add_fields: ["numero_quarto", "reservation_status", "check_in", "check_out", "number_days"],

	get_indicator: function(doc) {
		if (doc.reservation_status== "Nova") {
			return [__("Nova "+doc.numero_quarto), "red", "reservation_status,=,Nova"]
		} else if (doc.reservation_status== "Ativo") {
			return [__("Ativo "+doc.numero_quarto), "orange", "reservation_status,=,Ativo"]
		} else if (doc.reservation_status== "Pago") {
			return [__("Pago "+doc.numero_quarto), "green", "reservation_status,=,Pago"]
		} else if (doc.reservation_status== "Cancelada") {
			return [__("Cancelada "+doc.numero_quarto), "blue", "reservation_status,=,Cancelada"]
		}
	},

	
};

