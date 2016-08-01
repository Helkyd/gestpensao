// Copyright (c) 2016, Helio de Jesus and contributors
// For license information, please see license.txt


frappe.query_reports["teste"] = {
	"filters": [
		{
			"fieldname":"nome_mesa",
			"label": __("Numero da Mesa"),
			"fieldtype": "Data",
			"default": "BAR_RESTAURANTE",
			"width": "80"
		},
		{
			"fieldname":"hora_atendimento",
			"label": __("Hora Atendida"),
			"fieldtype": "Date",
			"default": "BAR_RESTAURANTE"
		},
		{
			"fieldname":"status_atendimento",
			"label": __("Status da Mesa"),
			"fieldtype": "Data",
			"options": "BAR_RESTAURANTE"
		},
		{
			"fieldname":"total_servicos",
			"label": __("Total dos Servicos"),
			"fieldtype": "Currency",
			"default": "BAR_RESTAURANTE"
		}
	
	]
}

