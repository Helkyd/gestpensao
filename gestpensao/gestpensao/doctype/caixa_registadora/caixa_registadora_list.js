// Copyright (c) 2016, Helio de Jesus and contributors
// For license information, please see license.txt

// render
frappe.listview_settings['CAIXA_Registadora'] = {
	add_fields: ["status_caixa"],

	get_indicator: function(doc) {

		if (doc.status_caixa== "Aberto" ) {
<<<<<<< HEAD
<<<<<<< HEAD
			return [__("Aberto" ), "green"]
		} else if (doc.status_caixa== "Em Curso" ) {
			return [__("Em Curso" ), "red"]
		} else if (doc.status_caixa== "Fechado" ) {
			return [__("Fechado" ), "orange"]
		
		}
	},
	colwidths: {"subject": 3, "indicator": 2,"Data e Hora": 3},
=======
=======
>>>>>>> Versao Production
			return [__("Aberto  " ), "green"]
		} else if (doc.status_caixa== "Fechado" ) {
			return [__("Fechado " ), "orange"]
		
		}
	},
	colwidths: {"subject": 3, "indicator": 3},
<<<<<<< HEAD
>>>>>>> Versao Production
=======
>>>>>>> Versao Production

	
	
};

