# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from frappe import _

def get_data():
	return [
		{
			"module_name": "Gestpensao",
			"color": "grey",
			"icon": "octicon octicon-file-directory",
			"type": "module",
			"label": _("Gestao Pensao"),
			{
				"_doctype": "CLIENTES",
				"module_name": "Clientes",
				"color": "#2ecc71",
				"icon": "octicon octicon-organization",
				"type": "link",
				"link": "List/Clientes",
				"label": _("Lista de Clientes")
			},

		},
		{
				"_doctype": "CLIENTES",
				"module_name": "Clientes",
				"color": "#2ecc71",
				"icon": "octicon octicon-organization",
				"type": "link",
				"link": "List/Clientes"
			},

	]
