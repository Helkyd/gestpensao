# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from frappe import _

def get_data():
	return [

		{
			"_doctype": "CLIENTES",
			"module_name": "CLIENTES",
			"color": "#2ecc71",
			"icon": "octicon octicon-organization",
			"type": "link",
			"link": "List/Clientes"
		},
                {
                    "type": "doctype",
                    "name": "Clientes",
                    "description": _("Clientes...)")
                },
                {
                    "type": "doctype",
                    "name": "Servicos",
                    "description": _("Servicos")
                },
		{
                    "type": "doctype",
                    "name": "GESTAO_QUARTOS",
                    "description": _("Gestao de Quartos... ")
                },
		{
                    "type": "doctype",
                    "name": "QUARTOS",
                    "description": _("Lista de Quartos...")
                },
		{
                    "type": "doctype",
                    "name": "QUARTOS_TIPO",
                    "description": _("Tipos de Quartos")
                },
		{
                    "type": "doctype",
                    "name": "RESERVAS",
                    "description": _("Reservas dos Quartos...")
                },
	]
