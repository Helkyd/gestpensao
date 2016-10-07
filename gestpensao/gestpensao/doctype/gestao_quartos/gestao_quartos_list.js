// Copyright (c) 2016, Helio de Jesus and contributors
// For license information, please see license.txt

// render

frappe.listview_settings['GESTAO_QUARTOS'] = {

	add_fields: ["name", "hora_entrada", "hora_saida", "status_reserva", "tipo_quarto"],

	column_render: {
		"tipo_quarto": function(doc) {
			var html = "";
	 		if(doc.tipo_quarto) {
				html += '<span class="filterable h6"\
					data-filter="hora_entrada,=,'+doc.hora_entrada+'">'+doc.hora_saida+' </span>';
			}
			if(doc.hora_entrada || doc.hora_saida) {
				html += '<i class="octicon octicon-arrow-right text-muted"></i> ';
			}
			if(doc.status_reserva) {
				html += '<span class="filterable h6"\
				data-filter="hora_saida,=,'+doc.hora_saida+'">'+doc.hora_entrada+'</span>';
			}
			return html;
		}

	},

	get_indicator: function(doc) {

		if (doc.status_reserva== "Livre" ) {
			return [__("Livre  " ), "green"]
		} else if (doc.status_reserva== "Ocupado" ) {
			return [__("Ocupado " + frappe.format(doc.hora_saida,{"fieldtype":"Date"}) ), "red"]
		} else if (doc.status_reserva== "Fechado" ) {
			return [__("Fechado" ), "orange"]
		
		}
	},
	colwidths: {"subject": 3, "indicator": 4},

	onload: function(listview){
		frappe.route_options = {
			"status_reserva":"Ocupado"
		};
	},

};

