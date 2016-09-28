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
	
		},
		{
				"_doctype": "CLIENTES",
				"module_name": "CLIENTES",
				"color": "#2ecc71",
				"icon": "octicon octicon-organization",
				"type": "link",
				"link": "List/CLIENTES"
		},
		{
		   "_doctype": "BAR_RESTAURANTE", 
		   "color": "grey", 
		   "icon": "octicon octicon-file-directory", 
		   "label": "BAR_RESTAURANTE", 
		   "link": "List/BAR_RESTAURANTE", 
		   "module_name": "BAR_RESTAURANTE", 
		   "type": "link"
		  },
		 {
		   "_doctype": "GESTAO_QUARTOS", 
		   "color": "grey", 
		   "icon": "octicon octicon-file-directory", 
		   "label": "GESTAO_QUARTOS", 
		   "link": "List/GESTAO_QUARTOS", 
		   "module_name": "GESTAO_QUARTOS", 
		   "type": "link"
		  }, 
		  {
		   "_doctype": "RESERVAS", 
		   "color": "grey", 
		   "icon": "octicon octicon-file-directory", 
		   "label": "RESERVAS", 
		   "link": "List/RESERVAS", 
		   "module_name": "RESERVAS", 
		   "type": "link"
		  }, 


	]
